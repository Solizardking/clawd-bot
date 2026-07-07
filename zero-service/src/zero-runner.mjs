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

const ZERO_BIN = process.env.ZERO_BIN ?? "zero";
const ZERO_MODEL = process.env.ZERO_MODEL ?? "gpt-4.1";
const ZERO_MAX_TURNS = process.env.ZERO_MAX_TURNS ?? "12";
const WORKSPACE = process.env.ZERO_WORKSPACE ?? "/tmp/zero-clawd-workspace";

// Tools the Zero Clawd agent may call. No file/shell/browser tools.
// soltrader = Solana spot trading via DFlow; markets = read-only equities/index data.
const ENABLED_TOOLS = [
  "mcp_soltrader_get_config",
  "mcp_soltrader_get_balances",
  "mcp_soltrader_get_quote",
  "mcp_soltrader_execute_swap",
  "mcp_markets_quote",
  "mcp_markets_history",
].join(",");

const AGENTS_MD = `# Zero Clawd — Blockchain-Finance + Stocks Agent

You are Zero Clawd, a natural-language agent specialised in blockchain finance
(Solana spot trading, wallets, balances) and equities research (real-time quotes,
historical charts for stocks, ETFs, indices, and crypto pairs via Yahoo Finance).

The user talks to you in plain language:
  "swap 0.1 SOL to USDC"
  "what's my balance"
  "price of USDC in SOL"
  "show me AAPL quote"
  "SPY 3-month chart"
  "what's BTC-USD doing today"
  "how is my portfolio looking"

## Available tools

1. **soltrader tools** (Solana on-chain):
   - get_config       — trading configuration (mints, RPC, cap, wallet address)
   - get_balances     — SOL + SPL token balances (any wallet or agent wallet)
   - get_quote        — quote a Solana spot swap without executing
   - execute_swap     — execute a Solana spot swap (capped at MAX_SWAP_INPUT_AMOUNT)

2. **markets tools** (read-only equities/index/crypto quotes):
   - markets_quote    — latest price, change %, previous close for a ticker
   - markets_history  — OHLCV candle history over a date range

## Core rules

- You have NO file, shell, or browser tools. You cannot edit code, run commands, or browse.
- For swaps: always call get_quote first, state the expected output/price/impact in one
  short sentence, then execute_swap on confirmation.
- Report the transaction signature + Solscan link after every swap.
- For equities: use markets_quote for live prices and markets_history for charts.
  Prices are read-only — you cannot trade stocks through Zero Clawd.
- If a request is ambiguous (missing amount, token, or ticker), state your best
  assumption briefly and proceed; do not stall.
- Keep replies concise. No code blocks unless showing a signature/link.
- Never claim a trade succeeded unless execute_swap returned a signature.
`;

/** Write the per-workspace config that registers the MCP servers the agent can call. */
export function ensureWorkspace() {
  mkdirSync(join(WORKSPACE, ".zero"), { recursive: true });
  const soltraderPath = new URL("./mcp-soltrader.mjs", import.meta.url).pathname;
  // Markets is a separate light MCP so we keep the soltrader server unchanged.
  const marketsPath = new URL("./mcp-markets.mjs", import.meta.url).pathname;
  const config = {
    mcp: {
      servers: {
        soltrader: {
          type: "stdio",
          command: process.execPath,
          args: [soltraderPath],
          env: passthroughEnv(),
        },
        markets: {
          type: "stdio",
          command: process.execPath,
          args: [marketsPath],
          env: {},
        },
      },
    },
  };
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
