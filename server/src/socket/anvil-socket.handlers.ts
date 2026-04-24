/**
 * Registers Anvil control + log streaming + preset management
 * handlers on the root Socket.io namespace.
 *
 * Consumes IAnvilBridge and IPresetManager interfaces — no direct
 * dependency on the child process or file system.
 */

import type { Server, Socket } from "socket.io";
import type { IAnvilBridge, IPresetManager } from "../../../shared/dist/bridge.js";
import type { AppLogger } from "../lib/logger.js";
import type { DbService } from "../services/db.service.js";
import type { RpcHealthService } from "../services/rpc-health.service.js";

export function registerAnvilSocketHandlers(
  io: Server,
  logger: AppLogger,
  bridge: IAnvilBridge,
  rpcHealth: RpcHealthService,
  db: DbService,
  presets: IPresetManager,
): void {
  const logSubscribers = new Set<Socket>();
  const logSubscriptionDepth = new Map<Socket, number>();

  // Fan-out log lines to all subscribed sockets
  bridge.onLog((line: string) => {
    for (const s of logSubscribers) {
      s.emit("logs:line", { text: line });
    }
  });

  // Notify all clients when process closes
  bridge.onClose((code: number | null, signal: string | null) => {
    io.emit("anvil:status-changed", { running: false, pid: null });
    logger.info({ code, signal, msg: "anvil.process.closed" });
  });

  io.on("connection", (socket) => {
    logger.debug({ socketId: socket.id, msg: "socket.connected" });

    // ─── Process Status ─────────────────────────────────────────

    socket.on("anvil:status", async (payload: { rpcUrl?: string }, cb) => {
      try {
        const running = await rpcHealth.isRpcReachable(
          payload?.rpcUrl ?? "http://127.0.0.1:8545",
        );
        cb?.({ running });
      } catch (e: unknown) {
        logger.warn({ err: e, msg: "anvil.status.error" });
        cb?.({ running: false, error: String(e) });
      }
    });

    // ─── Process Control ────────────────────────────────────────

    socket.on(
      "anvil:start",
      async (
        payload: {
          args?: string[];
          forkUrl?: string;
          forkBlockNumber?: string;
          mnemonic?: string;
        },
        cb,
      ) => {
        try {
          const args = Array.isArray(payload?.args) ? [...payload.args] : [];
          const forkUrl = payload?.forkUrl?.trim() ?? "";
          const forkBlockNumber = payload?.forkBlockNumber?.trim() ?? "";
          const mnemonic = payload?.mnemonic?.trim() ?? "";

          if (forkUrl) args.push("--fork-url", forkUrl);
          if (forkBlockNumber) args.push("--fork-block-number", forkBlockNumber);
          if (mnemonic) args.push("--mnemonic", mnemonic);

          bridge.start(args);

          // Notify all clients
          io.emit("anvil:status-changed", {
            running: true,
            pid: bridge.getPid(),
          });

          // Persist to DB
          try {
            await db.insertRun({
              label: forkUrl ? `Fork: ${forkUrl}` : "Local",
              args,
              forkUrl,
              forkBlockNumber,
              mnemonic,
            });
            await db.saveLastConfig({ args, forkUrl, forkBlockNumber, mnemonic });
          } catch (dbErr) {
            logger.warn({ err: dbErr, msg: "db.insert_run.warn" });
          }

          cb?.({ success: true });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : String(e);
          logger.error({ err: e, msg: "anvil.start.error" });
          cb?.({ success: false, error: message });
        }
      },
    );

    socket.on("anvil:stop", (_payload: unknown, cb) => {
      try {
        bridge.stop();
        io.emit("anvil:status-changed", { running: false, pid: null });
        cb?.({ success: true });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        logger.error({ err: e, msg: "anvil.stop.error" });
        cb?.({ success: false, error: message });
      }
    });

    socket.on("anvil:restart", (payload: { args?: string[] }, cb) => {
      try {
        bridge.restart(payload?.args);
        cb?.({ success: true });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        logger.error({ err: e, msg: "anvil.restart.error" });
        cb?.({ success: false, error: message });
      }
    });

    // ─── Run History ────────────────────────────────────────────

    socket.on("anvil:history", async (_payload: unknown, cb) => {
      try {
        const rows = await db.getHistory(20);
        cb?.({ success: true, history: rows });
      } catch (e: unknown) {
        logger.warn({ err: e, msg: "anvil.history.error" });
        cb?.({ success: false, history: [] });
      }
    });

    socket.on("anvil:lastConfig", async (_payload: unknown, cb) => {
      try {
        const config = await db.getLastConfig();
        cb?.({ success: true, config });
      } catch (e: unknown) {
        logger.warn({ err: e, msg: "anvil.lastConfig.error" });
        cb?.({ success: false, config: null });
      }
    });

    // ─── Log Streaming ──────────────────────────────────────────

    socket.on("logs:subscribe", () => {
      const next = (logSubscriptionDepth.get(socket) ?? 0) + 1;
      logSubscriptionDepth.set(socket, next);
      if (next === 1) {
        logSubscribers.add(socket);
        socket.emit("logs:history", { lines: bridge.getLogSnapshot() });
        logger.debug({ socketId: socket.id, msg: "logs.subscribed" });
      }
    });

    socket.on("logs:unsubscribe", () => {
      const prev = logSubscriptionDepth.get(socket) ?? 0;
      const next = Math.max(0, prev - 1);
      if (next === 0) {
        logSubscriptionDepth.delete(socket);
        logSubscribers.delete(socket);
        logger.debug({ socketId: socket.id, msg: "logs.unsubscribed" });
      } else {
        logSubscriptionDepth.set(socket, next);
      }
    });

    // ─── Preset Management ──────────────────────────────────────

    socket.on("presets:list", async (cb) => {
      try {
        const list = await presets.list();
        cb?.({ success: true, presets: list });
      } catch (e: unknown) {
        logger.warn({ err: e, msg: "presets.list.error" });
        cb?.({ success: false, presets: [] });
      }
    });

    socket.on(
      "presets:save",
      async (
        payload: { label: string; mnemonic: string; password: string },
        cb,
      ) => {
        try {
          const id = await presets.save(
            payload.label,
            payload.mnemonic,
            payload.password,
          );
          cb?.({ success: true, id });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : String(e);
          logger.error({ err: e, msg: "presets.save.error" });
          cb?.({ success: false, error: message });
        }
      },
    );

    socket.on(
      "presets:load",
      async (payload: { id: number; password: string }, cb) => {
        try {
          const mnemonic = await presets.load(payload.id, payload.password);
          cb?.({ success: true, mnemonic });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : String(e);
          logger.error({ err: e, msg: "presets.load.error" });
          cb?.({ success: false, error: message });
        }
      },
    );

    socket.on("presets:delete", async (payload: { id: number }, cb) => {
      try {
        await presets.delete(payload.id);
        cb?.({ success: true });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        logger.error({ err: e, msg: "presets.delete.error" });
        cb?.({ success: false, error: message });
      }
    });

    // ─── Disconnect ─────────────────────────────────────────────

    socket.on("disconnect", (reason) => {
      logSubscriptionDepth.delete(socket);
      logSubscribers.delete(socket);
      logger.debug({ socketId: socket.id, reason, msg: "socket.disconnected" });
    });
  });
}
