/**
 * Terminal banner for wanvil startup.
 */

export function printBanner(port: number, noGui: boolean): void {
  const lines = [
    "",
    "  ╦ ╦┌─┐┌┐┌┬  ┬┬┬  ",
    "  ║║║├─┤│││└┐┌┘││  ",
    "  ╚╩╝┴ ┴┘└┘ └┘ ┴┴─┘",
    "",
  ];

  for (const line of lines) {
    process.stdout.write(`\x1b[1m${line}\x1b[0m\n`);
  }

  process.stdout.write(
    `  \x1b[2mWrapped Anvil — Local Ethereum Development\x1b[0m\n`,
  );
  process.stdout.write("\n");

  if (!noGui) {
    process.stdout.write(
      `  \x1b[32m●\x1b[0m GUI available at \x1b[1mhttp://localhost:${port}\x1b[0m\n`,
    );
  } else {
    process.stdout.write(
      `  \x1b[33m●\x1b[0m GUI disabled (--no-gui)\n`,
    );
  }

  process.stdout.write("\n");
}
