import { create } from "zustand";
import type { RunHistoryRow } from "@/lib/anvilSocket";

export type OfflineTab = "config" | "history";

interface LogLine {
  text: string;
  count: number;
}

interface AnvilStore {
  // Runner configuration state
  forkUrl: string;
  forkBlockNumber: string;
  customMnemonic: string;
  extraArgs: string;

  // UI state for offline runner
  showHelp: boolean;
  activeTab: OfflineTab;

  // Offline Data
  runHistory: RunHistoryRow[];

  // Runtime State
  starting: boolean;
  logs: LogLine[];
  controlError: string | null;

  // Actions
  setForkUrl: (url: string) => void;
  setForkBlockNumber: (num: string) => void;
  setCustomMnemonic: (mnemonic: string) => void;
  setExtraArgs: (args: string) => void;
  setShowHelp: (show: boolean) => void;
  setActiveTab: (tab: OfflineTab) => void;
  setRunHistory: (history: RunHistoryRow[]) => void;
  setStarting: (starting: boolean) => void;
  setLogs: (logs: LogLine[] | ((prev: LogLine[]) => LogLine[])) => void;
  setControlError: (error: string | null) => void;
  resetConfig: () => void;
  applyHistoryConfig: (row: RunHistoryRow) => void;
}

export const useAnvilStore = create<AnvilStore>((set) => ({
  forkUrl: "",
  forkBlockNumber: "",
  customMnemonic: "",
  extraArgs: "",
  showHelp: false,
  activeTab: "config",
  runHistory: [],
  starting: false,
  logs: [],
  controlError: null,

  setForkUrl: (forkUrl) => set({ forkUrl }),
  setForkBlockNumber: (forkBlockNumber) => set({ forkBlockNumber }),
  setCustomMnemonic: (customMnemonic) => set({ customMnemonic }),
  setExtraArgs: (extraArgs) => set({ extraArgs }),
  setShowHelp: (showHelp) => set({ showHelp }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setRunHistory: (runHistory) => set({ runHistory }),
  setStarting: (starting) => set({ starting }),
  setLogs: (updater) =>
    set((state) => ({ logs: typeof updater === "function" ? updater(state.logs) : updater })),
  setControlError: (controlError) => set({ controlError }),
  resetConfig: () => set({ forkUrl: "", forkBlockNumber: "", customMnemonic: "", extraArgs: "" }),
  applyHistoryConfig: (row: RunHistoryRow) => {
    let extraArgs = "";
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
      extraArgs = filtered.join(" ");
    } catch {
      extraArgs = "";
    }

    set({
      forkUrl: row.fork_url || "",
      forkBlockNumber: row.fork_block_number || "",
      customMnemonic: row.mnemonic || "",
      extraArgs,
      activeTab: "config",
    });
  },
}));
