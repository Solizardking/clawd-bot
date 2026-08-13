package xai

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
)

// Create sends a non-streaming Responses API request.
func (c *Client) Create(ctx context.Context, req CreateRequest) (*Response, error) {
	if ctx == nil {
		return nil, fmt.Errorf("xai: nil context")
	}
	req.Model = c.resolveModel(req.Model)
	req.ServiceTier = c.resolveTier(req.ServiceTier)
	req.Stream = false

	data, status, err := c.doJSON(ctx, "POST", "/responses", req)
	if err != nil {
		return nil, err
	}
	if status < 200 || status >= 300 {
		return nil, fmt.Errorf("xai responses: status %d: %s", status, truncate(data, 512))
	}

	var out Response
	if err := json.Unmarshal(data, &out); err != nil {
		return nil, fmt.Errorf("decode response: %w", err)
	}
	if out.Error != nil {
		return &out, out.Error
	}
	if out.OutputText == "" {
		out.OutputText = OutputText(out.Output)
	}
	return &out, nil
}

// OutputText concatenates output_text parts from message items.
func OutputText(items []OutputItem) string {
	var b strings.Builder
	for _, item := range items {
		if item.Type != "message" {
			continue
		}
		if len(item.Content) == 0 {
			continue
		}
		var parts []struct {
			Type string `json:"type"`
			Text string `json:"text"`
		}
		if err := json.Unmarshal(item.Content, &parts); err != nil {
			continue
		}
		for _, p := range parts {
			if (p.Type == "output_text" || p.Type == "text") && p.Text != "" {
				b.WriteString(p.Text)
			}
		}
	}
	return b.String()
}

// FunctionCalls extracts client-side function_call items from a Response.
func FunctionCalls(resp *Response) []FunctionCall {
	if resp == nil {
		return []FunctionCall{}
	}
	calls := make([]FunctionCall, 0)
	for _, item := range resp.Output {
		if item.Type != "function_call" {
			continue
		}
		fc := FunctionCall{
			Name:    item.Name,
			CallID:  item.CallID,
			RawArgs: item.Arguments,
		}
		args := map[string]any{}
		if item.Arguments != "" {
			if err := json.Unmarshal([]byte(item.Arguments), &args); err != nil {
				args = map[string]any{"raw": item.Arguments}
			}
		}
		fc.Arguments = args
		calls = append(calls, fc)
	}
	return calls
}

// ImageResults returns base64 payloads from completed image_generation_call items.
func ImageResults(resp *Response) []string {
	if resp == nil {
		return []string{}
	}
	out := make([]string, 0)
	for _, item := range resp.Output {
		if item.Type == "image_generation_call" && item.Result != "" {
			out = append(out, item.Result)
		}
	}
	return out
}

func truncate(data []byte, n int) string {
	s := strings.TrimSpace(string(data))
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}
