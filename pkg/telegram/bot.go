// Package telegram implements the Telegram Bot API long-poll channel.
package telegram

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/8bitlabs/clawdbot/pkg/bus"
	"github.com/8bitlabs/clawdbot/pkg/channels"
)

const (
	DefaultAPIRoot = "https://api.telegram.org"
	Name           = "telegram"
	maxMessageLen  = 4096
	pollTimeoutSec = 30
)

var ErrNotConfigured = errors.New("telegram: TELEGRAM_BOT_TOKEN is not set")

type HTTPDoer interface {
	Do(*http.Request) (*http.Response, error)
}

type UpdateHandler func(ctx context.Context, upd Update) error

type Bot struct {
	token     string
	apiRoot   string
	http      HTTPDoer
	allowFrom []string
	handler   UpdateHandler
	bus       *bus.MessageBus
	base      *channels.BaseChannel

	running atomic.Bool
	offset  int64
	mu      sync.Mutex
}

func New(token string, opts ...Option) (*Bot, error) {
	token = strings.TrimSpace(token)
	if token == "" {
		return nil, ErrNotConfigured
	}
	b := &Bot{
		token:   token,
		apiRoot: DefaultAPIRoot,
		http:    &http.Client{Timeout: (pollTimeoutSec + 15) * time.Second},
	}
	for _, opt := range opts {
		if opt == nil {
			continue
		}
		if err := opt(b); err != nil {
			return nil, err
		}
	}
	b.base = channels.NewBaseChannel(Name, b.bus, b.allowFrom)
	return b, nil
}

type Option func(*Bot) error

func WithAPIRoot(u string) Option {
	return func(b *Bot) error {
		u = strings.TrimRight(strings.TrimSpace(u), "/")
		if u == "" {
			return fmt.Errorf("telegram: api root is empty")
		}
		b.apiRoot = u
		return nil
	}
}

func WithHTTPClient(h HTTPDoer) Option {
	return func(b *Bot) error {
		if h == nil {
			return fmt.Errorf("telegram: http client is nil")
		}
		b.http = h
		return nil
	}
}

func WithAllowFrom(ids ...string) Option {
	return func(b *Bot) error {
		b.allowFrom = append([]string{}, ids...)
		return nil
	}
}

func WithBus(mb *bus.MessageBus) Option {
	return func(b *Bot) error {
		b.bus = mb
		return nil
	}
}

func WithHandler(h UpdateHandler) Option {
	return func(b *Bot) error {
		b.handler = h
		return nil
	}
}

func (b *Bot) Name() string    { return Name }
func (b *Bot) IsRunning() bool { return b.running.Load() }
func (b *Bot) IsAllowed(senderID string) bool {
	return b.base.IsAllowed(senderID)
}

type User struct {
	ID        int64  `json:"id"`
	IsBot     bool   `json:"is_bot"`
	FirstName string `json:"first_name"`
	Username  string `json:"username"`
}

type Chat struct {
	ID   int64  `json:"id"`
	Type string `json:"type"`
}

type Message struct {
	MessageID int    `json:"message_id"`
	From      *User  `json:"from"`
	Chat      Chat   `json:"chat"`
	Text      string `json:"text"`
}

type Update struct {
	UpdateID int      `json:"update_id"`
	Message  *Message `json:"message"`
}

type apiResponse struct {
	OK          bool            `json:"ok"`
	Description string          `json:"description"`
	Result      json.RawMessage `json:"result"`
}

func (b *Bot) GetMe(ctx context.Context) (*User, error) {
	var u User
	if err := b.call(ctx, "getMe", nil, &u); err != nil {
		return nil, err
	}
	return &u, nil
}

func (b *Bot) Send(ctx context.Context, msg bus.OutboundMessage) error {
	return b.SendText(ctx, msg.ChatID, msg.Content)
}

func (b *Bot) SendText(ctx context.Context, chatID, text string) error {
	text = strings.TrimSpace(text)
	if text == "" {
		return nil
	}
	if len(text) > maxMessageLen {
		text = text[:maxMessageLen-1] + "…"
	}
	return b.call(ctx, "sendMessage", map[string]any{
		"chat_id": chatID,
		"text":    text,
	}, nil)
}

func (b *Bot) SetCommands(ctx context.Context) error {
	return b.call(ctx, "setMyCommands", map[string]any{
		"commands": []map[string]string{
			{"command": "start", "description": "Create or link your Privy Solana wallet"},
			{"command": "wallet", "description": "Show your Solana wallet"},
			{"command": "quote", "description": "Quote a DFlow swap: /quote 0.01 SOL USDC"},
			{"command": "swap", "description": "Execute a capped DFlow swap"},
			{"command": "policy", "description": "Show the Solana signer policy"},
			{"command": "help", "description": "Command list"},
		},
	}, nil)
}

func (b *Bot) Start(ctx context.Context) error {
	if ctx == nil {
		return fmt.Errorf("telegram: nil context")
	}
	if !b.running.CompareAndSwap(false, true) {
		return nil
	}
	if _, err := b.GetMe(ctx); err != nil {
		b.running.Store(false)
		return fmt.Errorf("telegram: getMe: %w", err)
	}
	_ = b.SetCommands(ctx)
	go b.poll(ctx)
	return nil
}

func (b *Bot) Stop(ctx context.Context) error {
	b.running.Store(false)
	return nil
}

func (b *Bot) poll(ctx context.Context) {
	defer b.running.Store(false)
	for {
		if !b.running.Load() {
			return
		}
		select {
		case <-ctx.Done():
			return
		default:
		}
		updates, err := b.getUpdates(ctx)
		if err != nil {
			if ctx.Err() != nil {
				return
			}
			timer := time.NewTimer(2 * time.Second)
			select {
			case <-ctx.Done():
				timer.Stop()
				return
			case <-timer.C:
			}
			continue
		}
		for _, upd := range updates {
			b.mu.Lock()
			if int64(upd.UpdateID) >= b.offset {
				b.offset = int64(upd.UpdateID) + 1
			}
			b.mu.Unlock()
			b.dispatch(ctx, upd)
		}
	}
}

func (b *Bot) dispatch(ctx context.Context, upd Update) {
	if upd.Message == nil || upd.Message.From == nil {
		return
	}
	senderID := strconv.FormatInt(upd.Message.From.ID, 10)
	if !b.IsAllowed(senderID) && !b.IsAllowed(upd.Message.From.Username) {
		return
	}
	if b.handler != nil {
		_ = b.handler(ctx, upd)
		return
	}
	if b.bus != nil {
		b.base.HandleMessage(ctx, senderID, strconv.FormatInt(upd.Message.Chat.ID, 10), upd.Message.Text, nil)
	}
}

func (b *Bot) getUpdates(ctx context.Context) ([]Update, error) {
	b.mu.Lock()
	offset := b.offset
	b.mu.Unlock()
	var updates []Update
	err := b.call(ctx, "getUpdates", map[string]any{
		"offset":          offset,
		"timeout":         pollTimeoutSec,
		"allowed_updates": []string{"message"},
	}, &updates)
	return updates, err
}

func (b *Bot) call(ctx context.Context, method string, payload any, dest any) error {
	var rdr io.Reader
	if payload != nil {
		raw, err := json.Marshal(payload)
		if err != nil {
			return fmt.Errorf("telegram: marshal: %w", err)
		}
		rdr = bytes.NewReader(raw)
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, b.apiRoot+"/bot"+b.token+"/"+method, rdr)
	if err != nil {
		return fmt.Errorf("telegram: request: %w", err)
	}
	if payload != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	resp, err := b.http.Do(req)
	if err != nil {
		return fmt.Errorf("telegram: %s: %s", method, redactSecret(err.Error(), b.token))
	}
	defer resp.Body.Close()
	raw, err := io.ReadAll(io.LimitReader(resp.Body, 2<<20))
	if err != nil {
		return fmt.Errorf("telegram: read: %w", err)
	}
	var wrap apiResponse
	if err := json.Unmarshal(raw, &wrap); err != nil {
		return fmt.Errorf("telegram: decode: %w", err)
	}
	if !wrap.OK {
		desc := wrap.Description
		if desc == "" {
			desc = fmt.Sprintf("http %d", resp.StatusCode)
		}
		return fmt.Errorf("telegram: %s", desc)
	}
	if dest == nil || len(bytes.TrimSpace(wrap.Result)) == 0 {
		return nil
	}
	if err := json.Unmarshal(wrap.Result, dest); err != nil {
		return fmt.Errorf("telegram: result: %w", err)
	}
	return nil
}

func redactSecret(s, secret string) string {
	if secret == "" || !strings.Contains(s, secret) {
		return s
	}
	return strings.ReplaceAll(s, secret, "***")
}
