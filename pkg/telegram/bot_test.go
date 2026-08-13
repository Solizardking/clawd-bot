package telegram_test

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/8bitlabs/clawdbot/pkg/telegram"
)

func TestSendAndGetMe(t *testing.T) {
	t.Parallel()
	mux := http.NewServeMux()
	mux.HandleFunc("/botTOKEN/getMe", func(w http.ResponseWriter, r *http.Request) {
		_, _ = io.WriteString(w, `{"ok":true,"result":{"id":1,"is_bot":true,"first_name":"Clawd","username":"clawdbot"}}`)
	})
	mux.HandleFunc("/botTOKEN/sendMessage", func(w http.ResponseWriter, r *http.Request) {
		var body map[string]any
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			t.Errorf("decode: %v", err)
		}
		if body["chat_id"] != "99" {
			t.Errorf("chat=%v", body["chat_id"])
		}
		_, _ = io.WriteString(w, `{"ok":true,"result":{"message_id":1}}`)
	})
	mux.HandleFunc("/botTOKEN/setMyCommands", func(w http.ResponseWriter, r *http.Request) {
		_, _ = io.WriteString(w, `{"ok":true,"result":true}`)
	})
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)

	bot, err := telegram.New("TOKEN",
		telegram.WithAPIRoot(srv.URL),
		telegram.WithHTTPClient(srv.Client()),
	)
	if err != nil {
		t.Fatal(err)
	}
	me, err := bot.GetMe(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if me.Username != "clawdbot" {
		t.Fatalf("username=%s", me.Username)
	}
	if err := bot.SendText(context.Background(), "99", "hello"); err != nil {
		t.Fatal(err)
	}
}

func TestAllowFrom(t *testing.T) {
	t.Parallel()
	var got string
	mux := http.NewServeMux()
	mux.HandleFunc("/botTOKEN/getMe", func(w http.ResponseWriter, r *http.Request) {
		_, _ = io.WriteString(w, `{"ok":true,"result":{"id":1,"is_bot":true,"first_name":"C"}}`)
	})
	mux.HandleFunc("/botTOKEN/setMyCommands", func(w http.ResponseWriter, r *http.Request) {
		_, _ = io.WriteString(w, `{"ok":true,"result":true}`)
	})
	mux.HandleFunc("/botTOKEN/getUpdates", func(w http.ResponseWriter, r *http.Request) {
		_, _ = io.WriteString(w, `{"ok":true,"result":[{"update_id":1,"message":{"message_id":1,"text":"/start","from":{"id":7,"username":"alice"},"chat":{"id":7,"type":"private"}}}]}`)
	})
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)

	bot, err := telegram.New("TOKEN",
		telegram.WithAPIRoot(srv.URL),
		telegram.WithHTTPClient(srv.Client()),
		telegram.WithAllowFrom("99"),
		telegram.WithHandler(func(ctx context.Context, upd telegram.Update) error {
			got = upd.Message.Text
			return nil
		}),
	)
	if err != nil {
		t.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	if err := bot.Start(ctx); err != nil {
		t.Fatal(err)
	}
	time.Sleep(150 * time.Millisecond)
	if got != "" {
		t.Fatalf("blocked sender leaked: %s", got)
	}
	_ = bot.Stop(ctx)
}

func TestNewRejectsEmpty(t *testing.T) {
	t.Parallel()
	if _, err := telegram.New("  "); err == nil {
		t.Fatal("expected error")
	}
}

func TestTokenNotInErrorPath(t *testing.T) {
	t.Parallel()
	bot, err := telegram.New("super-secret-token", telegram.WithAPIRoot("http://127.0.0.1:1"))
	if err != nil {
		t.Fatal(err)
	}
	err = bot.SendText(context.Background(), "1", "hi")
	if err == nil {
		t.Fatal("expected network error")
	}
	if strings.Contains(err.Error(), "super-secret-token") {
		t.Fatalf("token leaked in error: %v", err)
	}
}
