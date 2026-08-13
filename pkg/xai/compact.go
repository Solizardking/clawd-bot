package xai

import (
	"context"
	"encoding/json"
	"fmt"
)

// Compact shrinks a conversation into a single opaque compaction item.
// The conversation you compact must already fit in context — compaction
// cannot rescue an over-limit request. At most one compaction per call.
// Re-compacting an already-compacted conversation is supported.
func (c *Client) Compact(ctx context.Context, req CompactRequest) (*CompactResponse, error) {
	if ctx == nil {
		return nil, fmt.Errorf("xai: nil context")
	}
	req.Model = c.resolveModel(req.Model)

	data, status, err := c.doJSON(ctx, "POST", "/responses/compact", req)
	if err != nil {
		return nil, err
	}
	if status < 200 || status >= 300 {
		return nil, fmt.Errorf("xai compact: status %d: %s", status, truncate(data, 512))
	}

	var out CompactResponse
	if err := json.Unmarshal(data, &out); err != nil {
		return nil, fmt.Errorf("decode compaction: %w", err)
	}
	return &out, nil
}

// CompactionHead returns the output array to spread verbatim into the next
// CreateRequest.Input.Items. Do not prune, reorder, or edit the items.
func (cr *CompactResponse) CompactionHead() []any {
	if cr == nil {
		return []any{}
	}
	head := make([]any, 0, len(cr.Output))
	for _, item := range cr.Output {
		head = append(head, CompactionItem{
			Type:             "compaction",
			ID:               item.ID,
			EncryptedContent: item.EncryptedContent,
		})
	}
	return head
}
