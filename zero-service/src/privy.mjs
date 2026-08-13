/**
 * Privy REST helper for bot-first Telegram wallets.
 * Never logs app secret or authorization keys.
 */
const DEFAULT_BASE = "https://api.privy.io/v1";
const SOLANA_CAIP2 = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";

export function privyConfigured() {
  return Boolean(process.env.PRIVY_APP_ID?.trim() && process.env.PRIVY_APP_SECRET?.trim());
}

export function privyHealth() {
  return {
    configured: privyConfigured(),
    signer: Boolean(process.env.PRIVY_SIGNER_ID?.trim()),
    policy: Boolean(process.env.PRIVY_POLICY_ID?.trim()),
  };
}

function authHeaders() {
  const id = process.env.PRIVY_APP_ID?.trim();
  const secret = process.env.PRIVY_APP_SECRET?.trim();
  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  return {
    Authorization: `Basic ${basic}`,
    "privy-app-id": id,
    "Content-Type": "application/json",
  };
}

function baseURL() {
  return (process.env.PRIVY_BASE_URL ?? DEFAULT_BASE).replace(/\/$/, "");
}

async function call(path, { method = "GET", body } = {}) {
  const res = await fetch(`${baseURL()}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg = json?.error ?? json?.message ?? text.slice(0, 200);
    throw new Error(`privy http ${res.status}: ${msg}`);
  }
  return json;
}

export async function ensureTelegramWallet(telegramUserId) {
  if (!privyConfigured()) {
    throw new Error("PRIVY_APP_ID / PRIVY_APP_SECRET are not set");
  }
  let user;
  try {
    user = await call(`/users/telegram/telegram_user_id/${telegramUserId}`);
  } catch {
    user = await call("/users", {
      method: "POST",
      body: {
        linked_accounts: [{ type: "telegram", telegram_user_id: String(telegramUserId) }],
      },
    });
  }
  const existing = (user?.linked_accounts ?? []).find(
    (a) => a.type === "wallet" && (a.chain_type === "solana" || a.id),
  );
  if (existing?.id || existing?.address) {
    return {
      userId: user.id,
      walletId: existing.id ?? existing.wallet_id,
      address: existing.address ?? "",
    };
  }
  const signerId = process.env.PRIVY_SIGNER_ID?.trim();
  const policyId = process.env.PRIVY_POLICY_ID?.trim();
  const body = {
    chain_type: "solana",
    owner: { user_id: user.id },
  };
  if (signerId) {
    body.additional_signers = [
      {
        signer_id: signerId,
        override_policy_ids: policyId ? [policyId] : [],
      },
    ];
  }
  const wallet = await call("/wallets", { method: "POST", body });
  return { userId: user.id, walletId: wallet.id, address: wallet.address };
}

export async function signAndSendSolana(walletId, txBase64) {
  const json = await call(`/wallets/${walletId}/rpc`, {
    method: "POST",
    body: {
      method: "signAndSendTransaction",
      caip2: SOLANA_CAIP2,
      params: { transaction: txBase64, encoding: "base64" },
    },
  });
  return json?.data?.hash ?? json?.hash ?? "";
}
