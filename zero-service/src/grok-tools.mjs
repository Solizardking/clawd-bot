/**
 * OpenAI Responses API function tools wrapping the same dflow / markets /
 * perps / risk modules the MCP servers expose to Zero.
 */
import * as dflow from "./dflow.mjs";
import * as markets from "./markets.mjs";
import * as perps from "./perps.mjs";
import * as risk from "./risk.mjs";
import { envFlag } from "./grok-builtins.mjs";
import * as imagine from "./imagine.mjs";

const str = (description) => ({ type: "string", description });
const num = (description) => ({ type: "number", description });
const bool = (description) => ({ type: "boolean", description });
const integer = (description) => ({ type: "integer", description });

function fn(name, description, properties, required, handler) {
  return {
    def: {
      type: "function",
      name,
      description,
      parameters: {
        type: "object",
        properties,
        required: required ?? [],
        additionalProperties: false,
      },
    },
    handler,
  };
}

function json(value) {
  return JSON.stringify(value, null, 2);
}

const TOOLS = [
  fn(
    "get_config",
    "Return trading configuration: known mints (SOL, USDC), RPC, per-trade cap, and the agent wallet public key.",
    {},
    [],
    async () => ({ ...dflow.config, agentWallet: dflow.agentPublicKey() }),
  ),
  fn(
    "get_balances",
    "Get SOL and SPL token balances for a wallet. Omit owner to use the agent's own wallet.",
    { owner: str("Base58 wallet address; defaults to agent wallet") },
    [],
    async ({ owner }) => dflow.balances(owner),
  ),
  fn(
    "get_quote",
    "Quote a Solana spot swap without executing. Returns expected output amount, price, and price impact.",
    {
      inputMint: str("Input token mint (default SOL)"),
      outputMint: str("Output token mint (default USDC)"),
      amount: str("Human-decimal input amount, e.g. '0.1'"),
      slippageBps: integer("Slippage in bps (default 50 = 0.5%)"),
    },
    ["amount"],
    async (args) => dflow.quote(args),
  ),
  fn(
    "execute_swap",
    "Execute a spot swap with the agent hot wallet. Enforces the per-trade cap. Always get_quote first.",
    {
      inputMint: str("Input token mint (default SOL)"),
      outputMint: str("Output token mint (default USDC)"),
      amount: str("Human-decimal input amount, e.g. '0.1'"),
      slippageBps: integer("Slippage in bps (default 50 = 0.5%)"),
    },
    ["amount"],
    async (args) => dflow.swap(args),
  ),
  fn(
    "markets_quote",
    "Latest price, change percentage, and previous close for a ticker symbol.",
    { symbol: str("Ticker symbol, e.g. AAPL, SPY, ^GSPC, BTC-USD") },
    ["symbol"],
    async ({ symbol }) => markets.quote(symbol),
  ),
  fn(
    "markets_history",
    "OHLCV candle history for a ticker symbol over a date range.",
    {
      symbol: str("Ticker symbol, e.g. AAPL, SPY, BTC-USD"),
      range: str("Date range: 1d,5d,1mo,3mo,6mo,1y,5y,max (default 1mo)"),
      interval: str("Candle interval: 1d,1wk,1mo (default 1d)"),
    },
    ["symbol"],
    async ({ symbol, range, interval }) => markets.history(symbol, { range, interval }),
  ),
  fn(
    "list_markets",
    "List all available perpetual markets with current mark prices, funding rates, and open interest.",
    {},
    [],
    async () => perps.listMarkets(),
  ),
  fn(
    "get_ticker",
    "Current price, 24h volume, open interest, and funding rate for a market symbol.",
    { symbol: str("Market symbol, e.g. SOL, ETH, BTC") },
    ["symbol"],
    async ({ symbol }) => perps.getTicker(symbol),
  ),
  fn(
    "get_orderbook",
    "L2 orderbook snapshot for a market symbol.",
    {
      symbol: str("Market symbol, e.g. SOL"),
      depth: integer("Orderbook depth (default 10)"),
    },
    ["symbol"],
    async ({ symbol, depth }) => perps.getOrderbook(symbol, depth ?? 10),
  ),
  fn(
    "get_candles",
    "OHLCV candle history for a market symbol.",
    {
      symbol: str("Market symbol, e.g. SOL"),
      interval: str("Candle interval: 1m,5m,15m,1h,4h,1d (default 1h)"),
      limit: integer("Number of candles (default 20)"),
    },
    ["symbol"],
    async ({ symbol, interval, limit }) => perps.getCandles(symbol, interval ?? "1h", limit ?? 20),
  ),
  fn(
    "get_trades",
    "Recent trades for a market symbol.",
    {
      symbol: str("Market symbol, e.g. SOL"),
      limit: integer("Number of trades (default 20)"),
    },
    ["symbol"],
    async ({ symbol, limit }) => perps.getTrades(symbol, limit ?? 20),
  ),
  fn(
    "get_funding_rates",
    "Historical funding rates for a market symbol.",
    {
      symbol: str("Market symbol, e.g. SOL"),
      limit: integer("Number of records (default 20)"),
    },
    ["symbol"],
    async ({ symbol, limit }) => perps.getFundingRates(symbol, limit ?? 20),
  ),
  fn(
    "get_market_info",
    "Detailed market configuration (tick size, lot size, fees, leverage tiers).",
    { symbol: str("Market symbol, e.g. SOL") },
    ["symbol"],
    async ({ symbol }) => perps.getMarketInfo(symbol),
  ),
  fn(
    "get_leverage_tiers",
    "Leverage tier schedule for a market symbol.",
    { symbol: str("Market symbol, e.g. SOL") },
    ["symbol"],
    async ({ symbol }) => perps.getLeverageTiers(symbol),
  ),
  fn(
    "list_positions",
    "List all open perpetual positions.",
    {},
    [],
    async () => perps.listPositions(),
  ),
  fn(
    "get_position",
    "Detailed view of a specific position.",
    { symbol: str("Market symbol, e.g. SOL") },
    ["symbol"],
    async ({ symbol }) => perps.getPosition(symbol),
  ),
  fn(
    "get_margin_status",
    "Cross-margin health, equity, maintenance margin, and available balance.",
    {},
    [],
    async () => perps.getMarginStatus(),
  ),
  fn(
    "get_portfolio",
    "Full portfolio snapshot: margin, positions, and open orders in one call.",
    {},
    [],
    async () => perps.getPortfolio(),
  ),
  fn(
    "list_orders",
    "List open orders, optionally filtered by symbol.",
    { symbol: str("Market symbol to filter by (optional)") },
    [],
    async ({ symbol }) => perps.listOrders(symbol),
  ),
  fn(
    "preflight_check",
    "Check if a trade would pass safety limits without executing it. Use before any trade.",
    {
      symbol: str("Market symbol, e.g. SOL"),
      notionalUsd: num("Trade size in USDC"),
      leverage: num("Desired leverage"),
      execution: str("Execution mode: observe, paper, or live"),
    },
    ["symbol", "notionalUsd"],
    async ({ symbol, notionalUsd, leverage, execution }) =>
      perps.buildPreflightReport({
        symbol,
        notionalUsd,
        leverage,
        execution: execution ?? perps.tradingMode(),
      }),
  ),
  fn(
    "preview_trade",
    "Preview what a trade would look like without executing.",
    {
      symbol: str("Market symbol, e.g. SOL"),
      side: str("Trade direction: buy or sell"),
      notionalUsd: num("Trade size in USDC"),
      orderType: str("Order type: market or limit (default market)"),
      price: num("Limit price (required for limit orders)"),
      leverage: num("Desired leverage"),
    },
    ["symbol", "side", "notionalUsd"],
    async ({ symbol, side, notionalUsd, orderType, price, leverage }) => {
      const mode = perps.tradingMode();
      const preflight = perps.buildPreflightReport({
        symbol,
        notionalUsd,
        leverage,
        execution: mode === "live" ? "live" : "paper",
      });
      return {
        symbol: symbol.trim().toUpperCase(),
        side,
        notionalUsd,
        orderType: orderType ?? "market",
        execution: mode,
        preflight,
        route: {
          adapter: "vulcan",
          action: `${orderType ?? "market"}-${side}`,
          payload: {
            symbol: symbol.trim().toUpperCase(),
            side,
            notionalUsd,
            ...(price ? { price } : {}),
            ...(leverage ? { leverage } : {}),
          },
        },
      };
    },
  ),
  fn(
    "market_buy",
    "Place a market buy order (paper by default). Always preflight_check first.",
    {
      symbol: str("Market symbol, e.g. SOL"),
      notionalUsd: num(`Trade size in USDC (max ${perps.config.maxNotionalUsd})`),
      leverage: num("Desired leverage"),
      execution: str("Execution mode (default: paper). Live requires LIVE_TRADING=true"),
    },
    ["symbol", "notionalUsd"],
    async ({ symbol, notionalUsd, leverage, execution }) =>
      perps.marketBuy(symbol, notionalUsd, { leverage, execution: execution ?? "paper" }),
  ),
  fn(
    "market_sell",
    "Place a market sell order (paper by default). Always preflight_check first.",
    {
      symbol: str("Market symbol, e.g. SOL"),
      notionalUsd: num(`Trade size in USDC (max ${perps.config.maxNotionalUsd})`),
      leverage: num("Desired leverage"),
      execution: str("Execution mode (default: paper). Live requires LIVE_TRADING=true"),
    },
    ["symbol", "notionalUsd"],
    async ({ symbol, notionalUsd, leverage, execution }) =>
      perps.marketSell(symbol, notionalUsd, { leverage, execution: execution ?? "paper" }),
  ),
  fn(
    "limit_buy",
    "Place a limit buy order (paper by default). Base lots are the contract unit.",
    {
      symbol: str("Market symbol, e.g. SOL"),
      sizeLots: num("Order size in base lots"),
      price: num("Limit price in USDC"),
      execution: str("Execution mode (default: paper)"),
    },
    ["symbol", "sizeLots", "price"],
    async ({ symbol, sizeLots, price, execution }) =>
      perps.limitBuy(symbol, sizeLots, price, { execution: execution ?? "paper" }),
  ),
  fn(
    "limit_sell",
    "Place a limit sell order (paper by default). Base lots are the contract unit.",
    {
      symbol: str("Market symbol, e.g. SOL"),
      sizeLots: num("Order size in base lots"),
      price: num("Limit price in USDC"),
      execution: str("Execution mode (default: paper)"),
    },
    ["symbol", "sizeLots", "price"],
    async ({ symbol, sizeLots, price, execution }) =>
      perps.limitSell(symbol, sizeLots, price, { execution: execution ?? "paper" }),
  ),
  fn(
    "close_position",
    "Close an entire position for a symbol.",
    { symbol: str("Market symbol to close, e.g. SOL") },
    ["symbol"],
    async ({ symbol }) => perps.closePosition(symbol),
  ),
  fn(
    "close_all_positions",
    "Close every open position across all markets.",
    {},
    [],
    async () => perps.closeAllPositions(),
  ),
  fn(
    "cancel_all_orders",
    "Cancel all open orders, optionally for a specific market symbol.",
    { symbol: str("Market symbol to cancel orders for (optional)") },
    [],
    async ({ symbol }) => perps.cancelAllOrders(symbol),
  ),
  fn(
    "set_tpsl",
    "Set take-profit and/or stop-loss on an existing position.",
    {
      symbol: str("Market symbol, e.g. SOL"),
      tp: str("Take-profit as PRICE:SIZE_TOKENS (e.g. '180:0.5')"),
      sl: str("Stop-loss as PRICE:SIZE_TOKENS (e.g. '120:0.5')"),
    },
    ["symbol"],
    async ({ symbol, tp, sl }) => perps.setTpSl(symbol, { tp, sl }),
  ),
  fn(
    "deposit_collateral",
    "Deposit USDC collateral into the Phoenix trader account.",
    { amount: num("Amount of USDC to deposit") },
    ["amount"],
    async ({ amount }) => perps.depositCollateral(amount),
  ),
  fn(
    "withdraw_collateral",
    "Withdraw USDC collateral from the Phoenix trader account.",
    { amount: num("Amount of USDC to withdraw") },
    ["amount"],
    async ({ amount }) => perps.withdrawCollateral(amount),
  ),
  fn(
    "perps_health",
    "Check Vulcan connectivity, trading mode, wallet configuration, and runtime status.",
    {},
    [],
    async () => perps.health(),
  ),
  fn(
    "assess_token_risk",
    "Score a token 0-100 from liquidity, volume, 24h volatility, holder concentration, and mint/freeze flags.",
    {
      symbol: str("Token symbol, e.g. SOL, BONK"),
      price: num("Current price (quote currency)"),
      change24hPct: num("24h price change, percent"),
      volume24hUsd: num("24h trading volume, USD"),
      liquidityUsd: num("Pool/market liquidity, USD"),
      top10HolderPct: num("Percent of supply held by top 10 wallets"),
      mutable: bool("Whether token metadata is mutable"),
      hasMintAuth: bool("Whether mint authority is still active"),
      hasFreezeAuth: bool("Whether freeze authority is still active"),
    },
    [],
    async (snapshot) => risk.assessToken(snapshot),
  ),
  fn(
    "size_position",
    "Risk-based position sizing: notional in SOL such that a stop-out loses approximately riskPerTradePct of equity.",
    {
      equitySol: num("Total account equity, in SOL"),
      riskPerTradePct: num("Fraction of equity to lose if the stop is hit, e.g. 0.01 = 1%"),
      entryPrice: num("Planned entry price"),
      stopLossPrice: num("Planned stop price; must differ from entry"),
      confidence: num("0..1 signal confidence; scales the final size (default 1)"),
      maxPositionSol: num("Hard cap on notional in SOL (0/omit = no cap)"),
      maxPositionPct: num("Cap as a fraction of equity (0/omit = no cap)"),
    },
    ["equitySol", "riskPerTradePct", "entryPrice", "stopLossPrice"],
    async (input) => ({ sizeSol: risk.riskAdjustedSize(input) }),
  ),
  fn(
    "check_portfolio_guard",
    "Account-level risk gate: max concurrent positions, exposure caps, drawdown breaker, daily-loss limit.",
    {
      limits: {
        type: "object",
        description: "Account-level risk limits",
        additionalProperties: true,
      },
      asset: str("Asset symbol for the candidate entry"),
      sizeSol: num("Proposed position size, in SOL"),
      exposure: {
        type: "object",
        description: "Current book / session exposure snapshot",
        additionalProperties: true,
      },
    },
    ["limits", "asset", "sizeSol", "exposure"],
    async ({ limits, asset, sizeSol, exposure }) =>
      risk.checkPortfolioGuard(limits, asset, sizeSol, exposure),
  ),
];

if (envFlag("XAI_VIDEO_TOOL", true)) {
  TOOLS.push(
    fn(
      "generate_video",
      "Generate, edit, or extend a Grok Imagine video. Default is async: returns request_id immediately. Poll with get_video. Pass wait=true only for short clips you need inline.",
      {
        prompt: str("Video prompt"),
        image: str("Optional source image URL or file_id (image-to-video)"),
        video: str("Optional source video URL or file_id (edit or extend)"),
        extend: bool("If true with video, extend instead of edit"),
        duration: integer("Seconds (default 5)"),
        aspectRatio: str("Aspect ratio, e.g. 16:9, 9:16, 1:1"),
        resolution: str("720p or 480p"),
        wait: bool("Block until the video is done (slow). Default false."),
      },
      ["prompt"],
      async ({ prompt, image, video, extend, duration, aspectRatio, resolution, wait }) => {
        const opts = {
          prompt,
          image,
          video,
          extend: Boolean(extend),
          duration: duration ?? 5,
          aspectRatio: aspectRatio ?? "16:9",
          resolution: resolution ?? "720p",
        };
        if (wait) return imagine.generateVideo({ ...opts, wait: true });
        const started = await imagine.startVideo(opts);
        return { status: "pending", request_id: started.request_id, poll: "get_video" };
      },
    ),
    fn(
      "get_video",
      "Poll a Grok Imagine video job by request_id from generate_video.",
      { requestId: str("request_id returned by generate_video") },
      ["requestId"],
      async ({ requestId }) => imagine.getVideo(requestId),
    ),
  );
}

const BY_NAME = new Map(TOOLS.map((t) => [t.def.name, t]));

export const GROK_TOOLS = TOOLS.map((t) => t.def);
export const GROK_TOOL_NAMES = TOOLS.map((t) => t.def.name);

export async function executeGrokTool(name, args = {}) {
  const tool = BY_NAME.get(name);
  if (!tool) throw new Error(`unknown tool: ${name}`);
  return json(await tool.handler(args ?? {}));
}
