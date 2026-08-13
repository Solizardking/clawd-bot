// Package xai is a grok-4.6 client for the xAI REST API.
//
// The preferred surface is the Responses API at https://api.x.ai/v1/responses.
// Chat Completions remain available for deferred completions, which are not
// exposed on the Responses endpoint.
//
// Advanced features this package implements:
//
//   - Priority processing via service_tier=priority (user-facing / latency-sensitive paths)
//   - Context compaction via POST /v1/responses/compact
//   - Concurrent requests with a semaphore (see Gather)
//   - Deferred chat completions (poll GET /v1/chat/deferred-completion/{id})
//   - Function calling plus server-side tools: x_search, code_interpreter,
//     image_generation, mcp, web_search
package xai
