import type { AppEnv } from "../config/env.js";
import type { AppLogger } from "../lib/logger.js";
export declare class RpcHealthService {
    private readonly env;
    private readonly logger;
    constructor(env: AppEnv, logger: AppLogger);
    isRpcReachable(rpcUrl: string): Promise<boolean>;
}
//# sourceMappingURL=rpc-health.service.d.ts.map