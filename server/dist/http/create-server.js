import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// When compiled, __dirname is dist/server/http
// We are looking for dist/client relative to dist/server/.. assuming monorepo output structure
// Wait, actually the root package.json has: "build": "vite build" which outputs to client/dist or dist/?
// Let's resolve safely based on execution context
// Depending on vite's outDir, usually it's "dist". Let's configure Vite if needed, but standard is fallback html.
// Better resolution: try a few possible places where the client dist could be
const possibleClientPaths = [
    path.join(process.cwd(), "client", "dist"),
    path.join(__dirname, "..", "..", "..", "client", "dist"),
    path.join(__dirname, "..", "..", "..", "dist", "client"),
    path.join(process.cwd(), "dist", "client"),
];
function getClientPath() {
    for (const p of possibleClientPaths) {
        try {
            if (statSync(p).isDirectory())
                return p;
        }
        catch {
            // ignore
        }
    }
    return null;
}
const MIME_TYPES = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".json": "application/json",
};
export function createHttpServer(logger, env) {
    const startedAt = Date.now();
    return createServer((req, res) => {
        try {
            handleHttp(req, res, logger, env, startedAt);
        }
        catch (err) {
            logger.error({ err, msg: "http.unhandled" });
            if (!res.headersSent) {
                res.writeHead(500).end("internal error");
            }
        }
    });
}
function handleHttp(req, res, logger, env, startedAt) {
    const parsedUrl = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    // API Routes
    if (req.method === "GET" && pathname === "/health") {
        res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({
            status: "ok",
            service: "wanvil",
            uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
            nodeEnv: env.NODE_ENV,
        }));
        return;
    }
    if (req.method === "GET" && pathname === "/live") {
        res.writeHead(200, { "content-type": "text/plain; charset=utf-8" }).end("ok");
        return;
    }
    if (req.method === "GET" && pathname === "/ready") {
        res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ready: true }));
        return;
    }
    if (env.NODE_ENV === "development" && req.method === "GET" && pathname === "/debug/config") {
        res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({
            port: env.PORT,
            corsOrigins: env.CORS_ORIGINS,
        }));
        return;
    }
    // STATIC FILE SERVING FOR PRODUCTION (npx execution)
    const clientAssetDir = getClientPath();
    if (clientAssetDir && req.method === "GET") {
        // Determine file path
        let filePath = path.join(clientAssetDir, pathname === "/" ? "index.html" : pathname);
        try {
            let stat = statSync(filePath);
            if (stat.isDirectory()) {
                filePath = path.join(filePath, "index.html");
                stat = statSync(filePath);
            }
            const ext = path.extname(filePath).toLowerCase();
            res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
            createReadStream(filePath).pipe(res);
            return;
        }
        catch {
            // Fallback to index.html for SPA routing
            try {
                const indexHtml = path.join(clientAssetDir, "index.html");
                statSync(indexHtml);
                res.writeHead(200, { "Content-Type": "text/html" });
                createReadStream(indexHtml).pipe(res);
                return;
            }
            catch {
                // If no index.html found, just fall through to 404
            }
        }
    }
    if (pathname === "/") {
        res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({
            name: "wanvil-control-server",
            docs: "Socket.io API for local Anvil process control; use GET /health for probes.",
        }));
        return;
    }
    logger.debug({ method: req.method, pathname, msg: "http.not_found" });
    res.writeHead(404).end();
}
