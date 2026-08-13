package xai

import (
	"context"
	"fmt"
)

// Session keeps Responses input items and optionally compact them in place
// when the conversation grows past CompactEvery turns. encrypted_content
// blobs are stored verbatim and never parsed.
type Session struct {
	items        []any
	compactEvery int
	turns        int
	lastCompact  *CompactResponse
}

// NewSession starts a conversation with an optional system prompt.
func NewSession(system string, compactEvery int) *Session {
	s := &Session{
		items:        []any{},
		compactEvery: compactEvery,
	}
	if system != "" {
		s.items = append(s.items, Message{Role: "system", Content: system})
	}
	return s
}

// Append adds an input item (message, function_call_output, compaction, …).
func (s *Session) Append(item any) {
	if s == nil || item == nil {
		return
	}
	s.items = append(s.items, item)
}

// Items returns a copy of the current input list so callers cannot mutate
// the session's backing array via append aliasing.
func (s *Session) Items() []any {
	if s == nil {
		return []any{}
	}
	out := make([]any, len(s.items))
	copy(out, s.items)
	return out
}

// LastCompact returns the most recent compaction response, if any.
func (s *Session) LastCompact() *CompactResponse {
	if s == nil {
		return nil
	}
	return s.lastCompact
}

// MaybeCompact runs compaction when CompactEvery > 0 and enough user turns
// have been appended. The original messages are replaced by the compaction
// output — do not prune that output.
func (s *Session) MaybeCompact(ctx context.Context, c *Client, model string) (*CompactResponse, error) {
	if s == nil || c == nil {
		return nil, fmt.Errorf("xai: session or client is nil")
	}
	if s.compactEvery <= 0 {
		return nil, nil
	}
	s.turns++
	if s.turns%s.compactEvery != 0 {
		return nil, nil
	}
	return s.CompactNow(ctx, c, model)
}

// CompactNow always compacts the current items and replaces them in place.
func (s *Session) CompactNow(ctx context.Context, c *Client, model string) (*CompactResponse, error) {
	if s == nil || c == nil {
		return nil, fmt.Errorf("xai: session or client is nil")
	}
	cr, err := c.Compact(ctx, CompactRequest{
		Model: model,
		Input: Input{Items: s.items},
	})
	if err != nil {
		return nil, err
	}
	s.items = cr.CompactionHead()
	s.lastCompact = cr
	return cr, nil
}

// CreateRequest builds a Responses request from the current session items.
func (s *Session) CreateRequest(model string, tools []any, tier ServiceTier) CreateRequest {
	items := []any{}
	if s != nil {
		items = s.Items()
	}
	return CreateRequest{
		Model:       model,
		Input:       Input{Items: items},
		Tools:       tools,
		ServiceTier: tier,
	}
}
