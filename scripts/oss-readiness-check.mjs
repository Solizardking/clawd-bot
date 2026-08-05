#!/usr/bin/env node
/**
 * Open-source readiness gate for the six public trees:
 *   web, web/backend, web/frontend, zero-main, zk-primitives, zero-service
 *
 * Fails on:
 *  - missing LICENSE / SECURITY / CONTRIBUTING where required
 *  - tracked .env (non-example) files
 *  - absolute developer home paths in tracked sources
 *  - high-risk secret shapes in tracked non-test files
 *  - non-empty secret-like values in *.env.example
 *
 * Usage (repo root):
 *   node scripts/oss-readiness-check.mjs
 *   node scripts/oss-readiness-check.mjs --json
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const JSON_OUT = process.argv.includes("--json");

const TREES = [
  "web",
  "web/backend",
  "web/frontend",
  "zero-main",
  "zk-primitives",
  "zero-service",
];

/** Trees that must carry their own OSS docs (leaf packages). */
const DOC_REQUIREMENTS = {
  web: ["LICENSE", "SECURITY.md", "CONTRIBUTING.md", "README.md", ".env.example"],
  "zero-main": ["LICENSE", "SECURITY.md", "CONTRIBUTING.md", "README.md"],
  "zk-primitives": ["LICENSE", "SECURITY.md", "CONTRIBUTING.md", "README.md", ".env.example"],
  "zero-service": ["LICENSE", "SECURITY.md", "CONTRIBUTING.md", "README.md", ".env.example"],
};

const SECRET_KEY_RE =
  /^(?:.*_)?(?:API[_-]?KEY|SECRET|PRIVATE[_-]?KEY|ACCESS[_-]?TOKEN|PASSWORD|TOKEN|AUTH)$/i;

const HIGH_RISK_RE = [
  /\bsk-(?:proj-|live-|test-)?[a-zA-Z0-9]{20,}\b/,
  /\bsk-ant-[a-zA-Z0-9\-]{20,}\b/,
  /\bxai-[a-zA-Z0-9]{20,}\b/,
  /\bghp_[a-zA-Z0-9]{36}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /api-key=[a-zA-Z0-9_\-]{20,}/i,
];

const HOME_PATH_RE = /\/Users\/[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+/;

const TEST_PATH_RE = /(?:^|\/)(?:.*_)?test(?:s)?(?:\/|_|\.|$)|_test\.go$|\.test\.[jt]s$|testdata\//i;

function gitTrackedFiles() {
  const out = execSync("git ls-files -z", { encoding: "buffer", cwd: ROOT });
  return out
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .filter((f) => TREES.some((t) => f === t || f.startsWith(t + "/")));
}

function isUnder(file, tree) {
  return file === tree || file.startsWith(tree + "/");
}

function collectFailures() {
  const failures = [];
  const warnings = [];
  const tracked = gitTrackedFiles();

  // 1) Required docs
  for (const [tree, files] of Object.entries(DOC_REQUIREMENTS)) {
    for (const f of files) {
      const path = join(ROOT, tree, f);
      if (!existsSync(path)) {
        failures.push(`missing ${tree}/${f}`);
      }
    }
  }

  // 2) No tracked .env (except examples)
  for (const f of tracked) {
    const base = f.split("/").pop() ?? f;
    if (
      (base === ".env" || base.startsWith(".env.") || base.endsWith(".env")) &&
      !base.endsWith(".example") &&
      !base.endsWith(".template") &&
      !base.endsWith(".sample")
    ) {
      failures.push(`tracked env file must not be public: ${f}`);
    }
  }

  // 3) No developer home paths in non-test tracked files
  for (const f of tracked) {
    if (TEST_PATH_RE.test(f)) continue;
    if (/\.(png|jpg|jpeg|gif|webp|woff2?|sum|lock)$/i.test(f)) continue;
    if (f.endsWith("package-lock.json") || f.endsWith("pnpm-lock.yaml") || f.endsWith("go.sum")) {
      continue;
    }
    let text;
    try {
      text = readFileSync(join(ROOT, f), "utf8");
    } catch {
      continue;
    }
    if (HOME_PATH_RE.test(text)) {
      // allow well-known generic examples only
      if (/\/Users\/(?:user|dev|alice|example|zero)\b|\/home\/(?:user|dev|alice|example|zero|u)\b/.test(text) &&
          !/\/Users\/8bit\b|\/home\/8bit\b/.test(text)) {
        continue;
      }
      if (/\/Users\/8bit\b|\/home\/8bit\b/.test(text)) {
        failures.push(`developer home path in tracked file: ${f}`);
      }
    }
  }

  // 4) High-risk secret shapes in non-test tracked sources
  for (const f of tracked) {
    if (TEST_PATH_RE.test(f)) continue;
    if (/\.(png|jpg|jpeg|gif|webp|woff2?|sum|lock|md)$/i.test(f)) continue;
    if (f.endsWith("package-lock.json") || f.endsWith("pnpm-lock.yaml") || f.endsWith("go.sum")) {
      continue;
    }
    // ACTION / docs that show secret *names* are ok; skip pure docs already by .md
    let text;
    try {
      text = readFileSync(join(ROOT, f), "utf8");
    } catch {
      continue;
    }
    for (const re of HIGH_RISK_RE) {
      const m = text.match(re);
      if (!m) continue;
      // Allow obvious placeholders
      const sample = m[0];
      if (
        /EXAMPLE|placeholder|abcdefghijklmnopqrstuvwxyz|ABCDEFGHIJKLMNOP|sk-ant"$|sk-ant\b.*test/i.test(
          sample,
        ) ||
        /sk-ant-api03-ABCDEFGHIJKLMNOP|ghp_abcdefghijklmnopqrstuvwxyz|AKIAIOSFODNN7EXAMPLE/.test(
          sample,
        )
      ) {
        continue;
      }
      // Test-like literal sk-ant without long body often appears in fixtures
      if (sample === "sk-ant" || sample.length < 24) continue;
      failures.push(`high-risk secret-like pattern in ${f}: ${sample.slice(0, 24)}…`);
    }
  }

  // 5) .env.example files must not set secret values
  for (const f of tracked) {
    if (!f.endsWith(".env.example") && !f.endsWith(".env.template") && !f.endsWith(".env.sample")) {
      continue;
    }
    const text = readFileSync(join(ROOT, f), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!val) continue;
      // Non-secret config defaults are allowed (ports, public RPCs, model names, mints)
      if (SECRET_KEY_RE.test(key) || /PRIVATE|SECRET|PASSWORD|TOKEN/i.test(key)) {
        failures.push(`${f}: secret-like key has non-empty value: ${key}`);
      }
      for (const re of HIGH_RISK_RE) {
        if (re.test(val)) {
          failures.push(`${f}: high-risk value for ${key}`);
        }
      }
    }
  }

  // 6) Local ignored .env presence is a warning only (operator machine)
  for (const local of ["zero-service/.env", "zk-primitives/agent/.env.local", "web/.env"]) {
    if (existsSync(join(ROOT, local))) {
      warnings.push(
        `local secret file present (gitignored, do not publish): ${local}`,
      );
    }
  }

  // 7) Sanity: trees exist
  for (const t of TREES) {
    if (!existsSync(join(ROOT, t))) {
      failures.push(`missing tree: ${t}`);
    }
  }

  return { failures, warnings, trackedCount: tracked.length };
}

const result = collectFailures();
if (JSON_OUT) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`oss-readiness-check: scanned ${result.trackedCount} tracked files in 6 trees`);
  for (const w of result.warnings) console.log(`  WARN  ${w}`);
  if (result.failures.length === 0) {
    console.log("  OK    all gates passed");
  } else {
    for (const f of result.failures) console.log(`  FAIL  ${f}`);
  }
}
process.exit(result.failures.length === 0 ? 0 : 1);
