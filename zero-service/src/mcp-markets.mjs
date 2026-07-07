#!/usr/bin/env node
/**
 * markets — stdio MCP server exposing read-only equities / index / crypto data.
 *
 * Zero Clawd spawns this over stdio alongside the soltrader MCP. Tools register
 * in Zero's tool registry as: mcp_markets_<tool>.
 *
 * All tools are READ-ONLY — no order execution happens here.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as markets from "./markets.mjs";

const server = new McpServer(
  { name: "markets", version: "0.1.0" },
  {
    instructions:
      "Read-only equities, index, and crypto market data. Use quote for a " +
      "snapshot (price, change, previous close) and history for OHLCV candles. " +
      "Supports stocks (AAPL, MSFT), ETFs (SPY, QQQ), indices (^GSPC, ^IXIC), " +
      "and crypto pairs (BTC-USD, ETH-USD). Prices come from Yahoo Finance and " +
      "are delayed ~15 minutes for free tier.",
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
  "quote",
  "Latest price, change percentage, and previous close for a ticker symbol.",
  { symbol: z.string().describe("Ticker symbol, e.g. AAPL, SPY, ^GSPC, BTC-USD") },
  async ({ symbol }) => {
    try {
      return ok(await markets.quote(symbol));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "history",
  "OHLCV candle history for a ticker symbol over a date range.",
  {
    symbol: z.string().describe("Ticker symbol, e.g. AAPL, SPY, BTC-USD"),
    range: z.string().optional().describe("Date range: 1d,5d,1mo,3mo,6mo,1y,5y,max (default 1mo)"),
    interval: z.string().optional().describe("Candle interval: 1d,1wk,1mo (default 1d)"),
  },
  async ({ symbol, range, interval }) => {
    try {
      return ok(await markets.history(symbol, { range, interval }));
    } catch (e) {
      return fail(e);
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write("[markets] MCP server ready on stdio\n");