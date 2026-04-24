/**
 * AnvilBridge — IAnvilBridge implementation.
 *
 * Owns the `anvil` child process. Spawns it, captures stdout/stderr,
 * buffers log lines, emits events, echoes to terminal, and handles
 * graceful SIGTERM shutdown.
 *
 * This is the CLI-side counterpart that the server receives as an
 * opaque interface via IAnvilBridge.
 */

import { type ChildProcess, spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import type { IAnvilBridge } from "../../shared/dist/bridge.js";

const MAX_LOG_LINES = 2000;

export class AnvilBridge implements IAnvilBridge {
  private process: ChildProcess | null = null;
  private logs: string[] = [];
  private lineBuffer = "";
  private lastArgs: string[] = [];
  private readonly events = new EventEmitter();

  // ─── IAnvilBridge ───────────────────────────────────────────────

  start(args: string[]): void {
    if (this.process) {
      return;
    }

    this.logs = [];
    this.lineBuffer = "";
    this.lastArgs = [...args];

    const child = spawn("anvil", args, {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const pushLine = (line: string): void => {
      this.logs.push(line);
      while (this.logs.length > MAX_LOG_LINES) {
        this.logs.shift();
      }
      this.events.emit("log", line);

      // Mirror to terminal so CLI users see native output
      process.stdout.write(`${line}\n`);
    };

    const handleChunk = (data: Buffer): void => {
      const text = this.lineBuffer + data.toString();
      const parts = text.split("\n");
      this.lineBuffer = parts.pop() ?? "";

      for (const line of parts) {
        if (line) pushLine(line);
      }
    };

    child.stdout?.on("data", handleChunk);
    child.stderr?.on("data", handleChunk);

    child.on("error", (err) => {
      this.events.emit("log", `[wanvil] anvil spawn error: ${err.message}`);
    });

    child.on("close", (code, signal) => {
      // Flush remaining buffer
      if (this.lineBuffer) {
        pushLine(this.lineBuffer);
        this.lineBuffer = "";
      }
      this.process = null;
      this.events.emit("close", code, signal);
    });

    this.process = child;
  }

  stop(): void {
    if (!this.process) return;
    try {
      this.process.kill("SIGTERM");
    } catch {
      // Process may have already exited
    }
    this.process = null;
  }

  restart(args?: string[]): void {
    const nextArgs = args ?? this.lastArgs;
    this.stop();
    // Small delay to let the port release
    setTimeout(() => this.start(nextArgs), 500);
  }

  isRunning(): boolean {
    return this.process !== null;
  }

  getPid(): number | null {
    return this.process?.pid ?? null;
  }

  getLogSnapshot(): readonly string[] {
    return [...this.logs];
  }

  onLog(cb: (line: string) => void): () => void {
    this.events.on("log", cb);
    return () => this.events.off("log", cb);
  }

  onClose(
    cb: (code: number | null, signal: string | null) => void,
  ): () => void {
    this.events.on("close", cb);
    return () => this.events.off("close", cb);
  }
}
