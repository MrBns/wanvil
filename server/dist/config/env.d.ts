import { z } from "zod";
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    CORS_ORIGINS: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string[], string | undefined>>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<{
        error: "error";
        fatal: "fatal";
        warn: "warn";
        info: "info";
        debug: "debug";
        trace: "trace";
    }>>;
    ANVIL_LOG_BUFFER_SIZE: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    RPC_PROBE_TIMEOUT_MS: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type AppEnv = z.infer<typeof envSchema>;
export declare function loadEnv(): AppEnv;
export {};
//# sourceMappingURL=env.d.ts.map