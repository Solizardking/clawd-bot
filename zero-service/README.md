# SOL GPT — zero-service

Backend that powers the **SOL GPT** page in ClawdBrowser. With `XAI_API_KEY`
set it drives **grok-4.6** through the xAI Responses API (OpenAI SDK,
`baseURL: https://api.x.ai/v1`), streaming text and calling the same Solana
spot / markets / perps / risk tools in-process. Without that key it falls back
to the [Zero](../zero-main) coding agent **headless** (`zero exec --output-format stream-json`)
over stdio MCP. A user types "swap 0.1 SOL to USDC" in the web UI; the model
plans, calls the trading tools, and streams the result back.

```
Browser (/sol-gpt)
  → Next.js proxy  /api/sol-gpt        (adds bearer token, streams SSE)
    → zero-service  POST /chat         (this service)
      → grok-4.6  (xAI Responses API)  when XAI_API_KEY is set
        → grok-tools (in-process)      (get_quote / execute_swap / get_balances / …)
          → DFlow /order + Solana RPC  (real on-chain swaps)
      → zero exec  (stream-json)       fallback without XAI_API_KEY
        → mcp_soltrader_*  (stdio MCP)
```

## Pieces

| File | Role |
|------|------|
| `src/server.mjs`        | Express + SSE. `POST /chat`, `POST /ask`, `POST /compact`, Imagine routes, `GET /health`. |
| `src/xai-client.mjs`    | OpenAI SDK client for `https://api.x.ai/v1` (Responses, priority tier, compaction, streaming). |
| `src/grok-builtins.mjs` | Server-side tools: web_search, x_search, code_interpreter, image_generation, optional MCP. |
| `src/grok-runner.mjs`   | Streaming grok-4.6 loop: function tools + server tools + compaction. |
| `src/grok-tools.mjs`    | Responses API function defs wrapping dflow / markets / perps / risk / Imagine video. |
| `src/imagine.mjs`       | Grok Imagine images + async video (`/images/*`, `/videos/*`). |
| `src/zero-runner.mjs`   | Spawns `zero exec`, feeds one turn, parses stream-json, writes the workspace `.zero/config.json` + `AGENTS.md`. |
| `src/mcp-soltrader.mjs` | stdio MCP server. Tools register in Zero as `mcp_soltrader_*`. |
| `src/mcp-markets.mjs`   | stdio MCP server for equities/index/crypto market data. Tools register as `mcp_markets_*`. |
| `src/mcp-perps.mjs`     | stdio MCP server for Phoenix perpetuals. Tools register as `mcp_perps_*`. |
| `src/mcp-risk.mjs`      | stdio MCP server for risk-guard calculators. Tools register as `mcp_risk_*`. |
| `src/dflow.mjs`         | DFlow quote/swap + balances (ported from the app's `src/lib/dflow/trader.ts`). |
| `src/telegram-bot.mjs`  | Telegram long-poll bot (Privy bot-first + DFlow `/order` + Solana policy). |
| `src/perps.mjs`         | Phoenix perpetuals via Vulcan CLI — market data, orders, positions, margin, portfolio. |
| `src/markets.mjs`       | Read-only equities/index/crypto market data from Yahoo Finance. |
| `src/risk.mjs`          | Token risk scoring, risk-adjusted position sizing, portfolio exposure guard — ported from the clawdbot Go trading engine (`pkg/trading`, `pkg/strategy`). Pure functions, no network/wallet access. |
| `src/smoke.mjs`         | End-to-end local test (read-only by default). |

The grok-4.6 path mixes **client-side** trading tools (`grok-tools.mjs`) with
**xAI server tools**: `web_search`, `x_search` (image + video understanding),
`code_interpreter`, and conversational `image_generation`. Video is a client
function (`generate_video` / `get_video`) because Imagine video is not a
Responses built-in. User-facing chat sends `service_tier: "priority"`. Long
`store: false` loops compact via `POST /v1/responses/compact`. Safety is still
enforced in the trading tools via `MAX_SWAP_INPUT_AMOUNT` (spot) and
`PERPS_MAX_NOTIONAL_USD` (perps).

## Run locally

```bash
# 1. Build the Zero binary
cd ../zero-main && make build && cd ../zero-service

# 2. Install deps + configure
npm install
cp .env.example .env   # fill in XAI_API_KEY (grok-4.6), WALLET_PRIVATE_KEY, RPC_URL, DFLOW_*

# 3. Smoke test (read-only — no trade)
ZERO_BIN=../zero-main/zero node src/smoke.mjs "what's the agent wallet balance?"

# 4. Start the service (Telegram long-polls when TELEGRAM_BOT_TOKEN is set)
ZERO_BIN=../zero-main/zero npm start        # :8787

# Telegram only (same env):
npm run telegram
```

Point the Next.js app at it with `ZERO_SERVICE_URL=http://localhost:8787`
(and matching `ZERO_SERVICE_TOKEN` if you set one).

## Deploy

`../render.yaml` defines a `clawd-zero-service` Docker service. The
[`Dockerfile`](./Dockerfile) compiles the Go binary and runs the Node bridge in
one image (build context = repo root). Set the `sync: false` secrets in the
Render dashboard.

## Protocol

Stream-JSON schema v2 — see [`../zero-main/docs/STREAM_JSON_PROTOCOL.md`](../zero-main/docs/STREAM_JSON_PROTOCOL.md).
`/chat` events: `text`, `tool`, `result`, `image`, `server_tool`, `citations`,
`service_tier`, `compact`, `final`, `error`, `done`.

PumpFun and the command deck talk to this service:

```
clawdbot-frontend/grok-deck.html  →  POST /chat (SSE)
clawdbot-pumpfun (GROK_TRADE_CARDS) → POST /imagine/images + Telegram sendPhoto
```
