/**
 * Zero Clawd service: HTTP + SSE bridge in front of the headless Zero agent.
 *
 *   POST /chat  { prompt }  -> text/event-stream of normalized events:
 *     { type: "text",   delta }        streaming assistant text
 *     { type: "tool",   name, args }   a trading tool was called
 *     { type: "result", name, output } tool result (quote/swap/market JSON)
 *     { type: "final",  text }         final assistant message
 *     { type: "error",  message }
 *     { type: "done" }
 *
 *   GET  /health -> { ok, wallet, config, markets }
 */
import express from "express";
import { runTurn, ensureWorkspace } from "./zero-runner.mjs";
import { agentPublicKey, config as dflowConfig } from "./dflow.mjs";
import { config as marketsConfig } from "./markets.mjs";
import { config as perpsConfig } from "./perps.mjs";
import { health as perpsHealth } from "./perps.mjs";

const app = express();
app.use(express.json({ limit: "256kb" }));

// CORS so the Next.js app (or its proxy) can call this directly if desired.
const ALLOW_ORIGIN = process.env.CORS_ORIGIN ?? "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Optional shared-secret guard (set ZERO_SERVICE_TOKEN to require it).
const SERVICE_TOKEN = process.env.ZERO_SERVICE_TOKEN;
function authed(req) {
  if (!SERVICE_TOKEN) return true;
  const h = req.headers.authorization ?? "";
  return h === `Bearer ${SERVICE_TOKEN}`;
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
    config: dflowConfig,
    markets: marketsConfig,
    perps: { config: perpsConfig, health: perpsHealthStatus },
  });
});

app.post("/chat", async (req, res) => {
  if (!authed(req)) return res.status(401).json({ error: "unauthorized" });
  const prompt = String(req.body?.prompt ?? "").trim();
  if (!prompt) return res.status(400).json({ error: "missing prompt" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);
  const ac = new AbortController();
  // Abort the agent run only if the CLIENT disconnects mid-stream. Use res
  // "close" (not req "close" — that fires as soon as the request body is
  // consumed, which would kill the run immediately).
  let finished = false;
  res.on("close", () => {
    if (!finished) ac.abort();
  });

  try {
    await runTurn(
      prompt,
      (evt) => {
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
          case "final":
            send({ type: "final", text: evt.text ?? "" });
            break;
          case "error":
            send({ type: "error", message: evt.message ?? "agent error" });
            break;
          default:
            break; // run_start, usage, run_end, permission_* — not surfaced to UI
        }
      },
      { signal: ac.signal },
    );
  } catch (err) {
    send({ type: "error", message: err?.message ?? "internal error" });
  } finally {
    finished = true;
    send({ type: "done" });
    res.end();
  }
});

const PORT = Number(process.env.PORT ?? 8787);
ensureWorkspace(); // materialize .zero/config.json + AGENTS.md on boot
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[zero-clawd] zero-service listening on :${PORT}`);
});
