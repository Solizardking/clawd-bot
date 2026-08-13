/**
 * Telegram long-poll trading bot. Starts when TELEGRAM_BOT_TOKEN is set.
 * Commands use DFlow + optional Privy; other text goes to grok-4.6.
 */
import "./load-env.mjs";
import * as dflow from "./dflow.mjs";
import { runGrokTurn } from "./grok-runner.mjs";
import { xaiConfigured } from "./xai-client.mjs";
import { evaluateTradingAction, policySummary, maxSolLamports } from "./solana-policy.mjs";
import { ensureTelegramWallet, privyConfigured, privyHealth, signAndSendSolana } from "./privy.mjs";

const API = "https://api.telegram.org";
const wallets = new Map();
let polling = false;
let offset = 0;

export function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim());
}

export function telegramHealth() {
  return {
    configured: telegramConfigured(),
    polling,
    privy: privyHealth(),
    allow_from: allowList().length > 0,
  };
}

function token() {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
}

function allowList() {
  const raw = [
    process.env.TELEGRAM_ALLOW_FROM,
    process.env.TELEGRAM_ALLOWED_CHATS,
    process.env.TELEGRAM_CHAT_ID,
  ]
    .filter(Boolean)
    .join(",");
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function allowed(from) {
  const list = allowList();
  if (!list.length) return true;
  const id = String(from?.id ?? "");
  const user = from?.username ? `@${from.username}` : "";
  return list.includes(id) || (user && list.includes(user)) || list.includes(from?.username);
}

async function api(method, body) {
  const res = await fetch(`${API}/bot${token()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!json.ok) {
    const desc = json.description ?? `http ${res.status}`;
    throw new Error(String(desc).replaceAll(token(), "***"));
  }
  return json.result;
}

async function send(chatId, text) {
  const msg = String(text ?? "").slice(0, 4090);
  if (!msg) return;
  await api("sendMessage", { chat_id: chatId, text: msg });
}

const HELP = `Clawd Telegram trading bot (Solana + DFlow + Privy)

/start — create a Privy user + Solana wallet (bot-first)
/wallet — show your linked wallet
/quote 0.01 SOL USDC — DFlow quote
/swap 0.01 SOL USDC — policy-gated swap
/policy — signer policy
/help — this list

Natural language uses grok-4.6 when XAI_API_KEY is set.`;

function parseSwap(text) {
  const parts = text.trim().split(/\s+/).slice(1);
  const amount = parts[0];
  const inSym = (parts[1] ?? "SOL").toUpperCase();
  const outSym = (parts[2] ?? "USDC").toUpperCase();
  const inputMint = inSym === "USDC" ? dflow.config.settlementMint : dflow.SOL_MINT;
  const outputMint = outSym === "SOL" ? dflow.SOL_MINT : dflow.config.settlementMint;
  return { amount, inputMint, outputMint };
}

async function handleCommand(msg) {
  const text = String(msg.text ?? "").trim();
  const fromId = msg.from?.id;
  const [rawCmd] = text.split(/\s+/, 1);
  const cmd = rawCmd.split("@")[0].toLowerCase();

  if (cmd === "/help") return HELP;

  if (cmd === "/policy") {
    return JSON.stringify(policySummary(), null, 2);
  }

  if (cmd === "/start") {
    if (wallets.has(fromId)) {
      const w = wallets.get(fromId);
      return `Wallet already linked:\n${w.address || w.walletId}`;
    }
    if (!privyConfigured()) {
      return `${HELP}\n\nPrivy is not configured. Quotes still work via /quote. Set PRIVY_APP_ID and PRIVY_APP_SECRET for bot-first wallets.`;
    }
    const w = await ensureTelegramWallet(fromId);
    wallets.set(fromId, w);
    return `Privy Solana wallet ready.\n${w.address || w.walletId}\nThe bot is an additional signer (no key export, SOL cap ${maxSolLamports()} lamports).`;
  }

  if (cmd === "/wallet") {
    const w = wallets.get(fromId);
    return w ? `Wallet: ${w.address || w.walletId}` : "No wallet yet. Send /start first.";
  }

  if (cmd === "/quote" || cmd === "/swap" || cmd === "/transact") {
    const args = parseSwap(text);
    if (!args.amount) return "Usage: /quote 0.01 SOL USDC";
    const capSol = Number(maxSolLamports()) / 1e9;
    if (args.inputMint === dflow.SOL_MINT && Number(args.amount) > capSol) {
      return `Policy denied: amount exceeds ${capSol} SOL cap`;
    }
    const policy = evaluateTradingAction({
      method: "signAndSendTransaction",
      lamports: args.inputMint === dflow.SOL_MINT ? BigInt(Math.round(Number(args.amount) * 1e9)) : 0n,
    });
    if (!policy.allow) return `Policy denied: ${policy.reason}`;

    if (cmd === "/quote") {
      const quote = await dflow.quote(args);
      return `Quote: ${quote.inAmount} → ${quote.outAmount} (impact ${quote.priceImpactPct}%)`;
    }

    const w = wallets.get(fromId);
    if (w?.walletId && w.address && privyConfigured()) {
      const built = await dflow.order({ ...args, userPublicKey: w.address });
      if (!built?.transaction) {
        return "DFlow did not return a transaction for your Privy wallet.";
      }
      const sig = await signAndSendSolana(w.walletId, built.transaction);
      return `Sent via Privy signer\ntx ${sig}`;
    }
    const result = await dflow.swap(args);
    return `Sent via agent wallet\ntx ${result.signature}`;
  }

  if (xaiConfigured()) {
    const result = await runGrokTurn(
      text,
      () => {},
      { serviceTier: "priority" },
    );
    return result.final || "(empty grok reply)";
  }
  return "Unknown command. Try /help";
}

export async function startTelegramBot() {
  if (!telegramConfigured()) {
    console.log("[telegram] TELEGRAM_BOT_TOKEN unset — bot idle");
    return { started: false };
  }
  if (polling) return { started: true, already: true };
  polling = true;
  try {
    const me = await api("getMe");
    await api("setMyCommands", {
      commands: [
        { command: "start", description: "Create or link your Privy Solana wallet" },
        { command: "wallet", description: "Show your Solana wallet" },
        { command: "quote", description: "Quote a DFlow swap" },
        { command: "swap", description: "Execute a capped DFlow swap" },
        { command: "policy", description: "Show the Solana signer policy" },
        { command: "help", description: "Command list" },
      ],
    });
    console.log(`[telegram] bot @${me.username ?? me.id} long-polling`);
  } catch (err) {
    polling = false;
    console.error("[telegram] getMe failed:", err?.message ?? err);
    throw err;
  }
  void loop();
  return { started: true };
}

export function stopTelegramBot() {
  polling = false;
}

async function loop() {
  while (polling) {
    try {
      const updates = await api("getUpdates", {
        offset,
        timeout: 30,
        allowed_updates: ["message"],
      });
      for (const upd of updates ?? []) {
        offset = upd.update_id + 1;
        const msg = upd.message;
        if (!msg?.from || !allowed(msg.from)) continue;
        try {
          const reply = await handleCommand(msg);
          if (reply) await send(msg.chat.id, reply);
        } catch (err) {
          const text = `error: ${err?.message ?? err}`;
          try {
            await send(msg.chat.id, text);
          } catch {
            /* ignore send failure */
          }
        }
      }
    } catch (err) {
      if (!polling) return;
      console.error("[telegram] poll:", err?.message ?? err);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

export const _test = { handleCommand, allowed, parseSwap, wallets };

const isMain = process.argv[1] && /telegram-bot\.mjs$/.test(process.argv[1]);
if (isMain) {
  startTelegramBot().catch((err) => {
    console.error("[telegram]", err?.message ?? err);
    process.exit(1);
  });
}
