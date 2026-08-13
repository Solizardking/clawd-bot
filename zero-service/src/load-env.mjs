/**
 * Load zero-service/.env.local then .env into process.env (does not override
 * already-set variables). Import this module first so later modules see keys.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(DIR, "..");

function applyEnvFile(filename) {
  let text;
  try {
    text = readFileSync(join(ROOT, filename), "utf8");
  } catch {
    return false;
  }
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2].trim().replace(/^["']|["']$/g, "");
    if (process.env[m[1]] == null) process.env[m[1]] = value;
  }
  return true;
}

applyEnvFile(".env.local");
applyEnvFile(".env");
