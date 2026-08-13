package xai

import "encoding/json"

// ServiceTier selects xAI scheduling priority. "priority" is billed at a
// premium per-token rate; you are only charged that rate when the response
// echoes ServiceTierPriority. Cache discounts still apply before the multiplier.
type ServiceTier string

const (
	// ServiceTierDefault is standard processing (same as omitting the field).
	ServiceTierDefault ServiceTier = "default"
	// ServiceTierPriority requests higher scheduling priority (lower TTFT/ITL).
	ServiceTierPriority ServiceTier = "priority"
)

// ReasoningEffort controls grok-4.6 thinking depth.
type ReasoningEffort string

const (
	ReasoningLow    ReasoningEffort = "low"
	ReasoningMedium ReasoningEffort = "medium"
	ReasoningHigh   ReasoningEffort = "high"
	ReasoningXHigh  ReasoningEffort = "xhigh"
)

// Input is either a string prompt or a list of typed items (messages,
// function_call_output, compaction blobs). The JSON encoder picks the shape.
type Input struct {
	Text  string
	Items []any
}

// MarshalJSON encodes a string when Text is set and Items is empty; otherwise
// it encodes the item list (which may be empty).
func (in Input) MarshalJSON() ([]byte, error) {
	if in.Text != "" && len(in.Items) == 0 {
		return json.Marshal(in.Text)
	}
	if in.Items == nil {
		in.Items = []any{}
	}
	return json.Marshal(in.Items)
}

// UnmarshalJSON accepts either a string or an array of items.
func (in *Input) UnmarshalJSON(data []byte) error {
	if len(data) > 0 && data[0] == '"' {
		var s string
		if err := json.Unmarshal(data, &s); err != nil {
			return err
		}
		in.Text = s
		in.Items = nil
		return nil
	}
	var items []any
	if err := json.Unmarshal(data, &items); err != nil {
		return err
	}
	in.Items = items
	in.Text = ""
	return nil
}

// Message is a role/content turn used as a Responses input item.
type Message struct {
	Role    string `json:"role"`
	Content any    `json:"content"`
}

// CompactionItem is an opaque compacted-conversation blob. Treat
// EncryptedContent as opaque — do not parse or modify it. Pass the item
// verbatim as the head of the next request and append new user turns after it.
type CompactionItem struct {
	Type             string `json:"type"`
	ID               string `json:"id,omitempty"`
	EncryptedContent string `json:"encrypted_content"`
}

// FunctionCallOutput returns a tool result to the Responses API.
type FunctionCallOutput struct {
	Type   string `json:"type"`
	CallID string `json:"call_id"`
	Output string `json:"output"`
}

// FunctionTool is a client-side function the model can invoke.
type FunctionTool struct {
	Type        string         `json:"type"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Parameters  map[string]any `json:"parameters"`
}

// XSearchTool is the server-side X (Twitter) search tool.
type XSearchTool struct {
	Type                     string   `json:"type"`
	AllowedXHandles          []string `json:"allowed_x_handles,omitempty"`
	ExcludedXHandles         []string `json:"excluded_x_handles,omitempty"`
	FromDate                 string   `json:"from_date,omitempty"`
	ToDate                   string   `json:"to_date,omitempty"`
	EnableImageUnderstanding bool     `json:"enable_image_understanding,omitempty"`
	EnableVideoUnderstanding bool     `json:"enable_video_understanding,omitempty"`
}

// CodeInterpreterTool is the server-side Python sandbox (Responses name).
type CodeInterpreterTool struct {
	Type string `json:"type"`
}

// ImageGenerationTool lets Grok Imagine generate or edit images in-conversation.
type ImageGenerationTool struct {
	Type   string `json:"type"`
	Action string `json:"action,omitempty"` // auto | generate | edit
}

// MCPTool connects Grok to a remote MCP server (Streaming HTTP or SSE).
type MCPTool struct {
	Type              string            `json:"type"`
	ServerURL         string            `json:"server_url"`
	ServerLabel       string            `json:"server_label"`
	ServerDescription string            `json:"server_description,omitempty"`
	AllowedTools      []string          `json:"allowed_tools,omitempty"`
	Authorization     string            `json:"authorization,omitempty"`
	Headers           map[string]string `json:"headers,omitempty"`
}

// WebSearchTool is the server-side web search tool.
type WebSearchTool struct {
	Type string `json:"type"`
}

// ReasoningConfig is the nested reasoning object on a Responses request.
type ReasoningConfig struct {
	Effort ReasoningEffort `json:"effort,omitempty"`
}

// CreateRequest is POST /v1/responses.
type CreateRequest struct {
	Model              string           `json:"model"`
	Input              Input            `json:"input"`
	Tools              []any            `json:"tools,omitempty"`
	ToolChoice         any              `json:"tool_choice,omitempty"`
	ParallelToolCalls  *bool            `json:"parallel_tool_calls,omitempty"`
	PreviousResponseID string           `json:"previous_response_id,omitempty"`
	Store              *bool            `json:"store,omitempty"`
	Stream             bool             `json:"stream,omitempty"`
	ServiceTier        ServiceTier      `json:"service_tier,omitempty"`
	Reasoning          *ReasoningConfig `json:"reasoning,omitempty"`
	Include            []string         `json:"include,omitempty"`
	MaxOutputTokens    int              `json:"max_output_tokens,omitempty"`
	Temperature        *float64         `json:"temperature,omitempty"`
}

// Usage is token accounting on Responses / compaction objects.
type Usage struct {
	InputTokens         int            `json:"input_tokens"`
	OutputTokens        int            `json:"output_tokens"`
	TotalTokens         int            `json:"total_tokens"`
	DroppedMessageCount int            `json:"dropped_message_count,omitempty"`
	InputTokensDetails  map[string]any `json:"input_tokens_details,omitempty"`
	OutputTokensDetails map[string]any `json:"output_tokens_details,omitempty"`
	CostInUSDTicks      int64          `json:"cost_in_usd_ticks,omitempty"`
}

// OutputItem is one entry in a Responses output array. Type discriminates
// message, function_call, image_generation_call, web_search_call, compaction, etc.
type OutputItem struct {
	Type             string          `json:"type"`
	ID               string          `json:"id,omitempty"`
	Status           string          `json:"status,omitempty"`
	Role             string          `json:"role,omitempty"`
	Content          json.RawMessage `json:"content,omitempty"`
	Name             string          `json:"name,omitempty"`
	CallID           string          `json:"call_id,omitempty"`
	Arguments        string          `json:"arguments,omitempty"`
	Prompt           string          `json:"prompt,omitempty"`
	Result           string          `json:"result,omitempty"`
	Action           json.RawMessage `json:"action,omitempty"`
	EncryptedContent string          `json:"encrypted_content,omitempty"`
}

// Response is POST /v1/responses (non-streaming) and the completed stream object.
type Response struct {
	ID          string       `json:"id"`
	Object      string       `json:"object"`
	Model       string       `json:"model"`
	ServiceTier ServiceTier  `json:"service_tier,omitempty"`
	Output      []OutputItem `json:"output"`
	OutputText  string       `json:"output_text,omitempty"`
	Usage       Usage        `json:"usage"`
	Status      string       `json:"status,omitempty"`
	Error       *APIError    `json:"error,omitempty"`
}

// CompactRequest is POST /v1/responses/compact.
type CompactRequest struct {
	Model string `json:"model"`
	Input Input  `json:"input"`
}

// CompactResponse is object=response.compaction.
type CompactResponse struct {
	ID        string       `json:"id"`
	Object    string       `json:"object"`
	CreatedAt int64        `json:"created_at"`
	Model     string       `json:"model"`
	Output    []OutputItem `json:"output"`
	Usage     Usage        `json:"usage"`
}

// DeferredSubmitRequest is POST /v1/chat/completions with deferred=true.
type DeferredSubmitRequest struct {
	Model    string        `json:"model"`
	Messages []ChatMessage `json:"messages"`
	Deferred bool          `json:"deferred"`
}

// ChatMessage is a Chat Completions message.
type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// DeferredSubmitResponse is the 200 body of a deferred create.
type DeferredSubmitResponse struct {
	RequestID string `json:"request_id"`
}

// APIError is the nested error object on a failed Responses payload.
type APIError struct {
	Message string `json:"message"`
	Type    string `json:"type,omitempty"`
	Code    string `json:"code,omitempty"`
}

func (e *APIError) Error() string {
	if e == nil {
		return "xai: empty api error"
	}
	if e.Code != "" {
		return "xai: " + e.Code + ": " + e.Message
	}
	return "xai: " + e.Message
}

// FunctionCall is a parsed client-side tool invocation from a Response.
type FunctionCall struct {
	Name      string
	CallID    string
	Arguments map[string]any
	RawArgs   string
}
