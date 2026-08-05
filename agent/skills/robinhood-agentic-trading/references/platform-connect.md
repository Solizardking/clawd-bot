# Platform connect recipes

Official MCP URL (all platforms):

```text
https://agent.robinhood.com/mcp/trading
```

Stable server name in this monorepo: `robinhood-trading`

## Claude Code

```bash
claude mcp add robinhood-trading --transport http https://agent.robinhood.com/mcp/trading
```

Then `/mcp` → select `robinhood-trading` → authenticate.

## Claude Desktop

Settings → Connectors → Add custom connector → paste the URL above.

## ChatGPT

Developer Mode → Settings → Apps → Create app → MCP link = URL above.

## Codex / Codex CLI

Settings → MCP servers → Streamable HTTP → URL, or:

```bash
codex mcp add robinhood-trading --url https://agent.robinhood.com/mcp/trading
```

## Cursor

Tools & MCPs → Connect → custom URL.

## Grok

Chat **+** → Add connector → Custom → URL.

Project birth seed (this repo):

```toml
# .grok/config.toml
[mcp_servers.robinhood-trading]
url = "https://agent.robinhood.com/mcp/trading"
```

## ClawdBot / core-ai seed

```json
{
  "mcpServers": {
    "robinhood-trading": {
      "type": "http",
      "url": "https://agent.robinhood.com/mcp/trading"
    }
  }
}
```

Written by `install.sh` and `pkg/mcp` to `~/.clawdbot/core-ai.mcp.json` (override with `CLAWDBOT_CORE_AI_MCP_CONFIG`).

## zero-service workspace

`buildWorkspaceMCPConfig` registers:

```js
"robinhood-trading": {
  type: "http",
  url: "https://agent.robinhood.com/mcp/trading",
}
```

## Doctor / list

```bash
grok mcp list
grok mcp doctor robinhood-trading
```

Healthy handshake requires network reachability + completed OAuth. Seed presence is valid even when the host cannot dial Robinhood.
