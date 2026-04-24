/** JSON-RPC probe; does not require the Socket.io control server. */
export async function isRpcReachable(rpcUrl: string, timeoutMs = 2000): Promise<boolean> {
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
      signal: AbortSignal.timeout(timeoutMs),
    });
    return response.ok;
  } catch {
    return false;
  }
}
