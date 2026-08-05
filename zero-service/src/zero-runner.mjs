/**
 * Spawns `zero exec` in headless stream-json mode, feeds it one user turn, and
 * parses the JSONL output events, invoking onEvent for each.
 *
 * Protocol: docs/STREAM_JSON_PROTOCOL.md (schemaVersion 2).
 */
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildWorkspaceMCPConfig,
  ROBINHOOD_AGENTIC_NOTE,
} from "./mcp-seed.mjs";

const ZERO_BIN = process.env.ZERO_BIN ?? "zero";
const ZERO_MODEL = process.env.ZERO_MODEL ?? "gpt-4.1";
const ZERO_MAX_TURNS = process.env.ZERO_MAX_TURNS ?? "12";
const WORKSPACE = process.env.ZERO_WORKSPACE ?? "/tmp/zero-clawd-workspace";

// Tools the Zero Clawd agent may call. No file/shell/browser tools.
// soltrader = Solana spot trading via DFlow; markets = read-only equities/index data;
// perps = Phoenix perpetuals via Vulcan CLI (paper-safe, read-only market data + trading).
const ENABLED_TOOLS = [
  // soltrader (spot)
  "mcp_soltrader_get_config",
  "mcp_soltrader_get_balances",
  "mcp_soltrader_get_quote",
  "mcp_soltrader_execute_swap",
  // markets (equities)
  "mcp_markets_quote",
  "mcp_markets_history",
  // perps (Phoenix perpetuals)
  "mcp_perps_list_markets",
  "mcp_perps_get_ticker",
  "mcp_perps_get_orderbook",
  "mcp_perps_get_candles",
  "mcp_perps_get_trades",
  "mcp_perps_get_funding_rates",
  "mcp_perps_get_market_info",
  "mcp_perps_get_leverage_tiers",
  "mcp_perps_list_positions",
  "mcp_perps_get_position",
  "mcp_perps_get_margin_status",
  "mcp_perps_get_portfolio",
  "mcp_perps_list_orders",
  "mcp_perps_preflight_check",
  "mcp_perps_preview_trade",
  "mcp_perps_market_buy",
  "mcp_perps_market_sell",
  "mcp_perps_limit_buy",
  "mcp_perps_limit_sell",
  "mcp_perps_close_position",
  "mcp_perps_close_all_positions",
  "mcp_perps_cancel_all_orders",
  "mcp_perps_set_tpsl",
  "mcp_perps_deposit_collateral",
  "mcp_perps_withdraw_collateral",
  "mcp_perps_health",
  // risk (position sizing + portfolio guard, ported from clawdbot)
  "mcp_risk_assess_token_risk",
  "mcp_risk_size_position",
  "mcp_risk_check_portfolio_guard",
].join(",");

const AGENTS_MD = `# Zero Clawd — Blockchain-Finance + Stocks + Perps Agent

You are Zero Clawd, a natural-language agent specialised in blockchain finance
(Solana spot trading, wallets, balances), equities research (real-time quotes,
historical charts for stocks, ETFs, indices, and crypto pairs via Yahoo Finance),
and Phoenix perpetual futures (market data, positions, margin, paper trading).

The user talks to you in plain language:
  "swap 0.1 SOL to USDC"
  "what's my balance"
  "price of USDC in SOL"
  "show me AAPL quote"
  "SPY 3-month chart"
  "what's BTC-USD doing today"
  "how is my portfolio looking"
  "show me SOL perps price"
  "list my perps positions"
  "long 100 SOL perps"
  "what's my perps margin status"

## Available tools

### soltrader tools (Solana spot on-chain):
- get_config       — trading configuration (mints, RPC, cap, wallet address)
- get_balances     — SOL + SPL token balances (any wallet or agent wallet)
- get_quote        — quote a Solana spot swap without executing
- execute_swap     — execute a Solana spot swap (capped at MAX_SWAP_INPUT_AMOUNT)

### markets tools (read-only equities/index/crypto quotes):
- markets_quote    — latest price, change %, previous close for a ticker
- markets_history  — OHLCV candle history over a date range

### perps tools (Phoenix perpetuals via Vulcan CLI):
Read-only market data:
- list_markets     — all available perpetual markets with prices, funding, OI
- get_ticker       — current price, volume, funding rate for a symbol
- get_orderbook    — L2 orderbook for a symbol
- get_candles      — OHLCV candle history
- get_trades       — recent trades
- get_funding_rates — historical funding rates
- get_market_info  — detailed market config (tick size, lot size, fees, leverage tiers)
- get_leverage_tiers — leverage tier schedule

Positions & portfolio:
- list_positions   — all open positions
- get_position     — detailed view of one position
- get_margin_status — cross-margin health, equity, maintenance margin
- get_portfolio    — full snapshot (margin + positions + orders)
- list_orders      — open orders, optionally by symbol
- preflight_check  — check if a trade passes safety limits without executing
- preview_trade    — preview what a trade would look like

Trading (paper-safe by default):
- market_buy       — place a market buy (paper unless configured for live)
- market_sell      — place a market sell (paper unless configured for live)
- limit_buy        — place a limit buy
- limit_sell       — place a limit sell

Position management:
- close_position   — close a position
- close_all_positions — close all positions
- cancel_all_orders — cancel open orders
- set_tpsl         — set take-profit / stop-loss

Collateral:
- deposit_collateral   — deposit USDC
- withdraw_collateral  — withdraw USDC

### risk tools (position sizing + portfolio guard, pure calculators):
- assess_token_risk    — score a token 0-100 from liquidity/volume/volatility/holders
- size_position        — risk-based position size so a stop-out loses a fixed % of equity
- check_portfolio_guard — account-level gate: max positions, exposure caps, drawdown breaker

## Core rules

- You have NO file, shell, or browser tools. You cannot edit code, run commands, or browse.
- For spot swaps: always call get_quote first, state the expected output/price/impact in one
  short sentence, then execute_swap on confirmation. Report the Solscan link after every swap.
- For equities: use markets_quote for live prices and markets_history for charts.
  Prices are read-only — you cannot trade stocks through Zero Clawd.
- For perps: use preflight_check before any trade. Show the user the expected outcome
  and mode (paper/live) before executing. All perps trading is PAPER by default.
- When the user hasn't given an explicit size, call size_position (and
  check_portfolio_guard if you know current exposure) before executing a trade,
  and briefly state the sizing rationale.
- If a request is ambiguous (missing amount, token, or ticker), state your best
  assumption briefly and proceed; do not stall.
- Keep replies concise. No code blocks unless showing a signature/link.
- Never claim a trade succeeded unless the exchange confirmed it.

${ROBINHOOD_AGENTIC_NOTE}
`;

/** Write the per-workspace config that registers the MCP servers the agent can call. */
export function ensureWorkspace() {
  mkdirSync(join(WORKSPACE, ".zero"), { recursive: true });
  const soltraderPath = new URL("./mcp-soltrader.mjs", import.meta.url).pathname;
  // Markets is a separate light MCP so we keep the soltrader server unchanged.
  const marketsPath = new URL("./mcp-markets.mjs", import.meta.url).pathname;
  const perpsPath = new URL("./mcp-perps.mjs", import.meta.url).pathname;
  const riskPath = new URL("./mcp-risk.mjs", import.meta.url).pathname;
  const config = buildWorkspaceMCPConfig({
    soltraderPath,
    marketsPath,
    perpsPath,
    riskPath,
    nodePath: process.execPath,
    soltraderEnv: passthroughEnv(),
    perpsEnv: passthroughPerpsEnv(),
  });
  writeFileSync(join(WORKSPACE, ".zero", "config.json"), JSON.stringify(config, null, 2));
  writeFileSync(join(WORKSPACE, "AGENTS.md"), AGENTS_MD);
  return WORKSPACE;
}

/** Env vars the MCP subprocess needs (wallet + DFlow + RPC). */
function passthroughEnv() {
  const keys = [
    "WALLET_PRIVATE_KEY",
    "AGENT_WALLET_PRIVATE_KEY",
    "RPC_URL",
    "SOLANA_RPC_URL",
    "DFLOW_TRADE_API_URL",
    "DFLOW_API_KEY",
    "DFLOW_SETTLEMENT_MINT",
    "DFLOW_PUBLIC_SPOT_SOL_FEE_ACCOUNT",
    "DFLOW_SPONSOR",
    "DFLOW_PRIORITY_FEE",
    "MAX_SWAP_INPUT_AMOUNT",
  ];
  const env = {};
  for (const k of keys) if (process.env[k] != null) env[k] = process.env[k];
  return env;
}

/** Env vars the perps MCP subprocess needs (RPC + Vulcan config + risk limits). */
function passthroughPerpsEnv() {
  const keys = [
    "RPC_URL",
    "SOLANA_RPC_URL",
    "PERPS_API_URL",
    "VULCAN_BIN",
    "PERPS_WALLET",
    "VULCAN_WALLET_NAME",
    "VULCAN_WALLET_PASSWORD",
    "PERPS_ALLOWED_SYMBOLS",
    "PERPS_MAX_NOTIONAL_USD",
    "PERPS_MAX_LEVERAGE",
    "PERPS_MAX_SPREAD_BPS",
    "LIVE_TRADING",
    "OPERATOR_CONFIRMED",
    "PERPS_SIM_ONLY",
  ];
  const env = {};
  for (const k of keys) if (process.env[k] != null) env[k] = process.env[k];
  return env;
}

/**
 * Run one turn. `onEvent(evt)` receives every parsed stream-json event.
 * Returns a promise resolving to { exitCode, final } when the run ends.
 */
export function runTurn(prompt, onEvent, { signal } = {}) {
  const workspace = ensureWorkspace();
  const args = [
    "exec",
    "--input-format", "stream-json",
    "--output-format", "stream-json",
    "--auto", "high",
    "--cwd", workspace,
    "--model", ZERO_MODEL,
    "--max-turns", ZERO_MAX_TURNS,
    "--enabled-tools", ENABLED_TOOLS,
    "--no-notify",
  ];

  const child = spawn(ZERO_BIN, args, {
    cwd: workspace,
    env: process.env,
    stdio: ["pipe", "pipe", "pipe"],
  });

  if (signal) {
    signal.addEventListener("abort", () => child.kill("SIGTERM"), { once: true });
  }

  // Feed the single user turn, then EOF.
  const input =
    JSON.stringify({ schemaVersion: 2, type: "message", role: "user", content: prompt }) + "\n";
  child.stdin.write(input);
  child.stdin.end();

  let final = "";
  const rl = createInterface({ input: child.stdout });
  rl.on("line", (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let evt;
    try {
      evt = JSON.parse(trimmed);
    } catch {
      return; // ignore non-JSON noise
    }
    if (evt.type === "final" && typeof evt.text === "string") final = evt.text;
    try {
      onEvent(evt);
    } catch {
      /* consumer error shouldn't kill the stream */
    }
  });

  let stderr = "";
  child.stderr.on("data", (d) => {
    stderr += d.toString();
  });

  return new Promise((resolve) => {
    child.on("close", (code) => {
      if (code !== 0 && stderr) {
        onEvent({ type: "error", code: "process_error", message: stderr.slice(-800) });
      }
      resolve({ exitCode: code ?? 0, final });
    });
    child.on("error", (err) => {
      onEvent({ type: "error", code: "spawn_error", message: err.message });
      resolve({ exitCode: 1, final });
    });
  });
}
