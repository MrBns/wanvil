import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { createPublicClient, http, type PublicClient } from "viem";
import { localhost } from "viem/chains";

const DEFAULT_RPC = "http://127.0.0.1:8545";

function readStoredRpcUrl(): string {
  if (typeof window === "undefined") return DEFAULT_RPC;
  return localStorage.getItem("rpc_url") ?? DEFAULT_RPC;
}

type RpcContextType = {
  rpcUrl: string;
  setRpcUrl: (url: string) => void;
  publicClient: PublicClient;
};

const RpcContext = createContext<RpcContextType | null>(null);

export function RpcProvider({ children }: { children: ReactNode }) {
  const [rpcUrl, setRpcUrlState] = useState<string>(readStoredRpcUrl);

  const setRpcUrl = (url: string) => {
    setRpcUrlState(url);
    localStorage.setItem("rpc_url", url);
  };

  const publicClient = useMemo(
    () =>
      createPublicClient({
        chain: localhost,
        transport: http(rpcUrl),
      }),
    [rpcUrl]
  );

  return (
    <RpcContext.Provider value={{ rpcUrl, setRpcUrl, publicClient }}>
      {children}
    </RpcContext.Provider>
  );
}

export function useRpc() {
  const ctx = useContext(RpcContext);
  if (!ctx) throw new Error("useRpc must be used within RpcProvider");
  return ctx;
}
