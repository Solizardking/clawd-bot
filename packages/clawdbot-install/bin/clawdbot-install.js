#!/usr/bin/env node
/**
 * CLI entry for `npx clawdbot-install` / `install-clawdbot`.
 * Thin wrapper — real logic lives in lib/install.mjs + lib/plan.mjs.
 */
import { main } from "../lib/install.mjs";

main(process.argv.slice(2));
