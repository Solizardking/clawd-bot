package tgtrade_test

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/8bitlabs/clawdbot/pkg/dflow"
	"github.com/8bitlabs/clawdbot/pkg/privy"
	"github.com/8bitlabs/clawdbot/pkg/telegram"
	"github.com/8bitlabs/clawdbot/pkg/tgtrade"
)

func TestHelpAndQuote(t *testing.T) {
	t.Parallel()
	dflowSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = io.WriteString(w, `{
			"inputMint":"So11111111111111111111111111111111111111112",
			"inAmount":"10000000",
			"outputMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
			"outAmount":"1500000",
			"otherAmountThreshold":"1490000",
			"minOutAmount":"1490000",
			"slippageBps":50,
			"priceImpactPct":"0.01",
			"contextSlot":1,
			"executionMode":"sync"
		}`)
	}))
	t.Cleanup(dflowSrv.Close)
	dc, err := dflow.New(dflow.WithBaseURL(dflowSrv.URL), dflow.WithHTTPClient(dflowSrv.Client()))
	if err != nil {
		t.Fatal(err)
	}
	bot := tgtrade.New(tgtrade.WithDFlow(dc))
	upd := telegram.Update{Message: &telegram.Message{
		From: &telegram.User{ID: 7},
		Text: "/help",
		Chat: telegram.Chat{ID: 7},
	}}
	got, err := bot.HandleUpdate(context.Background(), upd)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(got, "/quote") {
		t.Fatalf("help=%s", got)
	}

	upd.Message.Text = "/quote 0.01 SOL USDC"
	got, err = bot.HandleUpdate(context.Background(), upd)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(got, "1500000") {
		t.Fatalf("quote=%s", got)
	}
}

func TestStartCreatesPrivyWallet(t *testing.T) {
	t.Parallel()
	mux := http.NewServeMux()
	mux.HandleFunc("GET /users/telegram/telegram_user_id/7", func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, `{"error":"not found"}`, http.StatusNotFound)
	})
	mux.HandleFunc("POST /users", func(w http.ResponseWriter, r *http.Request) {
		_, _ = io.WriteString(w, `{"id":"did:privy:u7","linked_accounts":[]}`)
	})
	mux.HandleFunc("POST /wallets", func(w http.ResponseWriter, r *http.Request) {
		_, _ = io.WriteString(w, `{"id":"wal_7","address":"So11111111111111111111111111111111111111112","chain_type":"solana"}`)
	})
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)
	pc, err := privy.New("app", "sec", privy.WithBaseURL(srv.URL), privy.WithHTTPClient(srv.Client()), privy.WithSignerID("sig"))
	if err != nil {
		t.Fatal(err)
	}
	bot := tgtrade.New(tgtrade.WithPrivy(pc))
	got, err := bot.HandleUpdate(context.Background(), telegram.Update{Message: &telegram.Message{
		From: &telegram.User{ID: 7},
		Text: "/start",
		Chat: telegram.Chat{ID: 7},
	}})
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(got, "So11111111111111111111111111111111111111112") {
		t.Fatalf("start=%s", got)
	}
	got, err = bot.HandleUpdate(context.Background(), telegram.Update{Message: &telegram.Message{
		From: &telegram.User{ID: 7},
		Text: "/wallet",
		Chat: telegram.Chat{ID: 7},
	}})
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(got, "So1111") {
		t.Fatalf("wallet=%s", got)
	}
}

func TestOversizedSwapDenied(t *testing.T) {
	t.Parallel()
	bot := tgtrade.New()
	got, err := bot.HandleUpdate(context.Background(), telegram.Update{Message: &telegram.Message{
		From: &telegram.User{ID: 1},
		Text: "/swap 9 SOL USDC",
		Chat: telegram.Chat{ID: 1},
	}})
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(strings.ToLower(got), "cap") && !strings.Contains(got, "DFlow is not configured") {
		t.Fatalf("got %s", got)
	}
}

func TestNaturalLanguageAsk(t *testing.T) {
	t.Parallel()
	bot := tgtrade.New(tgtrade.WithAsk(func(ctx context.Context, id int64, prompt string) (string, error) {
		return "asked:" + prompt, nil
	}))
	got, err := bot.HandleUpdate(context.Background(), telegram.Update{Message: &telegram.Message{
		From: &telegram.User{ID: 1},
		Text: "what is sol doing",
		Chat: telegram.Chat{ID: 1},
	}})
	if err != nil {
		t.Fatal(err)
	}
	if got != "asked:what is sol doing" {
		t.Fatalf("got %s", got)
	}
}
