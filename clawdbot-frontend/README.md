# Clawd Bot Frontend — control deck

Live command deck for **grok-4.6** on the xAI Responses API. Brand tokens match the approved command-deck direction (Solana purple/green, glass sidebar, Inter + JetBrains Mono).

Static design demos in `design-demos/` are unchanged. The running UI is `grok-deck.html`, served same-origin by the Go process so chat never hits `file://`.

## Run

```bash
export XAI_API_KEY=...
# optional
export XAI_MODEL=grok-4.6
export XAI_MCP_URL=https://mcp.example/mcp
export PUMP_GROK_URL=http://127.0.0.1:8788   # PumpFun sidecar (cmd/pump-grok)

go run ./cmd/clawd-frontend -addr 127.0.0.1:18810
# open http://127.0.0.1:18810
```

## xAI surfaces

| Feature | Where |
|---------|--------|
| Priority processing (`service_tier=priority`) | Chat default. Response badge shows the tier actually granted. |
| Context compaction | Compact button → `POST /api/compact`. Treat `encrypted_content` as opaque. |
| X Search / code interpreter / Imagine / web / remote MCP | Tool chips on the composer. |
| PumpFun analyze | Proxies `PUMP_GROK_URL/analyze` (priority). Execution stays in the Rust bot. |

User-facing chat uses priority. Bulk/background work should use `pkg/xai` deferred completions or the Batch API instead.

Claim a Telegram Privy wallet at `/claim` (Solana-only wallet list: Phantom, Solflare, Backpack).

## API

- `GET /` — control deck
- `GET /claim` — Telegram / Privy wallet claim (Solana-only connectors)
- `GET /health` — model, tier, pump sidecar flag (never the API key)
- `POST /api/chat` — SSE: `text` / `final` / `error` / `done`
- `POST /api/compact` — `{ items: [...] }`
- `GET /api/pump` — sidecar health
- `POST /api/analyze` — `{ mint, ticker?, is_buy? }`
