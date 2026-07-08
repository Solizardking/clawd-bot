/**
 * risk — account- and token-level risk primitives.
 *
 * Ported from the clawdbot Go trading engine (pkg/trading/risk.go,
 * pkg/trading/portfolio.go, pkg/strategy/strategy.go RiskAdjustedSize) into
 * pure JS functions so Zero Clawd can call them as MCP tools. Same formulas,
 * same thresholds — reimplemented rather than shelled out to Go so they run
 * in-process alongside the other zero-service trading tools.
 */

// ── Token risk assessment ───────────────────────────────────────────────
// Scores a token 0-100 from liquidity, volume, volatility, holder
// concentration, and mint/freeze authority flags. Mirrors AssessToken.

function grade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 55) return "D";
  return "F";
}

function confidenceMultiplier(score) {
  if (score >= 90) return 1.05;
  if (score >= 80) return 1.0;
  if (score >= 70) return 0.9;
  if (score >= 55) return 0.75;
  if (score >= 45) return 0.6;
  return 0.25;
}

/**
 * @param {{
 *   symbol?: string, price?: number, change24hPct?: number,
 *   volume24hUsd?: number, liquidityUsd?: number, top10HolderPct?: number,
 *   mutable?: boolean, hasMintAuth?: boolean, hasFreezeAuth?: boolean,
 * }} snapshot
 */
export function assessToken(snapshot) {
  const s = {
    symbol: snapshot.symbol?.trim() || "UNKNOWN",
    price: snapshot.price ?? 0,
    change24hPct: snapshot.change24hPct ?? 0,
    volume24hUsd: snapshot.volume24hUsd ?? 0,
    liquidityUsd: snapshot.liquidityUsd ?? 0,
    top10HolderPct: snapshot.top10HolderPct ?? 0,
    mutable: !!snapshot.mutable,
    hasMintAuth: !!snapshot.hasMintAuth,
    hasFreezeAuth: !!snapshot.hasFreezeAuth,
  };

  let score = 100;
  const reasons = [];

  if (s.price <= 0) {
    score -= 30;
    reasons.push("missing or invalid price");
  }

  if (s.liquidityUsd < 25_000) {
    score -= 40;
    reasons.push("liquidity below $25k");
  } else if (s.liquidityUsd < 100_000) {
    score -= 25;
    reasons.push("liquidity below $100k");
  } else if (s.liquidityUsd < 250_000) {
    score -= 10;
    reasons.push("liquidity below $250k");
  }

  if (s.volume24hUsd < 50_000) {
    score -= 25;
    reasons.push("24h volume below $50k");
  } else if (s.volume24hUsd < 500_000) {
    score -= 12;
    reasons.push("24h volume below $500k");
  }

  const absChange = Math.abs(s.change24hPct);
  if (absChange > 80) {
    score -= 20;
    reasons.push("24h move exceeds 80%");
  } else if (absChange > 40) {
    score -= 10;
    reasons.push("24h move exceeds 40%");
  }

  if (s.top10HolderPct > 70) {
    score -= 25;
    reasons.push("top 10 holders exceed 70%");
  } else if (s.top10HolderPct > 50) {
    score -= 12;
    reasons.push("top 10 holders exceed 50%");
  }

  if (s.mutable) {
    score -= 8;
    reasons.push("token metadata is mutable");
  }
  if (s.hasMintAuth) {
    score -= 20;
    reasons.push("mint authority is active");
  }
  if (s.hasFreezeAuth) {
    score -= 20;
    reasons.push("freeze authority is active");
  }

  if (score < 0) score = 0;

  const decision = score < 45 ? "block" : score < 70 ? "dry_run" : "allow";
  if (reasons.length === 0) {
    reasons.push("liquidity, volume, and authority checks are within configured guardrails");
  }

  return {
    symbol: s.symbol,
    score,
    grade: grade(score),
    decision,
    reasons,
    confidenceMultiplier: confidenceMultiplier(score),
  };
}

/** Scales a base confidence (0..1) by a token risk assessment, clamped to [0,1]. */
export function adjustConfidence(base, riskAssessment) {
  const adjusted = base * riskAssessment.confidenceMultiplier;
  if (adjusted < 0) return 0;
  if (adjusted > 1) return 1;
  return adjusted;
}

// ── Risk-based position sizing ──────────────────────────────────────────
// Volatility-aware sizing: size the trade so hitting its stop loses a fixed
// fraction of equity. Size scales inversely with stop distance and linearly
// with signal confidence. Mirrors strategy.RiskAdjustedSize.

/**
 * @param {{
 *   equitySol: number, riskPerTradePct: number, entryPrice: number,
 *   stopLossPrice: number, confidence?: number,
 *   maxPositionSol?: number, maxPositionPct?: number,
 * }} input
 * @returns {number} position notional in SOL, or 0 when inputs are unusable
 */
export function riskAdjustedSize(input) {
  const equitySol = input.equitySol ?? 0;
  const riskPerTradePct = input.riskPerTradePct ?? 0;
  const entryPrice = input.entryPrice ?? 0;
  const stopLossPrice = input.stopLossPrice ?? 0;

  if (equitySol <= 0 || entryPrice <= 0 || riskPerTradePct <= 0) return 0;

  const stopDist = Math.abs(entryPrice - stopLossPrice);
  if (stopDist <= 0) return 0;

  const lossFrac = stopDist / entryPrice;
  let notional = (equitySol * riskPerTradePct) / lossFrac;

  let conf = input.confidence ?? 1;
  if (conf <= 0) conf = 1;
  else if (conf > 1) conf = 1;
  notional *= conf;

  if (input.maxPositionPct > 0) {
    const cap = equitySol * input.maxPositionPct;
    if (notional > cap) notional = cap;
  }
  if (input.maxPositionSol > 0 && notional > input.maxPositionSol) {
    notional = input.maxPositionSol;
  }

  return notional < 0 ? 0 : notional;
}

// ── Portfolio risk guard ────────────────────────────────────────────────
// Account-level gate consulted before every new entry: max concurrent
// positions, total/per-asset exposure caps, a drawdown circuit breaker, and
// a daily-loss limit. Mirrors trading.PortfolioLimits.CheckEntry.

function drawdown(exposure) {
  const peak = exposure.peakEquity ?? 0;
  const equity = exposure.equity ?? 0;
  if (peak <= 0 || equity >= peak) return 0;
  return (peak - equity) / peak;
}

function sessionLoss(exposure) {
  const start = exposure.sessionStartEquity ?? 0;
  const pnl = exposure.sessionPnlSol ?? 0;
  if (start <= 0 || pnl >= 0) return 0;
  return -pnl / start;
}

/**
 * @param {{maxConcurrent?: number, maxTotalExposure?: number, maxPerAsset?: number,
 *   maxDrawdownPct?: number, dailyLossLimitPct?: number}} limits
 * @param {string} asset
 * @param {number} sizeSol
 * @param {{count?: number, totalSol?: number, perAssetSol?: Record<string, number>,
 *   peakEquity?: number, equity?: number, sessionPnlSol?: number, sessionStartEquity?: number}} exposure
 */
export function checkPortfolioGuard(limits, asset, sizeSol, exposure) {
  const reasons = [];
  asset = (asset ?? "").trim();
  exposure = exposure ?? {};

  // Circuit breakers first — halt all new entries regardless of size.
  if (limits.maxDrawdownPct > 0) {
    const dd = drawdown(exposure);
    if (dd >= limits.maxDrawdownPct) {
      reasons.push(
        `drawdown circuit breaker: ${(dd * 100).toFixed(1)}% >= ${(limits.maxDrawdownPct * 100).toFixed(1)}% limit`,
      );
    }
  }
  if (limits.dailyLossLimitPct > 0) {
    const loss = sessionLoss(exposure);
    if (loss >= limits.dailyLossLimitPct) {
      reasons.push(
        `daily loss limit: ${(loss * 100).toFixed(1)}% >= ${(limits.dailyLossLimitPct * 100).toFixed(1)}% limit`,
      );
    }
  }

  if (sizeSol <= 0) reasons.push("position size must be positive");

  const count = exposure.count ?? 0;
  if (!(limits.maxConcurrent > 0)) {
    reasons.push("max concurrent positions is zero (trading halted)");
  } else if (count >= limits.maxConcurrent) {
    reasons.push(`max concurrent positions reached (${count}/${limits.maxConcurrent})`);
  }

  const totalSol = exposure.totalSol ?? 0;
  if (limits.maxTotalExposure > 0 && totalSol + sizeSol > limits.maxTotalExposure) {
    reasons.push(
      `total exposure ${totalSol.toFixed(4)} + ${sizeSol.toFixed(4)} exceeds cap ${limits.maxTotalExposure.toFixed(4)} SOL`,
    );
  }

  if (limits.maxPerAsset > 0 && asset !== "") {
    const current = exposure.perAssetSol?.[asset] ?? 0;
    if (current + sizeSol > limits.maxPerAsset) {
      reasons.push(
        `${asset} exposure ${current.toFixed(4)} + ${sizeSol.toFixed(4)} exceeds per-asset cap ${limits.maxPerAsset.toFixed(4)} SOL`,
      );
    }
  }

  return { allowed: reasons.length === 0, reasons };
}
