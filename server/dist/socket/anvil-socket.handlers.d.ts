/**
 * Registers Anvil control + log streaming + preset management
 * handlers on the root Socket.io namespace.
 *
 * Consumes IAnvilBridge and IPresetManager interfaces — no direct
 * dependency on the child process or file system.
 */
import type { Server } from "socket.io";
import type { IAnvilBridge, IPresetManager } from "../../../shared/dist/bridge.js";
import type { AppLogger } from "../lib/logger.js";
import type { DbService } from "../services/db.service.js";
import type { RpcHealthService } from "../services/rpc-health.service.js";
export declare function registerAnvilSocketHandlers(io: Server, logger: AppLogger, bridge: IAnvilBridge, rpcHealth: RpcHealthService, db: DbService, presets: IPresetManager): void;
//# sourceMappingURL=anvil-socket.handlers.d.ts.map