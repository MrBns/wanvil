/**
 * Wanvil-specific CLI flag definitions.
 *
 * The CLI argument parser uses this list to separate wanvil flags
 * from anvil pass-through arguments. Anything NOT in WANVIL_FLAGS
 * is forwarded directly to the `anvil` child process.
 */
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
/**
 * Exhaustive list of flags consumed by wanvil itself.
 * Used by the argument parser to distinguish wanvil flags from anvil args.
 *
 * Flags that accept a value are marked with `hasValue: true`.
 */
export declare const WANVIL_FLAG_DEFS: readonly [{
    readonly long: "--gui-port";
    readonly short: null;
    readonly hasValue: true;
}, {
    readonly long: "--no-gui";
    readonly short: null;
    readonly hasValue: false;
}, {
    readonly long: "--no-open";
    readonly short: null;
    readonly hasValue: false;
}, {
    readonly long: "--preset";
    readonly short: "-p";
    readonly hasValue: true;
}, {
    readonly long: "--save-preset";
    readonly short: null;
    readonly hasValue: false;
}, {
    readonly long: "--log-level";
    readonly short: null;
    readonly hasValue: true;
}];
/**
 * Flat set of all wanvil flag strings for fast lookup.
 */
export declare const WANVIL_FLAGS: Set<string>;
export declare const DEFAULT_WANVIL_FLAGS: WanvilFlags;
//# sourceMappingURL=args.d.ts.map