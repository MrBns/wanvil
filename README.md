<![CDATA[<div align="center">

```
  ╦ ╦┌─┐┌┐┌┬  ┬┬┬  
  ║║║├─┤│││└┐┌┘││  
  ╚╩╝┴ ┴┘└┘ └┘ ┴┴─┘
```

**A visual GUI wrapper for Foundry's Anvil**

[![npm version](https://img.shields.io/npm/v/wanvil)](https://www.npmjs.com/package/wanvil)
[![license](https://img.shields.io/npm/l/wanvil)](./LICENSE)

</div>

---

**wanvil** (Wrapped Anvil) gives your local `anvil` node a real-time web dashboard.
Browse blocks, transactions, and addresses — start, stop, and restart your node — all from the browser.
Your terminal still works exactly like before.

## ✨ Features

| | Feature | Description |
|---|---------|-------------|
| 🔍 | **Block Explorer** | Live view of blocks, transactions, and address balances with search |
| ⚡ | **Node Controls** | Start / stop / restart anvil directly from the web UI |
| 📜 | **Live Logs** | Real-time anvil stdout/stderr streamed into a built-in terminal |
| 🔑 | **Preset Manager** | Save & load encrypted mnemonics — no more copy-pasting seed phrases |
| 📂 | **Run History** | See all past runs, reload any old config with one click |
| 🌗 | **Light & Dark Mode** | Auto-detected from your system preferences |
| 🖥️ | **Terminal Pass-through** | Everything anvil prints, wanvil prints too — fully transparent |

---

## 📦 Install

> **You need:** [Node.js 20+](https://nodejs.org/) and [Foundry](https://book.getfoundry.sh/getting-started/installation) (`anvil` on your PATH).

```bash
npm i -g wanvil
```

No extra build steps. No `postinstall`. Ready to go.

---

## 🚀 Quick Start

```bash
wanvil
```

That's it. Three things happen:

1. **anvil starts** — exactly like running `anvil` directly
2. **GUI opens** at **http://localhost:4269** — the full dashboard
3. **Terminal mirrors** all anvil output — you don't lose anything

> Your terminal behaves the same as `anvil`. wanvil just adds a browser UI on top.

---

## 📖 User Guide

### Passing Arguments

wanvil accepts **all anvil flags** directly — no `--` separator needed.
wanvil's own flags are silently consumed; everything else goes straight to anvil.

```bash
# These are equivalent:
anvil --fork-url https://... --accounts 20
wanvil --fork-url https://... --accounts 20
```

### Common Examples

**Fork Ethereum mainnet:**
```bash
wanvil --fork-url https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
```

**Fork at a specific block:**
```bash
wanvil --fork-url https://... --fork-block-number 19000000
```

**Fork with more accounts:**
```bash
wanvil --fork-url https://... --accounts 20
```

**Use a custom mnemonic:**
```bash
wanvil --mnemonic "test test test test test test test test test test test junk"
```

**Change the GUI port:**
```bash
wanvil --gui-port 5000
```

**No browser at all (headless, terminal only):**
```bash
wanvil --no-gui
```

**Start GUI but don't auto-open the browser:**
```bash
wanvil --no-open
```

### wanvil-specific Flags

These are consumed by wanvil itself. Anvil never sees them.

| Flag | Description | Default |
|------|-------------|---------|
| `--gui-port <port>` | Port for the web dashboard | `4269` |
| `--no-gui` | Disable the web dashboard entirely | `false` |
| `--no-open` | Don't auto-open the browser tab | `false` |
| `--preset <id>` | Load an encrypted mnemonic preset by ID | — |
| `--save-preset` | Interactive: encrypt & save a new mnemonic | — |
| `--log-level <level>` | Server log level (`info`, `debug`, `trace`, etc.) | `info` |

> **Everything else** (like `--fork-url`, `--accounts`, `--block-time`) passes through to anvil untouched.

---

### 🔍 The Dashboard

When you open the GUI, you land on the **Explorer Dashboard**. Here's what each page gives you:

#### Dashboard (`/`)

The home page shows a quick overview:
- **Last Block** number
- **Recent Transactions** count
- **Network** info (RPC URL, chain ID)
- **Latest 5 Blocks** with transaction counts
- **Latest 5 Transactions** with from/to addresses
- **Search bar** — paste a tx hash, address, or block number to jump straight to it

#### Blocks (`/blocks`)

A paginated table of all blocks on your local chain. Click any block number to see:
- Block hash, parent hash, timestamp
- Gas used / gas limit
- Full list of transactions in that block

#### Transactions (`/tx`)

List of all transactions. Click any tx hash to see:
- From / To addresses
- Value transferred
- Gas price, gas used
- Input data (calldata)
- Block number where it was mined

#### Addresses (`/address`)

Lists the default anvil accounts with their ETH balances. Click any address to see:
- Current balance
- Transaction count (nonce)
- Full transaction history for that address

#### Wanvil Control (`/anvil`)

The node management page. This only shows up when you're connected to a local node and the control server is running. From here you can:
- **View live logs** in a terminal emulator
- **Stop** the running node
- **Manage presets** — save, load, delete encrypted mnemonics

---

### 🔑 Mnemonic Presets

Tired of copy-pasting the same seed phrase? Presets let you save mnemonics locally, encrypted with a password.

**Save a preset** (interactive prompt):
```bash
wanvil --save-preset
```
It will ask for:
1. A label (e.g. "mainnet-fork-dev")
2. Your mnemonic phrase
3. A password (typed hidden, like `sudo`)
4. Password confirmation

**Use a saved preset:**
```bash
wanvil --preset 1
```
It prompts for your password, decrypts the mnemonic, and injects `--mnemonic <decrypted>` into the anvil args automatically.

> 🔒 **Encryption:** AES-256-GCM with PBKDF2 key derivation. Presets are stored at `~/.config/wanvil/presets.json`. Even if someone reads the file, they can't get your mnemonic without the password.

---

### 📂 Run History

Every time you start anvil through wanvil (either CLI or the web UI), the config is saved to a local SQLite database.

- Open the GUI when anvil is offline → you'll see a **"Run History"** tab
- Click **Load** on any past run to pre-fill the config form
- Hit **Launch Node** to start with that exact config again

This means you never have to remember long fork URLs or block numbers.

---

### 🌐 Starting From the Web UI

If you open the dashboard and anvil isn't running yet, you'll see the **"Anvil is not running"** screen. From there you can:

1. Fill in **Fork URL**, **Fork Block**, **Mnemonic**, and **Extra Arguments**
2. Click **Launch Node**
3. Watch the live logs stream in while the node boots

> This requires the control server to be running (it always is when you use `wanvil`).
> If you're using `npm run dev` for the client only, you need `npm run dev:server` in another terminal.

---

## 📁 Data Storage

All wanvil data lives in `~/.config/wanvil/`:

| File | What it stores |
|------|---------------|
| `data.db` | Run history and last-used configuration (SQLite) |
| `presets.json` | AES-256-GCM encrypted mnemonic presets |

This directory is created automatically on first run. Deleting it resets everything.

---

## 🏗️ Architecture

```
wanvil [flags] [...anvil-args]
  │
  ├── cli/       → parses args, spawns anvil, owns the process
  ├── server/    → HTTP + Socket.io control plane (passive)
  └── client/    → React web dashboard
```

- The **CLI** owns the anvil child process. It's the single source of truth for process lifecycle.
- The **Server** is a passive consumer — it receives an `IAnvilBridge` interface, never spawns anything.
- The **Client** talks to the server over Socket.io and reads the chain directly via JSON-RPC (viem).

---

## 🛠️ Development

Want to hack on wanvil? Here's how to get started.

### Setup

```bash
git clone https://github.com/MrBns/wanvil.git
cd wanvil
npm install
npx prisma generate
```

### Dev Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Starts the **Vite client only** at http://localhost:5173 |
| `npm run dev:server` | Starts the **control server only** (Socket.io + HTTP) |
| `npm run dev:cli` | Runs the **full CLI** with tsx (spawns anvil + server) |
| `npm run dev:full` | Runs **client + CLI** together ← recommended |

#### Typical workflow

```bash
npm run dev:full
```

This runs Vite (hot reload on :5173) and the CLI (anvil + control server on :4269) side by side.

> **Tip:** If you only want to work on the UI and already have `anvil` running separately, `npm run dev` is enough.

### Project Structure

```
├── shared/          Pure TypeScript interfaces (the contract)
│   ├── bridge.ts      IAnvilBridge, IPresetManager, IServerConfig
│   ├── events.ts      Socket.io event types
│   └── args.ts        CLI flag definitions
│
├── cli/             Node.js CLI (process owner)
│   └── src/
│       ├── boot.ts          Orchestrator
│       ├── anvil-bridge.ts  IAnvilBridge implementation
│       ├── parse-args.ts    Smart arg splitter
│       └── preset-manager.ts  AES-256-GCM encryption
│
├── server/          Passive HTTP + Socket.io backend
│   └── src/
│       ├── index.ts         bootServer() + standalone dev mode
│       ├── socket/          Socket event handlers
│       ├── services/        DbService (Prisma), RpcHealthService
│       └── http/            Static file server + health probes
│
├── client/          React 19 SPA
│   └── src/
│       ├── pages/           Dashboard, Blocks, Txs, Addresses, Manager
│       ├── components/      Sidebar, AnvilProvider, UI primitives
│       ├── lib/             Socket client, RPC context, Zustand store
│       └── services/        Blockchain service (viem)
│
└── prisma/          Database schema (SQLite)
```

### Build

TypeScript Project References compile in order: `shared → server → cli`. Client is built separately with Vite.

```bash
npm run build    # prisma generate → tsc --build → vite build
```

### Lint & Format

Uses [Biome](https://biomejs.dev/) (replaces ESLint + Prettier):

```bash
npm run lint      # check for issues
npm run format    # auto-format
npm run check     # fix + format in one go
```

### Key Rules for Contributors

1. **`server/` must never import from `cli/`** — that would create a circular dependency.
2. **All cross-layer types go through `shared/`** — `bridge.ts` and `events.ts` are the contract.
3. **Zero shadows in the UI** — the design uses borders and backgrounds, never `shadow-*`.
4. **The CLI owns the process** — the server is passive, reads from the bridge only.

### Environment Variables

**Client (dev only)**

| Variable | Default |
|----------|---------|
| `VITE_ANVIL_SOCKET_URL` | `http://127.0.0.1:4269` |

> In production the client auto-detects from `window.location`.

**Server**

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server listen port | `3001` |
| `CORS_ORIGINS` | Comma-separated allowed origins | dev defaults |
| `LOG_LEVEL` | Pino log level | `info` |
| `ANVIL_LOG_BUFFER_SIZE` | Max retained log lines | `1000` |
| `RPC_PROBE_TIMEOUT_MS` | Health check timeout | `2000` |

**HTTP Probes:** `GET /health` · `GET /live` · `GET /ready`

---

## 📄 License

MIT
]]>
