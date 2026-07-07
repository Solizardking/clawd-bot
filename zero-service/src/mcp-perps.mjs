#!/usr/bin/env node
/**
 * mcp-perps — stdio MCP server exposing Phoenix perpetuals trading tools to the Zero agent.
 *
 * Zero spawns this over stdio (see the generated .zero/config.json in zero-runner.mjs).
 * Tools register in Zero's tool registry as: mcp_perps_<tool>.
 *
 * Uses the Vulcan CLI for all operations. Rise SDK integration is planned for
 * a future release when @ellipsis-labs/rise is added as a dependency.
 *
 * Safety: All trading is PAPER by default. Live mode requires env vars:
 *   LIVE_TRADING=true, OPERATOR_CONFIRMED=true, PERPS_SIM_ONLY=false
 * Per-trade notional cap: PERPS_MAX_NOTIONAL_USD (default 250).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as perps from "./perps.mjs";

const server = new McpServer(
  { name: "perps", version: "0.1.0" },
  {
    instructions:
      "Phoenix perpetual futures via Vulcan CLI. All tools are read-only or paper-safe by default. " +
      "Available symbols: " +
      (perps.config.allowedSymbols.join(", ") || "SOL, ETH, BTC") +
      ". Mode: " +
      perps.config.tradingMode +
      ". Per-trade notional cap: $" +
      perps.config.maxNotionalUsd +
      ". Max leverage: " +
      perps.config.maxLeverage +
      "x. " +
      "For trades: always get_quote / get_orderbook first, state the expected outcome, " +
      "then execute on user confirmation. Never claim a trade succeeded unless the exchange confirms it.",
  },
);

const ok = (obj) => ({
  content: [{ type: "text", text: JSON.stringify(obj, null, 2) }],
});
const fail = (err) => ({
  content: [{ type: "text", text: `ERROR: ${err?.message ?? String(err)}` }],
  isError: true,
});

// ── Read-only market data tools ────────────────────────────────────────────

server.tool(
  "list_markets",
  "List all available perpetual markets with current mark prices, funding rates, and open interest.",
  {},
  async () => {
    try {
      return ok(await perps.listMarkets());
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "get_ticker",
  "Current price, 24h volume, open interest, and funding rate for a market symbol.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL, ETH, BTC"),
  },
  async ({ symbol }) => {
    try {
      return ok(await perps.getTicker(symbol));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "get_orderbook",
  "L2 orderbook snapshot for a market symbol.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
    depth: z.number().int().min(1).max(50).optional().describe("Orderbook depth (default 10)"),
  },
  async ({ symbol, depth }) => {
    try {
      return ok(await perps.getOrderbook(symbol, depth ?? 10));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "get_candles",
  "OHLCV candle history for a market symbol.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
    interval: z.string().optional().describe("Candle interval: 1m,5m,15m,1h,4h,1d (default 1h)"),
    limit: z.number().int().min(1).max(200).optional().describe("Number of candles (default 20)"),
  },
  async ({ symbol, interval, limit }) => {
    try {
      return ok(await perps.getCandles(symbol, interval ?? "1h", limit ?? 20));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "get_trades",
  "Recent trades for a market symbol.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
    limit: z.number().int().min(1).max(100).optional().describe("Number of trades (default 20)"),
  },
  async ({ symbol, limit }) => {
    try {
      return ok(await perps.getTrades(symbol, limit ?? 20));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "get_funding_rates",
  "Historical funding rates for a market symbol.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
    limit: z.number().int().min(1).max(100).optional().describe("Number of records (default 20)"),
  },
  async ({ symbol, limit }) => {
    try {
      return ok(await perps.getFundingRates(symbol, limit ?? 20));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "get_market_info",
  "Detailed market configuration (tick size, lot size, fees, leverage tiers).",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
  },
  async ({ symbol }) => {
    try {
      return ok(await perps.getMarketInfo(symbol));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "get_leverage_tiers",
  "Leverage tier schedule for a market symbol.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
  },
  async ({ symbol }) => {
    try {
      return ok(await perps.getLeverageTiers(symbol));
    } catch (e) {
      return fail(e);
    }
  },
);

// ── Position tools ─────────────────────────────────────────────────────────

server.tool(
  "list_positions",
  "List all open perpetual positions.",
  {},
  async () => {
    try {
      return ok(await perps.listPositions());
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "get_position",
  "Detailed view of a specific position.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
  },
  async ({ symbol }) => {
    try {
      return ok(await perps.getPosition(symbol));
    } catch (e) {
      return fail(e);
    }
  },
);

// ── Margin / collateral tools ──────────────────────────────────────────────

server.tool(
  "get_margin_status",
  "Cross-margin health, equity, maintenance margin, and available balance.",
  {},
  async () => {
    try {
      return ok(await perps.getMarginStatus());
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "get_portfolio",
  "Full portfolio snapshot: margin, positions, and open orders in one call.",
  {},
  async () => {
    try {
      return ok(await perps.getPortfolio());
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "list_orders",
  "List open orders, optionally filtered by symbol.",
  {
    symbol: z.string().optional().describe("Market symbol to filter by (optional)"),
  },
  async ({ symbol }) => {
    try {
      return ok(await perps.listOrders(symbol));
    } catch (e) {
      return fail(e);
    }
  },
);

// ── Read-only preflight ────────────────────────────────────────────────────

server.tool(
  "preflight_check",
  "Check if a trade would pass safety limits without executing it. Use before any trade.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
    notionalUsd: z.number().positive().describe("Trade size in USDC"),
    leverage: z.number().positive().optional().describe("Desired leverage"),
    execution: z.enum(["observe", "paper", "live"]).optional().describe("Execution mode (default: matches config)"),
  },
  async ({ symbol, notionalUsd, leverage, execution }) => {
    try {
      return ok(perps.buildPreflightReport({
        symbol,
        notionalUsd,
        leverage,
        execution: execution ?? perps.tradingMode(),
      }));
    } catch (e) {
      return fail(e);
    }
  },
);

// ── Paper / live trading tools ─────────────────────────────────────────────

server.tool(
  "preview_trade",
  "Preview what a trade would look like without executing. Shows preflight check and expected route.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
    side: z.enum(["buy", "sell"]).describe("Trade direction"),
    notionalUsd: z.number().positive().describe("Trade size in USDC"),
    orderType: z.enum(["market", "limit"]).optional().describe("Order type (default market)"),
    price: z.number().positive().optional().describe("Limit price (required for limit orders)"),
    leverage: z.number().positive().optional().describe("Desired leverage"),
  },
  async ({ symbol, side, notionalUsd, orderType, price, leverage }) => {
    try {
      const mode = perps.tradingMode();
      const preflight = perps.buildPreflightReport({
        symbol,
        notionalUsd,
        leverage,
        execution: mode === "live" ? "live" : "paper",
      });
      const route = {
        adapter: "vulcan",
        action: `${orderType ?? "market"}-${side}`,
        payload: { symbol: symbol.trim().toUpperCase(), side, notionalUsd, ...(price ? { price } : {}), ...(leverage ? { leverage } : {}) },
      };
      return ok({ symbol: symbol.trim().toUpperCase(), side, notionalUsd, orderType: orderType ?? "market", execution: mode, preflight, route });
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "market_buy",
  "Place a market buy order (paper by default). Always preflight_check + show quote first.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
    notionalUsd: z.number().positive().max(perps.config.maxNotionalUsd).describe(`Trade size in USDC (max ${perps.config.maxNotionalUsd})`),
    leverage: z.number().positive().optional().describe("Desired leverage"),
    execution: z.enum(["observe", "paper", "live"]).optional().describe("Execution mode (default: paper). Live requires LIVE_TRADING=true"),
  },
  async ({ symbol, notionalUsd, leverage, execution }) => {
    try {
      return ok(await perps.marketBuy(symbol, notionalUsd, { leverage, execution: execution ?? "paper" }));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "market_sell",
  "Place a market sell order (paper by default). Always preflight_check + show quote first.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
    notionalUsd: z.number().positive().max(perps.config.maxNotionalUsd).describe(`Trade size in USDC (max ${perps.config.maxNotionalUsd})`),
    leverage: z.number().positive().optional().describe("Desired leverage"),
    execution: z.enum(["observe", "paper", "live"]).optional().describe("Execution mode (default: paper). Live requires LIVE_TRADING=true"),
  },
  async ({ symbol, notionalUsd, leverage, execution }) => {
    try {
      return ok(await perps.marketSell(symbol, notionalUsd, { leverage, execution: execution ?? "paper" }));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "limit_buy",
  "Place a limit buy order (paper by default). Base lots are the contract unit.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
    sizeLots: z.number().positive().describe("Order size in base lots"),
    price: z.number().positive().describe("Limit price in USDC"),
    execution: z.enum(["observe", "paper", "live"]).optional().describe("Execution mode (default: paper)"),
  },
  async ({ symbol, sizeLots, price, execution }) => {
    try {
      return ok(await perps.limitBuy(symbol, sizeLots, price, { execution: execution ?? "paper" }));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "limit_sell",
  "Place a limit sell order (paper by default). Base lots are the contract unit.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
    sizeLots: z.number().positive().describe("Order size in base lots"),
    price: z.number().positive().describe("Limit price in USDC"),
    execution: z.enum(["observe", "paper", "live"]).optional().describe("Execution mode (default: paper)"),
  },
  async ({ symbol, sizeLots, price, execution }) => {
    try {
      return ok(await perps.limitSell(symbol, sizeLots, price, { execution: execution ?? "paper" }));
    } catch (e) {
      return fail(e);
    }
  },
);

// ── Position management tools ──────────────────────────────────────────────

server.tool(
  "close_position",
  "Close an entire position for a symbol.",
  {
    symbol: z.string().describe("Market symbol to close, e.g. SOL"),
  },
  async ({ symbol }) => {
    try {
      return ok(await perps.closePosition(symbol));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "close_all_positions",
  "Close every open position across all markets.",
  {},
  async () => {
    try {
      return ok(await perps.closeAllPositions());
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "cancel_all_orders",
  "Cancel all open orders, optionally for a specific market symbol.",
  {
    symbol: z.string().optional().describe("Market symbol to cancel orders for (optional; cancels all if omitted)"),
  },
  async ({ symbol }) => {
    try {
      return ok(await perps.cancelAllOrders(symbol));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "set_tpsl",
  "Set take-profit and/or stop-loss on an existing position.",
  {
    symbol: z.string().describe("Market symbol, e.g. SOL"),
    tp: z.string().optional().describe("Take-profit level as PRICE:SIZE_TOKENS (e.g. '180:0.5')"),
    sl: z.string().optional().describe("Stop-loss level as PRICE:SIZE_TOKENS (e.g. '120:0.5')"),
  },
  async ({ symbol, tp, sl }) => {
    try {
      return ok(await perps.setTpSl(symbol, { tp, sl }));
    } catch (e) {
      return fail(e);
    }
  },
);

// ── Collateral management tools ────────────────────────────────────────────

server.tool(
  "deposit_collateral",
  "Deposit USDC collateral into the Phoenix trader account.",
  {
    amount: z.number().positive().describe("Amount of USDC to deposit"),
  },
  async ({ amount }) => {
    try {
      return ok(await perps.depositCollateral(amount));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "withdraw_collateral",
  "Withdraw USDC collateral from the Phoenix trader account.",
  {
    amount: z.number().positive().describe("Amount of USDC to withdraw"),
  },
  async ({ amount }) => {
    try {
      return ok(await perps.withdrawCollateral(amount));
    } catch (e) {
      return fail(e);
    }
  },
);

// ── Health ─────────────────────────────────────────────────────────────────

server.tool(
  "health",
  "Check Vulcan connectivity, trading mode, wallet configuration, and runtime status.",
  {},
  async () => {
    try {
      return ok(await perps.health());
    } catch (e) {
      return fail(e);
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write("[mcp-perps] MCP server ready on stdio\n");