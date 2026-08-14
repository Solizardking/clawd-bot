// Package frontend serves the Clawd Bot control deck and proxies the xAI Responses API.
package frontend

import (
	"context"
	_ "embed"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/8bitlabs/clawdbot/pkg/xai"
)

const defaultSystem = `You are Clawd Bot (grok-4.6). Solana-native, concise, a little lobster. Bound by the six-law harness.
Priority processing is on for this chat. Use X search, code interpreter, web search, and image generation when they help.
Never invent fills or balances. If PumpFun data is missing, say so.`

//go:embed grok-deck.html
var deckHTML []byte

//go:embed claim.html
var claimHTML []byte

// Server hosts the control deck.
type Server struct {
	xai        *xai.Client
	log        *slog.Logger
	model      string
	mcpURL     string
	mcpName    string
	pumpURL    string
	pumpClient *http.Client
}

// NewServer builds the frontend around a configured xAI client.
func NewServer(c *xai.Client, log *slog.Logger) *Server {
	if log == nil {
		log = slog.Default()
	}
	return &Server{
		xai:     c,
		log:     log,
		model:   c.Model(),
		mcpURL:  strings.TrimSpace(os.Getenv("XAI_MCP_URL")),
		mcpName: envOr("XAI_MCP_LABEL", "clawd"),
		pumpURL: strings.TrimRight(strings.TrimSpace(os.Getenv("PUMP_GROK_URL")), "/"),
		pumpClient: &http.Client{
			Timeout: 45 * time.Second,
		},
	}
}

func envOr(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}

// Handler returns the mux. HTML is same-origin with the API.
func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", s.handleDeck)
	mux.HandleFunc("GET /claim", s.handleClaim)
	mux.HandleFunc("GET /health", s.handleHealth)
	mux.HandleFunc("POST /api/chat", s.handleChat)
	mux.HandleFunc("POST /api/compact", s.handleCompact)
	mux.HandleFunc("GET /api/pump", s.handlePump)
	mux.HandleFunc("POST /api/analyze", s.handleAnalyze)
	return mux
}

// ListenAndServe runs until ctx is cancelled.
func (s *Server) ListenAndServe(ctx context.Context, addr string) error {
	if ctx == nil {
		return fmt.Errorf("frontend: nil context")
	}
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return fmt.Errorf("listen: %w", err)
	}
	httpSrv := &http.Server{
		Handler:           s.Handler(),
		ReadHeaderTimeout: 10 * time.Second,
	}
	errCh := make(chan error, 1)
	go func() {
		s.log.Info("clawd-frontend listening", "addr", ln.Addr().String(), "model", s.model)
		errCh <- httpSrv.Serve(ln)
	}()
	select {
	case <-ctx.Done():
		shutCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), 10*time.Second)
		defer cancel()
		if err := httpSrv.Shutdown(shutCtx); err != nil {
			return fmt.Errorf("shutdown: %w", err)
		}
		<-errCh
		return nil
	case err := <-errCh:
		if err == nil || err == http.ErrServerClosed {
			return nil
		}
		return err
	}
}

func (s *Server) handleDeck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	_, _ = w.Write(deckHTML)
}

func (s *Server) handleClaim(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	_, _ = w.Write(claimHTML)
}

func (s *Server) handleHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"ok":     true,
		"engine": "xai-responses",
		"xai":    s.xai.Health(),
		"pump":   s.pumpURL != "",
	})
}

type chatBody struct {
	Prompt             string   `json:"prompt"`
	PreviousResponseID string   `json:"previous_response_id"`
	Priority           *bool    `json:"priority"`
	Tools              []string `json:"tools"`
	Items              []any    `json:"items"`
}

func (s *Server) handleChat(w http.ResponseWriter, r *http.Request) {
	var body chatBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	prompt := strings.TrimSpace(body.Prompt)
	if prompt == "" && len(body.Items) == 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing prompt"})
		return
	}

	items := body.Items
	if len(items) == 0 {
		items = []any{
			xai.Message{Role: "system", Content: defaultSystem},
			xai.Message{Role: "user", Content: prompt},
		}
	} else if prompt != "" {
		items = append(items, xai.Message{Role: "user", Content: prompt})
	}

	tier := xai.ServiceTierPriority
	if body.Priority != nil && !*body.Priority {
		tier = xai.ServiceTierDefault
	}
	store := false
	req := xai.CreateRequest{
		Model:              s.model,
		Input:              xai.Input{Items: items},
		Tools:              s.selectTools(body.Tools),
		ServiceTier:        tier,
		Store:              &store,
		PreviousResponseID: body.PreviousResponseID,
		Reasoning:          &xai.ReasoningConfig{Effort: xai.ReasoningLow},
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache, no-transform")
	w.Header().Set("Connection", "keep-alive")
	flusher, _ := w.(http.Flusher)
	send := func(v any) {
		b, _ := json.Marshal(v)
		_, _ = fmt.Fprintf(w, "data: %s\n\n", b)
		if flusher != nil {
			flusher.Flush()
		}
	}

	resp, err := s.xai.Stream(r.Context(), req, func(ev xai.StreamEvent) error {
		switch ev.Type {
		case "response.output_text.delta":
			if ev.Delta != "" {
				send(map[string]any{"type": "text", "delta": ev.Delta})
			}
		case "response.image_generation_call.in_progress",
			"response.image_generation_call.generating",
			"response.image_generation_call.completed":
			send(map[string]any{"type": "image_status", "status": ev.Type})
		}
		return nil
	})
	if err != nil {
		s.log.Error("chat stream", "err", err)
		send(map[string]any{"type": "error", "message": err.Error()})
		send(map[string]any{"type": "done"})
		return
	}
	if resp != nil {
		send(map[string]any{
			"type":        "final",
			"text":        resp.OutputText,
			"responseId":  resp.ID,
			"model":       resp.Model,
			"serviceTier": resp.ServiceTier,
			"usage":       resp.Usage,
			"images":      xai.ImageResults(resp),
			"toolCalls":   xai.FunctionCalls(resp),
		})
	}
	send(map[string]any{"type": "done"})
}

func (s *Server) selectTools(names []string) []any {
	if len(names) == 0 {
		return xai.UserFacingTools(s.mcpURL, s.mcpName)
	}
	want := map[string]bool{}
	for _, n := range names {
		want[strings.ToLower(strings.TrimSpace(n))] = true
	}
	var tools []any
	if want["x_search"] || want["xsearch"] {
		tools = append(tools, xai.XSearch())
	}
	if want["code"] || want["code_interpreter"] || want["code_execution"] {
		tools = append(tools, xai.CodeInterpreter())
	}
	if want["image"] || want["image_generation"] {
		tools = append(tools, xai.ImageGeneration("auto"))
	}
	if want["web"] || want["web_search"] {
		tools = append(tools, xai.WebSearch())
	}
	if (want["mcp"] || want["remote_mcp"]) && s.mcpURL != "" {
		tools = append(tools, xai.MCP(s.mcpURL, s.mcpName))
	}
	return tools
}

func (s *Server) handleCompact(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Items []any `json:"items"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || len(body.Items) == 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing items"})
		return
	}
	cr, err := s.xai.Compact(r.Context(), xai.CompactRequest{
		Model: s.model,
		Input: xai.Input{Items: body.Items},
	})
	if err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, cr)
}

func (s *Server) handlePump(w http.ResponseWriter, r *http.Request) {
	if s.pumpURL == "" {
		writeJSON(w, http.StatusOK, map[string]any{"ok": false, "configured": false})
		return
	}
	req, err := http.NewRequestWithContext(r.Context(), http.MethodGet, s.pumpURL+"/health", nil)
	if err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
		return
	}
	resp, err := s.pumpClient.Do(req)
	if err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
		return
	}
	defer resp.Body.Close()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	_, _ = io.Copy(w, resp.Body)
}

func (s *Server) handleAnalyze(w http.ResponseWriter, r *http.Request) {
	if s.pumpURL == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "PUMP_GROK_URL is not set"})
		return
	}
	req, err := http.NewRequestWithContext(r.Context(), http.MethodPost, s.pumpURL+"/analyze", r.Body)
	if err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
		return
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := s.pumpClient.Do(req)
	if err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
		return
	}
	defer resp.Body.Close()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	_, _ = io.Copy(w, resp.Body)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
