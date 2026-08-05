---
name: robinhood-agentic-trading
description: >-
  Connect and operate the Robinhood Agentic Trading MCP at agent birth.
  Use when setting up robinhood-trading, wiring https://agent.robinhood.com/mcp/trading,
  opening an Agentic account, desktop OAuth, portfolio reads, watchlists, or placing
  equity orders only in the Robinhood Agentic account. Not for Robinhood Chain crypto
  (use rh-crypto-agent / rh-bonded-launch) or Robinhood Banking MCP.
---

# Robinhood Agentic Trading

Operate the official **Robinhood Trading MCP** so Clawd can read brokerage data and
place trades **only** in a Robinhood **Agentic** account.

## When to use

- Birth/install MCP seed already includes `robinhood-trading` and tools are missing or unauthenticated
- User asks to trade on Robinhood with an AI agent / Agentic account
- Portfolio, balances, order history, watchlists, or Agentic order placement
- Connecting Claude Code, Claude Desktop, Cursor, Codex, ChatGPT, Grok, or other MCP hosts

## Non-goals

- Robinhood Chain / EVM bonded launches → `rh-crypto-agent`, `rh-bonded-launch`, `rh-launchpad-v3`
- Robinhood Banking MCP (`https://banking-agent.robinhood.com/mcp/banking`) unless user asks
- Live order placement without user intent and risk disclosure
- Reverse-engineering private Robinhood APIs (use the official MCP only)

## Official connector

| Field | Value |
|-------|--------|
| Server name | `robinhood-trading` |
| Transport | Streamable HTTP |
| URL | `https://agent.robinhood.com/mcp/trading` |

No API key in git. Auth is host-platform OAuth after the connector is added.

## Birth seed (this monorepo)

New agents get the connector from:

1. **`install.sh`** `write_core_ai_mcp_config` → `~/.clawdbot/core-ai.mcp.json`
2. **`pkg/mcp`** pure builder (`WriteCoreAIMCPConfig` / `EnsureCoreAIMCPConfig`)
3. **`pkg/config.EnsureDefaults`** — ensures seed + `workspace/ROBINHOOD_AGENTIC.md`
4. **`.agents/mcp.json`** and **`.grok/config.toml`**
5. **`zero-service`** `buildWorkspaceMCPConfig` / `ensureWorkspace`

Constants in Go:

```text
pkg/mcp/seed.go
  RobinhoodTradingServerName = "robinhood-trading"
  RobinhoodTradingMCPURL     = "https://agent.robinhood.com/mcp/trading"
```

If an existing install is missing the server, run Ensure (or merge the HTTP entry):

```bash
# After clawdbot EnsureDefaults / startup, or:
# ensure core-ai.mcp.json contains robinhood-trading → agent.robinhood.com/mcp/trading
```

## Connect on a platform

### Claude Code

```bash
claude mcp add robinhood-trading --transport http https://agent.robinhood.com/mcp/trading
# then: /mcp → select robinhood-trading → authenticate
```

### Grok

Start a chat → **+** → Add connector → Custom → paste  
`https://agent.robinhood.com/mcp/trading`

### Cursor

Settings → Tools & MCPs → Connect with the same URL.

### Codex CLI

```bash
codex mcp add robinhood-trading --url https://agent.robinhood.com/mcp/trading
```

### Claude Desktop / ChatGPT / other

Custom connector / app with MCP link: `https://agent.robinhood.com/mcp/trading`

### Manual JSON (Claude-style)

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

### Grok / TOML

```toml
[mcp_servers.robinhood-trading]
url = "https://agent.robinhood.com/mcp/trading"
```

## Open an Agentic account

Required by Robinhood before the agent can trade:

1. Primary individual investing account in good standing
2. Connect the MCP on an AI platform
3. When authenticating, follow the prompt to open an **Agentic** account
4. Finish onboarding on a **desktop** browser (copy mobile URLs to desktop)

You may have up to 10 self-directed individual investing accounts including Agentic.

## What the agent can access

**Read (may include all Robinhood accounts linked to the user):**

- Account numbers and account details
- Positions and balances
- Transactions and order history
- Watchlists and scans

**Write / trade:**

- **Only** in the Robinhood **Agentic** account

## Safe operating procedure

1. Confirm MCP is listed (`grok mcp list` / platform MCP UI).
2. Confirm OAuth completed and Agentic account exists.
3. Prefer **read-only** portfolio / risk questions first.
4. Before any order: restate ticker, side, size, order type, estimated notional, and that the target is the **Agentic** account.
5. Place trades only when the user clearly intends execution (or they pre-approved an autonomous loop with limits).
6. After fills: summarize fills, remaining buying power, and open risk.
7. Never claim unrestricted brokerage control over non-Agentic accounts.

### Example prompts (informational only — not investment advice)

- “What is my Agentic account buying power and top positions?”
- “Why is ROAR up today? Pull news + quote context.”
- “Buy $100 of ROAR only if it is down ≥2% in 1 day — show the plan first.”
- “Rebalance Agentic book toward 20% ROAR / 80% HMNI — dry-run allocation first.”

## Risks (disclose to the user)

- Agentic trading can execute without per-trade confirmation if the user asked for autonomous action.
- AI agents can misread data, act on stale quotes, or place unexpected sizes.
- Full principal loss is possible; user owns all investment decisions and monitoring.
- Robinhood does not guarantee agent output accuracy; third-party AI providers process data per their policies.

## Troubleshooting

| Symptom | Action |
|---------|--------|
| Server missing after install | Re-run install with core-ai, or `EnsureDefaults`; check `core-ai.mcp.json` for `robinhood-trading` |
| Auth / tools empty | Disconnect + reconnect MCP; complete desktop OAuth + Agentic onboarding |
| `HostUnreachable` / network | Environment may block `agent.robinhood.com` — config seed still valid offline |
| Folder untrusted (Grok doctor) | Trust the project folder per platform docs |
| “Robinhood-side” errors | User should contact Robinhood Support after platform reconnect attempts |

## Tests (offline)

```bash
go test ./pkg/mcp/ ./pkg/config/ -count=1
# zero-service birth seed
cd zero-service && npm test
```

Assertions check the real seed builders for name `robinhood-trading` and URL  
`https://agent.robinhood.com/mcp/trading` — no live order required.

## Related skills

- `rh-crypto-agent` — Robinhood Chain / EVM crypto pack (different product)
- `vulcan` / Phoenix perps — Solana perpetuals, not Robinhood equities
- `clawd-trading-terminal` — Cheshire / Solana terminal surfaces

## References

- `references/agentic-limits.md` — Agentic vs read scope, onboarding, disclosures
- `references/platform-connect.md` — per-platform MCP connect snippets
- Robinhood Help: Agentic Trading overview (product docs)
