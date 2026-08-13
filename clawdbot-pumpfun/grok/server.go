// Package grok is the grok-4.6 sidecar for the PumpFun copy-trading bot.
//
// User-facing /analyze and /chat use service_tier=priority. Background
// research can use SubmitDeferred. The Rust sniper still owns execution;
// this process only scores tokens and records recommendations.
package grok

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/8bitlabs/clawdbot/pkg/xai"
)

const defaultPumpSystem = `You are eliZERO's PumpFun desk. Score Solana pump.fun / PumpSwap tokens for copy-trading.
Use x_search for social heat, code_interpreter for sizing math, and the local function tools for tracker state.
Never claim you executed a trade. Recommend copy_buy, skip, sell, or watch with a short evidence-backed reason.
Priority processing is on: keep answers tight.`

// Server is the HTTP sidecar.
type Server struct {
	xai     *xai.Client
	log     *slog.Logger
	model   string
	mcpURL  string
	mcpName string

	mu    sync.Mutex
	recos map[string]Recommendation
	snaps map[string]TokenSnapshot
}

// Recommendation is a Grok copy-trade verdict stored by recommend_copy.
type Recommendation struct {
	Mint       string    `json:"mint"`
	Action     string    `json:"action"`
	Confidence float64   `json:"confidence,omitempty"`
	Reason     string    `json:"reason"`
	At         time.Time `json:"at"`
	Tier       string    `json:"service_tier,omitempty"`
}

// TokenSnapshot is optional tracker state the Rust bot can POST.
type TokenSnapshot struct {
	Mint     string `json:"mint"`
	Protocol string `json:"protocol,omitempty"`
	Held     bool   `json:"held"`
	LastSide string `json:"last_side,omitempty"`
	Note     string `json:"note,omitempty"`
}

// NewServer builds a sidecar around an xAI client. c must be non-nil.
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
		recos:   map[string]Recommendation{},
		snaps:   map[string]TokenSnapshot{},
	}
}

func envOr(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}

// Handler returns the sidecar mux.
func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", s.handleHealth)
	mux.HandleFunc("POST /chat", s.handleChat)
	mux.HandleFunc("POST /analyze", s.handleAnalyze)
	mux.HandleFunc("POST /compact", s.handleCompact)
	mux.HandleFunc("POST /snapshot", s.handleSnapshot)
	mux.HandleFunc("GET /recommendations", s.handleRecommendations)
	mux.HandleFunc("POST /image", s.handleImage)
	return mux
}

// ListenAndServe runs until ctx is cancelled, then shuts down gracefully.
func (s *Server) ListenAndServe(ctx context.Context, addr string) error {
	if ctx == nil {
		return fmt.Errorf("grok: nil context")
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
		s.log.Info("pump-grok listening", "addr", ln.Addr().String(), "model", s.model)
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

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	s.mu.Lock()
	nReco := len(s.recos)
	nSnap := len(s.snaps)
	s.mu.Unlock()
	writeJSON(w, http.StatusOK, map[string]any{
		"ok":              true,
		"engine":          "xai-responses",
		"xai":             s.xai.Health(),
		"recommendations": nReco,
		"snapshots":       nSnap,
	})
}

type chatBody struct {
	Prompt             string `json:"prompt"`
	PreviousResponseID string `json:"previous_response_id"`
	Compact            bool   `json:"compact"`
	Mint               string `json:"mint"`
}

func (s *Server) handleChat(w http.ResponseWriter, r *http.Request) {
	var body chatBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	prompt := strings.TrimSpace(body.Prompt)
	if prompt == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing prompt"})
		return
	}

	ctx := r.Context()
	input := []any{
		xai.Message{Role: "system", Content: defaultPumpSystem},
		xai.Message{Role: "user", Content: prompt},
	}
	resp, err := s.runTurn(ctx, input, body.PreviousResponseID)
	if err != nil {
		s.log.Error("chat", "err", err)
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"text":         resp.OutputText,
		"response_id":  resp.ID,
		"model":        resp.Model,
		"service_tier": resp.ServiceTier,
		"usage":        resp.Usage,
		"tool_calls":   xai.FunctionCalls(resp),
	})
}

type analyzeBody struct {
	Mint   string `json:"mint"`
	Ticker string `json:"ticker"`
	IsBuy  *bool  `json:"is_buy"`
	Note   string `json:"note"`
}

func (s *Server) handleAnalyze(w http.ResponseWriter, r *http.Request) {
	var body analyzeBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	mint := strings.TrimSpace(body.Mint)
	if mint == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing mint"})
		return
	}

	side := "activity"
	if body.IsBuy != nil {
		if *body.IsBuy {
			side = "buy"
		} else {
			side = "sell"
		}
	}
	prompt := fmt.Sprintf(
		"Analyze PumpFun token mint %s (ticker %s). Detected %s. %s\nSearch X for social heat, then recommend copy_buy, skip, sell, or watch.",
		mint, emptyDash(body.Ticker), side, body.Note,
	)

	input := []any{
		xai.Message{Role: "system", Content: defaultPumpSystem},
		xai.Message{Role: "user", Content: prompt},
	}
	resp, err := s.runTurn(r.Context(), input, "")
	if err != nil {
		s.log.Error("analyze", "mint", mint, "err", err)
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"mint":         mint,
		"text":         resp.OutputText,
		"response_id":  resp.ID,
		"model":        resp.Model,
		"service_tier": resp.ServiceTier,
		"usage":        resp.Usage,
		"images":       xai.ImageResults(resp),
	})
}

func (s *Server) handleCompact(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Items []any `json:"items"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	if len(body.Items) == 0 {
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

func (s *Server) handleSnapshot(w http.ResponseWriter, r *http.Request) {
	var snap TokenSnapshot
	if err := json.NewDecoder(r.Body).Decode(&snap); err != nil || snap.Mint == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "mint required"})
		return
	}
	s.mu.Lock()
	s.snaps[snap.Mint] = snap
	s.mu.Unlock()
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) handleRecommendations(w http.ResponseWriter, _ *http.Request) {
	s.mu.Lock()
	out := make([]Recommendation, 0, len(s.recos))
	for _, v := range s.recos {
		out = append(out, v)
	}
	s.mu.Unlock()
	writeJSON(w, http.StatusOK, out)
}

func (s *Server) handleImage(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Prompt string `json:"prompt"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || strings.TrimSpace(body.Prompt) == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing prompt"})
		return
	}
	resp, err := s.xai.Create(r.Context(), xai.CreateRequest{
		Model:       s.model,
		Input:       xai.Input{Text: body.Prompt},
		Tools:       []any{xai.ImageGeneration("generate")},
		ServiceTier: xai.ServiceTierPriority,
	})
	if err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"text":         resp.OutputText,
		"images":       xai.ImageResults(resp),
		"service_tier": resp.ServiceTier,
		"response_id":  resp.ID,
	})
}

func (s *Server) runTurn(ctx context.Context, input []any, prevID string) (*xai.Response, error) {
	tools := append(xai.UserFacingTools(s.mcpURL, s.mcpName), xai.PumpTools()...)
	store := false
	req := xai.CreateRequest{
		Model:              s.model,
		Input:              xai.Input{Items: input},
		Tools:              tools,
		ServiceTier:        xai.ServiceTierPriority,
		Store:              &store,
		PreviousResponseID: prevID,
		Reasoning:          &xai.ReasoningConfig{Effort: xai.ReasoningLow},
	}

	const maxTurns = 8
	var last *xai.Response
	for i := 0; i < maxTurns; i++ {
		if ctx.Err() != nil {
			return last, fmt.Errorf("run turn: %w", ctx.Err())
		}
		resp, err := s.xai.Create(ctx, req)
		if err != nil {
			return last, err
		}
		last = resp
		calls := xai.FunctionCalls(resp)
		if len(calls) == 0 {
			return resp, nil
		}
		outputs := make([]any, 0, len(calls))
		for _, call := range calls {
			out := s.execTool(call)
			outputs = append(outputs, xai.FunctionCallOutput{
				Type:   "function_call_output",
				CallID: call.CallID,
				Output: out,
			})
		}
		next := make([]any, 0, len(resp.Output)+len(outputs))
		for _, item := range resp.Output {
			next = append(next, item)
		}
		next = append(next, outputs...)
		req.Input = xai.Input{Items: next}
		req.PreviousResponseID = ""
	}
	return last, fmt.Errorf("max tool turns reached")
}

func (s *Server) execTool(call xai.FunctionCall) string {
	switch call.Name {
	case "get_token_snapshot":
		mint, _ := call.Arguments["mint"].(string)
		s.mu.Lock()
		snap, ok := s.snaps[mint]
		s.mu.Unlock()
		if !ok {
			return fmt.Sprintf(`{"mint":%q,"held":false,"note":"no local snapshot"}`, mint)
		}
		b, _ := json.Marshal(snap)
		return string(b)
	case "recommend_copy":
		mint, _ := call.Arguments["mint"].(string)
		action, _ := call.Arguments["action"].(string)
		reason, _ := call.Arguments["reason"].(string)
		conf, _ := call.Arguments["confidence"].(float64)
		rec := Recommendation{
			Mint:       mint,
			Action:     action,
			Confidence: conf,
			Reason:     reason,
			At:         time.Now().UTC(),
		}
		s.mu.Lock()
		s.recos[mint] = rec
		s.mu.Unlock()
		b, _ := json.Marshal(rec)
		return string(b)
	default:
		return fmt.Sprintf(`{"error":"unknown tool %s"}`, call.Name)
	}
}

func emptyDash(s string) string {
	if strings.TrimSpace(s) == "" {
		return "unknown"
	}
	return s
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
