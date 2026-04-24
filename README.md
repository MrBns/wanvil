# wanvil

wanvil is a local blockchain explorer and control plane for [Foundry Anvil](https://book.getfoundry.sh/anvil/). Runs on each user’s machine: a small **control server** (Node + Socket.io) plus a **Vite** UI.

## Layout

| Path | Role |
|------|------|
| `client/` | React 19 + Vite 8 + Tailwind v4 + React Router (`BrowserRouter` in `client/src/App.tsx`) |
| `server/` | Local control plane: Socket.io, structured logs (pino), validated config (zod) |

## Development

**UI only** (no control server — use a terminal `anvil` or skip in-app start):

```bash
npm run dev
```

Open http://127.0.0.1:5173

**Control server** (start/stop the local node from the app + log streaming):

```bash
npm run dev:server
```

**Both** (two processes):

```bash
npm run dev:full
```

The explorer detects the chain by calling JSON-RPC on your RPC URL directly. The full-screen “Anvil is not running” dialog appears when `eth_blockNumber` fails. You can start Foundry yourself or use the in-app Wanvil controls after `dev:server` is running.

## Lint & format

[Biome](https://biomejs.dev/) replaces ESLint and Prettier.

```bash
npm run lint      # biome check .
npm run format    # biome format --write .
npm run check     # biome check --write .  (safe fixes + format)
```

## Production build

```bash
npm run build
npm run preview
npm run start:server   # in another shell, or behind your process manager
```

Or `npm run start:full` for a quick local smoke test.

## Environment

**Client (Vite)**

- `VITE_ANVIL_SOCKET_URL` — Socket.io control server (default `http://127.0.0.1:3001`)

**Server**

| Variable | Description |
|----------|-------------|
| `PORT` | Listen port (default `3001`) |
| `CORS_ORIGINS` | Comma-separated browser origins |
| `LOG_LEVEL` | pino level (`info`, `debug`, …) |
| `ANVIL_LOG_BUFFER_SIZE` | Max retained log lines (default `1000`) |
| `RPC_PROBE_TIMEOUT_MS` | RPC probe timeout for `anvil:status` |

HTTP probes: `GET /health`, `GET /live`, `GET /ready`.
