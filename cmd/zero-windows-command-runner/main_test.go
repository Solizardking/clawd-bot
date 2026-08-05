package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

// TestBinaryRejectsMissingArgs exercises the shipped helper entrypoint:
// without required flags the Windows command runner must exit non-zero.
func TestBinaryRejectsMissingArgs(t *testing.T) {
	exe := buildHelper(t)
	cmd := exec.Command(exe)
	out, err := cmd.CombinedOutput()
	if err == nil {
		t.Fatalf("expected non-zero exit, got success: %s", out)
	}
	// Shared sandbox helper surfaces usage / arg errors on stderr.
	if len(out) == 0 {
		t.Fatal("expected error output on missing args")
	}
}

func buildHelper(t *testing.T) string {
	t.Helper()
	dir := t.TempDir()
	exe := filepath.Join(dir, "zero-windows-command-runner")
	cmd := exec.Command("go", "build", "-o", exe, ".")
	cmd.Dir = "."
	cmd.Env = append(os.Environ(), "CGO_ENABLED=0")
	if out, err := cmd.CombinedOutput(); err != nil {
		t.Fatalf("go build: %v\n%s", err, out)
	}
	return exe
}

func TestPackageImportsZerolib(t *testing.T) {
	// Guardrail: monorepo rewrite must not reintroduce Gitlawb internal imports.
	raw, err := os.ReadFile("main.go")
	if err != nil {
		t.Fatal(err)
	}
	if strings.Contains(string(raw), "github.com/Gitlawb/zero/internal/") {
		t.Fatal("cmd still imports Gitlawb/zero internal package")
	}
	if !strings.Contains(string(raw), "github.com/8bitlabs/clawdbot/pkg/zerolib/sandbox") {
		t.Fatal("cmd must import pkg/zerolib/sandbox")
	}
}
