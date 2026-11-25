import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type CommandResult = {
  stdout: string;
  exitCode: number;
};

/**
 * Run a command with a fixed argument array and a short timeout.
 * Returns null when the command fails or produces no output.
 */
export async function run(
  command: string,
  args: string[] = [],
  timeoutMs = 1_000,
  cwd?: string
): Promise<string | null> {
  const { stdout } = await runWithStatus(command, args, timeoutMs, cwd);

  return stdout.length > 0 ? stdout : null;
}

/** Like run(), but keeps the exit code so callers can distinguish failure modes. */
export async function runWithStatus(
  command: string,
  args: string[] = [],
  timeoutMs = 1_000,
  cwd?: string
): Promise<CommandResult> {
  const [executable, execArgs] = resolveCommand(command, args);

  try {
    const { stdout } = await execFileAsync(executable, execArgs, {
      cwd,
      timeout: timeoutMs,
      windowsHide: true,
      maxBuffer: 1024 * 1024,
    });

    return { stdout: stdout.trim(), exitCode: 0 };
  } catch (error) {
    return { stdout: "", exitCode: extractExitCode(error) };
  }
}

/** On Windows, npm/pnpm/yarn are .cmd shims and need cmd.exe to launch. */
function resolveCommand(command: string, args: string[]): [string, string[]] {
  const needsCmd =
    process.platform === "win32" &&
    (/\.(cmd|bat)$/i.test(command) ||
      ["npm", "npx", "pnpm", "yarn", "corepack"].includes(command.toLowerCase()));

  if (!needsCmd) return [command, args];

  const commandLine = [command, ...args].map(quoteForCmd).join(" ");

  return ["cmd.exe", ["/d", "/s", "/c", commandLine]];
}

function quoteForCmd(value: string): string {
  if (/^[\w./:@=+-]+$/.test(value)) return value;

  return `"${value.replace(/"/g, '""')}"`;
}

function extractExitCode(error: unknown): number {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return 1;
  }

  const code = (error as { code?: unknown }).code;

  if (typeof code === "number" && Number.isFinite(code)) return code;
  if (typeof code === "string") {
    const parsed = Number(code);
    if (Number.isFinite(parsed)) return parsed;
  }

  return 1;
}
