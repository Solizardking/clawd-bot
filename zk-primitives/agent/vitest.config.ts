import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolve the workspace client package even when dist/ has not been built yet
 * (fresh clone). Production consumers still use package.json exports → dist/.
 * `pretest` builds dist so Node/package entry resolution stays valid for
 * non-aliased tooling.
 */
export default defineConfig({
  resolve: {
    alias: {
      // Prefer source during tests so Vite never needs a prebuilt dist entry
      // to satisfy package.json "exports" when mocking or importing.
      "@clawd/zk-client": path.resolve(root, "../client/src/index.ts"),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    testTimeout: 10_000,
  },
});
