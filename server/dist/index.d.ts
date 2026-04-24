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
import type { IServerConfig } from "../../shared/dist/bridge.js";
export interface ServerHandle {
    shutdown: () => Promise<void>;
    port: number;
}
export declare function bootServer(config: IServerConfig): Promise<ServerHandle>;
//# sourceMappingURL=index.d.ts.map