/**
 * Pure birth MCP seed for the zero-service workspace.
 * No filesystem I/O — safe for unit tests and ensureWorkspace.
 */

export const ROBINHOOD_TRADING_SERVER_NAME = "robinhood-trading";
export const ROBINHOOD_TRADING_MCP_URL = "https://agent.robinhood.com/mcp/trading";

export const DEFAULT_CLAWDBROWSER_ROOT =
  process.env.CLAWDBROWSER_ROOT || "/Users/8bit/ClawdBrowser";

export const CLAWD_MCP_SERVER_NAME = "clawd";
export const CLAWD_SOLTRADER_SERVER_NAME = "clawd-soltrader";

/** Absolute paths into ClawdBrowser zero-service (birth access surface). */
export function clawdBrowserModulePaths(root = DEFAULT_CLAWDBROWSER_ROOT) {
  const base = root.replace(/\/+$/, "");
  return {
    root: base,
    clawdDir: `${base}/zero-service/src/clawd`,
    gateway: `${base}/zero-service/src/clawd/gateway.mjs`,
    hold: `${base}/zero-service/src/clawd/hold.mjs`,
    keys: `${base}/zero-service/src/clawd/keys.mjs`,
    providers: `${base}/zero-service/src/clawd/providers.mjs`,
    rhLaunch: `${base}/zero-service/src/clawd/rh-launch.mjs`,
    store: `${base}/zero-service/src/clawd/store.mjs`,
    usage: `${base}/zero-service/src/clawd/usage.mjs`,
    cors: `${base}/zero-service/src/cors.mjs`,
    dflow: `${base}/zero-service/src/dflow.mjs`,
    mcpClawd: `${base}/zero-service/src/mcp-clawd.mjs`,
    mcpSoltrader: `${base}/zero-service/src/mcp-soltrader.mjs`,
    openapi: `${base}/zero-service/src/openapi.mjs`,
    server: `${base}/zero-service/src/server.mjs`,
    smoke: `${base}/zero-service/src/smoke.mjs`,
    solanaConfig: `${base}/zero-service/src/solana-config.mjs`,
    zeroRunner: `${base}/zero-service/src/zero-runner.mjs`,
  };
}

/**
 * Build the MCP servers map for a zero-service workspace.
 * @param {{ soltraderPath: string, marketsPath: string, perpsPath: string, riskPath: string, nodePath?: string, soltraderEnv?: Record<string,string>, perpsEnv?: Record<string,string>, clawdPath?: string, clawdSoltraderPath?: string, clawdEnv?: Record<string,string> }} paths
 */
export function buildWorkspaceMCPServers(paths) {
  const node = paths.nodePath || process.execPath;
  const cb = clawdBrowserModulePaths();
  const clawdPath = paths.clawdPath || cb.mcpClawd;
  const clawdSoltraderPath = paths.clawdSoltraderPath || cb.mcpSoltrader;
  return {
    soltrader: {
      type: "stdio",
      command: node,
      args: [paths.soltraderPath],
      env: paths.soltraderEnv || {},
    },
    markets: {
      type: "stdio",
      command: node,
      args: [paths.marketsPath],
      env: {},
    },
    perps: {
      type: "stdio",
      command: node,
      args: [paths.perpsPath],
      env: paths.perpsEnv || {},
    },
    risk: {
      type: "stdio",
      command: node,
      args: [paths.riskPath],
      env: {},
    },
    [CLAWD_MCP_SERVER_NAME]: {
      type: "stdio",
      command: node,
      args: [clawdPath],
      env: paths.clawdEnv || {
        CLAWDBROWSER_ROOT: DEFAULT_CLAWDBROWSER_ROOT,
      },
    },
    [CLAWD_SOLTRADER_SERVER_NAME]: {
      type: "stdio",
      command: node,
      args: [clawdSoltraderPath],
      env: paths.soltraderEnv || {
        CLAWDBROWSER_ROOT: DEFAULT_CLAWDBROWSER_ROOT,
      },
    },
    [ROBINHOOD_TRADING_SERVER_NAME]: {
      type: "http",
      url: ROBINHOOD_TRADING_MCP_URL,
    },
  };
}

/**
 * Full .zero/config.json document for ensureWorkspace.
 * @param {Parameters<typeof buildWorkspaceMCPServers>[0]} paths
 */
export function buildWorkspaceMCPConfig(paths) {
  return {
    mcp: {
      servers: buildWorkspaceMCPServers(paths),
    },
  };
}

/** Operator note fragment for Agentic-only trade scope. */
export const ROBINHOOD_AGENTIC_NOTE = `
## Robinhood Agentic Trading MCP

Server name: \`${ROBINHOOD_TRADING_SERVER_NAME}\`
URL: ${ROBINHOOD_TRADING_MCP_URL}

- The agent may **place trades only** in your Robinhood **Agentic** account.
- Read access may cover other Robinhood accounts (positions, balances, history, watchlists).
- Desktop OAuth and Agentic account onboarding are required before live tools work.
- Open/authenticate on a **desktop** browser; copy mobile onboarding URLs to desktop.
- You remain responsible for every order the agent places.
`.trim();
