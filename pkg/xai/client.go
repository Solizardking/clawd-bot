package xai

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

// ErrNotConfigured is returned when NewFromEnv cannot find XAI_API_KEY.
var ErrNotConfigured = errors.New("xai: XAI_API_KEY is not set")

// ErrNotReady is returned by Deferred when the completion is still 202 Accepted.
var ErrNotReady = errors.New("xai: deferred completion not ready")

// Client talks to api.x.ai. Do not store a context on the client; pass ctx
// into every method so cancellation and deadlines propagate from the caller.
type Client struct {
	apiKey        string
	baseURL       string
	model         string
	http          HTTPDoer
	timeout       time.Duration
	serviceTier   ServiceTier
	maxConcurrent int
	userAgent     string
}

// New constructs a Client. apiKey may also be supplied via WithAPIKey.
func New(apiKey string, opts ...Option) (*Client, error) {
	c := &Client{
		apiKey:        strings.TrimSpace(apiKey),
		baseURL:       DefaultBaseURL,
		model:         DefaultModel,
		timeout:       DefaultTimeout,
		maxConcurrent: DefaultMaxConcurrent,
		userAgent:     "clawdbot-xai/1.0",
	}
	for _, opt := range opts {
		if opt == nil {
			continue
		}
		if err := opt(c); err != nil {
			return nil, err
		}
	}
	if c.apiKey == "" {
		return nil, ErrNotConfigured
	}
	if c.http == nil {
		c.http = &http.Client{Timeout: c.timeout}
	}
	return c, nil
}

// NewFromEnv builds a Client from XAI_API_KEY / XAI_BASE_URL / XAI_MODEL /
// XAI_SERVICE_TIER. Extra options override env.
func NewFromEnv(opts ...Option) (*Client, error) {
	key := strings.TrimSpace(os.Getenv("XAI_API_KEY"))
	if key == "" {
		return nil, ErrNotConfigured
	}
	envOpts := []Option{WithAPIKey(key)}
	if v := strings.TrimSpace(os.Getenv("XAI_BASE_URL")); v != "" {
		envOpts = append(envOpts, WithBaseURL(v))
	}
	if v := strings.TrimSpace(os.Getenv("XAI_MODEL")); v != "" {
		envOpts = append(envOpts, WithModel(v))
	} else if v := strings.TrimSpace(os.Getenv("GROK_MODEL")); v != "" {
		envOpts = append(envOpts, WithModel(v))
	}
	if v := strings.TrimSpace(os.Getenv("XAI_SERVICE_TIER")); v != "" {
		envOpts = append(envOpts, WithServiceTier(ServiceTier(v)))
	}
	return New(key, append(envOpts, opts...)...)
}

// Configured reports whether XAI_API_KEY is present in the environment.
func Configured() bool {
	return strings.TrimSpace(os.Getenv("XAI_API_KEY")) != ""
}

// Model returns the default model id.
func (c *Client) Model() string { return c.model }

// BaseURL returns the API root.
func (c *Client) BaseURL() string { return c.baseURL }

// ServiceTier returns the default scheduling tier (empty means omit / default).
func (c *Client) ServiceTier() ServiceTier { return c.serviceTier }

// Health is a JSON-safe snapshot for /health endpoints. It never includes the key.
func (c *Client) Health() map[string]any {
	if c == nil {
		return map[string]any{"configured": false}
	}
	tier := c.serviceTier
	if tier == "" {
		tier = ServiceTierDefault
	}
	return map[string]any{
		"configured":    true,
		"model":         c.model,
		"baseURL":       c.baseURL,
		"serviceTier":   tier,
		"maxConcurrent": c.maxConcurrent,
		"timeoutMs":     c.timeout.Milliseconds(),
	}
}

func (c *Client) resolveModel(model string) string {
	if strings.TrimSpace(model) != "" {
		return model
	}
	return c.model
}

func (c *Client) resolveTier(tier ServiceTier) ServiceTier {
	if tier != "" {
		return tier
	}
	return c.serviceTier
}

func (c *Client) doJSON(ctx context.Context, method, path string, body any) ([]byte, int, error) {
	if ctx == nil {
		return nil, 0, fmt.Errorf("xai: nil context")
	}
	var rdr io.Reader
	if body != nil {
		raw, err := json.Marshal(body)
		if err != nil {
			return nil, 0, fmt.Errorf("marshal request: %w", err)
		}
		rdr = bytes.NewReader(raw)
	}
	req, err := http.NewRequestWithContext(ctx, method, c.baseURL+path, rdr)
	if err != nil {
		return nil, 0, fmt.Errorf("build request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", c.userAgent)

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, 0, fmt.Errorf("xai request: %w", err)
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, resp.StatusCode, fmt.Errorf("read response: %w", err)
	}
	return data, resp.StatusCode, nil
}
