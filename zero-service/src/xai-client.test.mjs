/**
 * Offline tests for xAI builtins, Imagine helpers, and grok tool catalog.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { GROK_TOOLS, GROK_TOOL_NAMES } from "./grok-tools.mjs";
import { executeGrokTool } from "./grok-tools.mjs";
import { assessToken } from "./risk.mjs";
import { XAI_BASE_URL, XAI_MODEL, XAI_TIMEOUT_MS, xaiHealth } from "./xai-client.mjs";
import {
  builtinGrokTools,
  envFlag,
  grokServiceTier,
  shouldCompact,
} from "./grok-builtins.mjs";
import { mediaRef, storageOptions } from "./imagine.mjs";

test("GROK_TOOLS are Responses API function defs", () => {
  assert.ok(GROK_TOOLS.length >= 20);
  for (const tool of GROK_TOOLS) {
    assert.equal(tool.type, "function");
    assert.equal(typeof tool.name, "string");
    assert.ok(tool.name.length > 0);
    assert.equal(typeof tool.description, "string");
    assert.equal(tool.parameters.type, "object");
    assert.equal(typeof tool.parameters.properties, "object");
    assert.ok(Array.isArray(tool.parameters.required));
  }
  const names = new Set(GROK_TOOL_NAMES);
  assert.equal(names.size, GROK_TOOL_NAMES.length);
  for (const required of [
    "get_config",
    "get_quote",
    "execute_swap",
    "markets_quote",
    "preflight_check",
    "assess_token_risk",
    "size_position",
    "generate_video",
    "get_video",
  ]) {
    assert.ok(names.has(required), `missing ${required}`);
  }
});

test("assess_token_risk executes in-process without network", async () => {
  const raw = await executeGrokTool("assess_token_risk", {
    symbol: "SOL",
    price: 150,
    volume24hUsd: 1_000_000_000,
    liquidityUsd: 50_000_000,
  });
  const parsed = JSON.parse(raw);
  assert.equal(parsed.symbol, "SOL");
  assert.equal(typeof parsed.score, "number");
  assert.deepEqual(parsed, assessToken({
    symbol: "SOL",
    price: 150,
    volume24hUsd: 1_000_000_000,
    liquidityUsd: 50_000_000,
  }));
});

test("unknown grok tool throws", async () => {
  await assert.rejects(() => executeGrokTool("not_a_real_tool", {}), /unknown tool/);
});

test("xAI client defaults to grok-4.6 Responses API endpoint", () => {
  assert.equal(XAI_BASE_URL, process.env.XAI_BASE_URL ?? "https://api.x.ai/v1");
  assert.match(XAI_MODEL, /^grok-4/);
  assert.equal(XAI_TIMEOUT_MS, Number(process.env.XAI_TIMEOUT_MS ?? 3_600_000));
  assert.equal(typeof xaiHealth().serviceTier, "string");
});

test("builtin tools default to web, x, code, image", () => {
  const types = builtinGrokTools().map((t) => t.type);
  assert.deepEqual(types, ["web_search", "x_search", "code_interpreter", "image_generation"]);
  const x = builtinGrokTools().find((t) => t.type === "x_search");
  assert.equal(x.enable_image_understanding, true);
  assert.equal(x.enable_video_understanding, true);
});

test("envFlag and service tier", () => {
  assert.equal(envFlag("MISSING_FLAG_XYZ", true), true);
  assert.equal(envFlag("MISSING_FLAG_XYZ", false), false);
  assert.equal(grokServiceTier("priority"), "priority");
  assert.equal(grokServiceTier("default"), "default");
  assert.equal(grokServiceTier("nope"), "default");
});

test("shouldCompact turns off on tiny transcripts", () => {
  assert.equal(shouldCompact(0, 2), false);
  assert.equal(typeof shouldCompact(6, 8), "boolean");
});

test("imagine mediaRef and storage_options", () => {
  assert.deepEqual(mediaRef("https://cdn.example/a.jpg"), { url: "https://cdn.example/a.jpg" });
  assert.deepEqual(mediaRef("file_abc-1234-def"), { file_id: "file_abc-1234-def" });
  assert.deepEqual(mediaRef({ fileId: "file_9" }), { file_id: "file_9" });
  const storage = storageOptions({ persist: true, publicUrl: true, filename: "card.jpg" }, "fallback.jpg");
  assert.equal(storage.filename, "card.jpg");
  assert.equal(storage.public_url, true);
});
