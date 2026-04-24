/**
 * Wanvil Control Server.
 *
 * Two modes of operation:
 *
 * 1. **Production (via CLI)**: The `cli/` layer calls `bootServer(config)`
 *    passing an IAnvilBridge and IPresetManager. The server is a passive
 *    consumer — it never spawns anvil itself.
 *
 * 2. **Development (standalone)**: Running `npm run dev:server` calls
 *    `main()` which creates its own AnvilBridge for local development
 *    and debugging of the server in isolation.
 */
import { loadEnv } from "./config/env.js";
import { createHttpServer } from "./http/create-server.js";
import { createLogger } from "./lib/logger.js";
import { DbService } from "./services/db.service.js";
import { RpcHealthService } from "./services/rpc-health.service.js";
import { attachSocketIo } from "./socket/attach-socket-io.js";
export async function bootServer(config) {
    // Inject config values into env for downstream consumers
    process.env.PORT = String(config.port);
    process.env.LOG_LEVEL = config.logLevel;
    const env = loadEnv();
    // Override CORS from config
    env.CORS_ORIGINS = config.corsOrigins;
    env.PORT = config.port;
    const logger = createLogger(env);
    const rpcHealth = new RpcHealthService(env, logger);
    const db = new DbService(logger);
    const httpServer = createHttpServer(logger, env);
    const io = attachSocketIo(httpServer, env, logger, config.anvilBridge, rpcHealth, db, config.presetManager);
    await new Promise((resolve, reject) => {
        httpServer.once("error", reject);
        httpServer.listen(env.PORT, () => {
            httpServer.off("error", reject);
            logger.info({
                port: env.PORT,
                msg: "control_server.listening",
            });
            resolve();
        });
    });
    const shutdown = async () => {
        logger.info({ msg: "control_server.shutdown.start" });
        try {
            await io.close();
        }
        catch (err) {
            logger.warn({ err, msg: "control_server.socket_close.warn" });
        }
        await new Promise((resolve) => {
            httpServer.close(() => resolve());
        });
        try {
            await db.disconnect();
        }
        catch (err) {
            logger.warn({ err, msg: "control_server.db_disconnect.warn" });
        }
        logger.info({ msg: "control_server.shutdown.done" });
    };
    return { shutdown, port: env.PORT };
}
// ─── Standalone Dev Mode ─────────────────────────────────────────
async function main() {
    const env = loadEnv();
    const logger = createLogger(env);
    const rpcHealth = new RpcHealthService(env, logger);
    const db = new DbService(logger);
    // In dev mode, use lightweight inline implementations so the server
    // has zero imports from cli/ (avoiding circular project references).
    const bridge = createDevBridge();
    const presets = createDevPresetManager();
    const httpServer = createHttpServer(logger, env);
    const io = attachSocketIo(httpServer, env, logger, bridge, rpcHealth, db, presets);
    await new Promise((resolve, reject) => {
        httpServer.once("error", reject);
        httpServer.listen(env.PORT, () => {
            httpServer.off("error", reject);
            logger.info({
                port: env.PORT,
                msg: "control_server.listening (standalone dev mode)",
            });
            resolve();
        });
    });
    // Extract trailing CLI arguments to launch Anvil directly on boot
    const rawArgs = process.argv.slice(2);
    const anvilArgs = rawArgs[0] === "--" ? rawArgs.slice(1) : rawArgs;
    if (anvilArgs.length > 0) {
        logger.info({ msg: "launching_anvil_from_cli", args: anvilArgs });
        try {
            bridge.start(anvilArgs);
            let forkUrl = "";
            let forkBlockNumber = "";
            let mnemonic = "";
            for (let i = 0; i < anvilArgs.length; i++) {
                if (anvilArgs[i] === "--fork-url")
                    forkUrl = anvilArgs[i + 1] || "";
                if (anvilArgs[i] === "--fork-block-number")
                    forkBlockNumber = anvilArgs[i + 1] || "";
                if (anvilArgs[i] === "--mnemonic")
                    mnemonic = anvilArgs[i + 1] || "";
            }
            db.insertRun({
                label: "wanvil Dev Run",
                args: anvilArgs,
                forkUrl,
                forkBlockNumber,
                mnemonic,
            }).catch(() => { });
        }
        catch (err) {
            logger.error({ err, msg: "failed_initial_cli_anvil_launch" });
        }
    }
    let shuttingDown = false;
    const shutdown = async (signal) => {
        if (shuttingDown)
            return;
        shuttingDown = true;
        logger.info({ signal, msg: "control_server.shutdown.start" });
        bridge.stop();
        try {
            await io.close();
        }
        catch (err) {
            logger.warn({ err, msg: "control_server.socket_close.warn" });
        }
        await new Promise((resolve) => {
            httpServer.close(() => resolve());
        });
        try {
            await db.disconnect();
        }
        catch (err) {
            logger.warn({ err, msg: "control_server.db_disconnect.warn" });
        }
        logger.info({ msg: "control_server.shutdown.done" });
        process.exit(0);
    };
    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));
}
// Only run main() when executed directly (not imported by CLI)
const isDirectExecution = process.argv[1]?.includes("server/src/index");
if (isDirectExecution) {
    main().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
// ─── Dev-mode inline implementations ─────────────────────────────
// Lightweight stubs so `npm run dev:server` works without importing
// from cli/ (which would create a circular project reference).
import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
function createDevBridge() {
    let proc = null;
    let logs = [];
    let lineBuffer = "";
    let lastArgs = [];
    const events = new EventEmitter();
    const pushLine = (line) => {
        logs.push(line);
        if (logs.length > 2000)
            logs.shift();
        events.emit("log", line);
        process.stdout.write(`${line}\n`);
    };
    return {
        start(args) {
            if (proc)
                return;
            logs = [];
            lineBuffer = "";
            lastArgs = [...args];
            const child = spawn("anvil", args, { shell: false, stdio: ["ignore", "pipe", "pipe"] });
            const handleChunk = (data) => {
                const text = lineBuffer + data.toString();
                const parts = text.split("\n");
                lineBuffer = parts.pop() ?? "";
                for (const line of parts) {
                    if (line)
                        pushLine(line);
                }
            };
            child.stdout?.on("data", handleChunk);
            child.stderr?.on("data", handleChunk);
            child.on("error", (err) => events.emit("log", `[wanvil] spawn error: ${err.message}`));
            child.on("close", (code, signal) => {
                if (lineBuffer) {
                    pushLine(lineBuffer);
                    lineBuffer = "";
                }
                proc = null;
                events.emit("close", code, signal);
            });
            proc = child;
        },
        stop() {
            if (!proc)
                return;
            try {
                proc.kill("SIGTERM");
            }
            catch { /* already dead */ }
            proc = null;
        },
        restart(args) {
            this.stop();
            setTimeout(() => this.start(args ?? lastArgs), 500);
        },
        isRunning: () => proc !== null,
        getPid: () => proc?.pid ?? null,
        getLogSnapshot: () => [...logs],
        onLog(cb) { events.on("log", cb); return () => events.off("log", cb); },
        onClose(cb) {
            events.on("close", cb);
            return () => events.off("close", cb);
        },
    };
}
function createDevPresetManager() {
    return {
        async list() { return []; },
        async save(_label, _mnemonic, _password) { return 0; },
        async load(_id, _password) {
            throw new Error("Preset management requires the full CLI. Use `npm run dev:cli`.");
        },
        async delete(_id) { },
    };
}
