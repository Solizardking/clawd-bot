package frontend_test

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/8bitlabs/clawdbot/clawdbot-frontend"
	"github.com/8bitlabs/clawdbot/pkg/xai"
)

func TestDeckServesHTML(t *testing.T) {
	t.Parallel()
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.NotFound(w, r)
	}))
	t.Cleanup(upstream.Close)
	c, err := xai.New("k", xai.WithBaseURL(upstream.URL), xai.WithHTTPClient(upstream.Client()), xai.WithTimeout(2*time.Second))
	if err != nil {
		t.Fatal(err)
	}
	s := frontend.NewServer(c, nil)
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
	ct := rec.Header().Get("Content-Type")
	if !strings.Contains(ct, "text/html") {
		t.Fatalf("content-type = %s", ct)
	}
	if !bytes.Contains(rec.Body.Bytes(), []byte("Clawd Bot")) {
		t.Fatal("missing deck title")
	}
}

func TestClaimPage(t *testing.T) {
	t.Parallel()
	upstream := httptest.NewServer(http.NotFoundHandler())
	t.Cleanup(upstream.Close)
	c, err := xai.New("k", xai.WithBaseURL(upstream.URL), xai.WithHTTPClient(upstream.Client()))
	if err != nil {
		t.Fatal(err)
	}
	s := frontend.NewServer(c, nil)
	req := httptest.NewRequest(http.MethodGet, "/claim", nil)
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
	if !bytes.Contains(rec.Body.Bytes(), []byte("walletChainType")) {
		t.Fatal("missing Privy Solana claim snippet")
	}
}

func TestHealth(t *testing.T) {
	t.Parallel()
	upstream := httptest.NewServer(http.NotFoundHandler())
	t.Cleanup(upstream.Close)
	c, err := xai.New("k", xai.WithBaseURL(upstream.URL), xai.WithHTTPClient(upstream.Client()))
	if err != nil {
		t.Fatal(err)
	}
	s := frontend.NewServer(c, nil)
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
	var body map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if body["ok"] != true || body["engine"] != "xai-responses" {
		t.Fatalf("body = %#v", body)
	}
}

func TestChatMissingPrompt(t *testing.T) {
	t.Parallel()
	upstream := httptest.NewServer(http.NotFoundHandler())
	t.Cleanup(upstream.Close)
	c, err := xai.New("k", xai.WithBaseURL(upstream.URL), xai.WithHTTPClient(upstream.Client()))
	if err != nil {
		t.Fatal(err)
	}
	s := frontend.NewServer(c, nil)
	req := httptest.NewRequest(http.MethodPost, "/api/chat", bytes.NewBufferString(`{}`))
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d body = %s", rec.Code, rec.Body.Bytes())
	}
}

func TestChatStreamsPriority(t *testing.T) {
	t.Parallel()
	var saw map[string]any
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_ = json.NewDecoder(r.Body).Decode(&saw)
		w.Header().Set("Content-Type", "text/event-stream")
		_, _ = io.WriteString(w, "data: {\"type\":\"response.output_text.delta\",\"delta\":\"hi\"}\n\n")
		_, _ = io.WriteString(w, "data: {\"type\":\"response.completed\",\"response\":{\"id\":\"r1\",\"output_text\":\"hi\",\"model\":\"grok-4.6\",\"service_tier\":\"priority\",\"output\":[]}}\n\n")
	}))
	t.Cleanup(upstream.Close)
	c, err := xai.New("k",
		xai.WithBaseURL(upstream.URL),
		xai.WithHTTPClient(upstream.Client()),
		xai.WithTimeout(5*time.Second),
	)
	if err != nil {
		t.Fatal(err)
	}
	s := frontend.NewServer(c, nil)
	req := httptest.NewRequest(http.MethodPost, "/api/chat", bytes.NewBufferString(`{"prompt":"hello","tools":["x_search"]}`))
	rec := httptest.NewRecorder()
	s.Handler().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d body = %s", rec.Code, rec.Body.Bytes())
	}
	if saw["service_tier"] != "priority" {
		t.Fatalf("tier = %v", saw["service_tier"])
	}
	body := rec.Body.String()
	if !strings.Contains(body, `"type":"text"`) || !strings.Contains(body, `"type":"final"`) {
		t.Fatalf("sse = %s", body)
	}
}
