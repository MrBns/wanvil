/**
 * Boot orchestrator — the heart of the wanvil CLI.
 *
 * Flow:
 *  1. Parse mixed CLI args (wanvil flags vs anvil args)
 *  2. Handle --save-preset flow (interactive, then exit)
 *  3. Handle --preset=N (prompt password, decrypt, inject --mnemonic)
 *  4. Create AnvilBridge and start anvil with the resolved args
 *  5. If GUI enabled: boot the server, passing the bridge
 *  6. If auto-open enabled: open the browser
 *  7. Wire up SIGINT/SIGTERM for clean shutdown
 */
import { execFileSync, execSync } from "node:child_process";
import readline from "node:readline";
import { AnvilBridge } from "./anvil-bridge.js";
import { printBanner } from "./banner.js";
import { parseArgs } from "./parse-args.js";
import { PresetManager } from "./preset-manager.js";
export async function boot() {
    const { wanvil: flags, anvil: anvilArgs } = parseArgs(process.argv.slice(2));
    const presets = new PresetManager();
    // ─── Save Preset Flow ────────────────────────────────────────────
    if (flags.savePreset) {
        await savePresetFlow(presets);
        process.exit(0);
    }
    // ─── Load Preset → inject --mnemonic ─────────────────────────────
    if (flags.preset !== null) {
        const password = await promptHidden(`🔑 Enter password for preset #${flags.preset}: `);
        try {
            const mnemonic = await presets.load(flags.preset, password);
            anvilArgs.push("--mnemonic", mnemonic);
            process.stdout.write(`  \x1b[32m✓\x1b[0m Preset #${flags.preset} decrypted and injected.\n\n`);
        }
        catch (err) {
            process.stderr.write(`\x1b[31m✗ ${err instanceof Error ? err.message : String(err)}\x1b[0m\n`);
            process.exit(1);
        }
    }
    const anvilAvailabilityError = getAnvilAvailabilityError();
    if (anvilAvailabilityError) {
        process.stderr.write(`\x1b[31m✗ ${anvilAvailabilityError}\x1b[0m\n`);
        process.exit(1);
    }
    // ─── Print Banner ────────────────────────────────────────────────
    printBanner(flags.guiPort, flags.noGui);
    // ─── Create Bridge & Start Anvil ─────────────────────────────────
    const bridge = new AnvilBridge();
    bridge.start(anvilArgs);
    bridge.onClose((code, signal) => {
        process.stdout.write(`\n  \x1b[33m●\x1b[0m Anvil process exited (code=${code}, signal=${signal})\n`);
    });
    // ─── Boot GUI Server ─────────────────────────────────────────────
    let serverShutdown = null;
    if (!flags.noGui) {
        try {
            // Dynamic import so --no-gui doesn't need server deps loaded.
            // Prefer built server output for packaged/built CLI runs, but
            // fall back to source during `tsx cli/src/index.ts` development.
            const { bootServer } = await loadBootServer();
            const server = await bootServer({
                port: flags.guiPort,
                logLevel: flags.logLevel,
                corsOrigins: [
                    `http://localhost:${flags.guiPort}`,
                    `http://127.0.0.1:${flags.guiPort}`,
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                ],
                anvilBridge: bridge,
                presetManager: presets,
            });
            serverShutdown = server.shutdown;
            // Auto-open browser
            if (!flags.noOpen) {
                setTimeout(() => {
                    const url = `http://localhost:${flags.guiPort}`;
                    const cmd = process.platform === "darwin"
                        ? "open"
                        : process.platform === "win32"
                            ? "start"
                            : "xdg-open";
                    try {
                        execSync(`${cmd} ${url}`, { stdio: "ignore" });
                    }
                    catch {
                        process.stdout.write(`  Open ${url} in your browser.\n`);
                    }
                }, 1200);
            }
        }
        catch (err) {
            process.stderr.write(`\x1b[31m✗ Failed to start GUI server: ${err instanceof Error ? err.message : String(err)}\x1b[0m\n`);
            process.stderr.write("  Shutting down Anvil.\n\n");
            bridge.stop();
            process.exit(1);
        }
    }
    // ─── Graceful Shutdown ───────────────────────────────────────────
    let shuttingDown = false;
    const shutdown = async (signal) => {
        if (shuttingDown)
            return;
        shuttingDown = true;
        process.stdout.write(`\n  \x1b[2m[${signal}] Shutting down…\x1b[0m\n`);
        bridge.stop();
        if (serverShutdown) {
            try {
                await serverShutdown();
            }
            catch {
                // Best-effort
            }
        }
        process.exit(0);
    };
    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));
}
function getAnvilAvailabilityError() {
    try {
        execFileSync("anvil", ["--version"], {
            stdio: "ignore",
        });
        return null;
    }
    catch (err) {
        if (err instanceof Error && "code" in err && err.code === "ENOENT") {
            return 'Anvil is not installed or not available on your PATH. Install Foundry and ensure the `anvil` binary is accessible before running `wanvil`.';
        }
        return `Failed to start anvil: ${err instanceof Error ? err.message : String(err)}`;
    }
}
async function loadBootServer() {
    try {
        return await import("../../server/dist/index.js");
    }
    catch {
        return await import("../../server/src/index.js");
    }
}
// ─── Interactive Helpers ──────────────────────────────────────────
async function savePresetFlow(presets) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const ask = (q) => new Promise((resolve) => rl.question(q, resolve));
    try {
        const label = await ask("Label for this preset: ");
        const mnemonic = await ask("Mnemonic phrase: ");
        const password = await promptHidden("Encryption password: ");
        const confirm = await promptHidden("Confirm password: ");
        if (password !== confirm) {
            process.stderr.write("\x1b[31m✗ Passwords do not match.\x1b[0m\n");
            return;
        }
        const id = await presets.save(label.trim(), mnemonic.trim(), password);
        process.stdout.write(`\n\x1b[32m✓\x1b[0m Preset saved as #${id} ("${label.trim()}")\n`);
        process.stdout.write(`  Use it with: \x1b[1mwanvil --preset=${id}\x1b[0m\n\n`);
    }
    finally {
        rl.close();
    }
}
function promptHidden(query) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        // Attempt to disable echo for password input
        const stdin = process.stdin;
        const wasRaw = stdin.isRaw;
        process.stdout.write(query);
        if (stdin.isTTY && stdin.setRawMode) {
            stdin.setRawMode(true);
            let input = "";
            const onData = (char) => {
                const c = char.toString();
                if (c === "\n" || c === "\r") {
                    stdin.setRawMode(wasRaw ?? false);
                    stdin.removeListener("data", onData);
                    process.stdout.write("\n");
                    rl.close();
                    resolve(input);
                }
                else if (c === "\u007f" || c === "\b") {
                    // Backspace
                    input = input.slice(0, -1);
                }
                else if (c === "\u0003") {
                    // Ctrl+C
                    process.exit(130);
                }
                else {
                    input += c;
                    process.stdout.write("*");
                }
            };
            stdin.on("data", onData);
        }
        else {
            // Fallback: no TTY (piped input), just read normally
            rl.question("", (answer) => {
                rl.close();
                resolve(answer);
            });
        }
    });
}
