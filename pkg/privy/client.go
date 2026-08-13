// Package privy is a REST client for Privy server wallets (bot-first Telegram).
//
// Create a user linked to a Telegram ID, attach a Solana embedded wallet with
// the bot as an additional signer, then signAndSendTransaction under a Solana
// policy. Authorization private keys are never logged.
package privy

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

const (
	DefaultBaseURL = "https://api.privy.io/v1"
	DefaultTimeout = 30 * time.Second
	SolanaMainnet  = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
)

var ErrNotConfigured = errors.New("privy: PRIVY_APP_ID and PRIVY_APP_SECRET are required")

type HTTPDoer interface {
	Do(*http.Request) (*http.Response, error)
}

type Option func(*Client) error

type Client struct {
	appID     string
	appSecret string
	baseURL   string
	http      HTTPDoer
	timeout   time.Duration
	signerID  string
	policyIDs []string
	userAgent string
}

func New(appID, appSecret string, opts ...Option) (*Client, error) {
	c := &Client{
		appID:     strings.TrimSpace(appID),
		appSecret: strings.TrimSpace(appSecret),
		baseURL:   DefaultBaseURL,
		timeout:   DefaultTimeout,
		userAgent: "clawdbot-privy/1.0",
	}
	for _, opt := range opts {
		if opt == nil {
			continue
		}
		if err := opt(c); err != nil {
			return nil, err
		}
	}
	if c.appID == "" || c.appSecret == "" {
		return nil, ErrNotConfigured
	}
	if c.http == nil {
		c.http = &http.Client{Timeout: c.timeout}
	}
	return c, nil
}

func NewFromEnv(opts ...Option) (*Client, error) {
	id := strings.TrimSpace(os.Getenv("PRIVY_APP_ID"))
	secret := strings.TrimSpace(os.Getenv("PRIVY_APP_SECRET"))
	envOpts := []Option{
		WithBaseURL(envOr("PRIVY_BASE_URL", DefaultBaseURL)),
		WithSignerID(os.Getenv("PRIVY_SIGNER_ID")),
	}
	if v := strings.TrimSpace(os.Getenv("PRIVY_POLICY_ID")); v != "" {
		envOpts = append(envOpts, WithPolicyIDs(v))
	}
	return New(id, secret, append(envOpts, opts...)...)
}

func WithBaseURL(u string) Option {
	return func(c *Client) error {
		u = strings.TrimRight(strings.TrimSpace(u), "/")
		if u == "" {
			return fmt.Errorf("privy: base url is empty")
		}
		c.baseURL = u
		return nil
	}
}

func WithHTTPClient(h HTTPDoer) Option {
	return func(c *Client) error {
		if h == nil {
			return fmt.Errorf("privy: http client is nil")
		}
		c.http = h
		return nil
	}
}

func WithTimeout(d time.Duration) Option {
	return func(c *Client) error {
		if d <= 0 {
			return fmt.Errorf("privy: timeout must be positive")
		}
		c.timeout = d
		return nil
	}
}

func WithSignerID(id string) Option {
	return func(c *Client) error {
		c.signerID = strings.TrimSpace(id)
		return nil
	}
}

func WithPolicyIDs(ids ...string) Option {
	return func(c *Client) error {
		c.policyIDs = nil
		for _, id := range ids {
			for _, part := range strings.Split(id, ",") {
				part = strings.TrimSpace(part)
				if part != "" {
					c.policyIDs = append(c.policyIDs, part)
				}
			}
		}
		return nil
	}
}

func (c *Client) SignerID() string { return c.signerID }

func (c *Client) Health() map[string]any {
	return map[string]any{
		"configured": c.appID != "" && c.appSecret != "",
		"base_url":   c.baseURL,
		"signer":     c.signerID != "",
		"policies":   len(c.policyIDs),
	}
}

type User struct {
	ID             string          `json:"id"`
	LinkedAccounts []LinkedAccount `json:"linked_accounts"`
}

type LinkedAccount struct {
	Type           string `json:"type"`
	ID             string `json:"id,omitempty"`
	Address        string `json:"address,omitempty"`
	ChainType      string `json:"chain_type,omitempty"`
	TelegramUserID any    `json:"telegram_user_id,omitempty"`
	WalletID       string `json:"wallet_id,omitempty"`
}

type Wallet struct {
	ID        string `json:"id"`
	Address   string `json:"address"`
	ChainType string `json:"chain_type"`
}

type RPCResponse struct {
	Hash   string `json:"hash"`
	Method string `json:"method"`
	Data   struct {
		Hash        string `json:"hash"`
		Transaction string `json:"transaction"`
	} `json:"data"`
}

func (c *Client) CreateTelegramUser(ctx context.Context, telegramUserID int64) (*User, error) {
	body := map[string]any{
		"linked_accounts": []map[string]any{
			{"type": "telegram", "telegram_user_id": fmt.Sprintf("%d", telegramUserID)},
		},
	}
	var user User
	if err := c.doJSON(ctx, http.MethodPost, "/users", body, &user); err != nil {
		return nil, fmt.Errorf("privy: create user: %w", err)
	}
	return &user, nil
}

func (c *Client) GetByTelegramUserID(ctx context.Context, telegramUserID int64) (*User, error) {
	path := fmt.Sprintf("/users/telegram/telegram_user_id/%d", telegramUserID)
	var user User
	if err := c.doJSON(ctx, http.MethodGet, path, nil, &user); err != nil {
		return nil, fmt.Errorf("privy: get by telegram: %w", err)
	}
	return &user, nil
}

func (c *Client) CreateSolanaWallet(ctx context.Context, userID string) (*Wallet, error) {
	if strings.TrimSpace(userID) == "" {
		return nil, fmt.Errorf("privy: user id is empty")
	}
	body := map[string]any{
		"chain_type": "solana",
		"owner":      map[string]any{"user_id": userID},
	}
	if c.signerID != "" {
		signer := map[string]any{"signer_id": c.signerID}
		if len(c.policyIDs) > 0 {
			signer["override_policy_ids"] = c.policyIDs
		} else {
			signer["override_policy_ids"] = []string{}
		}
		body["additional_signers"] = []any{signer}
	}
	var w Wallet
	if err := c.doJSON(ctx, http.MethodPost, "/wallets", body, &w); err != nil {
		return nil, fmt.Errorf("privy: create wallet: %w", err)
	}
	return &w, nil
}

func (c *Client) SignAndSendSolana(ctx context.Context, walletID, txBase64 string) (string, error) {
	if strings.TrimSpace(walletID) == "" {
		return "", fmt.Errorf("privy: wallet id is empty")
	}
	if strings.TrimSpace(txBase64) == "" {
		return "", fmt.Errorf("privy: transaction is empty")
	}
	body := map[string]any{
		"method": "signAndSendTransaction",
		"caip2":  SolanaMainnet,
		"params": map[string]any{
			"transaction": txBase64,
			"encoding":    "base64",
		},
	}
	var rpc RPCResponse
	path := "/wallets/" + walletID + "/rpc"
	if err := c.doJSON(ctx, http.MethodPost, path, body, &rpc); err != nil {
		return "", fmt.Errorf("privy: sign and send: %w", err)
	}
	if rpc.Data.Hash != "" {
		return rpc.Data.Hash, nil
	}
	if rpc.Hash != "" {
		return rpc.Hash, nil
	}
	return "", fmt.Errorf("privy: empty transaction hash")
}

func SolanaWalletID(user *User) string {
	if user == nil {
		return ""
	}
	for _, a := range user.LinkedAccounts {
		if a.Type == "wallet" && (a.ChainType == "solana" || a.ChainType == "") {
			if a.ID != "" {
				return a.ID
			}
			if a.WalletID != "" {
				return a.WalletID
			}
		}
	}
	return ""
}

func (c *Client) doJSON(ctx context.Context, method, path string, body any, dest any) error {
	if ctx == nil {
		return fmt.Errorf("privy: nil context")
	}
	var rdr io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("marshal: %w", err)
		}
		rdr = bytes.NewReader(b)
	}
	req, err := http.NewRequestWithContext(ctx, method, c.baseURL+path, rdr)
	if err != nil {
		return fmt.Errorf("request: %w", err)
	}
	req.Header.Set("Authorization", "Basic "+basicAuth(c.appID, c.appSecret))
	req.Header.Set("privy-app-id", c.appID)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", c.userAgent)
	resp, err := c.http.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	raw, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return fmt.Errorf("read: %w", err)
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("http %d: %s", resp.StatusCode, truncate(raw, 300))
	}
	if dest == nil || len(bytes.TrimSpace(raw)) == 0 {
		return nil
	}
	if err := json.Unmarshal(raw, dest); err != nil {
		return fmt.Errorf("decode: %w", err)
	}
	return nil
}

func basicAuth(user, pass string) string {
	return base64.StdEncoding.EncodeToString([]byte(user + ":" + pass))
}

func envOr(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}

func truncate(b []byte, n int) string {
	s := strings.TrimSpace(string(b))
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}
