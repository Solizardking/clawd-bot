package grok_test

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/8bitlabs/clawdbot/clawdbot-pumpfun/grok"
	"github.com/8bitlabs/clawdbot/pkg/xai"
)

func newTestServer(t *testing.T, xaiHandler http.HandlerFunc) *grok.Server {
	t.Helper()
	upstream := httptest.NewServer(xaiHandler)
	t.Cleanup(upstream.Close)
	c, err := xai.New("test-key",
		xai.WithBaseURL(upstream.URL),
		xai.WithHTTPClient(upstream.Client()),
		xai.WithTimeout(5*time.Second),
	)
	if err != nil {
		t.Fatal(err)
	}
	return grok.NewServer(c, nil)
}

func TestHealth(t *testing.T) {
	t.Parallel()
	s := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		http.NotFound(w, r)
	})
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d body = %s", rec.Code, rec.Body.Bytes())
	}
	var body map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if body["ok"] != true || body["engine"] != "xai-responses" {
		t.Fatalf("body = %#v", body)
	}
}

func TestAnalyzeMissingMint(t *testing.T) {
	t.Parallel()
	s := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		t.Fatal("xai should not be called")
	})
	req := httptest.NewRequest(http.MethodPost, "/analyze", bytes.NewBufferString(`{}`))
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d", rec.Code)
	}
}

func TestAnalyzePriorityTools(t *testing.T) {
	t.Parallel()
	var saw map[string]any
	s := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/responses" {
			t.Errorf("path = %s", r.URL.Path)
		}
		_ = json.NewDecoder(r.Body).Decode(&saw)
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{
			"id":"resp_a",
			"model":"grok-4.6",
			"service_tier":"priority",
			"output":[{"type":"message","role":"assistant","content":[{"type":"output_text","text":"skip: no heat"}]}],
			"output_text":"skip: no heat",
			"usage":{"input_tokens":1,"output_tokens":1,"total_tokens":2}
		}`)
	})
	raw, _ := json.Marshal(map[string]any{"mint": "Mint111", "ticker": "CLAWD", "is_buy": true})
	req := httptest.NewRequest(http.MethodPost, "/analyze", bytes.NewReader(raw))
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d body = %s", rec.Code, rec.Body.Bytes())
	}
	if saw["service_tier"] != "priority" {
		t.Fatalf("tier = %v", saw["service_tier"])
	}
	tools, _ := saw["tools"].([]any)
	if len(tools) < 4 {
		t.Fatalf("tools = %#v", saw["tools"])
	}
	var out map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &out); err != nil {
		t.Fatal(err)
	}
	if out["text"] != "skip: no heat" || out["service_tier"] != "priority" {
		t.Fatalf("out = %#v", out)
	}
}

func TestSnapshotRoundTrip(t *testing.T) {
	t.Parallel()
	s := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		http.NotFound(w, r)
	})
	raw, _ := json.Marshal(grok.TokenSnapshot{Mint: "Mint111", Held: true, Protocol: "pumpfun"})
	req := httptest.NewRequest(http.MethodPost, "/snapshot", bytes.NewReader(raw))
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
}

func TestListenAndServeShutdown(t *testing.T) {
	t.Parallel()
	s := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		http.NotFound(w, r)
	})
	ctx, cancel := context.WithCancel(context.Background())
	errCh := make(chan error, 1)
	go func() { errCh <- s.ListenAndServe(ctx, "127.0.0.1:0") }()
	time.Sleep(50 * time.Millisecond)
	cancel()
	select {
	case err := <-errCh:
		if err != nil {
			t.Fatal(err)
		}
	case <-time.After(3 * time.Second):
		t.Fatal("shutdown timed out")
	}
}
