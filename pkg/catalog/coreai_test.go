package catalog

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadCoreAIPackages(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	mkdirAll(t, filepath.Join(root, "helius-mcp"))
	mkdirAll(t, filepath.Join(root, "v3"))
	mkdirAll(t, filepath.Join(root, "helius-skills"))
	writeFile(t, filepath.Join(root, "helius-skills", "SKILL.md"), `---
name: helius-das
description: DAS queries
category: Infrastructure
---
`)

	pkgs := LoadCoreAIPackages(root)
	if len(pkgs) != 10 {
		t.Fatalf("packages = %d", len(pkgs))
	}
	var present int
	for _, pkg := range pkgs {
		if !pkg.Selectable {
			t.Fatalf("expected selectable: %#v", pkg)
		}
		if pkg.Present {
			present++
		}
	}
	if present != 3 {
		t.Fatalf("present = %d", present)
	}

	skills := CoreAISkills(root)
	if len(skills) < 11 {
		t.Fatalf("skills = %d", len(skills))
	}
}

func TestSelectionRoundTrip(t *testing.T) {
	t.Parallel()
	path := filepath.Join(t.TempDir(), "selected.json")
	if err := SaveSelection(path, []string{"helius-mcp", "v3"}); err != nil {
		t.Fatal(err)
	}
	got, err := LoadSelection(path)
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 2 || got[0] != "helius-mcp" {
		t.Fatalf("got %#v", got)
	}
}

func TestLoadZeroServices(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	mkdirAll(t, filepath.Join(root, "zero-service"))
	mkdirAll(t, filepath.Join(root, "cmd", "clawdbot"))

	svcs := LoadZeroServices(root)
	if len(svcs) != 6 {
		t.Fatalf("services = %d", len(svcs))
	}
	found := map[string]bool{}
	for _, svc := range svcs {
		if svc.Present {
			found[svc.Slug] = true
		}
	}
	if !found["zero-service"] || !found["clawdbot"] {
		t.Fatalf("present %#v", found)
	}
}

func TestBuildReportIncludesCoreAI(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	mkdirAll(t, filepath.Join(root, "helius-mcp"))
	report := BuildReport(Roots{
		SkillsDir: filepath.Join(root, "missing-skills"),
		AgentsDir: filepath.Join(root, "missing-agents"),
		CoreAIDir: root,
		RepoRoot:  root,
	})
	if len(report.CoreAI) != 10 {
		t.Fatalf("core-ai = %d", len(report.CoreAI))
	}
	if len(report.ZeroServices) != 6 {
		t.Fatalf("zero = %d", len(report.ZeroServices))
	}
}

func TestLoadSelectionMissing(t *testing.T) {
	t.Parallel()
	got, err := LoadSelection(filepath.Join(t.TempDir(), "nope.json"))
	if err != nil {
		t.Fatal(err)
	}
	if got != nil && len(got) != 0 {
		t.Fatalf("got %#v", got)
	}
}

func TestLoadCoreAIPackagesEmptyRoot(t *testing.T) {
	t.Parallel()
	pkgs := LoadCoreAIPackages(filepath.Join(t.TempDir(), "absent"))
	if len(pkgs) != 10 {
		t.Fatalf("packages = %d", len(pkgs))
	}
	for _, pkg := range pkgs {
		if pkg.Present {
			t.Fatalf("expected absent: %#v", pkg)
		}
	}
}

func TestSaveSelectionCreatesParent(t *testing.T) {
	t.Parallel()
	path := filepath.Join(t.TempDir(), "nested", "sel.json")
	if err := SaveSelection(path, nil); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(path); err != nil {
		t.Fatal(err)
	}
}
