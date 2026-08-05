package mcp

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// Official Robinhood Agentic Trading MCP (streamable HTTP).
// Agents may place trades only in the Robinhood Agentic account after
// desktop OAuth / Agentic onboarding. Read access can cover other accounts.
const (
	RobinhoodTradingServerName = "robinhood-trading"
	RobinhoodTradingMCPURL     = "https://agent.robinhood.com/mcp/trading"

	ZKCompressionServerName = "zkcompression"
	ZKCompressionMCPURL     = "https://www.zkcompression.com/mcp"

	// CoreAIMCPFileName is the install/birth seed filename under CLAWDBOT_HOME.
	CoreAIMCPFileName = "core-ai.mcp.json"
)

// CoreAIMCPDocument is the Claude/Cursor-style mcpServers map written at install and birth.
type CoreAIMCPDocument struct {
	MCPServers map[string]ServerConfig `json:"mcpServers"`
}

// BuildCoreAIMCPServers returns the default core-ai birth/install MCP seed.
// coreAIDir is the on-disk core-ai sidecar root used for helius/pump stdio paths;
// HTTP remotes (zkcompression, robinhood-trading) do not depend on it.
func BuildCoreAIMCPServers(coreAIDir string) map[string]ServerConfig {
	coreAIDir = strings.TrimSpace(coreAIDir)
	if coreAIDir == "" {
		coreAIDir = "core-ai"
	}
	return map[string]ServerConfig{
		"helius": {
			Command: "node",
			Args:    []string{filepath.Join(coreAIDir, "helius-mcp", "dist", "index.js")},
			Env: map[string]string{
				"HELIUS_API_KEY": "${HELIUS_API_KEY}",
				"SOLANA_RPC_URL": "${SOLANA_RPC_URL}",
			},
		},
		"pump-mcp": {
			Command: "node",
			Args:    []string{filepath.Join(coreAIDir, "mcp-server", "dist", "index.js")},
			Env: map[string]string{
				"SOLANA_RPC_URL": "${SOLANA_RPC_URL}",
				"HELIUS_API_KEY": "${HELIUS_API_KEY}",
			},
		},
		ZKCompressionServerName: {
			Type: "http",
			URL:  ZKCompressionMCPURL,
		},
		RobinhoodTradingServerName: {
			Type: "http",
			URL:  RobinhoodTradingMCPURL,
		},
	}
}

// BuildCoreAIMCPDocument builds the full JSON document for core-ai.mcp.json.
func BuildCoreAIMCPDocument(coreAIDir string) CoreAIMCPDocument {
	return CoreAIMCPDocument{MCPServers: BuildCoreAIMCPServers(coreAIDir)}
}

// MarshalCoreAIMCPConfig returns pretty-printed JSON for the core-ai MCP seed.
func MarshalCoreAIMCPConfig(coreAIDir string) ([]byte, error) {
	doc := BuildCoreAIMCPDocument(coreAIDir)
	data, err := json.MarshalIndent(doc, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("marshal core-ai MCP config: %w", err)
	}
	return append(data, '\n'), nil
}

// WriteCoreAIMCPConfig writes the birth/install MCP seed to path (creates parent dirs).
// This is the pure install/Ensure writer path exercised by offline tests.
// Always rewrites the full default document (install path and tests).
func WriteCoreAIMCPConfig(path, coreAIDir string) error {
	path = strings.TrimSpace(path)
	if path == "" {
		return fmt.Errorf("MCP config path is required")
	}
	data, err := MarshalCoreAIMCPConfig(coreAIDir)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return fmt.Errorf("create MCP config dir: %w", err)
	}
	if err := os.WriteFile(path, data, 0o644); err != nil {
		return fmt.Errorf("write MCP config: %w", err)
	}
	return nil
}

// EnsureCoreAIMCPConfig creates the full seed when path is missing; when path
// already exists, merges in robinhood-trading (and other default HTTP remotes
// that are absent) without removing user-added servers or customized stdio paths.
func EnsureCoreAIMCPConfig(path, coreAIDir string) error {
	path = strings.TrimSpace(path)
	if path == "" {
		return fmt.Errorf("MCP config path is required")
	}
	if _, err := os.Stat(path); err != nil {
		if !os.IsNotExist(err) {
			return fmt.Errorf("stat MCP config: %w", err)
		}
		return WriteCoreAIMCPConfig(path, coreAIDir)
	}

	raw, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("read MCP config: %w", err)
	}
	var doc CoreAIMCPDocument
	if err := json.Unmarshal(raw, &doc); err != nil {
		return fmt.Errorf("parse MCP config: %w", err)
	}
	if doc.MCPServers == nil {
		doc.MCPServers = map[string]ServerConfig{}
	}

	// Only inject missing birth defaults so existing installs pick up Robinhood
	// without clobbering operator customizations.
	defaults := BuildCoreAIMCPServers(coreAIDir)
	changed := false
	for _, name := range []string{RobinhoodTradingServerName, ZKCompressionServerName} {
		if _, ok := doc.MCPServers[name]; ok {
			continue
		}
		doc.MCPServers[name] = defaults[name]
		changed = true
	}
	if !changed {
		return nil
	}
	data, err := json.MarshalIndent(doc, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal MCP config: %w", err)
	}
	data = append(data, '\n')
	if err := os.WriteFile(path, data, 0o644); err != nil {
		return fmt.Errorf("write MCP config: %w", err)
	}
	return nil
}

// DefaultCoreAIMCPConfigPath returns ~/.clawdbot/core-ai.mcp.json (or CLAWDBOT_CORE_AI_MCP_CONFIG).
func DefaultCoreAIMCPConfigPath(clawdbotHome string) string {
	if p := strings.TrimSpace(os.Getenv("CLAWDBOT_CORE_AI_MCP_CONFIG")); p != "" {
		return p
	}
	clawdbotHome = strings.TrimSpace(clawdbotHome)
	if clawdbotHome == "" {
		if h := os.Getenv("CLAWDBOT_HOME"); h != "" {
			clawdbotHome = h
		} else {
			home, _ := os.UserHomeDir()
			clawdbotHome = filepath.Join(home, ".clawdbot")
		}
	}
	return filepath.Join(clawdbotHome, CoreAIMCPFileName)
}

// AgenticTradingOperatorNote is the operator-facing limit for the Robinhood connector.
const AgenticTradingOperatorNote = `## Robinhood Agentic Trading MCP

Birth/install seeds the official HTTP connector as ` + "`robinhood-trading`" + `:
` + RobinhoodTradingMCPURL + `

**Limits (Robinhood product rules):**
- The agent may **place trades only** in your Robinhood **Agentic** account.
- Read access may cover other Robinhood accounts (positions, balances, history, watchlists).
- Desktop OAuth and Agentic account onboarding are required before live tools work.
- Open/authenticate the Agentic account on a **desktop** browser (mobile onboarding URL must be opened on desktop).
- You remain responsible for every order the agent places; review agent prompts and account activity.

Reconnect or re-auth via your AI platform's MCP connector settings if the handshake fails.
`
