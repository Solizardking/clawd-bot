/**
 * Live installer runner — fetches the real install.sh / edge install URL and
 * pipes it to bash. Dry-run path never touches the network or $HOME.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, resolveInstallPlan } from "./plan.mjs";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));

export function readPackageVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
    return pkg.version || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

export function buildPlan(cliOpts = {}) {
  const plan = resolveInstallPlan(cliOpts);
  plan.version = readPackageVersion();
  plan.dryRun = Boolean(cliOpts.dryRun);
  return plan;
}

function printHelp() {
  const v = readPackageVersion();
  console.log(`clawdbot-install v${v}

One-shot installer for ClawdBot Go. Wraps the same install surface as:
  curl -fsSL https://install.cheshireterminal.ai | bash
  curl -fsSL https://install.onchainai.fund | bash
  curl -fsSL https://raw.githubusercontent.com/Solizardking/clawdbot-go/main/install.sh | bash

Usage:
  npx clawdbot-install [options]
  clawdbot-install [options]

Options:
  --dry-run, -n       Print the resolved install plan as JSON; no network, no $HOME mutation
  --json              Machine-readable plan (implies --dry-run when alone with other flags for plan)
  --complete          Set CLAWDBOT_INSTALL_COMPLETE=1 (core-ai + full stack defaults)
  --core-ai           Set CLAWDBOT_INSTALL_CORE_AI=1
  --vulcan / --no-vulcan
  --prefer-edge       Use https://install.cheshireterminal.ai (default)
  --prefer-raw        Use raw GitHub install.sh URL
  --dir <path>        CLAWDBOT_INSTALL_DIR
  --ref <ref>         CLAWDBOT_REF (default: main)
  --url <url>         Override primary installer URL
  --help, -h          Show this help
  --version, -V       Show package version

Environment:
  CLAWDBOT_INSTALL_DRY_RUN=1   same as --dry-run
  CLAWDBOT_INSTALL_URL         primary install script URL
  CLAWDBOT_INSTALL_DIR         install home (default ~/.clawdbot)
  CLAWDBOT_INSTALL_COMPLETE=1  full stack
  CLAWDBOT_INSTALL_CORE_AI=1   core-ai sidecar
`);
}

/**
 * Probe an install URL: must return a shell script, not HTML/challenge pages.
 * @param {string} url
 * @returns {boolean}
 */
export function isUsableInstallUrl(url) {
  const result = spawnSync(
    "curl",
    ["-fsSL", "--max-time", "20", "-A", "clawdbot-install/1.0", url],
    { encoding: "utf8", maxBuffer: 512 * 1024 },
  );
  if (result.status !== 0 || result.error) return false;
  const body = String(result.stdout || "");
  if (!body) return false;
  // Reject Cloudflare challenge / SPA HTML
  if (/<!DOCTYPE html>|cf-mitigated|Just a moment/i.test(body)) return false;
  // Accept shebang or export-based wrapper scripts
  return body.startsWith("#!") || /CLAWDBOT_INSTALL|install\.sh|bash/.test(body);
}

/**
 * Execute the live install by curling a reachable install URL into bash.
 * Probes candidateUrls (primary → legacy edge → raw) so a Bot Fight 403 on the
 * brand host does not brick one-shot installs.
 * @param {ReturnType<typeof buildPlan>} plan
 * @returns {{ status: number, command: string, url: string }}
 */
export function runLiveInstall(plan) {
  const env = { ...process.env, ...plan.env };
  const candidates = plan.candidateUrls?.length
    ? plan.candidateUrls
    : [plan.primaryUrl, plan.fallbackUrl].filter(Boolean);

  let chosen = null;
  for (const url of candidates) {
    process.stderr.write(`[clawdbot-install] probing ${url} … `);
    if (isUsableInstallUrl(url)) {
      process.stderr.write("ok\n");
      chosen = url;
      break;
    }
    process.stderr.write("skip\n");
  }

  if (!chosen) {
    console.error(
      "[clawdbot-install] no reachable install surface. Tried:\n  " +
        candidates.join("\n  ") +
        "\nIf install.cheshireterminal.ai is challenged, disable Bot Fight for that host in Cloudflare, or use:\n  curl -fsSL https://install.onchainai.fund | bash",
    );
    process.exit(1);
  }

  const shellCmd = `curl -fsSL ${shellEscape(chosen)} | bash`;
  console.log(`[clawdbot-install] running: ${shellCmd}`);
  const result = spawnSync("bash", ["-lc", shellCmd], {
    env,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`[clawdbot-install] bash spawn failed: ${result.error.message}`);
    process.exit(1);
  }

  return { status: result.status ?? 1, command: shellCmd, url: chosen };
}

function shellEscape(url) {
  // URLs we control are https; still quote for safety.
  return `'${String(url).replace(/'/g, `'\\''`)}'`;
}

/**
 * CLI entry used by bin/clawdbot-install.js
 * @param {string[]} argv
 */
export function main(argv = process.argv.slice(2)) {
  let flags;
  try {
    flags = parseArgs(argv);
  } catch (err) {
    console.error(`[clawdbot-install] ${err.message}`);
    process.exit(2);
  }

  if (flags.help) {
    printHelp();
    process.exit(0);
  }

  if (flags.version) {
    console.log(readPackageVersion());
    process.exit(0);
  }

  const plan = buildPlan(flags);

  if (flags.dryRun || flags.json) {
    // Always JSON for dry-run so agents/CI can parse the plan.
    process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
    process.exit(0);
  }

  console.log("");
  console.log("  🦞 clawdbot-install — one-shot ClawdBot Go installer");
  console.log(`  version:  ${plan.version}`);
  console.log(`  platform: ${plan.os}/${plan.installArch}`);
  console.log(`  source:   ${plan.primaryUrl}`);
  console.log(`  target:   ${plan.installDir}`);
  console.log("");

  const { status } = runLiveInstall(plan);
  process.exit(status === null ? 1 : status);
}

export { parseArgs, resolveInstallPlan } from "./plan.mjs";
