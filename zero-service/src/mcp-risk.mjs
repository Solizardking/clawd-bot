#!/usr/bin/env node
/**
 * mcp-risk — stdio MCP server exposing account- and token-level risk
 * primitives, ported from the clawdbot Go trading engine.
 *
 * Zero spawns this over stdio (see zero-runner.mjs). Tools register in
 * Zero's tool registry as: mcp_risk_<tool>.
 *
 * All tools are pure calculations — no network calls, no wallet access, no
 * trade execution. They exist so the agent can size and gate a trade
 * *before* handing it to soltrader/perps for execution.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as risk from "./risk.mjs";

const server = new McpServer(
  { name: "risk", version: "0.1.0" },
  {
    instructions:
      "Risk-guard calculators, ported from clawdbot's Go trading engine. " +
      "assess_token_risk scores a token 0-100 from liquidity/volume/volatility/holder " +
      "concentration and returns allow/dry_run/block. size_position computes a " +
      "volatility-aware position size so a stop-out loses a fixed fraction of equity. " +
      "check_portfolio_guard is the account-level gate: max concurrent positions, " +
      "total/per-asset exposure caps, a drawdown circuit breaker, and a daily-loss limit. " +
      "Call size_position and check_portfolio_guard before any execute_swap or perps trade " +
      "when the user hasn't given an explicit size.",
  },
);

const ok = (obj) => ({
  content: [{ type: "text", text: JSON.stringify(obj, null, 2) }],
});
const fail = (err) => ({
  content: [{ type: "text", text: `ERROR: ${err?.message ?? String(err)}` }],
  isError: true,
});

server.tool(
  "assess_token_risk",
  "Score a token 0-100 from liquidity, volume, 24h volatility, holder concentration, " +
    "and mint/freeze authority flags. Returns a grade (A-F) and a decision (allow/dry_run/block).",
  {
    symbol: z.string().optional().describe("Token symbol, e.g. SOL, BONK"),
    price: z.number().optional().describe("Current price (quote currency)"),
    change24hPct: z.number().optional().describe("24h price change, percent"),
    volume24hUsd: z.number().optional().describe("24h trading volume, USD"),
    liquidityUsd: z.number().optional().describe("Pool/market liquidity, USD"),
    top10HolderPct: z.number().optional().describe("Percent of supply held by top 10 wallets"),
    mutable: z.boolean().optional().describe("Whether token metadata is mutable"),
    hasMintAuth: z.boolean().optional().describe("Whether mint authority is still active"),
    hasFreezeAuth: z.boolean().optional().describe("Whether freeze authority is still active"),
  },
  async (snapshot) => {
    try {
      return ok(risk.assessToken(snapshot));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "size_position",
  "Risk-based position sizing: returns the notional (in SOL) such that a stop-out " +
    "loses approximately riskPerTradePct of equity, scaled by confidence and clamped " +
    "by the configured caps. Returns 0 when inputs are unusable.",
  {
    equitySol: z.number().describe("Total account equity, in SOL"),
    riskPerTradePct: z.number().describe("Fraction of equity to lose if the stop is hit, e.g. 0.01 = 1%"),
    entryPrice: z.number().describe("Planned entry price"),
    stopLossPrice: z.number().describe("Planned stop price; must differ from entry"),
    confidence: z.number().optional().describe("0..1 signal confidence; scales the final size (default 1)"),
    maxPositionSol: z.number().optional().describe("Hard cap on notional in SOL (0/omit = no cap)"),
    maxPositionPct: z.number().optional().describe("Cap as a fraction of equity (0/omit = no cap)"),
  },
  async (input) => {
    try {
      const sizeSol = risk.riskAdjustedSize(input);
      return ok({ sizeSol });
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "check_portfolio_guard",
  "Account-level risk gate consulted before every new entry: max concurrent positions, " +
    "total/per-asset exposure caps, a drawdown circuit breaker, and a daily-loss limit. " +
    "Returns { allowed, reasons } — every violated rule is reported, not just the first.",
  {
    limits: z.object({
      maxConcurrent: z.number().describe("Max simultaneous open positions (0 blocks all trading)"),
      maxTotalExposure: z.number().optional().describe("Max sum of position sizes, SOL (0/omit = no limit)"),
      maxPerAsset: z.number().optional().describe("Max exposure to a single asset, SOL (0/omit = no limit)"),
      maxDrawdownPct: z.number().optional().describe("Halt new entries past this equity drawdown fraction"),
      dailyLossLimitPct: z.number().optional().describe("Halt if realized session loss exceeds this fraction"),
    }),
    asset: z.string().describe("Asset symbol for the candidate entry"),
    sizeSol: z.number().describe("Proposed position size, in SOL"),
    exposure: z.object({
      count: z.number().optional().describe("Number of currently open positions"),
      totalSol: z.number().optional().describe("Total notional currently deployed, SOL"),
      perAssetSol: z.record(z.string(), z.number()).optional().describe("Notional per asset, SOL"),
      peakEquity: z.number().optional().describe("Highest equity watermark this session, SOL"),
      equity: z.number().optional().describe("Current equity, SOL"),
      sessionPnlSol: z.number().optional().describe("Realized P&L since session start (negative = loss)"),
      sessionStartEquity: z.number().optional().describe("Equity at session start, SOL"),
    }),
  },
  async ({ limits, asset, sizeSol, exposure }) => {
    try {
      return ok(risk.checkPortfolioGuard(limits, asset, sizeSol, exposure));
    } catch (e) {
      return fail(e);
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write("[risk] MCP server ready on stdio\n");
