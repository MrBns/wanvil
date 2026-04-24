import type { Logger } from "pino";
export interface AnvilStartConfig {
    args?: string[];
    forkUrl?: string;
    forkBlockNumber?: string;
    mnemonic?: string;
}
export interface RunHistoryRow {
    id: number;
    created_at: Date;
    label: string;
    args_json: string;
    fork_url: string;
    fork_block_number: string;
    mnemonic: string;
}
export declare class DbService {
    private logger;
    private prisma;
    constructor(logger: Logger);
    disconnect(): Promise<void>;
    insertRun(config: AnvilStartConfig & {
        label?: string;
    }): Promise<void>;
    getHistory(limit?: number): Promise<RunHistoryRow[]>;
    saveLastConfig(config: AnvilStartConfig): Promise<void>;
    getLastConfig(): Promise<{
        forkUrl?: string;
        forkBlockNumber?: string;
        mnemonic?: string;
    } | null>;
}
//# sourceMappingURL=db.service.d.ts.map