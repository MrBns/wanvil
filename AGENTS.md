<!-- BEGIN:stack-agent-rules -->
# Stack

- **CLI:** `cli/` — Node.js entry point that parses args, spawns `anvil`, and boots the server. Entry: `cli/src/index.ts`. Owns the `AnvilBridge` (child process) and `PresetManager` (encrypted mnemonic storage).
- **Client:** `client/` — React 19 + TypeScript + Vite 8 + Tailwind v4 (`@tailwindcss/vite`) + React Router 7 (`BrowserRouter` in `client/src/App.tsx`).
- **Server:** `server/src/` — Passive HTTP + Socket.io control plane. Entry: `server/src/index.ts`. Receives `IAnvilBridge` and `IPresetManager` via `bootServer(config)`. Uses Prisma Client (`@prisma/client`) in `server/src/services/db.service.ts` to manage run persistence storing to `~/.config/wanvil/data.db`. No Redis; single-user / single-machine.
- **Shared:** `shared/` — Pure TypeScript interfaces (`IAnvilBridge`, `IPresetManager`, `WanvilFlags`, Socket.io event types) imported by both CLI and server. No runtime dependencies.
- **`npm run dev`** runs **only** the Vite client. Use **`npm run dev:cli`** for the full CLI+server stack, or **`npm run dev:full`** for client + CLI concurrently. To run the server in standalone dev mode, use **`npm run dev:server`**.
- **Lint/format:** Biome (`biome.json`). Use `npm run lint` / `npm run format` / `npm run check`.
- **Build System:** The monorepo uses **TypeScript Project References** (`tsc --build`) to compile in dependency order (`shared` → `server` → `cli`).
- **Env:** `VITE_ANVIL_SOCKET_URL` (client dev only; production auto-detects from window.location). Server: `PORT`, `CORS_ORIGINS`, `LOG_LEVEL` (see `server/src/config/env.ts`).
- **Distribution:** Configured as a publishable global executable via `npm i -g wanvil` running `npx wanvil`. Native anvil arguments pass through directly without `--` separator. The server statically serves `client/dist` when run in production mode.
<!-- END:stack-agent-rules -->

# Extended Developer Guide

## Architecture Overview
`wanvil` is a headless-first local Ethereum development control plane. It encapsulates an `anvil` process and provides a rich web-based explorer and management UI.

### 3-Layer Architecture

```
wanvil [--preset=N] [--gui-port 4269] [--no-gui] [...anvil-args]
   │
   ├─ cli/        Parses args, spawns anvil, creates Bridge, boots server
   │    └── AnvilBridge (implements IAnvilBridge)
   │
   ├─ server/     Receives bridge via bootServer(), exposes HTTP + Socket.io
   │    └── Socket.io ──► client/
   │
   └─ client/     React frontend (explorer + manager)
```

### Shared Interface Contract (`shared/`)
The `shared/` folder contains pure TypeScript interfaces that define the communication contract between CLI and server:
- **`bridge.ts`**: `IAnvilBridge` (process lifecycle + log streaming), `IPresetManager` (encrypted mnemonic CRUD), `IServerConfig` (server bootstrap).
- **`args.ts`**: `WanvilFlags` (CLI flag types), `WANVIL_FLAG_DEFS` (flag catalogue for the arg parser).
- **`events.ts`**: Typed Socket.io event payloads shared between server and client.

### Control Plane (CLI → Server)
The CLI owns the anvil process and passes it to the server as an `IAnvilBridge`:
- **Process Management:** `AnvilBridge` in `cli/src/anvil-bridge.ts` spawns `anvil`, captures logs, handles SIGTERM.
- **Preset Manager:** `PresetManager` in `cli/src/preset-manager.ts` encrypts/decrypts mnemonics with AES-256-GCM.
- **Server Boot:** The CLI calls `bootServer(config)` from `server/src/index.ts`, passing the bridge + preset manager.

### Data Persistence
- **Run History:** Prisma 7 + SQLite. Data stored in `~/.config/wanvil/data.db`.
- **Mnemonic Presets:** JSON file at `~/.config/wanvil/presets.json` with AES-256-GCM encryption per entry.

### Frontend (Client)
A Vercel-styled dashboard for interacting with the local node.
- **Explorer:** Real-time block and transaction inspection.
- **Manager:** UI for starting/stopping/restarting Anvil, viewing logs, managing credentials, preset management, and run history.

---

## Prisma 7 Implementation
We use Prisma v7.7.0. Due to architectural changes in Prisma 7:
- **No `url` in `schema.prisma`**: The datasource only specifies `provider = "sqlite"`.
- **Dynamic Connection**: We set `process.env.DATABASE_URL` programmatically in `DbService` before instantiating `PrismaClient`.
- **Initialization**: On boot, the server runs `npx prisma db push` synchronously via `execSync` to ensure the schema is up-to-date in the user's home directory.

---

## CLI Behavior
The `wanvil` CLI is a transparent wrapper for `anvil` with added GUI and preset management.

### Argument Parsing (No `--` Needed)
- **Wanvil flags** (`--gui-port`, `--no-gui`, `--no-open`, `--preset`, `--save-preset`, `--log-level`) are consumed by wanvil.
- **Everything else** is forwarded verbatim to the `anvil` binary.
- Example: `wanvil --gui-port 5000 --fork-url https://... --accounts 20`
  - Wanvil consumes `--gui-port 5000`
  - Anvil receives `--fork-url https://... --accounts 20`

### Preset System
- `wanvil --save-preset` → Interactive: prompts for label, mnemonic, password → encrypts → saves to `~/.config/wanvil/presets.json`.
- `wanvil --preset=2` → Prompts for password → decrypts preset #2 → injects `--mnemonic <decrypted>` into anvil args.

### Boot Flow
1. Parse mixed args → separate wanvil flags from anvil args
2. Handle `--save-preset` (interactive, then exit)
3. Handle `--preset=N` (decrypt, inject into anvil args)
4. Create `AnvilBridge` → `bridge.start(anvilArgs)`
5. If GUI enabled: `bootServer({ anvilBridge, presetManager, ... })`
6. If auto-open: open browser after 1.2s
7. Register SIGINT/SIGTERM → `bridge.stop()` + `server.shutdown()`

---

## Storage & Config
- **Path:** `~/.config/wanvil/` (Created automatically if missing).
- **Files:**
  - `data.db`: SQLite database for history and last used configs.
  - `data.db-journal`: Temporary SQLite state.
  - `presets.json`: AES-256-GCM encrypted mnemonic presets.

---

## Project Purpose
The **Wanvil (Wrapped Anvil)** project aims to be a production-ready, distributable CLI wrapper for the Foundry `anvil` node. It replaces traditional terminal-only local blockchain development by overlaying a headless Node.js control plane and a rich, web-based React application natively on top of the underlying `anvil` binary. It gives developers immediate graphical insight into blocks, transactions, and account states, while maintaining 100% CLI compatibility and standard output multiplexing.

---

## Coding Structure
The repository is structured as a fullstack monorepo with clean interface boundaries:
- **`/shared`**: Pure TypeScript interfaces defining the contract between CLI and server. No runtime deps.
  - `bridge.ts`: `IAnvilBridge`, `IPresetManager`, `IServerConfig` interfaces.
  - `args.ts`: `WanvilFlags`, `WANVIL_FLAG_DEFS` flag catalogue.
  - `events.ts`: Typed Socket.io event payloads.
- **`/cli`**: Node.js CLI entry point and process owner.
  - `src/index.ts`: `#!/usr/bin/env node` entry.
  - `src/boot.ts`: Orchestrator (parse args → bridge → server → browser).
  - `src/parse-args.ts`: Smart mixed-arg splitter.
  - `src/anvil-bridge.ts`: `IAnvilBridge` implementation (child process).
  - `src/preset-manager.ts`: `IPresetManager` implementation (AES-256-GCM).
  - `src/banner.ts`: Terminal ASCII art.
- **`/server`**: Passive HTTP + Socket.io backend.
  - `src/index.ts`: Exports `bootServer(config)` + standalone dev mode `main()`.
  - `src/services/`: `DbService` (Prisma), `RpcHealthService`.
  - `src/http/`: HTTP server with static file serving.
  - `src/socket/`: Socket.io handlers consuming `IAnvilBridge` + `IPresetManager`.
  - `src/lib/`: Logger.
- **`/client`**: React SPA (explorer + manager).
  - `src/components/`: Modular UI components.
  - `src/pages/`: Route-level container components.
  - `src/lib/`: Socket client, RPC context, state store, utils.
  - `src/services/`: Blockchain service (viem).
- **`/prisma`**: Database schema.

---

## Design System
The frontend adheres to a strict, Vercel-inspired minimalist design system specifically optimized for developer tooling:
- **Colors**: Strictly utilize pure white (`#ffffff`) for light mode backgrounds and deep black (`#000000`) for dark mode elements. Avoid highly saturated primary colors except for strict semantic use cases (e.g. red for errors, green for success).
- **Borders & Separation**: Rely entirely on explicit light gray borders (`border-border` / `#E5E5E5`) and subtle background color differences (`bg-muted/10`) to separate UI elements.
- **Shadows**: **ZERO drop-shadows.** Never use Tailwind classes like `shadow-md` or `shadow-lg` for elevation. Elevation MUST be done via contrasting borders or modal overlays.
- **Typography**: Utilize modern, clean sans-serif fonts for primary interfaces and strictly apply `font-mono` when displaying Ethereum hashes, addresses, and hex data to maintain alignment.
- **Layouts**: Bias towards highly tabular data viewing. Clean tabbed interfaces should be the standard for routing contextual information.

---

## Technology Stack
- **Frontend Layer**: React 19, TypeScript, Vite 8 build tools, Tailwind CSS v4, dynamic React Router v7. Core libraries include `lucide-react` for iconography.
- **Backend Layer**: Node.js (v25+) control plane using fast generic HTTP built via `node:http`, tightly integrated Socket.io for multiplexing, and Pino for structured logging.
- **Persistence Layer**: Prisma v7.7.0 operating against a dynamically provisioned SQLite file.
- **Security Layer**: `node:crypto` AES-256-GCM with PBKDF2 key derivation for mnemonic preset encryption.

---

## Coding Guidelines
When contributing to this workspace, adhere strictly to the following rules:
1. **Interface-First Design & TypeScript Project References**:
   - The monorepo uses TypeScript Project References to enforce dependency isolation.
   - All communication between CLI and server MUST go through the shared interfaces in `shared/`.
   - **CRITICAL:** The `server/` MUST NEVER import from `cli/`. Doing so creates a circular dependency (`cli` depends on `server` for `bootServer`, `server` depends on `cli`). To test the server in isolation, `server/src/index.ts` implements its own lightweight inline stubs for `IAnvilBridge` and `IPresetManager`.
2. **Frontend Constraints**: 
   - Write functional React components only. 
   - Adhere to the defined zero-shadow, border-driven aesthetic. 
   - Never implement standalone `.css` files unless absolutely required for resetting global behavior; rely on Tailwind utility classes.
3. **Backend Constraints**: 
   - Encapsulate server logic in testable, object-oriented services (e.g., `RpcHealthService`).
   - The server is a **passive consumer** of `IAnvilBridge`. It must NEVER spawn child processes directly.
   - Implement robust error boundaries when handling bridge events. Zombie processes are unacceptable and `SIGTERM` handlers must always be honored.
   - All backend errors should be securely emitted via the unified `logger.error` format powered by Pino.
4. **CLI Constraints**:
   - The CLI is the single source of truth for process lifecycle.
   - Argument parsing must be exhaustive: unknown flags go to anvil, known flags are consumed.
   - Password input must use hidden terminal input (no echo).
5. **Database Constraints**:
   - Because `wanvil` is a distributable package, you **cannot** rely on the typical `npx prisma migrate dev` CLI dynamically on end-users' machines. 
   - Schema pushes must utilize the programmatic wrapper located in `db.service.ts` so the structure generates dynamically during application boot. 
   - Never regress database connectivity back to `node:sqlite`; Prisma is the explicit source of truth.
