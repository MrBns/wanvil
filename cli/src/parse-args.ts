/**
 * Smart CLI argument parser.
 *
 * Separates wanvil-specific flags from anvil pass-through arguments
 * WITHOUT requiring a `--` separator. Walks process.argv and checks
 * each token against the known WANVIL_FLAG_DEFS catalogue.
 */

import {
  DEFAULT_WANVIL_FLAGS,
  WANVIL_FLAG_DEFS,
  WANVIL_FLAGS,
  type WanvilFlags,
} from "../../shared/dist/args.js";

export interface ParsedArgs {
  /** Flags consumed by wanvil itself. */
  wanvil: WanvilFlags;
  /** Everything else — forwarded verbatim to the `anvil` binary. */
  anvil: string[];
}

/**
 * Parse a raw argv array (typically `process.argv.slice(2)`).
 *
 * Algorithm:
 * 1. Walk tokens left-to-right.
 * 2. If the token matches a wanvil flag → consume it (+ the next token if it expects a value).
 *    Handle `--flag=value` and `--flag value` forms.
 * 3. Everything else → push to anvilArgs[].
 */
export function parseArgs(raw: string[]): ParsedArgs {
  const wanvil: WanvilFlags = { ...DEFAULT_WANVIL_FLAGS };
  const anvil: string[] = [];

  let i = 0;
  while (i < raw.length) {
    const token = raw[i];

    // Handle --flag=value form
    const eqIdx = token.indexOf("=");
    const flagPart = eqIdx !== -1 ? token.slice(0, eqIdx) : token;
    const eqValue = eqIdx !== -1 ? token.slice(eqIdx + 1) : null;

    if (WANVIL_FLAGS.has(flagPart)) {
      const def = WANVIL_FLAG_DEFS.find(
        (d: (typeof WANVIL_FLAG_DEFS)[number]) => d.long === flagPart || d.short === flagPart,
      );

      if (!def) {
        // Safety: should never happen since WANVIL_FLAGS is derived from WANVIL_FLAG_DEFS
        anvil.push(token);
        i++;
        continue;
      }

      let value: string | null = eqValue;
      if (def.hasValue && value === null) {
        // Consume next token as the value
        i++;
        value = raw[i] ?? null;
      }

      applyFlag(wanvil, def.long, value);
      i++;
      continue;
    }

    // Not a wanvil flag → forward to anvil
    anvil.push(token);
    i++;
  }

  return { wanvil, anvil };
}

/**
 * Apply a recognised wanvil flag + value to the flags struct.
 */
function applyFlag(
  flags: WanvilFlags,
  flag: string,
  value: string | null,
): void {
  switch (flag) {
    case "--gui-port":
      if (value) flags.guiPort = Number.parseInt(value, 10) || flags.guiPort;
      break;
    case "--no-gui":
      flags.noGui = true;
      break;
    case "--no-open":
      flags.noOpen = true;
      break;
    case "--preset":
      if (value) flags.preset = Number.parseInt(value, 10);
      break;
    case "--save-preset":
      flags.savePreset = true;
      break;
    case "--log-level":
      if (value) flags.logLevel = value;
      break;
  }
}
