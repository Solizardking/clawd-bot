/**
 * xAI Grok client via the OpenAI SDK pointed at https://api.x.ai/v1.
 *
 * Preferred surface is the Responses API (stateful, reasoning, streaming).
 * Chat Completions remain available for callers that need the older shape.
 */
import OpenAI from "openai";
import { grokServiceTier } from "./grok-builtins.mjs";

export const XAI_BASE_URL = process.env.XAI_BASE_URL ?? "https://api.x.ai/v1";
export const XAI_MODEL =
  process.env.XAI_MODEL ||
  process.env.GROK_MODEL ||
  process.env.ZERO_MODEL ||
  "grok-4.6";
export const XAI_TIMEOUT_MS = Number(process.env.XAI_TIMEOUT_MS ?? 3_600_000);
export const XAI_REASONING_EFFORT = process.env.XAI_REASONING_EFFORT ?? "low";
export const XAI_STORE_RESPONSES = /^(1|true|yes)$/i.test(
  process.env.XAI_STORE_RESPONSES ?? "",
);

let client;

export function xaiConfigured() {
  return Boolean(process.env.XAI_API_KEY);
}

export function getXaiClient() {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY is not set");
  }
  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL: XAI_BASE_URL,
      timeout: XAI_TIMEOUT_MS,
    });
  }
  return client;
}

export function xaiHealth() {
  return {
    configured: xaiConfigured(),
    model: XAI_MODEL,
    baseURL: XAI_BASE_URL,
    reasoningEffort: XAI_REASONING_EFFORT,
    store: XAI_STORE_RESPONSES,
    timeoutMs: XAI_TIMEOUT_MS,
    serviceTier: grokServiceTier(),
  };
}

function requestBody({
  input,
  tools,
  previousResponseId,
  store = XAI_STORE_RESPONSES,
  reasoningEffort = XAI_REASONING_EFFORT,
  includeEncryptedReasoning = !store,
  serviceTier,
  stream = false,
} = {}) {
  const body = {
    model: XAI_MODEL,
    input,
    store,
    reasoning: { effort: reasoningEffort },
    service_tier: grokServiceTier(serviceTier),
  };
  if (stream) body.stream = true;
  if (tools?.length) body.tools = tools;
  if (previousResponseId) body.previous_response_id = previousResponseId;
  const include = [];
  if (includeEncryptedReasoning) include.push("reasoning.encrypted_content");
  if (process.env.XAI_VERBOSE_STREAMING && /^(1|true|yes)$/i.test(process.env.XAI_VERBOSE_STREAMING)) {
    include.push("verbose_streaming");
  }
  if (include.length) body.include = include;
  return body;
}

/**
 * Non-streaming Responses API call. `store: false` by default so trading
 * prompts are not retained on xAI servers.
 */
export async function createGrokResponse(params = {}) {
  const body = requestBody(params);
  return getXaiClient().responses.create(body, { signal: params.signal });
}

function emitServerTool(onEvent, item) {
  if (!item?.type) return;
  const name = String(item.type).replace(/_call$/, "");
  onEvent?.({
    type: "server_tool",
    name,
    id: item.id,
    status: item.status,
    action: item.action ?? item.prompt ?? undefined,
  });
}

/**
 * Streaming Responses API. Yields SDK events; the last `response.completed`
 * event carries the full response object.
 */
export async function streamGrokResponse(params, onEvent, { signal } = {}) {
  const body = requestBody({ ...params, stream: true });
  const stream = await getXaiClient().responses.create(body, { signal });
  let completed = null;
  for await (const event of stream) {
    if (signal?.aborted) break;
    if (event.type === "response.output_text.delta" && event.delta) {
      onEvent?.({ type: "text", delta: event.delta });
    } else if (event.type === "response.output_item.done" && event.item?.type === "function_call") {
      let args = {};
      try {
        args = JSON.parse(event.item.arguments || "{}");
      } catch {
        args = { raw: event.item.arguments };
      }
      onEvent?.({ type: "tool_call", name: event.item.name, args, callId: event.item.call_id });
    } else if (event.type === "response.output_item.done" && event.item?.type === "image_generation_call") {
      onEvent?.({
        type: "image",
        id: event.item.id,
        prompt: event.item.prompt,
        b64: event.item.result,
        status: event.item.status,
      });
    } else if (
      event.type === "response.output_item.done" &&
      event.item?.type &&
      /_call$/.test(event.item.type) &&
      event.item.type !== "function_call"
    ) {
      emitServerTool(onEvent, event.item);
    } else if (typeof event.type === "string" && event.type.startsWith("response.image_generation_call.")) {
      onEvent?.({ type: "image_status", status: event.type.split(".").pop() });
    } else if (event.type === "response.completed") {
      completed = event.response;
      if (event.response?.service_tier) {
        onEvent?.({ type: "service_tier", tier: event.response.service_tier });
      }
      if (event.response?.citations?.length) {
        onEvent?.({ type: "citations", citations: event.response.citations });
      }
    }
  }
  return completed;
}

/**
 * Shrink a long conversation into an opaque compaction item.
 * Pass `compacted.output` verbatim as the head of the next request.
 */
export async function compactGrokContext({ input, model = XAI_MODEL, signal } = {}) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("XAI_API_KEY is not set");
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error("compact requires a non-empty input array");
  }
  const res = await fetch(`${XAI_BASE_URL.replace(/\/$/, "")}/responses/compact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input }),
    signal,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`xAI compact ${res.status}: ${data.error?.message || data.message || text.slice(0, 300)}`);
  }
  return data;
}
