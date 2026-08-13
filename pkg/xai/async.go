package xai

import (
	"context"
	"fmt"
	"sync"
)

// Gather runs fn for every item with at most maxConcurrent in flight.
// Results are returned in input order. The first error is joined with the
// rest via errors from each worker; a cancelled ctx stops new work.
//
// Use this for fan-out of independent Completions. For queued later-fetch
// workloads prefer SubmitDeferred + the Batch API instead.
func Gather[T any, R any](ctx context.Context, items []T, maxConcurrent int, fn func(context.Context, T) (R, error)) ([]R, error) {
	if ctx == nil {
		return nil, fmt.Errorf("xai: nil context")
	}
	if maxConcurrent < 1 {
		maxConcurrent = DefaultMaxConcurrent
	}
	n := len(items)
	out := make([]R, n)
	if n == 0 {
		return out, nil
	}

	sem := make(chan struct{}, maxConcurrent)
	errCh := make(chan error, n)
	var wg sync.WaitGroup

	for i, item := range items {
		if ctx.Err() != nil {
			break
		}
		wg.Add(1)
		sem <- struct{}{}
		go func(i int, item T) {
			defer wg.Done()
			defer func() { <-sem }()
			res, err := fn(ctx, item)
			if err != nil {
				errCh <- fmt.Errorf("gather[%d]: %w", i, err)
				return
			}
			out[i] = res
		}(i, item)
	}

	wg.Wait()
	close(errCh)

	var first error
	for err := range errCh {
		if first == nil {
			first = err
		}
	}
	if first != nil {
		return out, first
	}
	return out, ctx.Err()
}

// GatherResponses fans out Create calls under the client's maxConcurrent limit.
func (c *Client) GatherResponses(ctx context.Context, reqs []CreateRequest) ([]*Response, error) {
	return Gather(ctx, reqs, c.maxConcurrent, func(ctx context.Context, req CreateRequest) (*Response, error) {
		return c.Create(ctx, req)
	})
}
