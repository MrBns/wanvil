/**
 * Core bridge interfaces for communication between CLI ↔ Server.
 *
 * The CLI owns the anvil child process and exposes it via IAnvilBridge.
 * The server receives this bridge at boot time and uses it to stream
 * logs / control the process / query state — without ever touching
 * the child process directly.
 */

// ─── Anvil Process Bridge ───────────────────────────────────────────

export interface IAnvilBridge {
  /** Spawn the anvil process with the given CLI arguments. */
  start(args: string[]): void;

  /** Send SIGTERM to the running process. */
  stop(): void;

  /** Stop then start with the same (or new) args. */
  restart(args?: string[]): void;

  /** Whether the child process is currently alive. */
  isRunning(): boolean;

  /** PID of the child process, or null if not running. */
  getPid(): number | null;

  /** Returns a copy of the in-memory log buffer. */
  getLogSnapshot(): readonly string[];

  /** Subscribe to new log lines. Returns an unsubscribe function. */
  onLog(cb: (line: string) => void): () => void;

  /**
   * Subscribe to process close events.
   * Returns an unsubscribe function.
   */
  onClose(cb: (code: number | null, signal: string | null) => void): () => void;
}

// ─── Mnemonic Preset Storage ────────────────────────────────────────

export interface IMnemonicPreset {
  id: number;
  label: string;
  /** AES-256-GCM ciphertext (hex-encoded). */
  encryptedMnemonic: string;
  /** PBKDF2 salt (hex-encoded). */
  salt: string;
  /** AES-GCM initialisation vector (hex-encoded). */
  iv: string;
  /** GCM auth tag (hex-encoded). */
  authTag: string;
  createdAt: string;
}

export interface IPresetManager {
  /** List all saved presets (without decrypted mnemonics). */
  list(): Promise<IMnemonicPreset[]>;

  /** Encrypt and save a mnemonic. Returns the new preset id. */
  save(label: string, mnemonic: string, password: string): Promise<number>;

  /** Decrypt and return the mnemonic for the given preset. Throws on wrong password. */
  load(id: number, password: string): Promise<string>;

  /** Delete a preset by id. */
  delete(id: number): Promise<void>;
}

// ─── Server Bootstrap Config ────────────────────────────────────────

export interface IServerConfig {
  port: number;
  logLevel: string;
  corsOrigins: string[];
  anvilBridge: IAnvilBridge;
  presetManager: IPresetManager;
}
