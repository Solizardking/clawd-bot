package config

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"

	mcpPkg "github.com/8bitlabs/clawdbot/pkg/mcp"
)

// TestEnsureDefaultsWritesRobinhoodTradingMCP drives the real birth Ensure path
// (EnsureDefaults → WriteCoreAIMCPConfig) and asserts the shipped seed content.
func TestEnsureDefaultsWritesRobinhoodTradingMCP(t *testing.T) {
	home := t.TempDir()
	t.Setenv("CLAWDBOT_HOME", home)
	t.Setenv("CLAWDBOT_CORE_AI_MCP_CONFIG", filepath.Join(home, "core-ai.mcp.json"))
	t.Setenv("CLAWDBOT_CORE_AI_DIR", filepath.Join(home, "core-ai"))
	// Avoid clobbering a real CLAWDBOT_CONFIG if set.
	t.Setenv("CLAWDBOT_CONFIG", filepath.Join(home, "config.json"))

	if err := EnsureDefaults(); err != nil {
		t.Fatalf("EnsureDefaults first: %v", err)
	}
	// Idempotent second run.
	if err := EnsureDefaults(); err != nil {
		t.Fatalf("EnsureDefaults second: %v", err)
	}

	mcpPath := filepath.Join(home, "core-ai.mcp.json")
	raw, err := os.ReadFile(mcpPath)
	if err != nil {
		t.Fatalf("read MCP seed: %v", err)
	}
	if !strings.Contains(string(raw), mcpPkg.RobinhoodTradingServerName) {
		t.Fatalf("MCP seed missing %q:\n%s", mcpPkg.RobinhoodTradingServerName, raw)
	}
	if !strings.Contains(string(raw), mcpPkg.RobinhoodTradingMCPURL) {
		t.Fatalf("MCP seed missing URL %q:\n%s", mcpPkg.RobinhoodTradingMCPURL, raw)
	}

	var doc mcpPkg.CoreAIMCPDocument
	if err := json.Unmarshal(raw, &doc); err != nil {
		t.Fatalf("parse MCP seed: %v", err)
	}
	rh, ok := doc.MCPServers[mcpPkg.RobinhoodTradingServerName]
	if !ok {
		t.Fatal("parsed seed missing robinhood-trading")
	}
	if rh.Type != "http" || rh.URL != mcpPkg.RobinhoodTradingMCPURL {
		t.Fatalf("robinhood-trading entry: %#v", rh)
	}
	for _, name := range []string{"helius", "pump-mcp", "zkcompression"} {
		if _, ok := doc.MCPServers[name]; !ok {
			t.Fatalf("seed lost pre-existing server %q", name)
		}
	}

	notePath := filepath.Join(home, "workspace", "ROBINHOOD_AGENTIC.md")
	note, err := os.ReadFile(notePath)
	if err != nil {
		t.Fatalf("read Agentic note: %v", err)
	}
	if !strings.Contains(string(note), "Agentic") || !strings.Contains(string(note), mcpPkg.RobinhoodTradingMCPURL) {
		t.Fatalf("Agentic note incomplete:\n%s", note)
	}

	agentsPath := filepath.Join(home, "workspace", "AGENTS.md")
	agents, err := os.ReadFile(agentsPath)
	if err != nil {
		t.Fatalf("read birth AGENTS.md: %v", err)
	}
	if !strings.Contains(string(agents), "place trades only") || !strings.Contains(string(agents), "Agentic") {
		t.Fatalf("birth AGENTS.md missing Agentic limits:\n%s", agents)
	}
}

func TestInstallShSeedsRobinhoodTrading(t *testing.T) {
	// Structural check: install.sh write_core_ai_mcp_config must ship the same URL.
	// (Shell writer is the install path; Go WriteCoreAIMCPConfig is the Ensure path.)
	root, err := filepath.Abs("../..")
	if err != nil {
		t.Fatal(err)
	}
	// Test file is pkg/config → repo root is two levels up from module package.
	// When running as `go test ./pkg/config`, cwd is package dir.
	candidates := []string{
		filepath.Join(root, "install.sh"),
		"install.sh",
		filepath.Join("..", "..", "install.sh"),
	}
	var raw []byte
	for _, p := range candidates {
		b, err := os.ReadFile(p)
		if err == nil {
			raw = b
			break
		}
	}
	if raw == nil {
		// Fallback: walk from module root via go.mod discovery
		wd, _ := os.Getwd()
		for d := wd; d != "/" && d != "."; d = filepath.Dir(d) {
			p := filepath.Join(d, "install.sh")
			if b, err := os.ReadFile(p); err == nil {
				raw = b
				break
			}
		}
	}
	if raw == nil {
		t.Fatal("could not locate install.sh from test")
	}
	s := string(raw)
	if !strings.Contains(s, `"robinhood-trading"`) {
		t.Fatal("install.sh missing robinhood-trading server name")
	}
	if !strings.Contains(s, mcpPkg.RobinhoodTradingMCPURL) {
		t.Fatalf("install.sh missing %q", mcpPkg.RobinhoodTradingMCPURL)
	}
	if !strings.Contains(s, `"type": "http"`) {
		t.Fatal("install.sh robinhood entry should use type http")
	}
}
