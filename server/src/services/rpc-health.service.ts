import type { AppEnv } from "../config/env.js";
import type { AppLogger } from "../lib/logger.js";

export class RpcHealthService {
  constructor(
    private readonly env: AppEnv,
    private readonly logger: AppLogger
  ) {}

  async isRpcReachable(rpcUrl: string): Promise<boolean> {
    const url = rpcUrl?.trim() || "http://127.0.0.1:8545";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1,
        }),
        signal: AbortSignal.timeout(this.env.RPC_PROBE_TIMEOUT_MS),
      });
      return response.ok;
    } catch (err) {
      this.logger.debug({ err, url, msg: "rpc.probe.failed" });
      return false;
    }
  }
}
