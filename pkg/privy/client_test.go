package privy_test

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/8bitlabs/clawdbot/pkg/privy"
)

func TestCreateTelegramUserAndWallet(t *testing.T) {
	t.Parallel()

	mux := http.NewServeMux()
	mux.HandleFunc("POST /users", func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("privy-app-id") != "app_test" {
			t.Errorf("missing app id")
		}
		if !strings.HasPrefix(r.Header.Get("Authorization"), "Basic ") {
			t.Errorf("missing basic auth")
		}
		var body map[string]any
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			t.Errorf("decode: %v", err)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{"id":"did:privy:user1","linked_accounts":[{"type":"telegram","telegram_user_id":"42"}]}`)
	})
	mux.HandleFunc("POST /wallets", func(w http.ResponseWriter, r *http.Request) {
		var body map[string]any
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			t.Errorf("decode: %v", err)
		}
		if body["chain_type"] != "solana" {
			t.Errorf("chain_type=%v", body["chain_type"])
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{"id":"wal_1","address":"So11111111111111111111111111111111111111112","chain_type":"solana"}`)
	})
	mux.HandleFunc("POST /wallets/wal_1/rpc", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{"method":"signAndSendTransaction","data":{"hash":"5sig"}}`)
	})
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)

	c, err := privy.New("app_test", "secret",
		privy.WithBaseURL(srv.URL),
		privy.WithHTTPClient(srv.Client()),
		privy.WithSignerID("signer_1"),
		privy.WithPolicyIDs("pol_1"),
	)
	if err != nil {
		t.Fatal(err)
	}
	ctx := context.Background()
	user, err := c.CreateTelegramUser(ctx, 42)
	if err != nil {
		t.Fatalf("create user: %v", err)
	}
	if user.ID != "did:privy:user1" {
		t.Fatalf("user id=%s", user.ID)
	}
	w, err := c.CreateSolanaWallet(ctx, user.ID)
	if err != nil {
		t.Fatalf("create wallet: %v", err)
	}
	if w.ID != "wal_1" {
		t.Fatalf("wallet id=%s", w.ID)
	}
	sig, err := c.SignAndSendSolana(ctx, w.ID, "dHh4")
	if err != nil {
		t.Fatalf("send: %v", err)
	}
	if sig != "5sig" {
		t.Fatalf("sig=%s", sig)
	}
	h := c.Health()
	if h["configured"] != true {
		t.Fatalf("health=%v", h)
	}
}

func TestNewRejectsEmpty(t *testing.T) {
	t.Parallel()
	if _, err := privy.New("", "s"); err == nil {
		t.Fatal("expected error")
	}
}

func TestSolanaWalletID(t *testing.T) {
	t.Parallel()
	user := &privy.User{LinkedAccounts: []privy.LinkedAccount{
		{Type: "telegram"},
		{Type: "wallet", ChainType: "solana", ID: "wal_sol"},
	}}
	if got := privy.SolanaWalletID(user); got != "wal_sol" {
		t.Fatalf("got %s", got)
	}
}
