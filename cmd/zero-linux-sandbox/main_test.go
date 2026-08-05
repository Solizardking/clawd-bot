//go:build !linux

package main

import (
	"os"
	"os/exec"
	"strings"
	"testing"
)

// TestUnsupportedBinaryExits reports the platform-stub behavior for
// non-Linux hosts. This exercises the shipped binary path rather than
// re-implementing the helper.
func TestUnsupportedBinaryExits(t *testing.T) {
	exe := buildHelper(t)
	cmd := exec.Command(exe)
	out, err := cmd.CombinedOutput()
	if err == nil {
		t.Fatalf("expected non-zero exit, got success: %s", out)
	}
	if !strings.Contains(string(out), "only supported on Linux") {
		t.Fatalf("unexpected output: %q", out)
	}
}

func buildHelper(t *testing.T) string {
	t.Helper()
	dir := t.TempDir()
	exe := dir + "/zero-linux-sandbox"
	cmd := exec.Command("go", "build", "-o", exe, ".")
	cmd.Dir = "."
	cmd.Env = append(os.Environ(), "CGO_ENABLED=0")
	if out, err := cmd.CombinedOutput(); err != nil {
		t.Fatalf("go build: %v\n%s", err, out)
	}
	return exe
}
