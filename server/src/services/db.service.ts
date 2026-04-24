import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../../shared/generated/prisma/client.js";
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

export class DbService {
  private logger: Logger;
  private prisma: PrismaClient;

  constructor(logger: Logger) {
    this.logger = logger;

    // We store data in ~/.config/wanvil/data.db
    const configDir = path.join(os.homedir(), ".config", "wanvil");
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    const dbPath = path.join(configDir, "data.db");
    const isWindows = os.platform() === "win32";
    let dbUrl = `file:${dbPath}`;
    if (isWindows) {
      dbUrl = `file:/${dbPath.replace(/\\/g, "/")}`;
    }

    process.env.DATABASE_URL = dbUrl;

    // Auto-migrate tables seamlessly via Prisma Core CLI
    try {
      // Find the schema inside the standard prisma/ folder, resolving safely assuming dist/ server runpath
      let schemaPath = path.resolve(process.cwd(), "prisma/schema.prisma");
      if (!fs.existsSync(schemaPath)) {
        // Fallback for global cli
        schemaPath = path.resolve(__dirname, "../../prisma/schema.prisma");
      }

      execSync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, {
        stdio: "ignore",
        env: { ...process.env, DATABASE_URL: dbUrl },
      });
    } catch (err) {
      this.logger.warn({ err, msg: "db.service.prisma.push.failed" });
    }

    // Prisma 7 requires a driver adapter. Use the SQLite adapter and keep
    // unixepoch-ms compatibility for databases created by Prisma's native driver.
    const adapter = new PrismaBetterSqlite3(
      { url: dbUrl },
      { timestampFormat: "unixepoch-ms" },
    );

    this.prisma = new PrismaClient({ adapter });
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  public async insertRun(config: AnvilStartConfig & { label?: string }): Promise<void> {
    try {
      await this.prisma.runHistory.create({
        data: {
          label: config.label || "Local",
          args_json: JSON.stringify(config.args || []),
          fork_url: config.forkUrl || "",
          fork_block_number: config.forkBlockNumber || "",
          mnemonic: config.mnemonic || "",
        },
      });

      // Also upsert the last_config
      await this.saveLastConfig(config);
    } catch (err) {
      this.logger.warn({ err, msg: "db.insertRun.failed" });
    }
  }

  public async getHistory(limit: number = 50): Promise<RunHistoryRow[]> {
    try {
      const results = await this.prisma.runHistory.findMany({
        orderBy: { id: "desc" },
        take: limit,
      });
      return results as unknown as RunHistoryRow[];
    } catch (err) {
      this.logger.error({ err, msg: "db.getHistory.failed" });
      return [];
    }
  }

  public async saveLastConfig(config: AnvilStartConfig): Promise<void> {
    try {
      await this.prisma.lastConfig.deleteMany();
      await this.prisma.lastConfig.create({
        data: {
          fork_url: config.forkUrl || "",
          fork_block_number: config.forkBlockNumber || "",
          mnemonic: config.mnemonic || "",
        },
      });
    } catch (err) {
      this.logger.warn({ err, msg: "db.saveLastConfig.failed" });
    }
  }

  public async getLastConfig(): Promise<{
    forkUrl?: string;
    forkBlockNumber?: string;
    mnemonic?: string;
  } | null> {
    try {
      const res = await this.prisma.lastConfig.findFirst();
      if (!res) return null;
      return {
        forkUrl: res.fork_url || undefined,
        forkBlockNumber: res.fork_block_number || undefined,
        mnemonic: res.mnemonic || undefined,
      };
    } catch (err) {
      this.logger.error({ err, msg: "db.getLastConfig.failed" });
      return null;
    }
  }
}
