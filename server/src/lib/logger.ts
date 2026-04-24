import pino from "pino";
import type { AppEnv } from "../config/env.js";

export type AppLogger = pino.Logger;

export function createLogger(env: AppEnv): AppLogger {
  const base = { level: env.LOG_LEVEL };

  if (env.NODE_ENV === "development") {
    return pino({
      ...base,
      transport: {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "SYS:standard" },
      },
    });
  }

  return pino(base);
}
