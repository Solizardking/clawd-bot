import { test } from "node:test";
import assert from "node:assert/strict";
import { readPackageVersion, resolveLaunch } from "../lib/launch.mjs";

test("package version is semver-like", () => {
  assert.match(readPackageVersion(), /^\d+\.\d+\.\d+/);
});

test("default launch is desktop", () => {
  const plan = resolveLaunch([]);
  assert.equal(plan.product, "Clawd Bot");
  assert.equal(plan.sub, "desktop");
  assert.equal(plan.argv[0], "desktop");
  assert.ok(plan.install.curl.includes("install.cheshireterminal.ai"));
});

test("desktop alias is preserved", () => {
  const plan = resolveLaunch(["desktop", "--open=false"]);
  assert.deepEqual(plan.argv[0], "desktop");
  assert.ok(plan.argv.includes("--open=false"));
});
