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
export declare function attachSocketIo(httpServer: HttpServer, env: AppEnv, logger: AppLogger, bridge: IAnvilBridge, rpcHealth: RpcHealthService, db: DbService, presets: IPresetManager): IOServer;
//# sourceMappingURL=attach-socket-io.d.ts.map