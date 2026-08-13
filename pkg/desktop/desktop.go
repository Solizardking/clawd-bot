// Package desktop hosts the Clawd Bot macOS/control-deck UI: identity,
// selectable Core AI skills, and zero-service surfaces.
package desktop

import (
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/8bitlabs/clawdbot/pkg/catalog"
	"github.com/8bitlabs/clawdbot/pkg/identity"
)

//go:embed ui/*
var bundledUI embed.FS

// BundledUI returns the embedded Clawd Bot desktop UI.
func BundledUI() fs.FS {
	sub, err := fs.Sub(bundledUI, "ui")
	if err != nil {
		return bundledUI
	}
	return sub
}

const defaultAddr = "127.0.0.1:18810"

// Options configure the Clawd Bot desktop host.
type Options struct {
	Addr          string
	UIDir         string
	IdentityDir   string
	SelectionPath string
	OpenBrowser   bool
	Log           *slog.Logger
}

// Server serves the desktop UI and catalog APIs.
type Server struct {
	opts Options
	ui   http.Handler
}

// New builds a desktop server. uiFS is used when UIDir is empty.
func New(opts Options, uiFS fs.FS) (*Server, error) {
	if opts.Log == nil {
		opts.Log = slog.Default()
	}
	if strings.TrimSpace(opts.Addr) == "" {
		opts.Addr = defaultAddr
	}
	if strings.TrimSpace(opts.IdentityDir) == "" {
		opts.IdentityDir = identity.DefaultRoot()
	}
	if strings.TrimSpace(opts.SelectionPath) == "" {
		home, _ := os.UserHomeDir()
		opts.SelectionPath = filepath.Join(home, ".clawdbot", "selected-skills.json")
	}

	var ui http.Handler
	if opts.UIDir != "" {
		ui = http.FileServer(http.Dir(opts.UIDir))
	} else if uiFS != nil {
		ui = http.FileServer(http.FS(uiFS))
	} else {
		return nil, fmt.Errorf("desktop: no ui directory or filesystem")
	}
	return &Server{opts: opts, ui: ui}, nil
}

// Handler returns the HTTP mux.
func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", s.handleHealth)
	mux.HandleFunc("GET /api/catalog", s.handleCatalog)
	mux.HandleFunc("GET /api/identity", s.handleIdentity)
	mux.HandleFunc("GET /api/identity/{name}", s.handleIdentityFile)
	mux.HandleFunc("GET /api/selection", s.handleGetSelection)
	mux.HandleFunc("POST /api/selection", s.handlePostSelection)
	mux.Handle("/", s.ui)
	return mux
}

// ListenAndServe runs until ctx is cancelled.
func (s *Server) ListenAndServe(ctx context.Context) error {
	if ctx == nil {
		return fmt.Errorf("desktop: nil context")
	}
	ln, err := net.Listen("tcp", s.opts.Addr)
	if err != nil {
		return fmt.Errorf("desktop: listen: %w", err)
	}
	srv := &http.Server{
		Handler:           s.Handler(),
		ReadHeaderTimeout: 10 * time.Second,
	}
	errCh := make(chan error, 1)
	go func() {
		errCh <- srv.Serve(ln)
	}()
	s.opts.Log.Info("clawd bot desktop listening", "addr", ln.Addr().String())
	if s.opts.OpenBrowser {
		go openURL("http://" + ln.Addr().String())
	}
	select {
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := srv.Shutdown(shutdownCtx); err != nil {
			return fmt.Errorf("desktop: shutdown: %w", err)
		}
		<-errCh
		return nil
	case err := <-errCh:
		if err == nil || err == http.ErrServerClosed {
			return nil
		}
		return fmt.Errorf("desktop: serve: %w", err)
	}
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"product": identity.ProductName,
		"slug":    identity.ProductSlug,
		"engine":  "clawdbot-desktop",
	})
}

func (s *Server) handleCatalog(w http.ResponseWriter, r *http.Request) {
	report := catalog.BuildReport(catalog.DefaultRoots())
	selected, err := catalog.LoadSelection(s.opts.SelectionPath)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"report":    report,
		"selected":  selected,
		"selection": s.opts.SelectionPath,
	})
}

func (s *Server) handleIdentity(w http.ResponseWriter, r *http.Request) {
	m, err := identity.Load(s.opts.IdentityDir)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, m)
}

func (s *Server) handleIdentityFile(w http.ResponseWriter, r *http.Request) {
	name := r.PathValue("name")
	data, err := identity.ReadFile(s.opts.IdentityDir, name)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": err.Error()})
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	_, _ = w.Write(data)
}

func (s *Server) handleGetSelection(w http.ResponseWriter, r *http.Request) {
	selected, err := catalog.LoadSelection(s.opts.SelectionPath)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	if selected == nil {
		selected = []string{}
	}
	writeJSON(w, http.StatusOK, map[string]any{"selected": selected})
}

func (s *Server) handlePostSelection(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Selected []string `json:"selected"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	if err := catalog.SaveSelection(s.opts.SelectionPath, body.Selected); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true, "selected": body.Selected})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func openURL(url string) {
	var c *exec.Cmd
	switch runtime.GOOS {
	case "darwin":
		c = exec.Command("open", "-na", "Google Chrome", "--args", "--app="+url)
		if err := c.Start(); err == nil {
			return
		}
		c = exec.Command("open", url)
	case "windows":
		c = exec.Command("cmd", "/c", "start", url)
	default:
		c = exec.Command("xdg-open", url)
	}
	_ = c.Start()
}
