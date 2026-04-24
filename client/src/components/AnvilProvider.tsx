import { ArrowDown, Clock, GitFork, HelpCircle, History, Key, Loader2, Play, Terminal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  type AnvilStartConfig,
  anvilSocketHistory,
  anvilSocketLastConfig,
  anvilSocketStart,
  subscribeAnvilLogs,
  useAnvilSocketConnected,
} from "@/lib/anvilSocket";
import { appendCompactLog } from "@/lib/logCompression";
import { useRpc } from "@/lib/rpcContext";
import { isRpcReachable } from "@/lib/rpcHealth";
import { useAnvilStore } from "@/lib/store";
import { useStickyTerminalScroll } from "@/lib/useStickyTerminalScroll";

const DEFAULT_MNEMONIC = "test test test test test test test test test test test junk";
const RPC_HEALTH_POLL_MS = 2000;

export function AnvilProvider({ children }: { children: React.ReactNode }) {
  const { rpcUrl } = useRpc();
  const socketConnected = useAnvilSocketConnected();
  const [chainReachable, setChainReachable] = useState<boolean | null>(null);

  // Runner state from Zustand
  const showHelp = useAnvilStore((state) => state.showHelp);
  const setShowHelp = useAnvilStore((state) => state.setShowHelp);
  const activeTab = useAnvilStore((state) => state.activeTab);
  const setActiveTab = useAnvilStore((state) => state.setActiveTab);

  const forkUrl = useAnvilStore((state) => state.forkUrl);
  const setForkUrl = useAnvilStore((state) => state.setForkUrl);
  const forkBlockNumber = useAnvilStore((state) => state.forkBlockNumber);
  const setForkBlockNumber = useAnvilStore((state) => state.setForkBlockNumber);
  const customMnemonic = useAnvilStore((state) => state.customMnemonic);
  const setCustomMnemonic = useAnvilStore((state) => state.setCustomMnemonic);
  const extraArgs = useAnvilStore((state) => state.extraArgs);
  const setExtraArgs = useAnvilStore((state) => state.setExtraArgs);

  const runHistory = useAnvilStore((state) => state.runHistory);
  const setRunHistory = useAnvilStore((state) => state.setRunHistory);
  const applyHistoryConfig = useAnvilStore((state) => state.applyHistoryConfig);

  const starting = useAnvilStore((state) => state.starting);
  const setStarting = useAnvilStore((state) => state.setStarting);
  const logs = useAnvilStore((state) => state.logs);
  const setLogs = useAnvilStore((state) => state.setLogs);
  const controlError = useAnvilStore((state) => state.controlError);
  const setControlError = useAnvilStore((state) => state.setControlError);
  const { containerRef: logsContainerRef, isPinnedToBottom, scrollToBottom } =
    useStickyTerminalScroll([logs, starting]);
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const ok = await isRpcReachable(rpcUrl);
      if (!cancelled) {
        setChainReachable(ok);
        if (ok) setStarting(false);
      }
    };
    void tick();
    const intv = setInterval(() => void tick(), RPC_HEALTH_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(intv);
    };
  }, [rpcUrl]);

  // Load last config and history if control server is online
  useEffect(() => {
    if (socketConnected && !chainReachable) {
      void anvilSocketLastConfig()
        .then((res) => {
          if (res.success && res.config) {
            setForkUrl(res.config.forkUrl ?? "");
            setForkBlockNumber(res.config.forkBlockNumber ?? "");
            setCustomMnemonic(res.config.mnemonic ?? "");
          }
        })
        .catch(() => {});

      void anvilSocketHistory()
        .then((res) => {
          if (res.success) setRunHistory(res.history ?? []);
        })
        .catch(() => {});
    }
  }, [socketConnected, chainReachable]);

  const loadHistory = useCallback(() => {
    if (socketConnected) {
      void anvilSocketHistory()
        .then((res) => {
          if (res.success) setRunHistory(res.history ?? []);
        })
        .catch(() => {});
    }
  }, [socketConnected]);

  // Log streaming when starting
  useEffect(() => {
    if (!starting) return;
    const pushLine = (text: string) => {
      setLogs((prev) => appendCompactLog(prev, text, 200));
    };
    const unsub = subscribeAnvilLogs(
      (lines) => {
        for (const line of lines) pushLine(line);
      },
      (text) => pushLine(text)
    );
    return unsub;
  }, [starting]);

  const startAnvilFromControlServer = async () => {
    setControlError(null);
    setStarting(true);
    setLogs([]);

    const config: AnvilStartConfig = {
      forkUrl: forkUrl.trim() || undefined,
      forkBlockNumber: forkBlockNumber.trim() || undefined,
      mnemonic: customMnemonic.trim() || undefined,
    };
    if (extraArgs.trim()) {
      config.args = extraArgs.split(/\s+/).filter(Boolean);
    }

    try {
      const res = await anvilSocketStart(config);
      if (!res.success) {
        setControlError(res.error ?? "Control server refused to start Anvil.");
        setStarting(false);
      } else {
        loadHistory();
      }
    } catch (e) {
      setControlError(
        e instanceof Error
          ? e.message
          : "Cannot reach the control server. Run `npm run dev:server` in another terminal, or start `anvil` manually."
      );
      setStarting(false);
    }
  };
  if (chainReachable === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
        <Loader2 className="animate-spin text-foreground w-6 h-6" />
      </div>
    );
  }

  if (!chainReachable && !starting) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 text-foreground overflow-y-auto">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="anvil-offline-title"
          className="bg-card w-full max-w-2xl rounded-lg border border-border flex flex-col my-8 shadow-xl relative"
        >
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
            title="Help"
          >
            <HelpCircle size={20} />
          </button>

          <div className="p-8 pb-4">
            <div className="flex flex-col items-center text-center gap-2 mb-6">
              <div className="p-3 rounded-full border border-border bg-muted mb-2">
                <Terminal className="w-8 h-8 text-foreground" />
              </div>
              <h2 id="anvil-offline-title" className="text-xl font-semibold">
                Anvil is not running
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                No JSON-RPC response from{" "}
                <span className="font-mono text-foreground bg-muted px-1 py-0.5 rounded border border-border">
                  {rpcUrl}
                </span>
                .
              </p>
            </div>

            {showHelp && (
              <div className="rounded-md border border-border bg-muted/50 p-4 text-left text-sm text-muted-foreground space-y-2 mb-6 animate-in fade-in slide-in-from-top-2">
                <p className="font-medium text-foreground">Option A — External Terminal</p>
                <p>
                  Run{" "}
                  <code className="font-mono text-xs bg-muted border border-border px-1.5 py-0.5 rounded">
                    anvil
                  </code>{" "}
                  (Foundry) in a separate terminal. This application will auto-detect the node when
                  ready.
                </p>
                <p className="font-medium text-foreground pt-2">Option B — Built-in Manager</p>
                <p>
                  Use the configuration tabs below to start the local node directly from this
                  interface. Requires the control server bundle to be running.
                </p>
              </div>
            )}
          </div>

          <div className="flex border-b border-border px-8 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("config")}
              className={`flex items-center gap-1.5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px mr-6 ${
                activeTab === "config"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <GitFork size={14} /> New Run
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("history");
                loadHistory();
              }}
              className={`flex items-center gap-1.5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === "history"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <History size={14} /> Run History
            </button>
          </div>

          <div className="p-8 pt-6 min-h-[300px]">
            {activeTab === "config" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Fork URL
                    </label>
                    <input
                      type="text"
                      value={forkUrl}
                      onChange={(e) => setForkUrl(e.target.value)}
                      placeholder="https://eth-mainnet.g.alchemy..."
                      className="w-full py-2 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Fork Block
                    </label>
                    <input
                      type="text"
                      value={forkBlockNumber}
                      onChange={(e) => setForkBlockNumber(e.target.value)}
                      placeholder="latest"
                      className="w-full py-2 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5 flex items-center gap-1">
                    <Key size={12} /> Custom Mnemonic
                  </label>
                  <input
                    type="text"
                    value={customMnemonic}
                    onChange={(e) => setCustomMnemonic(e.target.value)}
                    placeholder={DEFAULT_MNEMONIC}
                    className="w-full py-2 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5 flex items-center gap-1">
                    <Terminal size={12} /> Extra Arguments
                  </label>
                  <input
                    type="text"
                    value={extraArgs}
                    onChange={(e) => setExtraArgs(e.target.value)}
                    placeholder="e.g. --dump-state state.json"
                    className="w-full py-2 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 font-mono text-sm"
                  />
                </div>

                {controlError && (
                  <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2">
                    {controlError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={startAnvilFromControlServer}
                  disabled={!socketConnected}
                  className="w-full mt-4 flex justify-center items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-md font-medium text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={16} fill="currentColor" />{" "}
                  {socketConnected ? "Launch Node" : "Control Server Offline"}
                </button>
              </div>
            )}

            {activeTab === "history" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 h-[340px] overflow-y-auto border border-border rounded-md">
                {runHistory.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm flex h-full items-center justify-center italic">
                    No run history found.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {runHistory.map((row) => {
                      const hasConfig = row.fork_url || row.mnemonic;
                      let argsPreview = "";
                      try {
                        const arr = JSON.parse(row.args_json) as string[];
                        argsPreview = arr.join(" ");
                      } catch {
                        /* ignore */
                      }

                      return (
                        <div
                          key={row.id}
                          className="p-4 hover:bg-muted/30 transition-colors flex items-start justify-between gap-4"
                        >
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {row.label || "Local"}
                              </span>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Clock size={11} />
                                {new Date(row.created_at).toLocaleString()}
                              </span>
                            </div>

                            <div className="space-y-1 mt-2">
                              {argsPreview && (
                                <p
                                  className="text-[10px] text-muted-foreground font-mono truncate bg-muted border border-border rounded px-1.5 py-0.5"
                                  title={argsPreview}
                                >
                                  &gt; anvil {argsPreview}
                                </p>
                              )}
                              {!hasConfig && !argsPreview && (
                                <p className="text-[10px] text-muted-foreground font-mono bg-muted border border-border rounded px-1.5 py-0.5 inline-block">
                                  &gt; anvil
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => applyHistoryConfig(row)}
                            className="text-xs font-medium px-3 py-1.5 bg-card border border-border rounded-md hover:bg-muted transition-colors text-foreground shrink-0 flex items-center gap-1.5"
                          >
                            <GitFork size={12} /> Load
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!chainReachable && starting) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-8 bg-background/95 backdrop-blur-sm">
        <div className="mb-6 flex flex-col justify-center items-center gap-3">
          <Loader2 className="animate-spin text-foreground w-6 h-6" />
          <p className="text-foreground font-medium text-sm">Starting Anvil…</p>
          <p className="text-muted-foreground text-sm text-center max-w-md">
            Waiting for RPC at <span className="font-mono">{rpcUrl}</span>. Logs below come from the
            control server.
          </p>
        </div>
        <div className="relative w-full max-w-4xl">
        <div className="h-[min(600px,55vh)] bg-terminal rounded-lg border border-terminal-border flex flex-col overflow-hidden">
          <div className="bg-terminal-header px-4 py-2.5 flex items-center gap-2 border-b border-terminal-border shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
            <span className="ml-3 text-xs font-mono text-terminal-muted">anvil stdout / stderr</span>
          </div>
          <div ref={logsContainerRef} className="flex-1 p-4 font-mono text-[13px] leading-relaxed text-terminal-foreground overflow-y-auto w-full space-y-0.5 min-h-0">
            {logs.length === 0 && <span className="text-terminal-muted">Waiting for log lines…</span>}
            {logs.map((log, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <span className="whitespace-pre-wrap break-all pr-4">{log.text}</span>
                {log.count > 1 && (
                  <span className="bg-terminal-badge text-terminal-muted border border-terminal-border px-2 py-0.5 rounded-full text-[10px] shrink-0 font-medium">
                    x{log.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
          {!isPinnedToBottom && (
            <button
              type="button"
              onClick={scrollToBottom}
              className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-terminal-border bg-terminal-header px-3 py-1.5 text-xs font-medium text-terminal-foreground transition-colors hover:bg-terminal-badge"
            >
              <ArrowDown size={12} />
              Scroll to latest
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
