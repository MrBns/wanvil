import pino from "pino";
export function createLogger(env) {
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
