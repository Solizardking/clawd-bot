#!/usr/bin/env node
/**
 * soltrader — stdio MCP server exposing Solana spot-trading tools to the Zero agent.
 *
 * Zero spawns this over stdio (see the generated .zero/config.json in server.mjs).
 * Tools register in Zero's tool registry as: mcp_soltrader_<tool>.
 *
 * Safety: execute_swap enforces MAX_SWAP_INPUT_AMOUNT (see dflow.mjs). Quotes and
 * balances are read-only.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as dflow from "./dflow.mjs";

const server = new McpServer(
  { name: "soltrader", version: "0.1.0" },
  {
    instructions:
      "Solana spot trading via DFlow. Use get_quote before execute_swap to show the user " +
      "expected output and price impact. Mints: SOL = " +
      dflow.config.solMint +
      ", USDC = " +
      dflow.config.settlementMint +
      ". Amounts are human-decimal strings (e.g. '0.1'). Per-trade cap: " +
      dflow.config.maxSwapInputAmount +
      " input tokens.",
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
  "get_config",
  "Return trading configuration: known mints (SOL, USDC), RPC, per-trade cap, and the agent wallet public key.",
  {},
  async () => {
    try {
      return ok({ ...dflow.config, agentWallet: dflow.agentPublicKey() });
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "get_balances",
  "Get SOL and SPL token balances for a wallet. Omit `owner` to use the agent's own wallet.",
  { owner: z.string().optional().describe("Base58 wallet address; defaults to agent wallet") },
  async ({ owner }) => {
    try {
      return ok(await dflow.balances(owner));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "get_quote",
  "Quote a spot swap without executing. Returns expected output amount, price, and price impact.",
  {
    inputMint: z.string().optional().describe("Input token mint (default SOL)"),
    outputMint: z.string().optional().describe("Output token mint (default USDC)"),
    amount: z.string().describe("Human-decimal input amount, e.g. '0.1'"),
    slippageBps: z.number().int().optional().describe("Slippage in bps (default 50 = 0.5%)"),
  },
  async (args) => {
    try {
      return ok(await dflow.quote(args));
    } catch (e) {
      return fail(e);
    }
  },
);

server.tool(
  "execute_swap",
  "Execute a spot swap with the agent hot wallet. Signs and submits on-chain. " +
    "Enforces the per-trade cap. Always get_quote first and confirm intent before calling this.",
  {
    inputMint: z.string().optional().describe("Input token mint (default SOL)"),
    outputMint: z.string().optional().describe("Output token mint (default USDC)"),
    amount: z.string().describe("Human-decimal input amount, e.g. '0.1'"),
    slippageBps: z.number().int().optional().describe("Slippage in bps (default 50 = 0.5%)"),
  },
  async (args) => {
    try {
      return ok(await dflow.swap(args));
    } catch (e) {
      return fail(e);
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
// stderr is safe for logs; stdout is the MCP channel.
process.stderr.write("[soltrader] MCP server ready on stdio\n");
