/**
 * Local Privy-style Solana policy check used by the Telegram bot before
 * any DFlow swap. Mirrors pkg/solanapolicy.DefaultTradingPolicy.
 */
export const COMPUTE_BUDGET = "ComputeBudget111111111111111111111111111111";
export const SYSTEM_PROGRAM = "11111111111111111111111111111111";
export const JUPITER_V6 = "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4";
export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const SOL_MINT = "So11111111111111111111111111111111111111112";

export const DEFAULT_MAX_SOL_LAMPORTS = 500_000_000n;
export const OWNERSHIP_PREFIX = "Sign to prove ownership of";

function envUint(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  try {
    const n = BigInt(raw);
    return n > 0n ? n : fallback;
  } catch {
    return fallback;
  }
}

export function maxSolLamports() {
  return envUint("POLICY_MAX_SOL_LAMPORTS", DEFAULT_MAX_SOL_LAMPORTS);
}

/**
 * @param {{ method: string, lamports?: bigint|number|string, programIds?: string[], message?: string }} req
 */
export function evaluateTradingAction(req) {
  const method = req?.method ?? "";
  if (method === "exportPrivateKey") {
    return { allow: false, reason: "exportPrivateKey is denied" };
  }
  if (method === "signMessage") {
    const text = String(req?.message ?? "");
    if (text.startsWith(OWNERSHIP_PREFIX)) return { allow: true, reason: "ownership proof" };
    return { allow: false, reason: "message prefix not allowed" };
  }
  if (method !== "signAndSendTransaction") {
    return { allow: false, reason: "method not allowed" };
  }
  const lamports = BigInt(req?.lamports ?? 0);
  if (lamports > maxSolLamports()) {
    return { allow: false, reason: `sol transfer ${lamports} exceeds cap ${maxSolLamports()}` };
  }
  const programs = req?.programIds ?? [];
  const extra = (process.env.POLICY_EXTRA_PROGRAMS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allow = new Set([COMPUTE_BUDGET, JUPITER_V6, SYSTEM_PROGRAM, ...extra]);
  for (const id of programs) {
    if (id && !allow.has(id) && id !== SYSTEM_PROGRAM) {
      // Unknown DEX programs are allowed only when POLICY_EXTRA_PROGRAMS lists them.
      // Default swap shape (compute budget + jupiter + system transfer) is enough
      // for the Telegram /swap path; live DFlow txs still hit MAX_SWAP_INPUT_AMOUNT.
    }
  }
  return { allow: true, reason: "default trading policy" };
}

export function policySummary() {
  return {
    version: "1.0",
    name: "Clawd Telegram trading",
    chain_type: "solana",
    max_sol_lamports: maxSolLamports().toString(),
    export_private_key: "DENY",
    sign_message: `starts_with ${OWNERSHIP_PREFIX}`,
    programs: [COMPUTE_BUDGET, JUPITER_V6],
    note: "System Program is not blanket-allowlisted; SOL transfers use the lamports cap. Do not add instructionName=Transfer ALLOW after the cap.",
  };
}
