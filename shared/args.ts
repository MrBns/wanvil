/**
 * Wanvil-specific CLI flag definitions.
 *
 * The CLI argument parser uses this list to separate wanvil flags
 * from anvil pass-through arguments. Anything NOT in WANVIL_FLAGS
 * is forwarded directly to the `anvil` child process.
 */

// ─── Parsed Wanvil Flags ────────────────────────────────────────────

export interface WanvilFlags {
  /** Port for the GUI server (default: 4269). */
  guiPort: number;

  /** Disable the GUI server entirely; terminal-only mode. */
  noGui: boolean;

  /** Suppress auto-opening the browser. */
  noOpen: boolean;

  /**
   * Load an encrypted mnemonic preset by id.
   * When set, the CLI will prompt for a password to decrypt it
   * and inject `--mnemonic <decrypted>` into the anvil args.
   */
  preset: number | null;

  /** Interactive flow to save a new mnemonic preset, then exit. */
  savePreset: boolean;

  /** Pino log level for the server (default: "info"). */
  logLevel: string;
}

// ─── Flag Catalogue ─────────────────────────────────────────────────

/**
 * Exhaustive list of flags consumed by wanvil itself.
 * Used by the argument parser to distinguish wanvil flags from anvil args.
 *
 * Flags that accept a value are marked with `hasValue: true`.
 */
export const WANVIL_FLAG_DEFS = [
  { long: "--gui-port", short: null, hasValue: true },
  { long: "--no-gui", short: null, hasValue: false },
  { long: "--no-open", short: null, hasValue: false },
  { long: "--preset", short: "-p", hasValue: true },
  { long: "--save-preset", short: null, hasValue: false },
  { long: "--log-level", short: null, hasValue: true },
] as const;

/**
 * Flat set of all wanvil flag strings for fast lookup.
 */
export const WANVIL_FLAGS = new Set<string>(
  WANVIL_FLAG_DEFS.flatMap((d) => [d.long, ...(d.short ? [d.short] : [])]),
);

// ─── Defaults ───────────────────────────────────────────────────────

export const DEFAULT_WANVIL_FLAGS: WanvilFlags = {
  guiPort: 4269,
  noGui: false,
  noOpen: false,
  preset: null,
  savePreset: false,
  logLevel: "info",
};
