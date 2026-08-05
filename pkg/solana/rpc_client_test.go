package solana

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

// System program id — valid base58 pubkey used as a stable RPC subject.
const systemProgramPubkey = "11111111111111111111111111111111"

func TestLamportsSOLRoundTrip(t *testing.T) {
	if LamportsPerSOL != 1_000_000_000 {
		t.Fatalf("LamportsPerSOL = %d, want 1e9", LamportsPerSOL)
	}
	if got := LamportsToSOL(1_500_000_000); got != 1.5 {
		t.Fatalf("LamportsToSOL = %v, want 1.5", got)
	}
	if got := SOLToLamports(2.5); got != 2_500_000_000 {
		t.Fatalf("SOLToLamports = %d, want 2500000000", got)
	}
	if got := SOLToLamports(-1); got != 0 {
		t.Fatalf("SOLToLamports(negative) = %d, want 0", got)
	}
}

func TestRPCClientGetBalanceAndSlot(t *testing.T) {
	var methods []string
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			t.Errorf("read body: %v", err)
			http.Error(w, "read", 500)
			return
		}
		var req struct {
			Method string          `json:"method"`
			Params json.RawMessage `json:"params"`
		}
		if err := json.Unmarshal(body, &req); err != nil {
			t.Errorf("decode request: %v", err)
			http.Error(w, "bad json", 400)
			return
		}
		methods = append(methods, req.Method)

		var result any
		switch req.Method {
		case "getBalance":
			result = map[string]any{
				"context": map[string]any{"slot": 42},
				"value":   1_500_000_000,
			}
		case "getSlot":
			result = uint64(987654)
		case "getLatestBlockhash":
			result = map[string]any{
				"context": map[string]any{"slot": 42},
				"value": map[string]any{
					"blockhash":            "EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N",
					"lastValidBlockHeight": 100,
				},
			}
		default:
			http.Error(w, "unexpected method "+req.Method, 500)
			return
		}

		_ = json.NewEncoder(w).Encode(map[string]any{
			"jsonrpc": "2.0",
			"id":      1,
			"result":  result,
		})
	}))
	t.Cleanup(srv.Close)

	client := NewRPCClientWithTimeout(srv.URL, 5*time.Second)
	t.Cleanup(client.Close)

	ctx := context.Background()

	bal, err := client.GetBalance(ctx, systemProgramPubkey)
	if err != nil {
		t.Fatalf("GetBalance: %v", err)
	}
	if bal.Lamports != 1_500_000_000 {
		t.Fatalf("lamports = %d, want 1500000000", bal.Lamports)
	}
	if bal.SOL != 1.5 {
		t.Fatalf("sol = %v, want 1.5", bal.SOL)
	}

	slot, err := client.GetSlot(ctx)
	if err != nil {
		t.Fatalf("GetSlot: %v", err)
	}
	if slot != 987654 {
		t.Fatalf("slot = %d, want 987654", slot)
	}

	hash, err := client.GetLatestBlockhash(ctx)
	if err != nil {
		t.Fatalf("GetLatestBlockhash: %v", err)
	}
	if hash == "" {
		t.Fatal("expected non-empty blockhash")
	}

	joined := strings.Join(methods, ",")
	for _, want := range []string{"getBalance", "getSlot", "getLatestBlockhash"} {
		if !strings.Contains(joined, want) {
			t.Fatalf("methods %q missing %s", joined, want)
		}
	}
}

func TestRPCClientInvalidPubkey(t *testing.T) {
	client := NewRPCClient("http://127.0.0.1:1")
	t.Cleanup(client.Close)

	_, err := client.GetBalance(context.Background(), "not-a-pubkey")
	if err == nil {
		t.Fatal("expected invalid pubkey error")
	}
	if !strings.Contains(err.Error(), "invalid pubkey") {
		t.Fatalf("error = %v, want invalid pubkey", err)
	}
}

func TestHeliusClientWiresSDKForBalanceAndSlot(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		var req struct {
			Method string `json:"method"`
		}
		_ = json.Unmarshal(body, &req)

		var result any
		switch req.Method {
		case "getBalance":
			result = map[string]any{
				"context": map[string]any{"slot": 1},
				"value":   uint64(2_000_000_000),
			}
		case "getSlot":
			result = uint64(12345)
		default:
			http.Error(w, "unexpected "+req.Method, 500)
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"jsonrpc": "2.0",
			"id":      1,
			"result":  result,
		})
	}))
	t.Cleanup(srv.Close)

	h := NewHeliusClientWithOptions(
		"",
		srv.URL,
		"",
		"mainnet",
		3*time.Second,
		1,
		10*time.Millisecond,
	)
	if h.SDK() == nil {
		t.Fatal("expected non-nil SDK")
	}
	if h.SDK().Endpoint != srv.URL {
		t.Fatalf("sdk endpoint = %q, want %q", h.SDK().Endpoint, srv.URL)
	}

	bal, err := h.GetBalance(systemProgramPubkey)
	if err != nil {
		t.Fatalf("GetBalance: %v", err)
	}
	if bal.Lamports != 2_000_000_000 || bal.SOL != 2.0 {
		t.Fatalf("balance = %+v", bal)
	}

	slot, err := h.GetSlot()
	if err != nil {
		t.Fatalf("GetSlot: %v", err)
	}
	if slot != 12345 {
		t.Fatalf("slot = %d, want 12345", slot)
	}
}
