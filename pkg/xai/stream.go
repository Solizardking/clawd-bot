package xai

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

// StreamEvent is one Responses API SSE event.
type StreamEvent struct {
	Type     string          `json:"type"`
	Delta    string          `json:"delta,omitempty"`
	Item     json.RawMessage `json:"item,omitempty"`
	Response json.RawMessage `json:"response,omitempty"`
}

// Stream POSTs a streaming Responses request and invokes onEvent for each
// parsed SSE event. The completed Response (if any) is returned.
func (c *Client) Stream(ctx context.Context, req CreateRequest, onEvent func(StreamEvent) error) (*Response, error) {
	if ctx == nil {
		return nil, fmt.Errorf("xai: nil context")
	}
	if onEvent == nil {
		onEvent = func(StreamEvent) error { return nil }
	}
	req.Model = c.resolveModel(req.Model)
	req.ServiceTier = c.resolveTier(req.ServiceTier)
	req.Stream = true

	raw, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("marshal request: %w", err)
	}
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/responses", bytes.NewReader(raw))
	if err != nil {
		return nil, fmt.Errorf("build request: %w", err)
	}
	httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Accept", "text/event-stream")
	httpReq.Header.Set("User-Agent", c.userAgent)

	resp, err := c.http.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("xai stream: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		data, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return nil, fmt.Errorf("xai stream: status %d: %s", resp.StatusCode, truncate(data, 512))
	}

	var completed *Response
	scanner := bufio.NewScanner(resp.Body)
	scanner.Buffer(make([]byte, 0, 64*1024), 2*1024*1024)
	var dataBuf strings.Builder
	flush := func() error {
		payload := strings.TrimSpace(dataBuf.String())
		dataBuf.Reset()
		if payload == "" || payload == "[DONE]" {
			return nil
		}
		var ev StreamEvent
		if err := json.Unmarshal([]byte(payload), &ev); err != nil {
			return nil // skip malformed chunks
		}
		if ev.Type == "response.completed" && len(ev.Response) > 0 {
			var r Response
			if err := json.Unmarshal(ev.Response, &r); err == nil {
				if r.OutputText == "" {
					r.OutputText = OutputText(r.Output)
				}
				completed = &r
			}
		}
		return onEvent(ev)
	}
	for scanner.Scan() {
		if ctx.Err() != nil {
			return completed, fmt.Errorf("stream: %w", ctx.Err())
		}
		line := scanner.Text()
		if line == "" {
			if err := flush(); err != nil {
				return completed, err
			}
			continue
		}
		if strings.HasPrefix(line, "data:") {
			if dataBuf.Len() > 0 {
				dataBuf.WriteByte('\n')
			}
			dataBuf.WriteString(strings.TrimSpace(strings.TrimPrefix(line, "data:")))
		}
	}
	if err := flush(); err != nil {
		return completed, err
	}
	if err := scanner.Err(); err != nil {
		return completed, fmt.Errorf("read stream: %w", err)
	}
	return completed, nil
}
