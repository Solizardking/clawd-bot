/**
 * Unit tests drive the real resolveInstallPlan / parseArgs exports.
 * No hard-coded reimplementation of plan logic inside the test.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_EDGE_INSTALL_URL,
  DEFAULT_RAW_INSTALL_URL,
  parseArgs,
  resolveArch,
  resolveInstallPlan,
  resolveOs,
} from "../lib/plan.mjs";
import { buildPlan, readPackageVersion } from "../lib/install.mjs";

test("resolveOs maps node platforms", () => {
  assert.equal(resolveOs("darwin"), "darwin");
  assert.equal(resolveOs("linux"), "linux");
  assert.equal(resolveOs("win32"), "windows");
});

test("resolveArch maps node arch labels to install.sh labels", () => {
  assert.equal(resolveArch("x64"), "amd64");
  assert.equal(resolveArch("arm64"), "arm64");
  assert.equal(resolveArch("aarch64"), "arm64");
});

test("resolveInstallPlan references real installer upstream URLs", () => {
  const plan = resolveInstallPlan({
    platform: "darwin",
    arch: "arm64",
    home: "/tmp/fake-home-clawdbot-install-test",
  });

  assert.equal(plan.os, "darwin");
  assert.equal(plan.installArch, "arm64");
  assert.equal(plan.installer, "install.sh");
  assert.equal(plan.edgeUrl, DEFAULT_EDGE_INSTALL_URL);
  assert.equal(plan.rawUrl, DEFAULT_RAW_INSTALL_URL);
  assert.equal(plan.primaryUrl, DEFAULT_EDGE_INSTALL_URL);
  assert.match(plan.primaryUrl, /install\.cheshireterminal\.ai|install\.sh/);
  assert.match(plan.rawUrl, /install\.sh$/);
  assert.match(plan.upstream.rawGitHub, /Solizardking\/clawdbot-go/);
  assert.match(plan.upstream.edge, /install\.cheshireterminal\.ai/);
  assert.match(plan.upstream.legacyEdge, /install\.onchainai\.fund/);
  assert.equal(plan.installDir, "/tmp/fake-home-clawdbot-install-test/.clawdbot");
  assert.equal(plan.env.CLAWDBOT_INSTALL_DIR, plan.installDir);
  assert.match(plan.commands.curl, /curl -fsSL /);
  assert.match(plan.commands.curl, /bash/);
  assert.ok(plan.notes.some((n) => /Dry-run/i.test(n)));
});

test("prefer raw switches primary URL to GitHub install.sh", () => {
  const plan = resolveInstallPlan({
    prefer: "raw",
    home: "/tmp/fake-home-clawdbot-install-test",
  });
  assert.equal(plan.primaryUrl, DEFAULT_RAW_INSTALL_URL);
  assert.equal(plan.fallbackUrl, DEFAULT_EDGE_INSTALL_URL);
  assert.match(plan.commands.curl, /raw\.githubusercontent\.com.*install\.sh/);
});

test("complete flag enables core-ai in plan env", () => {
  const plan = resolveInstallPlan({
    complete: true,
    home: "/tmp/fake-home-clawdbot-install-test",
  });
  assert.equal(plan.complete, true);
  assert.equal(plan.coreAi, true);
  assert.equal(plan.env.CLAWDBOT_INSTALL_COMPLETE, "1");
  assert.equal(plan.env.CLAWDBOT_INSTALL_CORE_AI, "1");
});

test("parseArgs understands dry-run and complete", () => {
  const flags = parseArgs(["--dry-run", "--complete", "--prefer-raw", "--dir", "/opt/clawd"]);
  assert.equal(flags.dryRun, true);
  assert.equal(flags.complete, true);
  assert.equal(flags.prefer, "raw");
  assert.equal(flags.installDir, "/opt/clawd");
});

test("buildPlan attaches package version from package.json", () => {
  const version = readPackageVersion();
  assert.match(version, /^\d+\.\d+\.\d+/);
  const plan = buildPlan({
    dryRun: true,
    platform: "linux",
    arch: "x64",
    home: "/tmp/fake-home-clawdbot-install-test",
  });
  assert.equal(plan.version, version);
  assert.equal(plan.dryRun, true);
  assert.equal(plan.package, "clawdbot-install");
  assert.ok(
    plan.primaryUrl.includes("install.cheshireterminal.ai") ||
      plan.primaryUrl.includes("install"),
  );
});
