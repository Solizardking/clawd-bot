package xai

// Function builds a client-side function tool. parameters must be a JSON
// Schema object (type=object) or a union of objects; a scalar/array root is
// rejected by the API with 400.
func Function(name, description string, parameters map[string]any) FunctionTool {
	if parameters == nil {
		parameters = map[string]any{
			"type":       "object",
			"properties": map[string]any{},
		}
	}
	return FunctionTool{
		Type:        "function",
		Name:        name,
		Description: description,
		Parameters:  parameters,
	}
}

// XSearch returns the server-side X search tool. allowed and excluded handles
// cannot be set on the same request (max 20 each).
func XSearch() XSearchTool {
	return XSearchTool{Type: "x_search"}
}

// CodeInterpreter returns the server-side Python sandbox (Responses API name).
func CodeInterpreter() CodeInterpreterTool {
	return CodeInterpreterTool{Type: "code_interpreter"}
}

// ImageGeneration returns the Grok Imagine tool. action is auto|generate|edit;
// empty means auto (generate and edit).
func ImageGeneration(action string) ImageGenerationTool {
	return ImageGenerationTool{Type: "image_generation", Action: action}
}

// MCP connects Grok to a remote MCP server. Only Streaming HTTP and SSE
// transports are supported. require_approval and connector_id are not supported.
func MCP(serverURL, serverLabel string) MCPTool {
	return MCPTool{
		Type:        "mcp",
		ServerURL:   serverURL,
		ServerLabel: serverLabel,
	}
}

// WebSearch returns the server-side web search tool.
func WebSearch() WebSearchTool {
	return WebSearchTool{Type: "web_search"}
}

// PumpTools is the default client-side function catalog for the PumpFun Grok
// sidecar: read-only market intel plus a gated copy-trade recommendation.
func PumpTools() []any {
	str := func(desc string) map[string]any {
		return map[string]any{"type": "string", "description": desc}
	}
	num := func(desc string) map[string]any {
		return map[string]any{"type": "number", "description": desc}
	}
	object := func(props map[string]any, required []string) map[string]any {
		schema := map[string]any{
			"type":                 "object",
			"properties":           props,
			"additionalProperties": false,
		}
		if len(required) > 0 {
			schema["required"] = required
		}
		return schema
	}

	return []any{
		Function(
			"get_token_snapshot",
			"Return the local PumpFun tracker snapshot for a mint: last seen buy/sell, protocol, and whether the bot currently holds it.",
			object(map[string]any{"mint": str("Pump.fun / PumpSwap token mint (base58)")}, []string{"mint"}),
		),
		Function(
			"recommend_copy",
			"Record a copy-trade recommendation after analyzing a token. Does not execute a trade; the Rust sniper still owns execution.",
			object(map[string]any{
				"mint":       str("Token mint"),
				"action":     str("copy_buy | skip | sell | watch"),
				"confidence": num("0-1 confidence"),
				"reason":     str("Short reason citing X/search or on-chain evidence"),
			}, []string{"mint", "action", "reason"}),
		),
	}
}

// UserFacingTools is the default server-side tool set for the control-deck chat:
// X search, code interpreter, image generation, plus optional remote MCP.
func UserFacingTools(mcpURL, mcpLabel string) []any {
	tools := []any{
		XSearch(),
		CodeInterpreter(),
		ImageGeneration("auto"),
		WebSearch(),
	}
	if mcpURL != "" && mcpLabel != "" {
		tools = append(tools, MCP(mcpURL, mcpLabel))
	}
	return tools
}
