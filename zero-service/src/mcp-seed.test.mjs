/**
 * Offline tests for the zero-service birth MCP seed.
 * Drives the real buildWorkspaceMCPConfig export (no network).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ROBINHOOD_TRADING_SERVER_NAME,
  ROBINHOOD_TRADING_MCP_URL,
  buildWorkspaceMCPConfig,
  buildWorkspaceMCPServers,
  ROBINHOOD_AGENTIC_NOTE,
} from "./mcp-seed.mjs";

const paths = {
  soltraderPath: "/app/mcp-soltrader.mjs",
  marketsPath: "/app/mcp-markets.mjs",
  perpsPath: "/app/mcp-perps.mjs",
  riskPath: "/app/mcp-risk.mjs",
  nodePath: "/usr/bin/node",
};

test("buildWorkspaceMCPServers includes robinhood-trading HTTP URL", () => {
  const servers = buildWorkspaceMCPServers(paths);
  const rh = servers[ROBINHOOD_TRADING_SERVER_NAME];
  assert.ok(rh, "robinhood-trading must be seeded");
  assert.equal(rh.type, "http");
  assert.equal(rh.url, ROBINHOOD_TRADING_MCP_URL);
  assert.equal(rh.command, undefined);
});

test("buildWorkspaceMCPConfig keeps stdio sidecars and robinhood", () => {
  const cfg = buildWorkspaceMCPConfig(paths);
  const servers = cfg.mcp.servers;
  for (const name of ["soltrader", "markets", "perps", "risk", ROBINHOOD_TRADING_SERVER_NAME]) {
    assert.ok(servers[name], `missing ${name}`);
  }
  assert.equal(servers.soltrader.type, "stdio");
  assert.equal(servers[ROBINHOOD_TRADING_SERVER_NAME].url, ROBINHOOD_TRADING_MCP_URL);
  // Stable serialize for double-run evidence shape
  const a = JSON.stringify(cfg);
  const b = JSON.stringify(buildWorkspaceMCPConfig(paths));
  assert.equal(a, b);
});

test("Agentic note states trade restriction and OAuth", () => {
  assert.match(ROBINHOOD_AGENTIC_NOTE, /Agentic/);
  assert.match(ROBINHOOD_AGENTIC_NOTE, /place trades only/i);
  assert.match(ROBINHOOD_AGENTIC_NOTE, /OAuth|desktop/i);
  assert.ok(ROBINHOOD_AGENTIC_NOTE.includes(ROBINHOOD_TRADING_MCP_URL));
});
