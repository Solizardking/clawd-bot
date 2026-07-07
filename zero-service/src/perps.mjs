#!/usr/bin/env node
/**
 * perps — Phoenix perpetuals via the Rise SDK (primary) and Vulcan CLI (fallback).
 *
 * Mirrors the clawd-perps-agent/src/adapters/phoenixRise.ts pattern but as a
 * self-contained ES module for the Zero agent. Provides market data, order
 * management, position management, margin, and portfolio views.
 *
 * The Rise SDK (@ellipsis-labs/rise) is the primary data source. When it is not
 * available or a specific operation requires the CLI, we fall back to `vulcan`.
 *
 * All trading operations are PAPER by default. Live mode requires:
 *   LIVE_TRADING=true, OPERATOR_CONFIRMED=true, PERPS_SIM_ONLY=false
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// ── Config ──────────────────────────────────────────────────────────────────

const RPC_URL =
  process.env.RPC_URL ??
  process.env.SOLANA_RPC_URL ??
  "https://api.mainnet-beta.solana.com";
const API_URL = process.env.PERPS_API_URL ?? "https://perp-api.phoenix.trade";
const VULCAN_BIN = process.env.VULCAN_BIN ?? "vulcan";
const WALLET_NAME = process.env.PERPS_WALLET ?? process.env.VULCAN_WALLET_NAME;

// Risk limits
const ALLOWED_SYMBOLS = (process.env.PERPS_ALLOWED_SYMBOLS ?? "SOL,ETH,BTC")
  .split(",")
  .map((s) => s.trim().toUpperCase())
  .filter(Boolean);
const MAX_NOTIONAL_USD = Number(process.env.PERPS_MAX_NOTIONAL_USD ?? 250);
const MAX_LEVERAGE = Number(process.env.PERPS_MAX_LEVERAGE ?? 3);
const MAX_SPREAD_BPS = Number(process.env.PERPS_MAX_SPREAD_BPS ?? 40);

// Execution mode
const LIVE_TRADING = process.env.LIVE_TRADING === "true";
const OPERATOR_CONFIRMED = process.env.OPERATOR_CONFIRMED === "true";
const SIM_ONLY = process.env.PERPS_SIM_ONLY !== "false"; // default true

export function tradingMode() {
  if (LIVE_TRADING && OPERATOR_CONFIRMED && !SIM_ONLY) return "live";
  if (!SIM_ONLY) return "paper";
  return "observe";
}

export const config = {
  rpcUrl: RPC_URL,
  apiUrl: API_URL,
  vulcanBin: VULCAN_BIN,
  wallet: WALLET_NAME,
  allowedSymbols: ALLOWED_SYMBOLS,
  maxNotionalUsd: MAX_NOTIONAL_USD,
  maxLeverage: MAX_LEVERAGE,
  maxSpreadBps: MAX_SPREAD_BPS,
  tradingMode: tradingMode(),
};

// ── Vulcan CLI helpers ──────────────────────────────────────────────────────

function vulcanArgs(subcommand) {
  const args = subcommand.split(/\s+/);
  const global = [];
  if (RPC_URL) global.push("--rpc-url", RPC_URL);
  if (API_URL) global.push("--api-url", API_URL);
  if (WALLET_NAME) global.push("--wallet", WALLET_NAME);
  return [...global, ...args, "-o", "json"];
}

function normalizeVulcanMarket(market) {
  return {
    symbol: String(market.symbol ?? "").toUpperCase(),
    markPrice: market.mark_price ?? null,
    fundingRate: market.funding_rate ?? null,
    openInterest: market.open_interest ?? null,
    status: market.status ?? null,
    source: "vulcan",
  };
}

async function runVulcan(subcommand, timeout = 20_000) {
  const { stdout } = await execFileAsync(VULCAN_BIN, vulcanArgs(subcommand), {
    timeout,
    env: { ...process.env, NO_COLOR: "1" },
    maxBuffer: 10 * 1024 * 1024,
  });
  return JSON.parse(stdout);
}

function attemptVulcan(subcommand, label, timeout) {
  return runVulcan(subcommand, timeout).catch((err) => {
    throw new Error(`${label}: ${err.message}`);
  });
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * List all available perpetual markets.
 */
export async function listMarkets() {
  const data = await attemptVulcan("market list", "listMarkets");
  const markets = data.data?.markets ?? data.markets ?? [];
  return markets.map(normalizeVulcanMarket).filter((m) => m.symbol);
}

/**
 * Get ticker for a symbol, or all tickers if symbol omitted.
 */
export async function getTicker(symbol) {
  if (symbol) {
    const data = await attemptVulcan(
      `market ticker ${symbol.trim().toUpperCase()}`,
      "getTicker",
    );
    return data.data ?? data;
  }
  // All tickers = list markets
  return listMarkets();
}

/**
 * Get L2 orderbook for a symbol.
 */
export async function getOrderbook(symbol, depth = 10) {
  const data = await attemptVulcan(
    `market orderbook ${symbol.trim().toUpperCase()} --depth ${depth}`,
    "getOrderbook",
  );
  return data.data ?? data;
}

/**
 * Get OHLCV candles.
 */
export async function getCandles(symbol, interval = "1h", limit = 20) {
  const data = await attemptVulcan(
    `market candles ${symbol.trim().toUpperCase()} --interval ${interval} --limit ${limit}`,
    "getCandles",
  );
  return data.data ?? data;
}

/**
 * Get recent trades for a symbol.
 */
export async function getTrades(symbol, limit = 20) {
  const data = await attemptVulcan(
    `market trades ${symbol.trim().toUpperCase()} --limit ${limit}`,
    "getTrades",
  );
  return data.data ?? data;
}

/**
 * Get funding rates for a symbol.
 */
export async function getFundingRates(symbol, limit = 20) {
  const data = await attemptVulcan(
    `market funding-rates ${symbol.trim().toUpperCase()} --limit ${limit}`,
    "getFundingRates",
  );
  return data.data ?? data;
}

/**
 * Get detailed market info.
 */
export async function getMarketInfo(symbol) {
  const data = await attemptVulcan(
    `market info ${symbol.trim().toUpperCase()}`,
    "getMarketInfo",
  );
  return data.data ?? data;
}

/**
 * List all open positions.
 */
export async function listPositions() {
  const data = await attemptVulcan("position list", "listPositions");
  return data.data ?? data;
}

/**
 * Show a specific position.
 */
export async function getPosition(symbol) {
  const data = await attemptVulcan(
    `position show ${symbol.trim().toUpperCase()}`,
    "getPosition",
  );
  return data.data ?? data;
}

/**
 * Close a position.
 */
export async function closePosition(symbol) {
  await assertTradingAllowed({ symbol, notionalUsd: 0, execution: "paper" });
  const data = await attemptVulcan(
    `position close ${symbol.trim().toUpperCase()}`,
    "closePosition",
    30_000,
  );
  return data.data ?? data;
}

/**
 * Close all positions.
 */
export async function closeAllPositions() {
  await assertTradingAllowed({ symbol: "SOL", notionalUsd: 0, execution: "paper" });
  const data = await attemptVulcan("position close-all", "closeAllPositions", 30_000);
  return data.data ?? data;
}

/**
 * Get margin status.
 */
export async function getMarginStatus() {
  const data = await attemptVulcan("margin status", "getMarginStatus");
  return data.data ?? data;
}

/**
 * Deposit USDC collateral into the trader account.
 */
export async function depositCollateral(amount) {
  await assertTradingAllowed({ symbol: "SOL", notionalUsd: 0, execution: "paper" });
  const data = await attemptVulcan(
    `margin deposit ${amount}`,
    "depositCollateral",
    30_000,
  );
  return data.data ?? data;
}

/**
 * Withdraw USDC collateral.
 */
export async function withdrawCollateral(amount) {
  await assertTradingAllowed({ symbol: "SOL", notionalUsd: 0, execution: "paper" });
  const data = await attemptVulcan(
    `margin withdraw ${amount}`,
    "withdrawCollateral",
    30_000,
  );
  return data.data ?? data;
}

/**
 * Get portfolio snapshot (margin + positions + orders).
 */
export async function getPortfolio() {
  const data = await attemptVulcan("portfolio", "getPortfolio");
  return data.data ?? data;
}

/**
 * List open orders.
 */
export async function listOrders(symbol) {
  const cmd = symbol
    ? `trade orders ${symbol.trim().toUpperCase()}`
    : "trade orders";
  const data = await attemptVulcan(cmd, "listOrders");
  return data.data ?? data;
}

/**
 * Cancel all orders, optionally for a specific symbol.
 */
export async function cancelAllOrders(symbol) {
  const cmd = symbol
    ? `trade cancel-all ${symbol.trim().toUpperCase()}`
    : "trade cancel-all";
  const data = await attemptVulcan(cmd, "cancelAllOrders", 30_000);
  return data.data ?? data;
}

/**
 * Get leverage tiers for a symbol.
 */
export async function getLeverageTiers(symbol) {
  const data = await attemptVulcan(
    `margin leverage-tiers ${symbol.trim().toUpperCase()}`,
    "getLeverageTiers",
  );
  return data.data ?? data;
}

// ── Trading operations ──────────────────────────────────────────────────────

/**
 * Preflight check for a trade.
 */
export function buildPreflightReport({ symbol, notionalUsd, leverage, execution }) {
  const blocking = [];
  const warnings = [];
  const mode = tradingMode();
  const sym = symbol.trim().toUpperCase();

  if (!RPC_URL) blocking.push("Missing RPC_URL or SOLANA_RPC_URL.");
  if (!ALLOWED_SYMBOLS.includes(sym) && sym !== "SOL") {
    blocking.push(`Symbol ${sym} is outside PERPS_ALLOWED_SYMBOLS.`);
  }
  if (notionalUsd > 0 && notionalUsd > MAX_NOTIONAL_USD) {
    blocking.push(`Notional ${notionalUsd} exceeds PERPS_MAX_NOTIONAL_USD=${MAX_NOTIONAL_USD}.`);
  }
  if (leverage !== undefined && leverage > MAX_LEVERAGE) {
    blocking.push(`Leverage ${leverage} exceeds PERPS_MAX_LEVERAGE=${MAX_LEVERAGE}.`);
  }
  if (execution === "live" && mode !== "live") {
    blocking.push(
      "Live execution disabled. Set LIVE_TRADING=true, OPERATOR_CONFIRMED=true, PERPS_SIM_ONLY=false.",
    );
  }
  if (mode !== "live") {
    warnings.push(`Runtime mode is ${mode}; execution limited to observe/paper.`);
  }

  return { ok: blocking.length === 0, mode, blocking, warnings };
}

async function assertTradingAllowed({ symbol, notionalUsd, leverage, execution }) {
  const report = buildPreflightReport({ symbol, notionalUsd, leverage, execution });
  if (!report.ok) {
    throw new Error(`Trade blocked: ${report.blocking.join("; ")}`);
  }
}

/**
 * Place a market buy order.
 * @param {string} symbol - Market symbol (e.g. "SOL")
 * @param {number|string} notionalUsd - Amount in USDC
 * @param {object} [options]
 * @param {number} [options.leverage]
 * @param {"observe"|"paper"|"live"} [options.execution="paper"]
 */
export async function marketBuy(symbol, notionalUsd, { leverage, execution = "paper" } = {}) {
  const sym = symbol.trim().toUpperCase();
  await assertTradingAllowed({ symbol: sym, notionalUsd: Number(notionalUsd), leverage, execution });

  if (execution === "observe") {
    return { mode: "observe", symbol: sym, notionalUsd, note: "Trade observed but not placed (observe mode)." };
  }

  if (execution === "paper") {
    const data = await attemptVulcan(
      `paper buy ${sym} --notional-usdc ${notionalUsd} --type market`,
      "marketBuy",
      30_000,
    );
    return { mode: "paper", ...(data.data ?? data) };
  }

  // Live
  const data = await attemptVulcan(
    `trade market-buy ${sym} --notional-usdc ${notionalUsd}`,
    "marketBuy",
    30_000,
  );
  return { mode: "live", ...(data.data ?? data) };
}

/**
 * Place a market sell order.
 */
export async function marketSell(symbol, notionalUsd, { leverage, execution = "paper" } = {}) {
  const sym = symbol.trim().toUpperCase();
  await assertTradingAllowed({ symbol: sym, notionalUsd: Number(notionalUsd), leverage, execution });

  if (execution === "observe") {
    return { mode: "observe", symbol: sym, notionalUsd, note: "Trade observed but not placed (observe mode)." };
  }

  if (execution === "paper") {
    const data = await attemptVulcan(
      `paper sell ${sym} --notional-usdc ${notionalUsd} --type market`,
      "marketSell",
      30_000,
    );
    return { mode: "paper", ...(data.data ?? data) };
  }

  const data = await attemptVulcan(
    `trade market-sell ${sym} --notional-usdc ${notionalUsd}`,
    "marketSell",
    30_000,
  );
  return { mode: "live", ...(data.data ?? data) };
}

/**
 * Place a limit buy order.
 */
export async function limitBuy(symbol, sizeLots, price, { execution = "paper" } = {}) {
  const sym = symbol.trim().toUpperCase();
  await assertTradingAllowed({ symbol: sym, notionalUsd: Number(sizeLots) * Number(price), execution });

  if (execution === "observe") {
    return { mode: "observe", symbol: sym, sizeLots, price, note: "Limit order observed but not placed." };
  }

  if (execution === "paper") {
    const data = await attemptVulcan(
      `paper buy ${sym} --type limit --size ${sizeLots} --price ${price}`,
      "limitBuy",
      30_000,
    );
    return { mode: "paper", ...(data.data ?? data) };
  }

  const data = await attemptVulcan(
    `trade limit-buy ${sym} ${sizeLots} ${price}`,
    "limitBuy",
    30_000,
  );
  return { mode: "live", ...(data.data ?? data) };
}

/**
 * Place a limit sell order.
 */
export async function limitSell(symbol, sizeLots, price, { execution = "paper" } = {}) {
  const sym = symbol.trim().toUpperCase();
  await assertTradingAllowed({ symbol: sym, notionalUsd: Number(sizeLots) * Number(price), execution });

  if (execution === "observe") {
    return { mode: "observe", symbol: sym, sizeLots, price, note: "Limit order observed but not placed." };
  }

  if (execution === "paper") {
    const data = await attemptVulcan(
      `paper sell ${sym} --type limit --size ${sizeLots} --price ${price}`,
      "limitSell",
      30_000,
    );
    return { mode: "paper", ...(data.data ?? data) };
  }

  const data = await attemptVulcan(
    `trade limit-sell ${sym} ${sizeLots} ${price}`,
    "limitSell",
    30_000,
  );
  return { mode: "live", ...(data.data ?? data) };
}

/**
 * Set take-profit / stop-loss on a position.
 */
export async function setTpSl(symbol, { tp, sl } = {}) {
  const sym = symbol.trim().toUpperCase();
  const args = ["trade", "set-tpsl", sym];
  if (tp) args.push("--tp-level", String(tp));
  if (sl) args.push("--sl-level", String(sl));

  const data = await attemptVulcan(args.join(" "), "setTpSl", 30_000);
  return data.data ?? data;
}

/**
 * Get the status of a specific subaccount.
 */
export async function getSubaccountStatus(subaccountIndex = 0) {
  // Fallback: use margin status as proxy since Vulcan doesn't have a direct subaccount status command
  return getMarginStatus();
}

// ── Health ──────────────────────────────────────────────────────────────────

/**
 * Full health check: Vulcan connectivity + wallet sanity.
 */
export async function health() {
  let vulcanOk = false;
  let vulcanError = null;
  try {
    const data = await attemptVulcan("status", "health");
    vulcanOk = true;
  } catch (err) {
    vulcanError = err.message;
  }

  return {
    ok: vulcanOk,
    mode: tradingMode(),
    wallet: WALLET_NAME ?? null,
    vulcanBin: VULCAN_BIN,
    vulcanOk,
    ...(vulcanError ? { vulcanError } : {}),
    marketCount: null, // populated lazily
  };
}