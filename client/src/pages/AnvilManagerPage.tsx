import {
  ArrowDown,
  Clock,
  Eye,
  EyeOff,
  GitFork,
  History,
  Key,
  Play,
  RefreshCw,
  RotateCcw,
  Square,
  Terminal,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toHex } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { Button } from "@/components/ui/button";
import { WanvilMark } from "@/components/WanvilMark";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  type AnvilStartConfig,
  anvilSocketHistory,
  anvilSocketLastConfig,
  anvilSocketStart,
  anvilSocketStop,
  type RunHistoryRow,
  subscribeAnvilLogs,
  useAnvilSocketConnected,
} from "@/lib/anvilSocket";
import { appendCompactLog } from "@/lib/logCompression";
import { isRpcReachable } from "@/lib/rpcHealth";
import { useRpc } from "@/lib/rpcContext";
import { useStickyTerminalScroll } from "@/lib/useStickyTerminalScroll";

interface LogLine {
  text: string;
  count: number;
}

const DEFAULT_MNEMONIC = "test test test test test test test test test test test junk";
const RPC_STATUS_POLL_MS = 2000;

type Tab = "logs" | "credentials" | "config" | "history";

export default function AnvilManagerPage() {
  const { rpcUrl } = useRpc();
  const socketConnected = useAnvilSocketConnected();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("logs");
  const { containerRef: logsContainerRef, isPinnedToBottom, scrollToBottom } =
    useStickyTerminalScroll([logs, activeTab]);

  useEffect(() => {
    let isLocal = false;
    try {
      const parsed = new URL(rpcUrl);
      const h = parsed.hostname;
      if (h === "127.0.0.1" || h === "0.0.0.0" || h === "localhost") {
        isLocal = true;
      }
    } catch {
      isLocal =
        rpcUrl.includes("localhost") || rpcUrl.includes("127.0.0.1") || rpcUrl.includes("0.0.0.0");
    }

    if (!socketConnected || !isLocal) {
      navigate("/");
    }
  }, [socketConnected, rpcUrl, navigate]);

  useEffect(() => {
    let cancelled = false;

    const syncRunningState = async () => {
      const running = await isRpcReachable(rpcUrl);
      if (!cancelled) {
        setIsRunning(running);
      }
    };

    void syncRunningState();
    const intervalId = window.setInterval(() => void syncRunningState(), RPC_STATUS_POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [rpcUrl]);

  const [showMnemonic, setShowMnemonic] = useState(false);
  const [revealedKey, setRevealedKey] = useState<number | null>(null);

  const [forkUrl, setForkUrl] = useState("");
  const [forkBlockNumber, setForkBlockNumber] = useState("");
  const [customMnemonic, setCustomMnemonic] = useState("");
  const [extraArgs, setExtraArgs] = useState("");

  const [runHistory, setRunHistory] = useState<RunHistoryRow[]>([]);

  const activeMnemonic = customMnemonic.trim() || DEFAULT_MNEMONIC;

  const refreshRunningState = useCallback(async () => {
    const running = await isRpcReachable(rpcUrl);
    setIsRunning(running);
  }, [rpcUrl]);

  const defaultAccounts = Array.from({ length: 10 }).map((_, i) => {
    try {
      const acc = mnemonicToAccount(activeMnemonic, { accountIndex: i });
      return {
        index: i,
        address: acc.address,
        privateKey: acc.getHdKey().privateKey ? toHex(acc.getHdKey().privateKey!) : "",
      };
    } catch {
      return { index: i, address: "Invalid mnemonic", privateKey: "" };
    }
  });

  useEffect(() => {
    void anvilSocketLastConfig()
      .then((res) => {
        if (res.success && res.config) {
          setForkUrl(res.config.forkUrl ?? "");
          setForkBlockNumber(res.config.forkBlockNumber ?? "");
          setCustomMnemonic(res.config.mnemonic ?? "");
        }
      })
      .catch(() => {});
  }, []);

  const loadHistory = useCallback(() => {
    void anvilSocketHistory()
      .then((res) => {
        if (res.success) setRunHistory(res.history ?? []);
      })
      .catch(() => {});
  }, []);

  const refreshManagerState = useCallback(() => {
    void refreshRunningState();
    loadHistory();
    void anvilSocketLastConfig()
      .then((res) => {
        if (res.success && res.config) {
          setForkUrl(res.config.forkUrl ?? "");
          setForkBlockNumber(res.config.forkBlockNumber ?? "");
          setCustomMnemonic(res.config.mnemonic ?? "");
        }
      })
      .catch(() => {});
  }, [loadHistory, refreshRunningState]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const pushLine = (text: string) => {
      setLogs((prev) => appendCompactLog(prev, text, 400));
    };

    return subscribeAnvilLogs(
      (lines) => {
        for (const line of lines) pushLine(line);
      },
      (text) => pushLine(text)
    );
  }, []);

  const handleStart = async () => {
    if (isRunning) {
      setActiveTab("logs");
      return;
    }

    const config: AnvilStartConfig = {
      forkUrl: forkUrl.trim() || undefined,
      forkBlockNumber: forkBlockNumber.trim() || undefined,
      mnemonic: customMnemonic.trim() || undefined,
    };
    if (extraArgs.trim()) {
      config.args = extraArgs.split(/\s+/).filter(Boolean);
    }
    try {
      await anvilSocketStart(config);
      setActiveTab("logs");
      loadHistory();
    } catch {}
  };

  const handleStop = async () => {
    try {
      await anvilSocketStop();
      setIsRunning(false);
    } catch {}
  };

  const handleRestart = async () => {
    setLogs([]);
    try {
      await anvilSocketStop();
      setTimeout(() => {
        void handleStart();
      }, 1000);
    } catch {}
  };

  const applyHistoryConfig = (row: RunHistoryRow) => {
    setForkUrl(row.fork_url);
    setForkBlockNumber(row.fork_block_number);
    setCustomMnemonic(row.mnemonic);
    try {
      const args = JSON.parse(row.args_json) as string[];
      const filtered = args.filter(
        (a) =>
          a !== "--fork-url" &&
          a !== "--fork-block-number" &&
          a !== "--mnemonic" &&
          !args.some(
            (prev, idx) =>
              (prev === "--fork-url" || prev === "--fork-block-number" || prev === "--mnemonic") &&
              args[idx + 1] === a
          )
      );
      setExtraArgs(filtered.join(" "));
    } catch {
      setExtraArgs("");
    }
    setActiveTab("config");
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "logs", label: "Logs", icon: <Terminal size={14} /> },
    { id: "credentials", label: "Credentials", icon: <Key size={14} /> },
    { id: "history", label: "Run History", icon: <History size={14} /> },
    { id: "config", label: "Configuration", icon: <GitFork size={14} /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <WanvilMark className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Wanvil Control</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="items-center bg-card border border-border rounded-md px-3 py-1.5 hidden lg:flex">
            <span className="text-xs text-muted-foreground mr-2 font-mono">RPC:</span>
            <div
              className="bg-transparent text-sm font-mono focus:outline-none w-48 text-foreground truncate cursor-default"
              title={rpcUrl}
            >
              {rpcUrl}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={refreshManagerState}
            title="Refresh Wanvil State"
          >
            <RefreshCw size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRestart} title="Restart Anvil Node">
            <RotateCcw size={16} />
          </Button>
          <Button variant="destructive" size="icon" onClick={handleStop} title="Stop Anvil Node">
            <Square size={16} fill="currentColor" />
          </Button>
        </div>
      </div>

      <div className="flex border-b border-border shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "config" && (
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Node Configuration</CardTitle>
            <CardDescription className="mt-1">
              Configure your Wanvil-managed node. Settings are persisted across sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <GitFork size={14} />
                Fork Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Fork URL
                  </label>
                  <Input
                    type="text"
                    value={forkUrl}
                    onChange={(e) => setForkUrl(e.target.value)}
                    placeholder="https://eth-mainnet.g.alchemy.com/v2/..."
                    className="font-mono text-sm shadow-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Fork Block Number
                  </label>
                  <Input
                    type="text"
                    value={forkBlockNumber}
                    onChange={(e) => setForkBlockNumber(e.target.value)}
                    placeholder="latest"
                    className="font-mono text-sm shadow-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Key size={14} />
                Custom Mnemonic
              </h3>
              <Input
                type="text"
                value={customMnemonic}
                onChange={(e) => setCustomMnemonic(e.target.value)}
                placeholder={DEFAULT_MNEMONIC}
                className="font-mono text-sm shadow-none"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use the default Foundry mnemonic.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Terminal size={14} />
                Extra Arguments
              </h3>
              <Input
                type="text"
                value={extraArgs}
                onChange={(e) => setExtraArgs(e.target.value)}
                placeholder="e.g. --dump-state state.json --accounts 20"
                className="font-mono text-sm shadow-none"
              />
            </div>

            {isRunning ? (
              <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-[#22c55e]" />
                Wanvil node is already running
              </div>
            ) : (
              <Button onClick={handleStart} variant="primary" className="flex items-center gap-2">
                <Play size={14} fill="currentColor" />
                Start Wanvil Node
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "logs" && (
        <div className="relative">
          <div
            className="flex flex-col rounded-lg border border-terminal-border bg-terminal overflow-hidden"
            style={{ minHeight: "calc(100vh - 240px)" }}
          >
          <div className="bg-terminal-header px-4 py-2.5 flex items-center gap-2 border-b border-terminal-border shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
            <span className="ml-3 text-xs font-mono text-terminal-muted">
              Terminal — anvil process
            </span>
          </div>
          <div
            ref={logsContainerRef}
            className="flex-1 p-4 font-mono text-[13px] leading-relaxed text-terminal-foreground overflow-y-auto space-y-0.5"
            style={{ maxHeight: "calc(100vh - 300px)" }}
          >
            {logs.length === 0 ? (
              <div className="text-terminal-muted animate-pulse">Waiting for logs...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex items-start justify-between group">
                  <span className="whitespace-pre-wrap break-all pr-4">{log.text}</span>
                  {log.count > 1 && (
                    <span className="bg-terminal-badge text-terminal-muted border border-terminal-border px-2 py-0.5 rounded-full text-[10px] shrink-0 font-medium mt-0.5">
                      x{log.count}
                    </span>
                  )}
                </div>
              ))
            )}
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
      )}

      {activeTab === "credentials" && (
        <Card className="max-w-4xl w-full">
          <CardHeader>
            <CardTitle className="text-base">Default Accounts Configuration</CardTitle>
            <CardDescription className="mt-1">
              Foundry establishes 10 default unlocked signers. Use these safely in local
              environments.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
            <div className="flex items-center justify-between bg-muted p-4 rounded-md border border-border mb-6">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-1.5">
                  Mnemonic Phrase
                </p>
                {showMnemonic ? (
                  <p className="font-mono text-sm text-foreground break-all">{activeMnemonic}</p>
                ) : (
                  <p className="font-mono text-sm text-muted-foreground">
                    ••••••••••••••••••••••••••••••••••••••••••••
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowMnemonic(!showMnemonic)}
                className="ml-4 shrink-0 transition-colors"
              >
                {showMnemonic ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>

            <div className="space-y-3">
              {defaultAccounts.map((acc) => (
                <div
                  key={acc.index}
                  className="flex flex-col gap-2.5 p-4 border border-border rounded-md hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-foreground">{acc.address}</span>
                    <span className="text-[11px] bg-muted border border-border px-2 py-0.5 rounded font-medium text-muted-foreground">
                      Account {acc.index}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2.5">
                    {revealedKey === acc.index ? (
                      <span className="font-mono text-xs text-foreground break-all bg-muted px-2 py-1 rounded border border-border">
                        {acc.privateKey}
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground">
                        0x••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRevealedKey(revealedKey === acc.index ? null : acc.index)}
                    >
                      {revealedKey === acc.index ? "Hide" : "Reveal"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "history" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Run History</CardTitle>
              <CardDescription className="mt-1">
                Previous Wanvil node configurations. Click to reuse.
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={loadHistory}>
              <RefreshCw size={14} />
            </Button>
          </CardHeader>
          <CardContent className="overflow-y-auto p-0" style={{ maxHeight: "calc(100vh - 300px)" }}>
            {runHistory.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No run history yet. Start a Wanvil node from the Configuration tab.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {runHistory.map((row) => {
                  const hasConfig = row.fork_url || row.mnemonic;
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
                        {row.fork_url && (
                          <p className="text-xs text-muted-foreground font-mono truncate">
                            Fork: {row.fork_url}
                            {row.fork_block_number ? ` @ ${row.fork_block_number}` : ""}
                          </p>
                        )}
                        {row.mnemonic && (
                          <p className="text-xs text-muted-foreground font-mono truncate">
                            Mnemonic: {row.mnemonic.slice(0, 30)}...
                          </p>
                        )}
                        {!hasConfig && (
                          <p className="text-xs text-muted-foreground">Default configuration</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => applyHistoryConfig(row)}>
                        Use Config
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
