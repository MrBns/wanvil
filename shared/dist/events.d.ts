/**
 * Typed Socket.io event contracts shared between server and client.
 *
 * These interfaces enforce compile-time safety for all real-time
 * communication between the React frontend and the Node.js backend.
 */
import type { IMnemonicPreset } from "./bridge.js";
export interface LogLinePayload {
    text: string;
}
export interface LogHistoryPayload {
    lines: string[];
}
export interface AnvilStatusPayload {
    running: boolean;
    pid: number | null;
}
export interface ActionAck {
    success: boolean;
    error?: string;
}
export interface RunHistoryRow {
    id: number;
    created_at: string;
    label: string;
    args_json: string;
    fork_url: string;
    fork_block_number: string;
    mnemonic: string;
}
export interface ServerToClientEvents {
    "logs:line": (payload: LogLinePayload) => void;
    "logs:history": (payload: LogHistoryPayload) => void;
    "anvil:status-changed": (payload: AnvilStatusPayload) => void;
}
export interface ClientToServerEvents {
    "anvil:status": (payload: {
        rpcUrl?: string;
    }, cb: (res: {
        running: boolean;
        error?: string;
    }) => void) => void;
    "anvil:start": (payload: {
        args?: string[];
        forkUrl?: string;
        forkBlockNumber?: string;
        mnemonic?: string;
    }, cb: (res: ActionAck) => void) => void;
    "anvil:stop": (payload: unknown, cb: (res: ActionAck) => void) => void;
    "anvil:restart": (payload: {
        args?: string[];
    }, cb: (res: ActionAck) => void) => void;
    "logs:subscribe": () => void;
    "logs:unsubscribe": () => void;
    "anvil:history": (payload: unknown, cb: (res: {
        success: boolean;
        history: RunHistoryRow[];
    }) => void) => void;
    "anvil:lastConfig": (payload: unknown, cb: (res: {
        success: boolean;
        config: {
            forkUrl: string;
            forkBlockNumber: string;
            mnemonic: string;
        } | null;
    }) => void) => void;
    "presets:list": (cb: (res: {
        success: boolean;
        presets: IMnemonicPreset[];
    }) => void) => void;
    "presets:save": (payload: {
        label: string;
        mnemonic: string;
        password: string;
    }, cb: (res: ActionAck & {
        id?: number;
    }) => void) => void;
    "presets:load": (payload: {
        id: number;
        password: string;
    }, cb: (res: ActionAck & {
        mnemonic?: string;
    }) => void) => void;
    "presets:delete": (payload: {
        id: number;
    }, cb: (res: ActionAck) => void) => void;
}
//# sourceMappingURL=events.d.ts.map