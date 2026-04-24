import { io, type Socket } from "socket.io-client";
import type { IMnemonicPreset } from "../../../shared/bridge";

let socket: Socket | null = null;

export function getAnvilSocketUrl(): string {
  // In production (served by wanvil server), use same origin.
  // In development, use the env variable or default.
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
  return import.meta.env.VITE_ANVIL_SOCKET_URL ?? "http://127.0.0.1:4269";
}

export function getAnvilSocket(): Socket {
  if (!socket) {
    socket = io(getAnvilSocketUrl(), {
      autoConnect: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

type ActionAck = { success: boolean; error?: string };

function emitWithAck<T>(event: string, payload?: object): Promise<T> {
  const s = getAnvilSocket();
  return new Promise((resolve, reject) => {
    const send = () => {
      s.timeout(8000).emit(event, payload ?? {}, (err: Error | null, res: T) => {
        if (err) reject(err);
        else resolve(res);
      });
    };
    if (s.connected) send();
    else s.once("connect", send);
  });
}

// ─── Anvil Start Config ─────────────────────────────────────────

export interface AnvilStartConfig {
  args?: string[];
  forkUrl?: string;
  forkBlockNumber?: string;
  mnemonic?: string;
}

export function anvilSocketStart(config: AnvilStartConfig): Promise<ActionAck> {
  return emitWithAck<ActionAck>("anvil:start", config);
}

export function anvilSocketStop(): Promise<ActionAck> {
  return emitWithAck<ActionAck>("anvil:stop", {});
}

export function anvilSocketRestart(args?: string[]): Promise<ActionAck> {
  return emitWithAck<ActionAck>("anvil:restart", { args });
}

// ─── Run History ────────────────────────────────────────────────

export interface RunHistoryRow {
  id: number;
  created_at: string;
  label: string;
  args_json: string;
  fork_url: string;
  fork_block_number: string;
  mnemonic: string;
}

export function anvilSocketHistory(): Promise<{
  success: boolean;
  history: RunHistoryRow[];
}> {
  return emitWithAck("anvil:history", {});
}

export function anvilSocketLastConfig(): Promise<{
  success: boolean;
  config: {
    args: string[];
    forkUrl: string;
    forkBlockNumber: string;
    mnemonic: string;
  } | null;
}> {
  return emitWithAck("anvil:lastConfig", {});
}

// ─── Preset Management ─────────────────────────────────────────

export function presetsSocketList(): Promise<{
  success: boolean;
  presets: IMnemonicPreset[];
}> {
  return emitWithAck("presets:list");
}

export function presetsSocketSave(
  label: string,
  mnemonic: string,
  password: string,
): Promise<ActionAck & { id?: number }> {
  return emitWithAck("presets:save", { label, mnemonic, password });
}

export function presetsSocketLoad(
  id: number,
  password: string,
): Promise<ActionAck & { mnemonic?: string }> {
  return emitWithAck("presets:load", { id, password });
}

export function presetsSocketDelete(id: number): Promise<ActionAck> {
  return emitWithAck("presets:delete", { id });
}

// ─── Log Streaming ──────────────────────────────────────────────

export function subscribeAnvilLogs(
  onHistory: (lines: string[]) => void,
  onLine: (text: string) => void,
): () => void {
  const s = getAnvilSocket();
  const onHistoryEv = (payload: { lines: string[] }) => {
    onHistory(payload.lines ?? []);
  };
  const onLineEv = (payload: { text: string }) => {
    if (payload?.text) onLine(payload.text);
  };

  const onConnect = () => {
    s.emit("logs:subscribe");
  };

  s.on("connect", onConnect);
  s.on("logs:history", onHistoryEv);
  s.on("logs:line", onLineEv);
  if (s.connected) {
    s.emit("logs:subscribe");
  }

  return () => {
    s.off("connect", onConnect);
    s.emit("logs:unsubscribe");
    s.off("logs:history", onHistoryEv);
    s.off("logs:line", onLineEv);
  };
}

// ─── Connection Status Hook ─────────────────────────────────────

import { useEffect, useState } from "react";

export function useAnvilSocketConnected(): boolean {
  const [connected, setConnected] = useState(() => {
    try {
      return getAnvilSocket().connected;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const s = getAnvilSocket();
    setConnected(s.connected);

    const onConn = () => setConnected(true);
    const onDisconn = () => setConnected(false);

    s.on("connect", onConn);
    s.on("disconnect", onDisconn);
    return () => {
      s.off("connect", onConn);
      s.off("disconnect", onDisconn);
    };
  }, []);

  return connected;
}
