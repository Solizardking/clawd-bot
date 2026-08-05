package mcp

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestBuildCoreAIMCPServersIncludesRobinhoodTrading(t *testing.T) {
	servers := BuildCoreAIMCPServers("/opt/core-ai")
	rh, ok := servers[RobinhoodTradingServerName]
	if !ok {
		t.Fatalf("missing %q in seed servers; got keys %v", RobinhoodTradingServerName, serverKeys(servers))
	}
	if rh.Type != "http" {
		t.Fatalf("robinhood-trading type = %q, want http", rh.Type)
	}
	if rh.URL != RobinhoodTradingMCPURL {
		t.Fatalf("robinhood-trading url = %q, want %q", rh.URL, RobinhoodTradingMCPURL)
	}
	if rh.Command != "" {
		t.Fatalf("robinhood-trading must be HTTP-only, got command %q", rh.Command)
	}
}

func TestBuildCoreAIMCPServersIncludesClawdBrowserMCP(t *testing.T) {
	servers := BuildCoreAIMCPServers("/opt/core-ai")
	clawd, ok := servers[ClawdMCPServerName]
	if !ok {
		t.Fatalf("missing %q; keys %v", ClawdMCPServerName, serverKeys(servers))
	}
	if clawd.Command != "node" || len(clawd.Args) == 0 {
		t.Fatalf("clawd MCP must be node stdio: %#v", clawd)
	}
	if !strings.Contains(clawd.Args[0], "mcp-clawd.mjs") {
		t.Fatalf("clawd args should point at mcp-clawd.mjs, got %#v", clawd.Args)
	}
	st, ok := servers[ClawdSolTraderServerName]
	if !ok || !strings.Contains(strings.Join(st.Args, " "), "mcp-soltrader.mjs") {
		t.Fatalf("clawd-soltrader seed missing or wrong: %#v", st)
	}
}

func TestBuildCoreAIMCPServersKeepsExistingSidecars(t *testing.T) {
	servers := BuildCoreAIMCPServers("/Users/test/.clawdbot/core-ai")
	for _, name := range []string{"helius", "pump-mcp", ZKCompressionServerName} {
		if _, ok := servers[name]; !ok {
			t.Fatalf("pre-existing seed server %q missing", name)
		}
	}
	helius := servers["helius"]
	wantHelius := filepath.Join("/Users/test/.clawdbot/core-ai", "helius-mcp", "dist", "index.js")
	if len(helius.Args) == 0 || helius.Args[0] != wantHelius {
		t.Fatalf("helius args = %#v, want %q", helius.Args, wantHelius)
	}
	zk := servers[ZKCompressionServerName]
	if zk.Type != "http" || zk.URL != ZKCompressionMCPURL {
		t.Fatalf("zkcompression seed broken: %#v", zk)
	}
}

func TestWriteCoreAIMCPConfigRoundTrip(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "core-ai.mcp.json")
	coreAI := filepath.Join(dir, "core-ai")

	if err := WriteCoreAIMCPConfig(path, coreAI); err != nil {
		t.Fatalf("WriteCoreAIMCPConfig: %v", err)
	}
	// Second write must stay consistent (idempotent rewrite).
	if err := WriteCoreAIMCPConfig(path, coreAI); err != nil {
		t.Fatalf("WriteCoreAIMCPConfig second: %v", err)
	}

	raw, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read written config: %v", err)
	}
	if !strings.Contains(string(raw), RobinhoodTradingServerName) {
		t.Fatalf("written config missing server name %q:\n%s", RobinhoodTradingServerName, raw)
	}
	if !strings.Contains(string(raw), RobinhoodTradingMCPURL) {
		t.Fatalf("written config missing URL %q:\n%s", RobinhoodTradingMCPURL, raw)
	}

	var doc CoreAIMCPDocument
	if err := json.Unmarshal(raw, &doc); err != nil {
		t.Fatalf("parse written config: %v\n%s", err, raw)
	}
	rh, ok := doc.MCPServers[RobinhoodTradingServerName]
	if !ok {
		t.Fatalf("parsed config missing %q", RobinhoodTradingServerName)
	}
	if rh.URL != RobinhoodTradingMCPURL || rh.Type != "http" {
		t.Fatalf("parsed robinhood entry: %#v", rh)
	}
	for _, name := range []string{"helius", "pump-mcp", "zkcompression"} {
		if _, ok := doc.MCPServers[name]; !ok {
			t.Fatalf("parsed config lost pre-existing server %q", name)
		}
	}
}

func TestMarshalCoreAIMCPConfigExactURL(t *testing.T) {
	data, err := MarshalCoreAIMCPConfig("/x/core-ai")
	if err != nil {
		t.Fatal(err)
	}
	var doc map[string]any
	if err := json.Unmarshal(data, &doc); err != nil {
		t.Fatal(err)
	}
	servers, ok := doc["mcpServers"].(map[string]any)
	if !ok {
		t.Fatalf("mcpServers not an object: %T", doc["mcpServers"])
	}
	rh, ok := servers[RobinhoodTradingServerName].(map[string]any)
	if !ok {
		t.Fatalf("robinhood-trading missing or wrong type: %#v", servers[RobinhoodTradingServerName])
	}
	if rh["url"] != RobinhoodTradingMCPURL {
		t.Fatalf("url = %#v, want %q", rh["url"], RobinhoodTradingMCPURL)
	}
	if rh["type"] != "http" {
		t.Fatalf("type = %#v, want http", rh["type"])
	}
}

func TestEnsureCoreAIMCPConfigMergesRobinhoodWithoutClobber(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "core-ai.mcp.json")
	// Pre-existing operator config with a custom server and no robinhood.
	existing := []byte(`{
  "mcpServers": {
    "custom": {
      "command": "node",
      "args": ["custom.js"]
    },
    "helius": {
      "command": "node",
      "args": ["/custom/helius.js"]
    }
  }
}
`)
	if err := os.WriteFile(path, existing, 0o644); err != nil {
		t.Fatal(err)
	}
	if err := EnsureCoreAIMCPConfig(path, filepath.Join(dir, "core-ai")); err != nil {
		t.Fatalf("EnsureCoreAIMCPConfig: %v", err)
	}
	// Second ensure is a no-op for already-present keys.
	if err := EnsureCoreAIMCPConfig(path, filepath.Join(dir, "core-ai")); err != nil {
		t.Fatalf("EnsureCoreAIMCPConfig second: %v", err)
	}

	raw, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	var doc CoreAIMCPDocument
	if err := json.Unmarshal(raw, &doc); err != nil {
		t.Fatal(err)
	}
	if _, ok := doc.MCPServers["custom"]; !ok {
		t.Fatal("custom server was clobbered")
	}
	helius := doc.MCPServers["helius"]
	if len(helius.Args) == 0 || helius.Args[0] != "/custom/helius.js" {
		t.Fatalf("helius path was clobbered: %#v", helius)
	}
	rh, ok := doc.MCPServers[RobinhoodTradingServerName]
	if !ok || rh.URL != RobinhoodTradingMCPURL || rh.Type != "http" {
		t.Fatalf("robinhood-trading not merged: %#v", doc.MCPServers[RobinhoodTradingServerName])
	}
}

func TestAgenticTradingOperatorNoteStatesLimits(t *testing.T) {
	note := AgenticTradingOperatorNote
	for _, needle := range []string{
		"Agentic",
		"place trades only",
		"desktop",
		"OAuth",
		RobinhoodTradingMCPURL,
		RobinhoodTradingServerName,
	} {
		if !strings.Contains(note, needle) {
			t.Fatalf("operator note missing %q", needle)
		}
	}
}

func serverKeys(m map[string]ServerConfig) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
}
