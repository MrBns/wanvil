#!/usr/bin/env node

/**
 * wanvil — Wrapped Anvil CLI.
 *
 * Entry point for `npx wanvil` or global `wanvil` command.
 * Delegates to the boot orchestrator.
 */

import { boot } from "./boot.js";

boot().catch((err) => {
  process.stderr.write(
    `\x1b[31m✗ Fatal error: ${err instanceof Error ? err.message : String(err)}\x1b[0m\n`,
  );
  process.exit(1);
});
