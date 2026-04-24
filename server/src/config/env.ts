import { z } from "zod";

const DEFAULT_CORS_ORIGINS = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
] as const;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  /** Comma-separated origins for Socket.io and CORS preflight */
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((s) => {
      if (!s?.trim()) return [...DEFAULT_CORS_ORIGINS];
      const list = s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      return list.length > 0 ? list : [...DEFAULT_CORS_ORIGINS];
    }),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  /** Max retained stdout/stderr lines per anvil process instance */
  ANVIL_LOG_BUFFER_SIZE: z.coerce.number().int().positive().max(50_000).default(1000),
  RPC_PROBE_TIMEOUT_MS: z.coerce.number().int().positive().max(30_000).default(2000),
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(): AppEnv {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment:", parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}
