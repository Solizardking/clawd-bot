#!/usr/bin/env node
/**
 * Write a Clawd Bot skills catalog JSON from Core AI + repo skills.
 * Does not execute skills. Selection happens in the desktop UI.
 */
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const out = outIdx >= 0 ? args[outIdx + 1] : join(root, "desktop/skills/catalog.json");

const coreAi = process.env.CLAWDBOT_CORE_AI_DIR || resolve(root, "../core-ai");
const corePackages = [
  ["helius-cli", "Helius CLI", "cli", "Infrastructure"],
  ["helius-cursor", "Helius Cursor", "plugin", "Dev Tools"],
  ["helius-mcp", "Helius MCP", "mcp", "Infrastructure"],
  ["helius-plugin", "Helius Plugin", "plugin", "Infrastructure"],
  ["helius-skills", "Helius Skills", "skills", "Infrastructure"],
  ["knowledge", "Core AI Knowledge", "knowledge", "Research"],
  ["mcp-server", "Pump MCP Server", "mcp", "Launch"],
  ["solana-mcp", "Solana MCP", "mcp", "Infrastructure"],
  ["v3", "Core AI v3", "runtime", "Orchestration"],
  ["scripts", "Core AI Scripts", "scripts", "Dev Tools"],
];

function exists(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

const skills = corePackages.map(([dir, name, kind, category]) => ({
  slug: dir,
  name,
  kind,
  category,
  source: "core-ai",
  present: exists(join(coreAi, dir)),
  selectable: true,
}));

const zero = [
  ["zero-service", "Clawd Core AI service"],
  ["clawdbot-frontend", "Clawd Bot control deck"],
  ["clawdbot-pumpfun", "PumpFun sidecar"],
  ["cmd/clawdbot", "Clawd Bot CLI"],
].map(([rel, name]) => ({
  slug: rel.replace(/\//g, "-"),
  name,
  kind: "service",
  source: "zero-service",
  present: exists(join(root, rel)),
  selectable: true,
}));

const catalog = {
  product: "Clawd Bot",
  generatedAt: new Date().toISOString(),
  coreAiDir: coreAi,
  skills,
  services: zero,
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(catalog, null, 2) + "\n");
console.log(`wrote ${out} (${skills.length} core-ai, ${zero.length} services)`);
