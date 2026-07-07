/**
 * markets — read-only equities / index market data for Zero Clawd.
 *
 * Uses a configurable HTTP endpoint (STOCK_API_URL). The default is Yahoo
 * Finance's public chart API, which is keyless and returns OHLC + last price.
 * All calls here are READ-ONLY — there is no equities order execution. Zero
 * Clawd trades on-chain (Solana spot via DFlow, see dflow.mjs); stocks are
 * analysis/context only.
 */

const STOCK_API_URL = (process.env.STOCK_API_URL ?? "https://query1.finance.yahoo.com").replace(/\/+$/, "");
const STOCK_API_KEY = process.env.STOCK_API_KEY ?? "";

function authHeaders() {
  const h = { "User-Agent": "zero-clawd/0.1 (+markets)" };
  if (STOCK_API_KEY) h.Authorization = `Bearer ${STOCK_API_KEY}`;
  return h;
}

async function getJson(url) {
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`market data ${res.status} for ${url}`);
  return res.json();
}

/**
 * Latest quote for a symbol (e.g. "AAPL", "SPY", "^GSPC", "BTC-USD").
 * Returns { symbol, price, currency, previousClose, changePct, exchange, time }.
 */
export async function quote(symbol) {
  const sym = String(symbol ?? "").trim().toUpperCase();
  if (!sym) throw new Error("symbol required (e.g. AAPL)");
  const url = `${STOCK_API_URL}/v8/finance/chart/${encodeURIComponent(sym)}?range=1d&interval=1d`;
  const data = await getJson(url);
  const r = data?.chart?.result?.[0];
  const m = r?.meta;
  if (!m) throw new Error(`no data for ${sym}`);
  const price = m.regularMarketPrice ?? null;
  const prev = m.chartPreviousClose ?? m.previousClose ?? null;
  const changePct = price != null && prev ? ((price - prev) / prev) * 100 : null;
  return {
    symbol: m.symbol ?? sym,
    price,
    currency: m.currency ?? null,
    previousClose: prev,
    changePct: changePct != null ? Number(changePct.toFixed(2)) : null,
    exchange: m.exchangeName ?? null,
    time: m.regularMarketTime ?? null,
  };
}

/**
 * Historical OHLC candles for a symbol.
 * range: 1d,5d,1mo,3mo,6mo,1y,5y,max — interval: 1d,1wk,1mo (etc).
 * Returns { symbol, currency, candles: [{ t, open, high, low, close, volume }] }.
 */
export async function history(symbol, { range = "1mo", interval = "1d" } = {}) {
  const sym = String(symbol ?? "").trim().toUpperCase();
  if (!sym) throw new Error("symbol required (e.g. AAPL)");
  const url =
    `${STOCK_API_URL}/v8/finance/chart/${encodeURIComponent(sym)}` +
    `?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`;
  const data = await getJson(url);
  const r = data?.chart?.result?.[0];
  if (!r) throw new Error(`no data for ${sym}`);
  const ts = r.timestamp ?? [];
  const q = r.indicators?.quote?.[0] ?? {};
  const candles = ts.map((t, i) => ({
    t,
    open: q.open?.[i] ?? null,
    high: q.high?.[i] ?? null,
    low: q.low?.[i] ?? null,
    close: q.close?.[i] ?? null,
    volume: q.volume?.[i] ?? null,
  }));
  return { symbol: r.meta?.symbol ?? sym, currency: r.meta?.currency ?? null, range, interval, candles };
}

export const config = { stockApiUrl: STOCK_API_URL, hasKey: Boolean(STOCK_API_KEY) };
