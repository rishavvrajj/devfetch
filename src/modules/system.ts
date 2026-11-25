import os from "node:os";
import type { ModuleResult, SystemInfo } from "../types.js";
import { run } from "../utils/run.js";

export async function getSystemInfo(): Promise<ModuleResult<SystemInfo>> {
  try {
    const shell = await detectShell();
    const totalMemory = os.totalmem() / 1024 ** 3;
    const freeMemory = os.freemem() / 1024 ** 3;
    const usedMemory = totalMemory - freeMemory;

    const data: SystemInfo = {
      os: `${os.type()} ${os.release()}`,
      kernel: os.release(),
      shell,
      terminal:
        process.env.TERM_PROGRAM ??
        process.env.TERM ??
        (process.platform === "win32" ? "console" : "unknown"),
      uptime: formatUptime(os.uptime()),
      cpu: detectCpu(),
      memory: `${usedMemory.toFixed(1)} GB / ${totalMemory.toFixed(1)} GB`,
    };

    return { available: true, data };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : "System detection failed",
    };
  }
}

async function detectShell(): Promise<string> {
  if (process.platform === "win32") {
    const comSpec = process.env.ComSpec ?? "cmd.exe";

    return comSpec.split(/[\\/]/).pop()?.replace(/\.exe$/i, "") ?? "cmd";
  }

  if (process.env.SHELL) {
    return process.env.SHELL.split("/").pop() ?? process.env.SHELL;
  }

  const fromShell = await run("sh", ["-c", "echo $SHELL"]);

  return fromShell?.split("/").pop() ?? "unknown";
}

function detectCpu(): string {
  return os.cpus()[0]?.model?.trim() || "unknown";
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours}h ${minutes}m`;
}
