#!/usr/bin/env node
/**
 * Regenerate catalogs/sol-gpt-tools.json from ClawdBrowser live tool-catalog.ts.
 *
 *   node scripts/sync-sol-gpt-catalog.mjs
 *   CLAWDBROWSER_ROOT=/path/to/ClawdBrowser node scripts/sync-sol-gpt-catalog.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..");
const CB = (process.env.CLAWDBROWSER_ROOT || "/Users/8bit/ClawdBrowser").replace(/\/+$/, "");
const OUT_FULL = join(REPO, "catalogs", "sol-gpt-tools.json");
const OUT_NAMES = join(REPO, "catalogs", "sol-gpt-tool-names.json");

const script = `
import { getSolGptShippedToolCatalog, getSolGptShippedToolGroups } from './src/lib/sol-gpt/tool-catalog.ts';
const tools = getSolGptShippedToolCatalog();
const groups = getSolGptShippedToolGroups();
const out = {
  generatedAt: new Date().toISOString(),
  source: 'ClawdBrowser/src/lib/sol-gpt/tool-catalog.ts',
  totals: {
    tools: tools.length,
    core: tools.filter((t) => t.core).length,
    groups: groups.length,
  },
  groups: groups.map((g) => ({
    id: g.id,
    label: g.label,
    blurb: g.blurb,
    count: g.tools.length,
  })),
  tools: tools.map((t) => ({
    name: t.name,
    description: t.description,
    group: t.group,
    core: t.core,
    readOnly: t.readOnly,
  })),
};
process.stdout.write(JSON.stringify(out));
`;

const r = spawnSync(
  process.execPath,
  ["--experimental-strip-types", "-e", script],
  { cwd: CB, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
);
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(r.status || 1);
}

const full = JSON.parse(r.stdout);
mkdirSync(join(REPO, "catalogs"), { recursive: true });
writeFileSync(OUT_FULL, JSON.stringify(full, null, 2) + "\n");
const names = {
  generatedAt: full.generatedAt,
  source: full.source,
  count: full.totals.tools,
  coreCount: full.totals.core,
  names: full.tools.map((t) => t.name).sort(),
  coreNames: full.tools.filter((t) => t.core).map((t) => t.name).sort(),
};
writeFileSync(OUT_NAMES, JSON.stringify(names, null, 2) + "\n");
console.log(
  `synced ${full.totals.tools} tools (${full.totals.core} core) → catalogs/`,
);
if (full.totals.tools < 171) {
  console.error("warning: tool count below 171");
  process.exit(2);
}
