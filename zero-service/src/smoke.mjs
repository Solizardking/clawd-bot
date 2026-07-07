/**
 * End-to-end smoke: load ../.env.local, run one read-only turn through Zero,
 * print normalized events. Does NOT place a trade (balance/config only).
 *
 *   ZERO_BIN=/path/to/zero node src/smoke.mjs "what's the agent wallet balance?"
 */
import { readFileSync } from "node:fs";
import { runTurn } from "./zero-runner.mjs";

// minimal .env.local loader
try {
  const envPath = new URL("../../.env.local", import.meta.url).pathname;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim().replace(/^["']|["']$/g, "");
    if (process.env[m[1]] == null) process.env[m[1]] = v;
  }
  console.error("[smoke] loaded .env.local");
} catch (e) {
  console.error("[smoke] no .env.local:", e.message);
}

const prompt = process.argv[2] ?? "What is the agent wallet address and its SOL balance? Do not trade.";
console.error(`[smoke] model=${process.env.ZERO_MODEL ?? "gpt-4.1"} prompt=${JSON.stringify(prompt)}\n`);

const { exitCode, final } = await runTurn(prompt, (evt) => {
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
