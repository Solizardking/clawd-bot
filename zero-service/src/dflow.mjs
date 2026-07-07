/**
 * DFlow spot trading, ported from ClawdBrowser's src/lib/dflow/trader.ts so the
 * MCP server is self-contained (no dependency on the Next.js runtime).
 *
 * Quote:  GET {DFLOW_TRADE_API_URL}/order?...   (optionally with userPublicKey to get a tx)
 * Swap:   quote (with userPublicKey) -> deserialize -> sign with agent key -> sendTransaction
 *
 * Docs: https://pond.dflow.net/spot/recipes/quickstart
 */
import {
  Connection,
  Keypair,
  PublicKey,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";

const DFLOW_TRADE_API_URL =
  process.env.DFLOW_TRADE_API_URL ?? "https://dev-quote-api.dflow.net";
const DFLOW_API_KEY = process.env.DFLOW_API_KEY;
const DFLOW_SETTLEMENT_MINT =
  process.env.DFLOW_SETTLEMENT_MINT ??
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
const DFLOW_FEE_ACCOUNT = process.env.DFLOW_PUBLIC_SPOT_SOL_FEE_ACCOUNT;
const DFLOW_SPONSOR = process.env.DFLOW_SPONSOR;
const DFLOW_PRIORITY_FEE = process.env.DFLOW_PRIORITY_FEE ?? "auto";
const RPC_URL =
  process.env.RPC_URL ??
  process.env.SOLANA_RPC_URL ??
  "https://api.mainnet-beta.solana.com";

export const SOL_MINT = "So11111111111111111111111111111111111111112";
const SOL_DECIMALS = 9;
const DEFAULT_DECIMALS = 6;

/** Hard safety cap: max notional per swap, denominated in the *input* token's
 * human units. Prevents a hallucinated/oversized trade from draining the wallet.
 * Configure via MAX_SWAP_INPUT_AMOUNT (e.g. "1" = at most 1 SOL / 1 USDC per trade). */
const MAX_SWAP_INPUT_AMOUNT = Number(process.env.MAX_SWAP_INPUT_AMOUNT ?? "0.5");

let _connection;
export function getConnection() {
  if (!_connection) _connection = new Connection(RPC_URL, "confirmed");
  return _connection;
}

function getAgentKeypair() {
  const pk =
    process.env.WALLET_PRIVATE_KEY ?? process.env.AGENT_WALLET_PRIVATE_KEY;
  if (!pk) throw new Error("No agent wallet private key configured (set WALLET_PRIVATE_KEY)");
  return Keypair.fromSecretKey(bs58.decode(pk.trim()));
}

export function agentPublicKey() {
  return getAgentKeypair().publicKey.toBase58();
}

function toRawAmount(human, decimals) {
  const parts = String(human).split(".");
  const int = parts[0] || "0";
  const frac = (parts[1] ?? "").padEnd(decimals, "0").slice(0, decimals);
  return BigInt(int + frac).toString();
}

function fromRaw(raw, decimals) {
  const padded = String(raw).padStart(decimals + 1, "0");
  const intPart = padded.slice(0, padded.length - decimals) || "0";
  const fracPart = padded.slice(padded.length - decimals);
  return `${intPart}.${fracPart}`.replace(/\.?0+$/, "") || "0";
}

function guessDecimals(mint) {
  return mint === SOL_MINT ? SOL_DECIMALS : DEFAULT_DECIMALS;
}

function buildQueryParams({ inputMint, outputMint, rawAmount, slippageBps, userPublicKey }) {
  const qp = new URLSearchParams();
  qp.append("inputMint", inputMint);
  qp.append("outputMint", outputMint);
  qp.append("amount", rawAmount);
  qp.append("slippageBps", String(slippageBps));
  qp.append("prioritizationFeeLamports", String(DFLOW_PRIORITY_FEE));
  if (DFLOW_FEE_ACCOUNT) qp.append("feeAccount", DFLOW_FEE_ACCOUNT);
  if (DFLOW_SPONSOR) qp.append("sponsor", DFLOW_SPONSOR);
  if (userPublicKey) qp.append("userPublicKey", userPublicKey);
  return qp;
}

async function fetchOrder(qp) {
  const headers = {};
  if (DFLOW_API_KEY) headers["x-api-key"] = DFLOW_API_KEY;
  const url = `${DFLOW_TRADE_API_URL}/order?${qp.toString()}`;
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DFlow /order error ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

/**
 * Get a spot quote. Returns human-readable in/out amounts plus raw order data.
 */
export async function quote({ inputMint = SOL_MINT, outputMint = DFLOW_SETTLEMENT_MINT, amount, slippageBps = 50 } = {}) {
  if (amount === undefined || amount === null || amount === "")
    throw new Error("amount is required");
  const inDecimals = guessDecimals(inputMint);
  const rawAmount = toRawAmount(amount, inDecimals);
  const data = await fetchOrder(
    buildQueryParams({ inputMint, outputMint, rawAmount, slippageBps }),
  );
  const outDecimals = guessDecimals(outputMint);
  const inAmountRaw = String(data.inAmount ?? rawAmount);
  const outAmountRaw = String(data.outAmount ?? "0");
  return {
    inputMint,
    outputMint,
    inAmount: fromRaw(inAmountRaw, inDecimals),
    outAmount: fromRaw(outAmountRaw, outDecimals),
    inAmountRaw,
    outAmountRaw,
    slippageBps: data.slippageBps ?? slippageBps,
    priceImpactPct: data.priceImpactPct ?? "0",
    executionMode: data.executionMode ?? "sync",
    price:
      Number(fromRaw(outAmountRaw, outDecimals)) /
        Number(fromRaw(inAmountRaw, inDecimals)) || 0,
  };
}

/**
 * Execute a swap with the agent hot wallet. Enforces MAX_SWAP_INPUT_AMOUNT.
 */
export async function swap({ inputMint = SOL_MINT, outputMint = DFLOW_SETTLEMENT_MINT, amount, slippageBps = 50 } = {}) {
  if (amount === undefined || amount === null || amount === "")
    throw new Error("amount is required");
  if (Number(amount) > MAX_SWAP_INPUT_AMOUNT) {
    throw new Error(
      `Refused: input amount ${amount} exceeds MAX_SWAP_INPUT_AMOUNT (${MAX_SWAP_INPUT_AMOUNT}). ` +
        `Ask the operator to raise the cap for larger trades.`,
    );
  }
  const keypair = getAgentKeypair();
  const inDecimals = guessDecimals(inputMint);
  const rawAmount = toRawAmount(amount, inDecimals);

  const data = await fetchOrder(
    buildQueryParams({
      inputMint,
      outputMint,
      rawAmount,
      slippageBps,
      userPublicKey: keypair.publicKey.toBase58(),
    }),
  );
  const txB64 = data.transaction;
  if (!txB64) throw new Error("DFlow did not return a transaction to sign");

  const tx = VersionedTransaction.deserialize(Buffer.from(txB64, "base64"));
  tx.sign([keypair]);

  const connection = getConnection();
  const signature = await connection.sendTransaction(tx, {
    skipPreflight: false,
    maxRetries: 3,
  });

  const outDecimals = guessDecimals(outputMint);
  const result = {
    signature,
    explorerUrl: `https://solscan.io/tx/${signature}`,
    inputMint,
    outputMint,
    inAmount: fromRaw(rawAmount, inDecimals),
    outAmount: fromRaw(String(data.outAmount ?? "0"), outDecimals),
    executionMode: data.executionMode ?? "sync",
  };

  if (result.executionMode === "async") return result;

  const { value } = await connection.confirmTransaction(signature, "confirmed");
  if (value?.err)
    throw new Error(`DFlow swap failed: ${JSON.stringify(value.err)}`);
  return result;
}

/**
 * Balances for a wallet (defaults to the agent wallet): native SOL + SPL tokens.
 */
export async function balances(owner) {
  const connection = getConnection();
  const ownerPk = new PublicKey(owner ?? agentPublicKey());
  const lamports = await connection.getBalance(ownerPk);
  const parsed = await connection.getParsedTokenAccountsByOwner(ownerPk, {
    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
  });
  const tokens = parsed.value
    .map((a) => {
      const info = a.account.data.parsed.info;
      return {
        mint: info.mint,
        amount: info.tokenAmount.uiAmountString,
        decimals: info.tokenAmount.decimals,
      };
    })
    .filter((t) => Number(t.amount) > 0);
  return {
    owner: ownerPk.toBase58(),
    sol: lamports / LAMPORTS_PER_SOL,
    tokens,
  };
}

/** RPC host only — never expose the full URL, it may embed an API key. */
function rpcHost() {
  try {
    return new URL(RPC_URL).host;
  } catch {
    return "unknown";
  }
}

export const config = {
  settlementMint: DFLOW_SETTLEMENT_MINT,
  solMint: SOL_MINT,
  rpcHost: rpcHost(),
  maxSwapInputAmount: MAX_SWAP_INPUT_AMOUNT,
  tradeApiUrl: DFLOW_TRADE_API_URL,
};
