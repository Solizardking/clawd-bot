import { test } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateTradingAction,
  policySummary,
  OWNERSHIP_PREFIX,
  DEFAULT_MAX_SOL_LAMPORTS,
} from "./solana-policy.mjs";
import { _test } from "./telegram-bot.mjs";

test("default policy denies oversized SOL and key export", () => {
  const over = evaluateTradingAction({
    method: "signAndSendTransaction",
    lamports: DEFAULT_MAX_SOL_LAMPORTS + 1n,
  });
  assert.equal(over.allow, false);
  const ok = evaluateTradingAction({
    method: "signAndSendTransaction",
    lamports: 10_000_000n,
  });
  assert.equal(ok.allow, true);
  const exp = evaluateTradingAction({ method: "exportPrivateKey" });
  assert.equal(exp.allow, false);
  const msg = evaluateTradingAction({
    method: "signMessage",
    message: OWNERSHIP_PREFIX + " wallet",
  });
  assert.equal(msg.allow, true);
});

test("policy summary does not include secrets", () => {
  const s = policySummary();
  assert.equal(s.chain_type, "solana");
  assert.equal(s.export_private_key, "DENY");
  const blob = JSON.stringify(s);
  assert.equal(blob.includes("PRIVY"), false);
  assert.equal(blob.includes("TOKEN"), false);
});

test("parseSwap defaults SOL to USDC", () => {
  const got = _test.parseSwap("/quote 0.01");
  assert.equal(got.amount, "0.01");
  assert.ok(got.inputMint);
  assert.ok(got.outputMint);
});
