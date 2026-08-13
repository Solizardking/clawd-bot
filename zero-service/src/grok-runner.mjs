/**
 * Native grok-4.6 turn runner via the xAI Responses API (OpenAI SDK).
 *
 * Emits event shapes for /chat SSE:
 *   text | tool_call | tool_result | image | server_tool | citations |
 *   service_tier | compact | final | error
 *
 * Mixes client-side trading tools with xAI server tools (web_search, x_search,
 * code_interpreter, image_generation). Compact long store:false loops.
 */
import { AGENT_SYSTEM_PROMPT } from "./zero-runner.mjs";
import { GROK_TOOLS, executeGrokTool } from "./grok-tools.mjs";
import { builtinGrokTools, grokServiceTier, shouldCompact } from "./grok-builtins.mjs";
import {
  XAI_MODEL,
  XAI_STORE_RESPONSES,
  compactGrokContext,
  streamGrokResponse,
} from "./xai-client.mjs";

const MAX_TURNS = Number(process.env.ZERO_MAX_TURNS ?? 12);

export const GROK_SYSTEM_PROMPT = `${AGENT_SYSTEM_PROMPT}

## xAI Grok tools (this path)

You also have xAI built-in tools that run on xAI servers:
- web_search — live web results with citations. Use for news, docs, live prices off-chain.
- x_search — X/Twitter keyword + semantic search. Images and videos in posts can be analyzed.
- code_interpreter — sandboxed Python for exact math, stats, and small charts. Prefer this over guessing numbers.
- image_generation — Grok Imagine stills (generate or edit) inside the conversation.
- generate_video / get_video — client-side: text-to-video, image-to-video, edit, or extend. Default is async (returns request_id); poll with get_video.

The older "NO file, shell, or browser tools" rule is overridden for web_search, x_search, and code_interpreter. You still cannot edit local files or run a shell on the user's machine.

Use web_search and x_search before trading takes that depend on live social or news context.
Keep replies concise. When you generate an image, describe it in one line; the client already shows it.
`;

function functionCalls(response) {
  const output = response?.output ?? [];
  return output.filter((item) => item.type === "function_call");
}

function outputText(response) {
  if (typeof response?.output_text === "string" && response.output_text) {
    return response.output_text;
  }
  const parts = [];
  for (const item of response?.output ?? []) {
    if (item.type !== "message") continue;
    for (const c of item.content ?? []) {
      if (c.type === "output_text" && c.text) parts.push(c.text);
    }
  }
  return parts.join("");
}

function allTools(requested) {
  const builtins = builtinGrokTools();
  const map = {
    web: "web_search",
    web_search: "web_search",
    x_search: "x_search",
    code: "code_interpreter",
    code_interpreter: "code_interpreter",
    image: "image_generation",
    image_generation: "image_generation",
    mcp: "mcp",
  };
  let selected = builtins;
  if (Array.isArray(requested)) {
    const want = new Set(requested.map((t) => map[t] || t));
    selected = builtins.filter((t) => want.has(t.type));
  }
  return [...selected, ...GROK_TOOLS];
}

/**
 * Run one user turn through grok-4.6 with trading + xAI tools.
 * @returns {Promise<{ exitCode: number, final: string, responseId?: string, serviceTier?: string, images?: object[] }>}
 */
export async function runGrokTurn(prompt, onEvent, { signal, previousResponseId, serviceTier, compaction, tools: requestedTools } = {}) {
  const emit = (evt) => {
    try {
      onEvent?.(evt);
    } catch {
      /* consumer error shouldn't kill the stream */
    }
  };

  const chain = Boolean(previousResponseId) && XAI_STORE_RESPONSES;
  let input = chain
    ? [{ role: "user", content: prompt }]
    : [
        { role: "system", content: GROK_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ];
  if (Array.isArray(compaction) && compaction.length) {
    input = chain
      ? [...compaction, { role: "user", content: prompt }]
      : [...compaction, { role: "user", content: prompt }];
  }
  let prevId = chain ? previousResponseId : undefined;
  let final = "";
  let lastId;
  let lastTier;
  const images = [];
  const tools = allTools(requestedTools);
  const tier = grokServiceTier(serviceTier);

  const wrapEmit = (evt) => {
    if (evt.type === "image" && evt.b64) images.push(evt);
    if (evt.type === "service_tier") lastTier = evt.tier;
    emit(evt);
  };

  try {
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      if (signal?.aborted) {
        emit({ type: "error", message: "aborted" });
        return { exitCode: 1, final, responseId: lastId, serviceTier: lastTier, images };
      }

      const response = await streamGrokResponse(
        {
          input,
          tools,
          previousResponseId: XAI_STORE_RESPONSES ? prevId : undefined,
          store: XAI_STORE_RESPONSES,
          includeEncryptedReasoning: !XAI_STORE_RESPONSES,
          serviceTier: tier,
        },
        wrapEmit,
        { signal },
      );

      if (!response) {
        emit({ type: "error", message: "grok stream ended without a completed response" });
        return { exitCode: 1, final, responseId: lastId, serviceTier: lastTier, images };
      }

      lastId = response.id;
      lastTier = response.service_tier || lastTier;
      const calls = functionCalls(response);
      if (calls.length === 0) {
        final = outputText(response);
        emit({
          type: "final",
          text: final,
          responseId: lastId,
          model: XAI_MODEL,
          serviceTier: lastTier,
        });
        return { exitCode: 0, final, responseId: lastId, serviceTier: lastTier, images };
      }

      const toolOutputs = [];
      for (const call of calls) {
        let args = {};
        try {
          args = JSON.parse(call.arguments || "{}");
        } catch {
          args = {};
        }
        let output;
        let status = "ok";
        try {
          output = await executeGrokTool(call.name, args);
        } catch (err) {
          status = "error";
          output = `ERROR: ${err?.message ?? String(err)}`;
        }
        emit({ type: "tool_result", name: call.name, status, output });
        toolOutputs.push({
          type: "function_call_output",
          call_id: call.call_id,
          output,
        });
      }

      let nextInput;
      if (XAI_STORE_RESPONSES) {
        prevId = response.id;
        nextInput = toolOutputs;
      } else {
        prevId = undefined;
        nextInput = [...(response.output ?? []), ...toolOutputs];
        if (shouldCompact(turn + 1, nextInput.length)) {
          try {
            const compacted = await compactGrokContext({ input: nextInput, signal });
            const blob = compacted.output;
            if (Array.isArray(blob) && blob.length) {
              emit({
                type: "compact",
                id: compacted.id,
                dropped: compacted.usage?.dropped_message_count,
              });
              nextInput = blob;
            }
          } catch (err) {
            emit({ type: "compact_error", message: err?.message ?? String(err) });
          }
        }
      }
      input = nextInput;
    }

    emit({ type: "error", message: `max turns (${MAX_TURNS}) reached` });
    return { exitCode: 1, final, responseId: lastId, serviceTier: lastTier, images };
  } catch (err) {
    emit({ type: "error", code: "grok_error", message: err?.message ?? String(err) });
    return { exitCode: 1, final, responseId: lastId, serviceTier: lastTier, images };
  }
}
