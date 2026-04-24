/**
 * Attaches Socket.io to the shared HTTP server.
 *
 * Accepts the IAnvilBridge and IPresetManager interfaces so the
 * socket layer is decoupled from process ownership.
 */
import { Server as IOServer } from "socket.io";
import { registerAnvilSocketHandlers } from "./anvil-socket.handlers.js";
export function attachSocketIo(httpServer, env, logger, bridge, rpcHealth, db, presets) {
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
