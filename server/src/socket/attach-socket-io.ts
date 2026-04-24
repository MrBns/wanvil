/**
 * Attaches Socket.io to the shared HTTP server.
 *
 * Accepts the IAnvilBridge and IPresetManager interfaces so the
 * socket layer is decoupled from process ownership.
 */

import type { Server as HttpServer } from "node:http";
import { Server as IOServer } from "socket.io";
import type { IAnvilBridge, IPresetManager } from "../../../shared/dist/bridge.js";
import type { AppEnv } from "../config/env.js";
import type { AppLogger } from "../lib/logger.js";
import type { DbService } from "../services/db.service.js";
import type { RpcHealthService } from "../services/rpc-health.service.js";
import { registerAnvilSocketHandlers } from "./anvil-socket.handlers.js";

export function attachSocketIo(
  httpServer: HttpServer,
  env: AppEnv,
  logger: AppLogger,
  bridge: IAnvilBridge,
  rpcHealth: RpcHealthService,
  db: DbService,
  presets: IPresetManager,
): IOServer {
  const io = new IOServer(httpServer, {
    cors: { origin: env.CORS_ORIGINS, methods: ["GET", "POST"], credentials: true },
    transports: ["websocket", "polling"],
    maxHttpBufferSize: 1e6,
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  registerAnvilSocketHandlers(io, logger, bridge, rpcHealth, db, presets);
  logger.debug({ msg: "socket.io.attached" });
  return io;
}
