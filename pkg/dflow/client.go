// Package dflow is a client for the DFlow aggregator GET /order API.
// Prefer /order (quote + optional transaction) over the legacy /quote + /swap
// pair. Production: https://quote-api.dflow.net — send x-api-key when set.
package dflow

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

const (
	DefaultBaseURL = "https://dev-quote-api.dflow.net"
	ProdBaseURL    = "https://quote-api.dflow.net"
	DefaultTimeout = 20 * time.Second
	SOLMint        = "So11111111111111111111111111111111111111112"
	USDCMint       = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
	SOLDecimals    = 9
	USDCDecimals   = 6
)

var ErrNotConfigured = errors.New("dflow: client is not configured")

type HTTPDoer interface {
	Do(*http.Request) (*http.Response, error)
}

type Option func(*Client) error

type Client struct {
	baseURL        string
	apiKey         string
	http           HTTPDoer
	timeout        time.Duration
	settlementMint string
	priorityFee    string
	userAgent      string
}

func New(opts ...Option) (*Client, error) {
	c := &Client{
		baseURL:        DefaultBaseURL,
		timeout:        DefaultTimeout,
		settlementMint: USDCMint,
		priorityFee:    "auto",
		userAgent:      "clawdbot-dflow/1.0",
	}
	for _, opt := range opts {
		if opt == nil {
			continue
		}
		if err := opt(c); err != nil {
			return nil, err
		}
	}
	if c.http == nil {
		c.http = &http.Client{Timeout: c.timeout}
	}
	return c, nil
}

func NewFromEnv(opts ...Option) (*Client, error) {
	envOpts := []Option{
		WithBaseURL(envOr("DFLOW_TRADE_API_URL", DefaultBaseURL)),
		WithAPIKey(os.Getenv("DFLOW_API_KEY")),
		WithSettlementMint(envOr("DFLOW_SETTLEMENT_MINT", USDCMint)),
		WithPriorityFee(envOr("DFLOW_PRIORITY_FEE", "auto")),
	}
	return New(append(envOpts, opts...)...)
}

func WithBaseURL(u string) Option {
	return func(c *Client) error {
		u = strings.TrimRight(strings.TrimSpace(u), "/")
		if u == "" {
			return fmt.Errorf("dflow: base url is empty")
		}
		c.baseURL = u
		return nil
	}
}

func WithAPIKey(key string) Option {
	return func(c *Client) error {
		c.apiKey = strings.TrimSpace(key)
		return nil
	}
}

func WithHTTPClient(h HTTPDoer) Option {
	return func(c *Client) error {
		if h == nil {
			return fmt.Errorf("dflow: http client is nil")
		}
		c.http = h
		return nil
	}
}

func WithSettlementMint(mint string) Option {
	return func(c *Client) error {
		mint = strings.TrimSpace(mint)
		if mint == "" {
			return fmt.Errorf("dflow: settlement mint is empty")
		}
		c.settlementMint = mint
		return nil
	}
}

func WithPriorityFee(fee string) Option {
	return func(c *Client) error {
		c.priorityFee = strings.TrimSpace(fee)
		return nil
	}
}

func (c *Client) SettlementMint() string { return c.settlementMint }

func (c *Client) Health() map[string]any {
	return map[string]any{
		"base_url":        c.baseURL,
		"api_key":         c.apiKey != "",
		"settlement_mint": c.settlementMint,
		"priority_fee":    c.priorityFee,
	}
}

type OrderRequest struct {
	InputMint     string
	OutputMint    string
	Amount        uint64
	SlippageBps   int
	UserPublicKey string
}

type OrderResponse struct {
	InputMint            string `json:"inputMint"`
	InAmount             string `json:"inAmount"`
	OutputMint           string `json:"outputMint"`
	OutAmount            string `json:"outAmount"`
	OtherAmountThreshold string `json:"otherAmountThreshold"`
	MinOutAmount         string `json:"minOutAmount"`
	SlippageBps          int    `json:"slippageBps"`
	PriceImpactPct       string `json:"priceImpactPct"`
	ContextSlot          int64  `json:"contextSlot"`
	ExecutionMode        string `json:"executionMode"`
	Transaction          string `json:"transaction"`
	LastValidBlockHeight int64  `json:"lastValidBlockHeight"`
	Msg                  string `json:"msg"`
	Code                 string `json:"code"`
}

func (c *Client) Order(ctx context.Context, req OrderRequest) (*OrderResponse, error) {
	if ctx == nil {
		return nil, fmt.Errorf("dflow: nil context")
	}
	if req.Amount == 0 {
		return nil, fmt.Errorf("dflow: amount is zero")
	}
	input := strings.TrimSpace(req.InputMint)
	if input == "" {
		input = SOLMint
	}
	output := strings.TrimSpace(req.OutputMint)
	if output == "" {
		output = c.settlementMint
	}
	q := url.Values{}
	q.Set("inputMint", input)
	q.Set("outputMint", output)
	q.Set("amount", strconv.FormatUint(req.Amount, 10))
	if req.SlippageBps > 0 {
		q.Set("slippageBps", strconv.Itoa(req.SlippageBps))
	}
	if pk := strings.TrimSpace(req.UserPublicKey); pk != "" {
		q.Set("userPublicKey", pk)
	}
	if c.priorityFee != "" {
		q.Set("prioritizationFeeLamports", c.priorityFee)
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, c.baseURL+"/order?"+q.Encode(), nil)
	if err != nil {
		return nil, fmt.Errorf("dflow: request: %w", err)
	}
	if c.apiKey != "" {
		httpReq.Header.Set("x-api-key", c.apiKey)
	}
	httpReq.Header.Set("User-Agent", c.userAgent)

	resp, err := c.http.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("dflow: order: %w", err)
	}
	defer resp.Body.Close()
	raw, err := io.ReadAll(io.LimitReader(resp.Body, 2<<20))
	if err != nil {
		return nil, fmt.Errorf("dflow: read: %w", err)
	}
	var out OrderResponse
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, fmt.Errorf("dflow: decode: %w", err)
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		msg := out.Msg
		if msg == "" {
			msg = strings.TrimSpace(string(raw))
		}
		return &out, fmt.Errorf("dflow: http %d: %s", resp.StatusCode, msg)
	}
	return &out, nil
}

type PriorityFees struct {
	MediumMicroLamports   int64 `json:"mediumMicroLamports"`
	HighMicroLamports     int64 `json:"highMicroLamports"`
	VeryHighMicroLamports int64 `json:"veryHighMicroLamports"`
}

func (c *Client) PriorityFees(ctx context.Context) (*PriorityFees, error) {
	if ctx == nil {
		return nil, fmt.Errorf("dflow: nil context")
	}
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, c.baseURL+"/priority-fees", nil)
	if err != nil {
		return nil, fmt.Errorf("dflow: request: %w", err)
	}
	if c.apiKey != "" {
		httpReq.Header.Set("x-api-key", c.apiKey)
	}
	resp, err := c.http.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("dflow: priority fees: %w", err)
	}
	defer resp.Body.Close()
	var fees PriorityFees
	if err := json.NewDecoder(resp.Body).Decode(&fees); err != nil {
		return nil, fmt.Errorf("dflow: decode: %w", err)
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("dflow: http %d", resp.StatusCode)
	}
	return &fees, nil
}

// HumanToRaw converts a decimal string like "0.01" into a scaled integer.
func HumanToRaw(human string, decimals int) (uint64, error) {
	human = strings.TrimSpace(human)
	if human == "" {
		return 0, fmt.Errorf("dflow: empty amount")
	}
	neg := strings.HasPrefix(human, "-")
	if neg {
		return 0, fmt.Errorf("dflow: amount must be positive")
	}
	parts := strings.SplitN(human, ".", 2)
	intPart := parts[0]
	if intPart == "" {
		intPart = "0"
	}
	frac := ""
	if len(parts) == 2 {
		frac = parts[1]
	}
	if decimals < 0 {
		return 0, fmt.Errorf("dflow: negative decimals")
	}
	if len(frac) > decimals {
		frac = frac[:decimals]
	}
	for len(frac) < decimals {
		frac += "0"
	}
	raw := intPart + frac
	raw = strings.TrimLeft(raw, "0")
	if raw == "" {
		return 0, fmt.Errorf("dflow: amount is zero")
	}
	n, err := strconv.ParseUint(raw, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("dflow: amount: %w", err)
	}
	return n, nil
}

func GuessDecimals(mint string) int {
	if mint == SOLMint || mint == "" {
		return SOLDecimals
	}
	return USDCDecimals
}

func envOr(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}
