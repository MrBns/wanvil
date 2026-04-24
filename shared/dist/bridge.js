/**
 * Core bridge interfaces for communication between CLI ↔ Server.
 *
 * The CLI owns the anvil child process and exposes it via IAnvilBridge.
 * The server receives this bridge at boot time and uses it to stream
 * logs / control the process / query state — without ever touching
 * the child process directly.
 */
export {};
