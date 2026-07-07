# SOL GPT — zero-service

Backend that powers the **SOL GPT** page in ClawdBrowser. It runs the
[Zero](../zero-main) coding agent **headless** (`zero exec --output-format stream-json`)
and gives it a locked-down set of Solana **spot-trading** tools via a stdio MCP
server. A user types "swap 0.1 SOL to USDC" in the web UI; Zero plans, calls the
trading tools, and streams the result back.

```
Browser (/sol-gpt)
  → Next.js proxy  /api/sol-gpt        (adds bearer token, streams SSE)
    → zero-service  POST /chat         (this service)
      → zero exec  (stream-json)       (the agent loop)
        → mcp_soltrader_*  (stdio MCP) (get_quote / execute_swap / get_balances)
          → DFlow /order + Solana RPC  (real on-chain swaps)
```

## Pieces

| File | Role |
|------|------|
| `src/server.mjs`        | Express + SSE bridge. `POST /chat`, `GET /health`. |
| `src/zero-runner.mjs`   | Spawns `zero exec`, feeds one turn, parses stream-json, writes the workspace `.zero/config.json` + `AGENTS.md`. |
| `src/mcp-soltrader.mjs` | stdio MCP server. Tools register in Zero as `mcp_soltrader_*`. |
| `src/dflow.mjs`         | DFlow quote/swap + balances (ported from the app's `src/lib/dflow/trader.ts`). |
| `src/smoke.mjs`         | End-to-end local test (read-only by default). |

The agent is scoped to trading only: `--enabled-tools` allows just the four
`mcp_soltrader_*` tools, so it has **no file, shell, or browser access**.
`--auto high` auto-approves those tool calls (headless exec can't prompt), and
safety is enforced in the tool itself via `MAX_SWAP_INPUT_AMOUNT`.

## Run locally

```bash
# 1. Build the Zero binary
cd ../zero-main && make build && cd ../zero-service

# 2. Install deps + configure
npm install
cp .env.example .env   # fill in OPENAI_API_KEY, WALLET_PRIVATE_KEY, RPC_URL, DFLOW_*

# 3. Smoke test (read-only — no trade)
ZERO_BIN=../zero-main/zero node src/smoke.mjs "what's the agent wallet balance?"

# 4. Start the service
ZERO_BIN=../zero-main/zero npm start        # :8787
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
`/chat` normalizes those events to: `text`, `tool`, `result`, `final`, `error`, `done`.
