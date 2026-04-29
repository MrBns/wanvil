/**
 * Wanvil-specific CLI flag definitions.
 *
 * The CLI argument parser uses this list to separate wanvil flags
 * from anvil pass-through arguments. Anything NOT in WANVIL_FLAGS
 * is forwarded directly to the `anvil` child process.
 */
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
    { long: "--open-browser", short: "-O", hasValue: false },
    { long: "--anvil-logs", short: "-AL", hasValue: false },
    { long: "--version", short: "-v", hasValue: false },
    { long: "--help", short: "-h", hasValue: false },
    { long: "--no-anvil", short: "-N", hasValue: false },
    { long: "--preset", short: "-p", hasValue: true },
    { long: "--save-preset", short: null, hasValue: false },
    { long: "--log-level", short: null, hasValue: true },
];
/**
 * Flat set of all wanvil flag strings for fast lookup.
 */
export const WANVIL_FLAGS = new Set(WANVIL_FLAG_DEFS.flatMap((d) => [d.long, ...(d.short ? [d.short] : [])]));
// ─── Defaults ───────────────────────────────────────────────────────
export const DEFAULT_WANVIL_FLAGS = {
    guiPort: 4269,
    noGui: false,
    openBrowser: false,
    anvilLogs: false,
    version: false,
    help: false,
    noAnvil: false,
    preset: null,
    savePreset: false,
    logLevel: "info",
};
