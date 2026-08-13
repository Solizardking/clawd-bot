package xai

import (
	"fmt"
	"net/http"
	"strings"
	"time"
)

// DefaultBaseURL is the xAI OpenAI-compatible API root.
const DefaultBaseURL = "https://api.x.ai/v1"

// DefaultModel is grok-4.6, the current Responses-API reasoning model.
const DefaultModel = "grok-4.6"

// DefaultTimeout covers long reasoning + tool loops. Override per-call with
// context.WithTimeout; this is the HTTP client ceiling.
const DefaultTimeout = 3600 * time.Second

// DefaultMaxConcurrent is the Gather semaphore size. Stay under console rate limits.
const DefaultMaxConcurrent = 2

// HTTPDoer is the one-method HTTP surface the client needs. *http.Client
// implements it; tests inject an httptest-backed RoundTripper.
type HTTPDoer interface {
	Do(req *http.Request) (*http.Response, error)
}

// Option configures a Client. Options that fail validation return an error
// from New so bad config is caught at construction, not on the first request.
type Option func(*Client) error

// WithAPIKey sets the Bearer token. Empty is rejected.
func WithAPIKey(key string) Option {
	return func(c *Client) error {
		key = strings.TrimSpace(key)
		if key == "" {
			return fmt.Errorf("xai: api key is empty")
		}
		c.apiKey = key
		return nil
	}
}

// WithBaseURL overrides the API root. Trailing slashes are stripped.
func WithBaseURL(url string) Option {
	return func(c *Client) error {
		url = strings.TrimRight(strings.TrimSpace(url), "/")
		if url == "" {
			return fmt.Errorf("xai: base url is empty")
		}
		c.baseURL = url
		return nil
	}
}

// WithModel sets the default model id used when a request omits Model.
func WithModel(model string) Option {
	return func(c *Client) error {
		model = strings.TrimSpace(model)
		if model == "" {
			return fmt.Errorf("xai: model is empty")
		}
		c.model = model
		return nil
	}
}

// WithHTTPClient replaces the default *http.Client.
func WithHTTPClient(doer HTTPDoer) Option {
	return func(c *Client) error {
		if doer == nil {
			return fmt.Errorf("xai: http client is nil")
		}
		c.http = doer
		return nil
	}
}

// WithTimeout sets the HTTP client timeout. Zero or negative is rejected.
func WithTimeout(d time.Duration) Option {
	return func(c *Client) error {
		if d <= 0 {
			return fmt.Errorf("xai: timeout must be positive")
		}
		c.timeout = d
		return nil
	}
}

// WithServiceTier sets the default scheduling tier. Empty means omit the field
// (equivalent to "default").
func WithServiceTier(tier ServiceTier) Option {
	return func(c *Client) error {
		switch tier {
		case "", ServiceTierDefault, ServiceTierPriority:
			c.serviceTier = tier
			return nil
		default:
			return fmt.Errorf("xai: unknown service tier %q", tier)
		}
	}
}

// WithMaxConcurrent sets the Gather semaphore. Must be >= 1.
func WithMaxConcurrent(n int) Option {
	return func(c *Client) error {
		if n < 1 {
			return fmt.Errorf("xai: max concurrent must be >= 1")
		}
		c.maxConcurrent = n
		return nil
	}
}

// WithUserAgent overrides the User-Agent header.
func WithUserAgent(ua string) Option {
	return func(c *Client) error {
		ua = strings.TrimSpace(ua)
		if ua == "" {
			return fmt.Errorf("xai: user agent is empty")
		}
		c.userAgent = ua
		return nil
	}
}
