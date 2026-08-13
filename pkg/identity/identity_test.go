package identity

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadFindsCanonicalFiles(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	for _, name := range []string{
		"CLAWD.md",
		"CONSTITUTION.md",
		"six-laws.md",
		"IDENTITY.md",
		"SOUL.md",
		"strategy.md",
		"program.md",
		"schema.sql",
		"install.sh",
		"start.sh",
	} {
		writeFile(t, filepath.Join(root, name), "# "+name+"\n")
	}

	m, err := Load(root)
	if err != nil {
		t.Fatal(err)
	}
	if m.Product != ProductName || m.Slug != ProductSlug {
		t.Fatalf("unexpected product: %#v", m)
	}
	if len(m.Missing) != 0 {
		t.Fatalf("missing: %v", m.Missing)
	}
	if len(m.Files) != 11 {
		t.Fatalf("files = %d", len(m.Files))
	}
	data, err := ReadFile(root, "SOUL.md")
	if err != nil {
		t.Fatal(err)
	}
	if string(data) != "# SOUL.md\n" {
		t.Fatalf("soul = %q", data)
	}
}

func TestLoadReportsMissingRequired(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	writeFile(t, filepath.Join(root, "CLAWD.md"), "x\n")

	m, err := Load(root)
	if err != nil {
		t.Fatal(err)
	}
	if len(m.Missing) == 0 {
		t.Fatal("expected missing required files")
	}
}

func TestReadFileRejectsUnknown(t *testing.T) {
	t.Parallel()
	_, err := ReadFile(t.TempDir(), "../etc/passwd")
	if err == nil {
		t.Fatal("expected error")
	}
}

func writeFile(t *testing.T, path, content string) {
	t.Helper()
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}
}
