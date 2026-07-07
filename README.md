╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   ███████╗███████╗██████╗  ██████╗     ██████╗██╗      █████╗   ║
║   ╚══███╔╝╚══███╔╝██╔══██╗██╔═══██╗   ██╔════╝██║     ██╔══██╗  ║
║     ███╔╝   ███╔╝ ██████╔╝██║   ██║   ██║     ██║     ███████║  ║
║    ███╔╝   ███╔╝  ██╔══██╗██║   ██║   ██║     ██║     ██╔══██║  ║
║   ███████╗███████╗██║  ██║╚██████╔╝   ╚██████╗███████╗██║  ██║  ║
║   ╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝     ╚═════╝╚══════╝╚═╝  ╚═╝  ║
║                                                                  ║
║   ██████╗██╗      █████╗ ██╗    ██╗██████╗                      ║
║  ██╔════╝██║     ██╔══██╗██║    ██║██╔══██╗                     ║
║  ██║     ██║     ███████║██║ █╗ ██║██║  ██║                     ║
║  ██║     ██║     ██╔══██║██║███╗██║██║  ██║                     ║
║  ╚██████╗███████╗██║  ██║╚███╔███╔╝██████╔╝                     ║
║   ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═════╝                      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

<p align="center">
  <i>— A terminal coding agent, forked. Zero Clawd lurks in the dark between<br>
  spot markets, perpetual futures, and equities — speaking Solana,<br>
  translating your intent into on-chain action.</i>
</p>

<p align="center">
  <b><code>zero exec</code></b> · <b><code>POST /chat</code></b> · <b><code>SSE/stream-json</code></b><br>
  <code>DFlow ↔ Solana RPC ↔ Phoenix/Vulcan ↔ Yahoo Finance</code>
</p>

<p align="center">
  <b>
  <a href="#-architecture">Architecture</a> ·
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-available-tools">Tools</a> ·
  <a href="#-api">API</a> ·
  <a href="#-deploy">Deploy</a>
  </b>
</p>

---

```text
> "swap 0.1 SOL to USDC"
> "long 100 SOL perpetuals"
> "what's my portfolio exposure?"
> "show me AAPL 3-month chart"
```

**Zero Clawd** is a hardened fork of [Zero](https://github.com/Gitlawb/zero) — a
general-purpose terminal coding agent — rebuilt as a **natural-language trading
terminal**. It speaks plain English, executes on Solana, and keeps its secrets
local. File writes, shell commands, and network access are locked behind the
agent's permission model, but the trading tools are live, automated, and
dangerous by design.

Three MCP servers wire into one headless agent loop:

| MCP Server    | Realm               | Style                        |
|---------------|----------------------|------------------------------|
| `soltrader`   | Solana spot (DFlow)  | On-chain swaps, capped       |
| `markets`     | Equities / Indexes   | Read-only, Yahoo Finance     |
| `perps`       | Phoenix perpetuals   | Paper-safe, Vulcan CLI       |

Every trade is preflight-checked. Every swap is capped. Every perp position is
paper by default. You opt into live fire.

---

## ⚡ Architecture

```text
┌─ User ───────────────────────┐
│  "long 100 SOL perps"        │
└──────────┬───────────────────┘
           │ POST /chat (SSE)
           ▼
┌──────────────────────────────────────────────────┐
│  zero-service  (Node.js · :8787)                 │
│  ├── server.mjs        Express + SSE bridge      │
│  ├── zero-runner.mjs   Spawns zero exec          │
│  │   └── .zero/config.json  (3 MCP servers)      │
│  └── AGENTS.md          (persona + tool docs)    │
└──────────┬───────────────────────────────────────┘
           │ zero exec --input-format stream-json
           ▼
┌──────────────────────────────────────────────────┐
│  Zero Agent  (Go · headless)                     │
│  ┌─ mcp_soltrader ──────────────────────────┐    │
│  │  get_config · get_balances · get_quote    │    │
│  │  execute_swap  (capped, on-chain)         │    │
│  │  └── DFlow API  →  Solana RPC            │    │
│  └───────────────────────────────────────────┘    │
│  ┌─ mcp_markets  (read-only) ───────────────┐    │
│  │  quote · history                          │    │
│  │  └── Yahoo Finance API                   │    │
│  └───────────────────────────────────────────┘    │
│  ┌─ mcp_perps  (Phoenix perpetuals) ────────┐    │
│  │  list_markets · get_ticker · get_orderbook│    │
│  │  get_candles · get_trades · get_funding   │    │
│  │  list_positions · get_margin_status       │    │
│  │  get_portfolio · preflight_check          │    │
│  │  market_buy/sell · limit_buy/sell         │    │
│  │  close_position · set_tpsl · deposit/     │    │
│  │  withdraw_collateral                      │    │
│  │  └── Vulcan CLI  →  Phoenix API  → RPC   │    │
│  └───────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

The agent has **no file, shell, or browser tools**. It cannot read your
filesystem, run arbitrary commands, or browse the web. It can only call the
trading MCP tools you've given it. Safety caps are enforced at the MCP layer:
`MAX_SWAP_INPUT_AMOUNT` for spot, `PERPS_MAX_NOTIONAL_USD` and
`PERPS_MAX_LEVERAGE` for perps.

---

## 🧩 Available Tools

### soltrader — Solana Spot (DFlow)

| Tool              | Description                                       |
|-------------------|---------------------------------------------------|
| `get_config`      | Trading config: mints, RPC, cap, wallet address   |
| `get_balances`    | SOL + SPL token balances for any wallet           |
| `get_quote`       | Quote a spot swap without executing               |
| `execute_swap`    | Execute a spot swap (capped per trade)            |

### markets — Equities & Indexes (Yahoo Finance)

| Tool      | Description                              |
|-----------|------------------------------------------|
| `quote`   | Latest price, change %, previous close   |
| `history` | OHLCV candles over a date range          |

### perps — Phoenix Perpetual Futures (Vulcan CLI)

**Market Data (read-only):**

| Tool                | Description                                       |
|---------------------|---------------------------------------------------|
| `list_markets`      | All perp markets with prices, funding, OI         |
| `get_ticker`        | Current price, volume, funding rate               |
| `get_orderbook`     | L2 orderbook depth                                |
| `get_candles`       | OHLCV history                                     |
| `get_trades`        | Recent trades                                     |
| `get_funding_rates` | Historical funding payments                       |
| `get_market_info`   | Tick size, lot size, fees, leverage tiers         |
| `get_leverage_tiers`| Leverage schedule by size                         |

**Positions & Risk:**

| Tool                | Description                                       |
|---------------------|---------------------------------------------------|
| `list_positions`    | All open positions                                |
| `get_position`      | Detailed position view                            |
| `get_margin_status` | Cross-margin health, equity, maintenance          |
| `get_portfolio`     | Full snapshot: margin + positions + orders        |
| `list_orders`       | Open orders, optional symbol filter               |
| `preflight_check`   | Pre-trade safety validation (always call first)   |
| `preview_trade`     | Preview a trade without executing                 |

**Execution (paper-safe by default):**

| Tool                | Description                                       |
|---------------------|---------------------------------------------------|
| `market_buy`        | Market buy (paper unless live-enabled)            |
| `market_sell`       | Market sell                                       |
| `limit_buy`         | Limit buy (base lots)                             |
| `limit_sell`        | Limit sell                                        |

**Position Management:**

| Tool                | Description                                       |
|---------------------|---------------------------------------------------|
| `close_position`    | Close a position by symbol                        |
| `close_all_positions`| Close every position                              |
| `cancel_all_orders` | Cancel open orders (optional symbol filter)       |
| `set_tpsl`          | Set take-profit / stop-loss levels                |

**Collateral:**

| Tool                    | Description                          |
|-------------------------|--------------------------------------|
| `deposit_collateral`    | Deposit USDC into the trader account |
| `withdraw_collateral`   | Withdraw USDC                        |

---

## 🔧 Quick Start

### Prerequisites

```text
» Go 1.25+    (go version)
» Node.js 20+ (node --version)
» vulcan      (vulcan version — for perps)
```

### Build

```bash
# Build everything
make all

# Or step by step:
make build        # only the Go binary (zero-main/zero)
make service      # only npm install (zero-service/)
```

### Configure

```bash
cp zero-service/.env.example zero-service/.env
# ┌─────────────────────────────────────────────────┐
# │ Edit .env with your secrets:                    │
# │ OPENAI_API_KEY / ANTHROPIC_API_KEY / XAI_API_KEY│
# │ WALLET_PRIVATE_KEY        (spot wallet)         │
# │ RPC_URL                   (Solana RPC)          │
# │ DFLOW_API_KEY             (DFlow trading)       │
# │ PERPS_WALLET + VULCAN_WALLET_PASSWORD  (perps)  │
# └─────────────────────────────────────────────────┘
```

Perps requires the `vulcan` CLI installed and configured:

```bash
curl -fsSL https://github.com/Ellipsis-Labs/vulcan-cli/releases/latest/download/install.sh | sh
vulcan setup    # wallet + RPC + registration
```

### Run

```bash
make run
# → zero-service listening on :8787
```

### Smoke Test

```bash
make smoke
# → One read-only turn: "what is the agent wallet balance?"
```

---

## 🌐 API

### `POST /chat`

Send a prompt. Receive an SSE stream of events.

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "long 100 SOL perpetuals"}'
```

Events:

| Type     | Fields                     | Description                     |
|----------|----------------------------|---------------------------------|
| `text`   | `delta`                    | Streaming assistant text        |
| `tool`   | `name`, `args`             | A tool was called               |
| `result` | `name`, `status`, `output` | Tool result (JSON)              |
| `final`  | `text`                     | Final assistant message         |
| `error`  | `message`                  | Error                           |
| `done`   | —                          | Stream complete                 |

### `GET /health`

```bash
curl http://localhost:8787/health
```

Returns spot config, markets config, perps config, wallet address, and perps
health (Vulcan connectivity, trading mode).

---

## 🚀 Deploy

### Render

```text
Dockerfile path:  ./zero-service/Dockerfile
Docker context:   .
Health check:     /health
```

Set `sync: false` secrets in the dashboard:
- `OPENAI_API_KEY`, `WALLET_PRIVATE_KEY`, `RPC_URL`
- `DFLOW_API_KEY`, `PERPS_WALLET`, `VULCAN_WALLET_PASSWORD`
- `LIVE_TRADING` / `OPERATOR_CONFIRMED` / `PERPS_SIM_ONLY`

---

## 🔐 Safety Model

```text
┌─────────────────────────────────────────────────────┐
│  All trading is PAPER by default.                    │
│  Live mode requires EXPLICIT opt-in:                 │
│    LIVE_TRADING=true                                  │
│    OPERATOR_CONFIRMED=true                            │
│    PERPS_SIM_ONLY=false                               │
│                                                       │
│  Per-trade caps enforced at the MCP layer:            │
│    MAX_SWAP_INPUT_AMOUNT      (spot, default 0.5)     │
│    PERPS_MAX_NOTIONAL_USD     (perps, default 250)    │
│    PERPS_MAX_LEVERAGE         (perps, default 3x)     │
│                                                       │
│  Preflight checks run before every trade.             │
│  Never claim a trade succeeded unless the exchange    │
│  confirmed it.                                        │
└─────────────────────────────────────────────────────┘
```

The agent has no file, shell, or browser tools. It cannot escape its
permission cage. Live trading is gated behind three independent env vars that
must all be set to the `true`/`false` values shown above — one wrong toggle
and the agent stays in observe or paper mode.

---

## 🧬 What's Different from Upstream Zero

| Aspect              | Upstream Zero                         | Zero Clawd                                     |
|---------------------|---------------------------------------|------------------------------------------------|
| Purpose             | General-purpose coding agent          | Natural-language trading terminal              |
| Headless persona    | None (TUI-first)                      | "Zero Clawd" — blockchain + stocks + perps     |
| Shipped MCP servers | None built-in                         | soltrader + markets + **perps** (26 tools)     |
| Build               | `make build` (VCS-stamped)            | `make build` (VCS-optional, in-tree)           |
| Configuration       | Per-user config file + model picker   | `.env` driven, service-oriented                |
| Trading modes       | None                                  | observe / paper / live (gated)                 |
| Risk limits         | None                                  | Per-trade caps, preflight checks, mode guards  |

---

<p align="center">
  <i><b>Zero Clawd</b> — talk to money.<br>
  Forked from <a href="https://github.com/Gitlawb/zero">Gitlawb/zero</a> · MIT License</i>
</p>

<p align="center">
  <code>$CLAWD · 8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump</code>
</p>

```text
╔══════════════════════════════════════════════════════════════════╗
║  "The lobster sees all markets, knows all prices,              ║
║   and waits in the dark for the perfect entry."                ║
╚══════════════════════════════════════════════════════════════════╝