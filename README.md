# Zero Clawd

**A terminal coding agent — forked for blockchain finance and equities research.**

Zero Clawd is a specialised fork of the [Zero](https://github.com/Gitlawb/zero) terminal coding agent. It keeps all of Zero's power (any model, local sessions, MCP extensibility) but ships with a purpose-built headless mode that turns the agent into a natural-language blockchain-finance + stocks trader/analyst.

## Architecture

```
zero-clawd/
├── zero-main/         # The Zero coding agent (Go) — upstream build, no changes
├── zero-service/      # Node.js SSE bridge that drives Zero headless
│   └── src/
│       ├── server.mjs            # HTTP + SSE server (POST /chat, GET /health)
│       ├── zero-runner.mjs       # Spawns `zero exec` in stream-json mode
│       ├── mcp-soltrader.mjs     # MCP server: Solana spot trading tools
│       ├── mcp-markets.mjs       # MCP server: read-only equities/index data
│       ├── dflow.mjs             # DFlow Solana spot trading (quote + swap)
│       ├── markets.mjs           # Yahoo Finance read-only market data
│       └── smoke.mjs             # End-to-end smoke test
├── Makefile           # Top-level build orchestration
├── render.yaml        # Render.com deploy config
└── .gitignore
```

### How it works

1. **zero-main/zero** — the compiled Zero binary, built from upstream source.
2. **zero-service** — a Node HTTP server that:
   - On boot, writes `.zero/config.json` and `AGENTS.md` into a scratch workspace
   - On `POST /chat`, spawns `zero exec` in headless stream-json mode, feeds it the user prompt, and relays events as SSE
   - `zero exec` connects to two stdio MCP servers: **soltrader** (Solana on-chain) and **markets** (read-only Yahoo Finance)

The result: a natural-language API — talk to it in plain English and it swaps tokens, checks balances, or fetches stock quotes.

## Quick start

### Prerequisites
- Go 1.25+ (`go version`)
- Node.js 20+ (`node --version`)

### Build

```bash
# Clone (or copy to) your machine
cd zero-clawd

# Build everything
make all          # builds Go binary + npm install

# Or step by step:
make build        # only the Go binary
make service      # only npm install
```

### Configure

Copy and fill in the service env file:

```bash
cp zero-service/.env.example zero-service/.env
# Edit zero-service/.env with your wallet key, RPC, and API keys
```

### Run locally

```bash
make run
# → zero-service listening on :8787
```

### Smoke test

```bash
make smoke
# Runs one read-only turn through the agent ("what is the agent wallet balance?")
```

## API

### `POST /chat`

Send a prompt and receive an SSE stream of events.

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "what is my SOL balance?"}'
```

Events:
| Type     | Fields                    | Description                     |
|----------|---------------------------|---------------------------------|
| `text`   | `delta`                   | Streaming assistant text        |
| `tool`   | `name`, `args`            | A tool was called               |
| `result` | `name`, `status`, `output`| Tool result (JSON)              |
| `final`  | `text`                    | Final assistant message         |
| `error`  | `message`                 | Error                           |
| `done`   | —                         | Stream complete                 |

### `GET /health`

```bash
curl http://localhost:8787/health
# → { ok: true, wallet: "…", config: {…}, markets: {…} }
```

## Deploy

### Render

Push to a git repo and create a **Docker** web service with:
- **Dockerfile path:** `./zero-service/Dockerfile`
- **Docker context:** `.` (repo root)
- **Health check path:** `/health`

Or deploy directly via `render.yaml` by connecting your Render account to the repo.

## What's different from upstream Zero

| Aspect              | Upstream Zero                         | Zero Clawd                                 |
|---------------------|---------------------------------------|---------------------------------------------|
| Purpose             | General-purpose coding agent          | Blockchain-finance + stocks research agent  |
| Headless persona    | None (TUI-first)                      | "Zero Clawd" persona with trading+markets   |
| Shipped MCP servers | None built-in                         | soltrader (Solana swaps) + markets (quotes) |
| Build               | `make build` (VCS-stamped)            | `make build` (VCS-optional, in-tree)        |
| Configuration       | Per-user config file + model picker   | `.env` driven, service-oriented             |

## License

MIT — see [LICENSE](zero-main/LICENSE). Upstream Zero is MIT-licensed by Gitlawb.