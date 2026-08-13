package xai_test

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"github.com/8bitlabs/clawdbot/pkg/xai"
)

func TestNewRejectsEmptyKey(t *testing.T) {
	t.Parallel()
	_, err := xai.New("")
	if !errors.Is(err, xai.ErrNotConfigured) {
		t.Fatalf("got %v, want ErrNotConfigured", err)
	}
}

func TestOptionsValidation(t *testing.T) {
	t.Parallel()
	cases := []struct {
		name string
		opt  xai.Option
	}{
		{"empty api key", xai.WithAPIKey("  ")},
		{"empty base url", xai.WithBaseURL("")},
		{"empty model", xai.WithModel("")},
		{"nil http", xai.WithHTTPClient(nil)},
		{"zero timeout", xai.WithTimeout(0)},
		{"bad tier", xai.WithServiceTier("turbo")},
		{"zero concurrent", xai.WithMaxConcurrent(0)},
		{"empty ua", xai.WithUserAgent("")},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			_, err := xai.New("test-key", tc.opt)
			if err == nil {
				t.Fatal("expected validation error")
			}
		})
	}
}

func TestCreatePriorityAndTools(t *testing.T) {
	t.Parallel()

	var gotBody map[string]any
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/responses" {
			t.Errorf("path = %s", r.URL.Path)
		}
		if r.Header.Get("Authorization") != "Bearer test-key" {
			t.Errorf("missing bearer")
		}
		if err := json.NewDecoder(r.Body).Decode(&gotBody); err != nil {
			t.Errorf("decode: %v", err)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{
			"id":"resp_1",
			"object":"response",
			"model":"grok-4.6",
			"service_tier":"priority",
			"output":[{"type":"message","role":"assistant","content":[{"type":"output_text","text":"ok"}]}],
			"output_text":"ok",
			"usage":{"input_tokens":10,"output_tokens":2,"total_tokens":12}
		}`)
	}))
	t.Cleanup(srv.Close)

	c, err := xai.New("test-key",
		xai.WithBaseURL(srv.URL),
		xai.WithHTTPClient(srv.Client()),
		xai.WithServiceTier(xai.ServiceTierPriority),
		xai.WithTimeout(5*time.Second),
	)
	if err != nil {
		t.Fatal(err)
	}

	resp, err := c.Create(context.Background(), xai.CreateRequest{
		Input: xai.Input{Text: "ping"},
		Tools: []any{xai.XSearch(), xai.CodeInterpreter(), xai.ImageGeneration("generate"), xai.Function("get_token_snapshot", "snap", map[string]any{"type": "object"})},
	})
	if err != nil {
		t.Fatal(err)
	}
	if resp.ServiceTier != xai.ServiceTierPriority {
		t.Fatalf("tier = %q", resp.ServiceTier)
	}
	if resp.OutputText != "ok" {
		t.Fatalf("text = %q", resp.OutputText)
	}
	if gotBody["service_tier"] != "priority" {
		t.Fatalf("request tier = %v", gotBody["service_tier"])
	}
	if gotBody["model"] != "grok-4.6" {
		t.Fatalf("model = %v", gotBody["model"])
	}
	tools, ok := gotBody["tools"].([]any)
	if !ok || len(tools) != 4 {
		t.Fatalf("tools = %#v", gotBody["tools"])
	}
}

func TestCreateInheritsClientTier(t *testing.T) {
	t.Parallel()
	var tier any
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var body map[string]any
		_ = json.NewDecoder(r.Body).Decode(&body)
		tier = body["service_tier"]
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{"id":"r","output":[],"usage":{}}`)
	}))
	t.Cleanup(srv.Close)

	c, err := xai.New("k", xai.WithBaseURL(srv.URL), xai.WithHTTPClient(srv.Client()), xai.WithServiceTier(xai.ServiceTierPriority))
	if err != nil {
		t.Fatal(err)
	}
	if _, err := c.Create(context.Background(), xai.CreateRequest{Input: xai.Input{Text: "x"}}); err != nil {
		t.Fatal(err)
	}
	if tier != "priority" {
		t.Fatalf("inherited tier = %v", tier)
	}
}

func TestFunctionCalls(t *testing.T) {
	t.Parallel()
	resp := &xai.Response{
		Output: []xai.OutputItem{
			{Type: "function_call", Name: "recommend_copy", CallID: "call_1", Arguments: `{"mint":"abc","action":"skip"}`},
			{Type: "message", Role: "assistant"},
		},
	}
	calls := xai.FunctionCalls(resp)
	if len(calls) != 1 {
		t.Fatalf("len = %d", len(calls))
	}
	if calls[0].Name != "recommend_copy" || calls[0].CallID != "call_1" {
		t.Fatalf("%+v", calls[0])
	}
	if calls[0].Arguments["mint"] != "abc" {
		t.Fatalf("args = %#v", calls[0].Arguments)
	}
	if xai.FunctionCalls(nil) == nil {
		t.Fatal("nil response should return empty slice")
	}
}

func TestOutputTextFromContentParts(t *testing.T) {
	t.Parallel()
	raw, _ := json.Marshal([]map[string]string{
		{"type": "output_text", "text": "hello "},
		{"type": "output_text", "text": "world"},
	})
	got := xai.OutputText([]xai.OutputItem{{Type: "message", Content: raw}})
	if got != "hello world" {
		t.Fatalf("got %q", got)
	}
}

func TestInputJSONShapes(t *testing.T) {
	t.Parallel()
	cases := []struct {
		name string
		in   xai.Input
		want string
	}{
		{"text", xai.Input{Text: "hi"}, `"hi"`},
		{"items", xai.Input{Items: []any{xai.Message{Role: "user", Content: "q"}}}, `[{"role":"user","content":"q"}]`},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			b, err := json.Marshal(tc.in)
			if err != nil {
				t.Fatal(err)
			}
			if string(b) != tc.want {
				t.Fatalf("got %s want %s", b, tc.want)
			}
		})
	}
}

func TestCompactPassthrough(t *testing.T) {
	t.Parallel()
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/responses/compact" {
			t.Errorf("path = %s", r.URL.Path)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{
			"id":"cmp_1",
			"object":"response.compaction",
			"model":"grok-4.6",
			"output":[{"type":"compaction","id":"cmp_1","encrypted_content":"blob"}],
			"usage":{"input_tokens":100,"output_tokens":8,"total_tokens":108,"dropped_message_count":4}
		}`)
	}))
	t.Cleanup(srv.Close)

	c, err := xai.New("k", xai.WithBaseURL(srv.URL), xai.WithHTTPClient(srv.Client()))
	if err != nil {
		t.Fatal(err)
	}
	cr, err := c.Compact(context.Background(), xai.CompactRequest{
		Input: xai.Input{Items: []any{xai.Message{Role: "user", Content: "long"}}},
	})
	if err != nil {
		t.Fatal(err)
	}
	if cr.Usage.DroppedMessageCount != 4 {
		t.Fatalf("dropped = %d", cr.Usage.DroppedMessageCount)
	}
	head := cr.CompactionHead()
	if len(head) != 1 {
		t.Fatalf("head len = %d", len(head))
	}
	item, ok := head[0].(xai.CompactionItem)
	if !ok || item.EncryptedContent != "blob" || item.Type != "compaction" {
		t.Fatalf("head = %#v", head[0])
	}
}

func TestDeferredReadyAndPending(t *testing.T) {
	t.Parallel()
	var gets atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch {
		case r.Method == http.MethodPost && r.URL.Path == "/chat/completions":
			w.Header().Set("Content-Type", "application/json")
			_, _ = io.WriteString(w, `{"request_id":"def_1"}`)
		case r.Method == http.MethodGet && r.URL.Path == "/chat/deferred-completion/def_1":
			n := gets.Add(1)
			if n < 2 {
				w.WriteHeader(http.StatusAccepted)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			_, _ = io.WriteString(w, `{"id":"cmpl","choices":[{"message":{"content":"42"}}]}`)
		default:
			http.NotFound(w, r)
		}
	}))
	t.Cleanup(srv.Close)

	c, err := xai.New("k", xai.WithBaseURL(srv.URL), xai.WithHTTPClient(srv.Client()))
	if err != nil {
		t.Fatal(err)
	}
	id, err := c.SubmitDeferred(context.Background(), "", []xai.ChatMessage{{Role: "user", Content: "126/3=?"}})
	if err != nil {
		t.Fatal(err)
	}
	if id != "def_1" {
		t.Fatalf("id = %s", id)
	}
	_, err = c.GetDeferred(context.Background(), id)
	if err != xai.ErrNotReady {
		t.Fatalf("first get: %v", err)
	}
	body, err := c.AwaitDeferred(context.Background(), id, 2*time.Second, 10*time.Millisecond)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Contains(body, []byte("42")) {
		t.Fatalf("body = %s", body)
	}
}

func TestGatherRespectsSemaphore(t *testing.T) {
	t.Parallel()
	var inflight atomic.Int32
	var max atomic.Int32
	items := []int{1, 2, 3, 4}
	_, err := xai.Gather(context.Background(), items, 2, func(ctx context.Context, n int) (int, error) {
		cur := inflight.Add(1)
		for {
			old := max.Load()
			if cur <= old || max.CompareAndSwap(old, cur) {
				break
			}
		}
		time.Sleep(20 * time.Millisecond)
		inflight.Add(-1)
		return n * 10, nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if max.Load() > 2 {
		t.Fatalf("max inflight = %d", max.Load())
	}
}

func TestGatherEmpty(t *testing.T) {
	t.Parallel()
	out, err := xai.Gather(context.Background(), []int{}, 2, func(context.Context, int) (int, error) {
		t.Fatal("fn should not run")
		return 0, nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if len(out) != 0 {
		t.Fatalf("len = %d", len(out))
	}
}

func TestSessionCompactReplacesItems(t *testing.T) {
	t.Parallel()
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{
			"id":"cmp_s",
			"object":"response.compaction",
			"output":[{"type":"compaction","id":"cmp_s","encrypted_content":"opaque"}],
			"usage":{"dropped_message_count":2}
		}`)
	}))
	t.Cleanup(srv.Close)

	c, err := xai.New("k", xai.WithBaseURL(srv.URL), xai.WithHTTPClient(srv.Client()))
	if err != nil {
		t.Fatal(err)
	}
	s := xai.NewSession("sys", 2)
	s.Append(xai.Message{Role: "user", Content: "a"})
	if _, err := s.MaybeCompact(context.Background(), c, ""); err != nil {
		t.Fatal(err)
	}
	if len(s.Items()) != 2 { // system + user, not yet compacted
		t.Fatalf("before compact: %d", len(s.Items()))
	}
	s.Append(xai.Message{Role: "user", Content: "b"})
	cr, err := s.MaybeCompact(context.Background(), c, "")
	if err != nil {
		t.Fatal(err)
	}
	if cr == nil {
		t.Fatal("expected compaction")
	}
	items := s.Items()
	if len(items) != 1 {
		t.Fatalf("after compact: %d", len(items))
	}
	item, ok := items[0].(xai.CompactionItem)
	if !ok || item.EncryptedContent != "opaque" {
		t.Fatalf("items = %#v", items)
	}
}

func TestPumpToolsAreObjects(t *testing.T) {
	t.Parallel()
	tools := xai.PumpTools()
	if len(tools) < 2 {
		t.Fatalf("len = %d", len(tools))
	}
	for i, raw := range tools {
		b, err := json.Marshal(raw)
		if err != nil {
			t.Fatalf("tool %d: %v", i, err)
		}
		var m map[string]any
		if err := json.Unmarshal(b, &m); err != nil {
			t.Fatal(err)
		}
		if m["type"] != "function" {
			t.Fatalf("tool %d type = %v", i, m["type"])
		}
		params, _ := m["parameters"].(map[string]any)
		if params["type"] != "object" {
			t.Fatalf("tool %d parameters type = %v", i, params["type"])
		}
	}
}

func TestUserFacingToolsIncludeMCP(t *testing.T) {
	t.Parallel()
	tools := xai.UserFacingTools("https://mcp.example/mcp", "example")
	if len(tools) != 5 {
		t.Fatalf("len = %d", len(tools))
	}
	last, _ := json.Marshal(tools[len(tools)-1])
	if !bytes.Contains(last, []byte(`"type":"mcp"`)) {
		t.Fatalf("last = %s", last)
	}
}

func TestNilContextRejected(t *testing.T) {
	t.Parallel()
	c, err := xai.New("k")
	if err != nil {
		t.Fatal(err)
	}
	if _, err := c.Create(nil, xai.CreateRequest{Input: xai.Input{Text: "x"}}); err == nil { //nolint:staticcheck
		t.Fatal("expected nil context error")
	}
}

func TestHealthOmitsSecrets(t *testing.T) {
	t.Parallel()
	c, err := xai.New("super-secret-key", xai.WithServiceTier(xai.ServiceTierPriority))
	if err != nil {
		t.Fatal(err)
	}
	h := c.Health()
	raw, _ := json.Marshal(h)
	if bytes.Contains(raw, []byte("super-secret-key")) {
		t.Fatalf("leaked key: %s", raw)
	}
	if h["configured"] != true || h["serviceTier"] != xai.ServiceTierPriority {
		t.Fatalf("health = %#v", h)
	}
}

func TestStreamParsesDeltas(t *testing.T) {
	t.Parallel()
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var body map[string]any
		_ = json.NewDecoder(r.Body).Decode(&body)
		if body["stream"] != true {
			t.Errorf("stream = %v", body["stream"])
		}
		w.Header().Set("Content-Type", "text/event-stream")
		_, _ = io.WriteString(w, "data: {\"type\":\"response.output_text.delta\",\"delta\":\"hel\"}\n\n")
		_, _ = io.WriteString(w, "data: {\"type\":\"response.output_text.delta\",\"delta\":\"lo\"}\n\n")
		_, _ = io.WriteString(w, "data: {\"type\":\"response.completed\",\"response\":{\"id\":\"r1\",\"output_text\":\"hello\",\"output\":[],\"service_tier\":\"priority\"}}\n\n")
	}))
	t.Cleanup(srv.Close)

	c, err := xai.New("k", xai.WithBaseURL(srv.URL), xai.WithHTTPClient(srv.Client()))
	if err != nil {
		t.Fatal(err)
	}
	var deltas []string
	resp, err := c.Stream(context.Background(), xai.CreateRequest{Input: xai.Input{Text: "hi"}}, func(ev xai.StreamEvent) error {
		if ev.Type == "response.output_text.delta" {
			deltas = append(deltas, ev.Delta)
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if strings.Join(deltas, "") != "hello" {
		t.Fatalf("deltas = %#v", deltas)
	}
	if resp == nil || resp.OutputText != "hello" || resp.ServiceTier != xai.ServiceTierPriority {
		t.Fatalf("resp = %+v", resp)
	}
}
