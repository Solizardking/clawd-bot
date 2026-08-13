package desktop

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"testing/fstest"
)

func TestHealthAndSelection(t *testing.T) {
	t.Parallel()
	ui := fstest.MapFS{"index.html": &fstest.MapFile{Data: []byte("<html>Clawd Bot</html>")}}
	ident := t.TempDir()
	write(t, filepath.Join(ident, "CLAWD.md"), "# CLAWD\n")
	write(t, filepath.Join(ident, "CONSTITUTION.md"), "# CONST\n")
	write(t, filepath.Join(ident, "six-laws.md"), "# LAWS\n")
	write(t, filepath.Join(ident, "IDENTITY.md"), "# ID\n")
	write(t, filepath.Join(ident, "SOUL.md"), "# SOUL\n")
	write(t, filepath.Join(ident, "strategy.md"), "# STRAT\n")
	write(t, filepath.Join(ident, "program.md"), "# PROG\n")
	write(t, filepath.Join(ident, "schema.sql"), "-- sql\n")
	write(t, filepath.Join(ident, "install.sh"), "#!/bin/sh\n")
	write(t, filepath.Join(ident, "start.sh"), "#!/bin/sh\n")

	sel := filepath.Join(t.TempDir(), "selected.json")
	s, err := New(Options{IdentityDir: ident, SelectionPath: sel}, ui)
	if err != nil {
		t.Fatal(err)
	}
	h := s.Handler()

	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/health", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("health status %d", rec.Code)
	}
	if !strings.Contains(rec.Body.String(), "clawdbot-desktop") {
		t.Fatalf("health body %s", rec.Body.String())
	}

	rec = httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/api/identity", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("identity status %d body %s", rec.Code, rec.Body.String())
	}

	rec = httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/api/identity/SOUL.md", nil))
	if rec.Code != http.StatusOK || !strings.Contains(rec.Body.String(), "SOUL") {
		t.Fatalf("soul %d %s", rec.Code, rec.Body.String())
	}

	rec = httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/selection", strings.NewReader(`{"selected":["helius-mcp","v3"]}`))
	req.Header.Set("Content-Type", "application/json")
	h.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("post selection %d %s", rec.Code, rec.Body.String())
	}

	rec = httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/api/selection", nil))
	var body struct {
		Selected []string `json:"selected"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if len(body.Selected) != 2 {
		t.Fatalf("selected %#v", body.Selected)
	}

	rec = httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("ui %d", rec.Code)
	}
	got, _ := io.ReadAll(rec.Body)
	if !strings.Contains(string(got), "Clawd Bot") {
		t.Fatalf("ui body %s", got)
	}
}

func TestNewRequiresUI(t *testing.T) {
	t.Parallel()
	_, err := New(Options{}, nil)
	if err == nil {
		t.Fatal("expected error")
	}
}

func write(t *testing.T, path, content string) {
	t.Helper()
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}
}
