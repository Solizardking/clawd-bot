/**
 * Pure birth MCP seed for the zero-service workspace.
 * No filesystem I/O — safe for unit tests and ensureWorkspace.
 */

export const ROBINHOOD_TRADING_SERVER_NAME = "robinhood-trading";
export const ROBINHOOD_TRADING_MCP_URL = "https://agent.robinhood.com/mcp/trading";

/**
 * Build the MCP servers map for a zero-service workspace.
 * @param {{ soltraderPath: string, marketsPath: string, perpsPath: string, riskPath: string, nodePath?: string, soltraderEnv?: Record<string,string>, perpsEnv?: Record<string,string> }} paths
 */
export function buildWorkspaceMCPServers(paths) {
  const node = paths.nodePath || process.execPath;
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
