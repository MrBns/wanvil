/**
 * PresetManager — IPresetManager implementation.
 *
 * Manages password-encrypted mnemonic presets stored in:
 *   ~/.config/wanvil/presets.json
 *
 * Encryption: AES-256-GCM with PBKDF2-derived keys.
 * Each preset stores its own salt + IV + authTag so presets
 * can have independent passwords.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { IMnemonicPreset, IPresetManager } from "../../shared/dist/bridge.js";

const CONFIG_DIR = path.join(os.homedir(), ".config", "wanvil");
const PRESETS_FILE = path.join(CONFIG_DIR, "presets.json");

const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH = 32; // 256 bits
const SALT_LENGTH = 16;
const IV_LENGTH = 12; // GCM standard

export class PresetManager implements IPresetManager {
  private presets: IMnemonicPreset[] = [];

  constructor() {
    this.ensureConfigDir();
    this.loadFromDisk();
  }

  async list(): Promise<IMnemonicPreset[]> {
    return [...this.presets];
  }

  async save(
    label: string,
    mnemonic: string,
    password: string,
  ): Promise<number> {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = this.deriveKey(password, salt);

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    let encrypted = cipher.update(mnemonic, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();

    const nextId =
      this.presets.length > 0
        ? Math.max(...this.presets.map((p) => p.id)) + 1
        : 1;

    const preset: IMnemonicPreset = {
      id: nextId,
      label,
      encryptedMnemonic: encrypted,
      salt: salt.toString("hex"),
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
      createdAt: new Date().toISOString(),
    };

    this.presets.push(preset);
    this.writeToDisk();
    return nextId;
  }

  async load(id: number, password: string): Promise<string> {
    const preset = this.presets.find((p) => p.id === id);
    if (!preset) {
      throw new Error(`Preset #${id} not found.`);
    }

    const salt = Buffer.from(preset.salt, "hex");
    const iv = Buffer.from(preset.iv, "hex");
    const authTag = Buffer.from(preset.authTag, "hex");
    const key = this.deriveKey(password, salt);

    try {
      const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(preset.encryptedMnemonic, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch {
      throw new Error("Incorrect password or corrupted preset.");
    }
  }

  async delete(id: number): Promise<void> {
    this.presets = this.presets.filter((p) => p.id !== id);
    this.writeToDisk();
  }

  // ─── Internal Helpers ───────────────────────────────────────────

  private deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      password,
      salt,
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      "sha512",
    );
  }

  private ensureConfigDir(): void {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(PRESETS_FILE)) {
        const raw = fs.readFileSync(PRESETS_FILE, "utf8");
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          this.presets = data;
        }
      }
    } catch {
      // Corrupted file — start fresh
      this.presets = [];
    }
  }

  private writeToDisk(): void {
    this.ensureConfigDir();
    fs.writeFileSync(PRESETS_FILE, JSON.stringify(this.presets, null, 2), "utf8");
  }
}
