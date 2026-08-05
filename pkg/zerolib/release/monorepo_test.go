package release

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestMonorepoZeroRootDetectsZeroMain(t *testing.T) {
	// Resolve the monorepo root from this package path:
	// pkg/zerolib/release → ../../../
	cwd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	// Walk up until we find go.mod for clawdbot, then check monorepoZeroRoot.
	dir := cwd
	var monorepo string
	for i := 0; i < 6; i++ {
		raw, err := os.ReadFile(filepath.Join(dir, "go.mod"))
		if err == nil && strings.Contains(string(raw), "module github.com/8bitlabs/clawdbot") {
			monorepo = dir
			break
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	if monorepo == "" {
		t.Skip("not running inside clawdbot monorepo checkout")
	}

	got := monorepoZeroRoot(monorepo)
	if got == "" {
		t.Fatal("monorepoZeroRoot returned empty; expected zero-main")
	}
	want := filepath.Join(monorepo, "zero-main")
	if filepath.Clean(got) != filepath.Clean(want) {
		t.Fatalf("monorepoZeroRoot = %q, want %q", got, want)
	}
}

func TestResolveRootDirPrefersZeroMainInMonorepo(t *testing.T) {
	cwd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	dir := cwd
	var monorepo string
	for i := 0; i < 6; i++ {
		raw, err := os.ReadFile(filepath.Join(dir, "go.mod"))
		if err == nil && strings.Contains(string(raw), "module github.com/8bitlabs/clawdbot") {
			monorepo = dir
			break
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	if monorepo == "" {
		t.Skip("not running inside clawdbot monorepo checkout")
	}

	// Chdir into monorepo root so empty rootDir resolves via monorepoZeroRoot.
	prev, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Chdir(monorepo); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.Chdir(prev) })

	resolved, err := resolveRootDir("")
	if err != nil {
		t.Fatal(err)
	}
	want, err := filepath.Abs(filepath.Join(monorepo, "zero-main"))
	if err != nil {
		t.Fatal(err)
	}
	if filepath.Clean(resolved) != filepath.Clean(want) {
		t.Fatalf("resolveRootDir(\"\") = %q, want %q", resolved, want)
	}
}

func TestMonorepoZeroRootIgnoresUnrelatedTree(t *testing.T) {
	dir := t.TempDir()
	// zero-main without the right module path must not match.
	zeroMain := filepath.Join(dir, "zero-main")
	if err := os.MkdirAll(filepath.Join(zeroMain, "cmd", "zero"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(zeroMain, "package.json"), []byte(`{"version":"0.0.1"}`), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(zeroMain, "cmd", "zero", "main.go"), []byte("package main\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(zeroMain, "go.mod"), []byte("module example.com/not-zero\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if got := monorepoZeroRoot(dir); got != "" {
		t.Fatalf("monorepoZeroRoot = %q, want empty", got)
	}
}
