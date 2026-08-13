/**
 * Zero Clawd service: HTTP + SSE bridge in front of grok-4.6 (xAI Responses API)
 * with a Zero exec fallback when XAI_API_KEY is unset.
 *
 *   POST /chat  { prompt, previous_response_id?, service_tier?, compaction? }
 *     -> text/event-stream:
 *     text | tool | result | image | server_tool | citations | service_tier |
 *     compact | final | error | done
 *
 *   POST /ask              JSON (bots / pumpfun) — waits for the final turn
 *   POST /compact          { input } -> xAI compaction item
 *   POST /imagine/images
 *   POST /imagine/images/edits
 *   POST /imagine/videos   202 + request_id (wait:true to block)
 *   GET  /imagine/videos/:requestId
 *   GET  /health
 */
import "./load-env.mjs";
import express from "express";
import { runTurn, ensureWorkspace } from "./zero-runner.mjs";
import { runGrokTurn } from "./grok-runner.mjs";
import { compactGrokContext, xaiConfigured, xaiHealth, XAI_MODEL } from "./xai-client.mjs";
import { builtinGrokTools, grokServiceTier } from "./grok-builtins.mjs";
import {
  editImages,
  generateImages,
  getVideo,
  imagineHealth,
  startVideo,
  waitForVideo,
} from "./imagine.mjs";
import { agentPublicKey, config as dflowConfig } from "./dflow.mjs";
import { config as marketsConfig } from "./markets.mjs";
import { config as perpsConfig } from "./perps.mjs";
import { health as perpsHealth } from "./perps.mjs";
import { startTelegramBot, telegramHealth } from "./telegram-bot.mjs";

const app = express();
app.use(express.json({ limit: "25mb" }));

const ALLOW_ORIGIN = process.env.CORS_ORIGIN ?? "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const SERVICE_TOKEN = process.env.ZERO_SERVICE_TOKEN;
function authed(req) {
  if (!SERVICE_TOKEN) return true;
  const h = req.headers.authorization ?? "";
  return h === `Bearer ${SERVICE_TOKEN}`;
}

function emitChatEvent(send, evt) {
  switch (evt.type) {
    case "text":
      if (evt.delta) send({ type: "text", delta: evt.delta });
      break;
    case "tool_call":
      send({ type: "tool", name: evt.name, args: evt.args ?? {} });
      break;
    case "tool_result":
      send({ type: "result", name: evt.name, status: evt.status, output: evt.output });
      break;
    case "image":
      send({
        type: "image",
        id: evt.id,
        prompt: evt.prompt,
        b64: evt.b64,
        status: evt.status,
      });
      break;
    case "image_status":
      send({ type: "image_status", status: evt.status });
      break;
    case "server_tool":
      send({ type: "server_tool", name: evt.name, id: evt.id, status: evt.status, action: evt.action });
      break;
    case "citations":
      send({ type: "citations", citations: evt.citations });
      break;
    case "service_tier":
      send({ type: "service_tier", tier: evt.tier });
      break;
    case "compact":
      send({ type: "compact", id: evt.id, dropped: evt.dropped });
      break;
    case "final":
      send({
        type: "final",
        text: evt.text ?? "",
        responseId: evt.responseId,
        model: evt.model,
        serviceTier: evt.serviceTier,
      });
      break;
    case "error":
      send({ type: "error", message: evt.message ?? "agent error" });
      break;
    default:
      break;
  }
}

app.get("/health", async (_req, res) => {
  let wallet = null;
  try {
    wallet = agentPublicKey();
  } catch {
    /* wallet not configured */
  }
  let perpsHealthStatus = null;
  try {
    perpsHealthStatus = await perpsHealth();
  } catch {
    /* perps not available */
  }
  res.json({
    ok: true,
    wallet,
    engine: xaiConfigured() ? "xai-responses" : "zero-exec",
    model: xaiConfigured() ? XAI_MODEL : (process.env.ZERO_MODEL ?? "grok-4.6"),
    xai: {
      ...xaiHealth(),
      tools: builtinGrokTools().map((t) => t.type),
      imagine: imagineHealth(),
    },
    config: dflowConfig,
    markets: marketsConfig,
    perps: { config: perpsConfig, health: perpsHealthStatus },
    telegram: telegramHealth(),
  });
});

app.post("/chat", async (req, res) => {
  if (!authed(req)) return res.status(401).json({ error: "unauthorized" });
  const prompt = String(req.body?.prompt ?? "").trim();
  if (!prompt) return res.status(400).json({ error: "missing prompt" });
  const previousResponseId = req.body?.previous_response_id ?? req.body?.previousResponseId;
  const serviceTier = req.body?.service_tier ?? req.body?.serviceTier;
  const compaction = req.body?.compaction;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);
  const ac = new AbortController();
  let finished = false;
  res.on("close", () => {
    if (!finished) ac.abort();
  });

  try {
    const runner = xaiConfigured() ? runGrokTurn : runTurn;
    await runner(
      prompt,
      (evt) => emitChatEvent(send, evt),
      { signal: ac.signal, previousResponseId, serviceTier, compaction, tools: req.body?.tools },
    );
  } catch (err) {
    send({ type: "error", message: err?.message ?? "internal error" });
  } finally {
    finished = true;
    send({ type: "done" });
    res.end();
  }
});

app.post("/ask", async (req, res) => {
  if (!authed(req)) return res.status(401).json({ error: "unauthorized" });
  const prompt = String(req.body?.prompt ?? "").trim();
  if (!prompt) return res.status(400).json({ error: "missing prompt" });
  if (!xaiConfigured()) return res.status(503).json({ error: "XAI_API_KEY is not set" });

  const events = [];
  const ac = new AbortController();
  req.on("close", () => ac.abort());
  try {
    const result = await runGrokTurn(
      prompt,
      (evt) => events.push(evt),
      {
        signal: ac.signal,
        previousResponseId: req.body?.previous_response_id ?? req.body?.previousResponseId,
        serviceTier: req.body?.service_tier ?? req.body?.serviceTier,
        compaction: req.body?.compaction,
        tools: req.body?.tools,
      },
    );
    res.json({
      text: result.final,
      responseId: result.responseId,
      serviceTier: result.serviceTier,
      model: XAI_MODEL,
      images: (result.images ?? []).map((img) => ({
        id: img.id,
        prompt: img.prompt,
        b64: img.b64,
      })),
      citations: events.find((e) => e.type === "citations")?.citations ?? [],
      exitCode: result.exitCode,
    });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? "internal error" });
  }
});

app.post("/compact", async (req, res) => {
  if (!authed(req)) return res.status(401).json({ error: "unauthorized" });
  if (!xaiConfigured()) return res.status(503).json({ error: "XAI_API_KEY is not set" });
  const input = req.body?.input ?? req.body?.items;
  if (!Array.isArray(input) || !input.length) {
    return res.status(400).json({ error: "input array required" });
  }
  try {
    const compacted = await compactGrokContext({ input, model: req.body?.model });
    res.json(compacted);
  } catch (err) {
    res.status(502).json({ error: err?.message ?? "compact failed" });
  }
});

app.post("/imagine/images", async (req, res) => {
  if (!authed(req)) return res.status(401).json({ error: "unauthorized" });
  try {
    const data = await generateImages({
      prompt: req.body?.prompt,
      n: req.body?.n,
      aspectRatio: req.body?.aspect_ratio ?? req.body?.aspectRatio,
      resolution: req.body?.resolution,
      filename: req.body?.filename,
      persist: req.body?.persist !== false,
      publicUrl: req.body?.public_url ?? req.body?.publicUrl ?? true,
    });
    res.json({ images: data.images, model: data.model });
  } catch (err) {
    res.status(502).json({ error: err?.message ?? "image generation failed" });
  }
});

app.post("/imagine/images/edits", async (req, res) => {
  if (!authed(req)) return res.status(401).json({ error: "unauthorized" });
  try {
    const data = await editImages({
      prompt: req.body?.prompt,
      image: req.body?.image,
      images: req.body?.images,
      filename: req.body?.filename,
      persist: req.body?.persist !== false,
      publicUrl: req.body?.public_url ?? req.body?.publicUrl ?? true,
    });
    res.json({ images: data.images, model: data.model });
  } catch (err) {
    res.status(502).json({ error: err?.message ?? "image edit failed" });
  }
});

app.post("/imagine/videos", async (req, res) => {
  if (!authed(req)) return res.status(401).json({ error: "unauthorized" });
  try {
    const started = await startVideo({
      prompt: req.body?.prompt,
      image: req.body?.image,
      video: req.body?.video,
      duration: req.body?.duration,
      aspectRatio: req.body?.aspect_ratio ?? req.body?.aspectRatio,
      resolution: req.body?.resolution,
      extend: Boolean(req.body?.extend),
      filename: req.body?.filename,
    });
    if (req.body?.wait === true && started.request_id) {
      const done = await waitForVideo(started.request_id);
      return res.json(done);
    }
    res.status(202).json({ request_id: started.request_id, status: started.status ?? "pending" });
  } catch (err) {
    res.status(502).json({ error: err?.message ?? "video generation failed" });
  }
});

app.get("/imagine/videos/:requestId", async (req, res) => {
  if (!authed(req)) return res.status(401).json({ error: "unauthorized" });
  try {
    const data = await getVideo(req.params.requestId);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err?.message ?? "video poll failed" });
  }
});

const PORT = Number(process.env.PORT ?? 8787);
ensureWorkspace();
app.listen(PORT, () => {
  const engine = xaiConfigured() ? `xai-responses/${XAI_MODEL}` : "zero-exec";
  const tier = grokServiceTier();
  // eslint-disable-next-line no-console
  console.log(`[zero-clawd] zero-service listening on :${PORT} (${engine}, tier=${tier})`);
  startTelegramBot().catch((err) => {
    console.error("[telegram] failed to start:", err?.message ?? err);
  });
});
