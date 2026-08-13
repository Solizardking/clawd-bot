/**
 * End-to-end smoke: load .env.local, run one read-only turn through grok-4.6
 * (xAI Responses API) or Zero exec, print normalized events. Does NOT place a trade.
 *
 *   ZERO_BIN=/path/to/zero node src/smoke.mjs "what's the agent wallet balance?"
 */
import "./load-env.mjs";
import { runTurn } from "./zero-runner.mjs";
import { runGrokTurn } from "./grok-runner.mjs";
import { xaiConfigured, XAI_MODEL } from "./xai-client.mjs";

const prompt = process.argv[2] ?? "What is the agent wallet address and its SOL balance? Do not trade.";
const engine = xaiConfigured() ? "xai-responses" : "zero-exec";
const model = xaiConfigured() ? XAI_MODEL : (process.env.ZERO_MODEL ?? "grok-4.6");
console.error(`[smoke] engine=${engine} model=${model} prompt=${JSON.stringify(prompt)}\n`);

const runner = xaiConfigured() ? runGrokTurn : runTurn;
const { exitCode, final } = await runner(prompt, (evt) => {
  switch (evt.type) {
    case "text": process.stdout.write(evt.delta ?? ""); break;
    case "tool_call": console.error(`\n[tool] ${evt.name}(${JSON.stringify(evt.args)})`); break;
    case "tool_result": console.error(`[result:${evt.status}] ${String(evt.output).slice(0, 300)}`); break;
    case "error": console.error(`\n[error] ${evt.message}`); break;
    default: break;
  }
});
console.error(`\n\n[smoke] exit=${exitCode}`);
console.error(`[smoke] final: ${final.slice(0, 500)}`);
