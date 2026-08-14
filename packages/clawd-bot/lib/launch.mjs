/**
 * Clawd Bot npm launcher. Prefers a local clawdbot binary, otherwise
 * prints the install surface (npx clawdbot-install / curl installer).
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));

export function readPackageVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
    return pkg.version || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function findBinary() {
  const fromEnv = process.env.CLAWDBOT_BIN;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const which = spawnSync("which", ["clawdbot"], { encoding: "utf8" });
  const path = String(which.stdout || "").trim();
  if (path && existsSync(path)) return path;
  const home = process.env.HOME || "";
  const candidates = [
    join(home, ".clawdbot", "bin", "clawdbot"),
    join(home, ".local", "bin", "clawdbot"),
    "/usr/local/bin/clawdbot",
  ];
  return candidates.find((p) => existsSync(p)) || "";
}

export function resolveLaunch(args = []) {
  const version = readPackageVersion();
  const bin = findBinary();
  const sub = args[0] === "desktop" || args[0] === "app" ? "desktop" : args[0] || "desktop";
  return {
    product: "Clawd Bot",
    version,
    bin,
    sub,
    argv: sub === "desktop" ? ["desktop", ...args.slice(args[0] === "desktop" || args[0] === "app" ? 1 : 0)] : args,
    install: {
      npm: "npx clawdbot-install --complete",
      curl: "curl -fsSL https://install.cheshireterminal.ai | bash",
    },
  };
}

export function main(args = process.argv.slice(2)) {
  if (args.includes("-h") || args.includes("--help")) {
    console.log(`clawd-bot v${readPackageVersion()}

Launch Clawd Bot (desktop skills picker by default).

  npx clawd-bot
  npx clawd-bot desktop
  npx clawd-bot --help

If the Go binary is missing, install first:

  npx clawdbot-install --complete
  curl -fsSL https://install.cheshireterminal.ai | bash
`);
    return 0;
  }
  if (args.includes("-V") || args.includes("--version")) {
    console.log(readPackageVersion());
    return 0;
  }
  const plan = resolveLaunch(args);
  if (!plan.bin) {
    console.error(`Clawd Bot binary not found.
Install:
  ${plan.install.npm}
  ${plan.install.curl}
`);
    process.exitCode = 1;
    return 1;
  }
  const result = spawnSync(plan.bin, plan.argv, { stdio: "inherit" });
  const code = result.status == null ? 1 : result.status;
  process.exitCode = code;
  return code;
}
