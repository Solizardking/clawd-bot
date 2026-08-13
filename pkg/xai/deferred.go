package xai

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"
)

// SubmitDeferred creates a chat completion that is retrieved later.
// The result is available exactly once within 24 hours.
func (c *Client) SubmitDeferred(ctx context.Context, model string, messages []ChatMessage) (string, error) {
	if ctx == nil {
		return "", fmt.Errorf("xai: nil context")
	}
	if len(messages) == 0 {
		return "", fmt.Errorf("xai: deferred messages are empty")
	}
	body := DeferredSubmitRequest{
		Model:    c.resolveModel(model),
		Messages: messages,
		Deferred: true,
	}
	data, status, err := c.doJSON(ctx, "POST", "/chat/completions", body)
	if err != nil {
		return "", err
	}
	if status < 200 || status >= 300 {
		return "", fmt.Errorf("xai deferred submit: status %d: %s", status, truncate(data, 512))
	}
	var out DeferredSubmitResponse
	if err := json.Unmarshal(data, &out); err != nil {
		return "", fmt.Errorf("decode deferred submit: %w", err)
	}
	if out.RequestID == "" {
		return "", fmt.Errorf("xai: deferred submit missing request_id")
	}
	return out.RequestID, nil
}

// GetDeferred fetches a previously submitted deferred completion.
// Returns ErrNotReady when the server responds 202 Accepted.
func (c *Client) GetDeferred(ctx context.Context, requestID string) (json.RawMessage, error) {
	if ctx == nil {
		return nil, fmt.Errorf("xai: nil context")
	}
	if requestID == "" {
		return nil, fmt.Errorf("xai: deferred request id is empty")
	}
	data, status, err := c.doJSON(ctx, "GET", "/chat/deferred-completion/"+requestID, nil)
	if err != nil {
		return nil, err
	}
	switch status {
	case http.StatusOK:
		return json.RawMessage(data), nil
	case http.StatusAccepted:
		return nil, ErrNotReady
	default:
		return nil, fmt.Errorf("xai deferred get: status %d: %s", status, truncate(data, 512))
	}
}

// AwaitDeferred polls GetDeferred until the result is ready, ctx is done, or
// timeout elapses. interval is the sleep between polls; a zero interval
// defaults to 10 seconds.
func (c *Client) AwaitDeferred(ctx context.Context, requestID string, timeout, interval time.Duration) (json.RawMessage, error) {
	if ctx == nil {
		return nil, fmt.Errorf("xai: nil context")
	}
	if interval <= 0 {
		interval = 10 * time.Second
	}
	if timeout > 0 {
		var cancel context.CancelFunc
		ctx, cancel = context.WithTimeout(ctx, timeout)
		defer cancel()
	}

	timer := time.NewTimer(0)
	defer timer.Stop()

	for {
		select {
		case <-ctx.Done():
			return nil, fmt.Errorf("await deferred: %w", ctx.Err())
		case <-timer.C:
			body, err := c.GetDeferred(ctx, requestID)
			if err == nil {
				return body, nil
			}
			if !errors.Is(err, ErrNotReady) {
				return nil, err
			}
			timer.Reset(interval)
		}
	}
}
