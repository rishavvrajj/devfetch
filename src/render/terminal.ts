import pc from "picocolors";
import type { DevFetchData } from "../types.js";

export function renderTerminal(
  data: DevFetchData,
  options: { ascii: boolean; theme: string }
): string {
  const lines: string[] = [];

  if (options.ascii) {
    lines.push(pc.cyan("  devfetch"));
    lines.push("");
  }

  if (data.system.available && data.system.data) {
    const system = data.system.data;

    lines.push(pc.bold("System"));
    lines.push(`OS: ${system.os}`);
    lines.push(`Shell: ${system.shell}`);
    lines.push(`Uptime: ${system.uptime}`);
    lines.push(`CPU: ${system.cpu}`);
    lines.push(`Memory: ${system.memory}`);
    lines.push("");
  }

  if (data.tools.available && data.tools.data) {
    lines.push(pc.bold("Tools"));

    for (const tool of data.tools.data) {
      lines.push(`${tool.name}: ${tool.version}`);
    }

    lines.push("");
  }

  if (data.project.available && data.project.data) {
    const project = data.project.data;

    lines.push(pc.bold("Project"));
    lines.push(`Name: ${project.name}`);
    lines.push(`Framework: ${project.framework}`);
    lines.push(`Package manager: ${project.packageManager}`);
    lines.push(`Dependencies: ${project.dependencies}`);
    lines.push("");
  } else {
    lines.push(pc.dim("No project detected"));
    lines.push("");
  }

  if (data.git.available && data.git.data) {
    const git = data.git.data;

    lines.push(pc.bold("Git"));
    lines.push(`Branch: ${git.branch}`);
    lines.push(`Uncommitted files: ${git.dirtyFiles}`);

    if (git.ahead || git.behind) {
      lines.push(`Ahead/behind: ${git.ahead}/${git.behind}`);
    }

    lines.push(`Last commit: ${git.lastCommit} (${git.lastCommitTime})`);
    lines.push("");
  } else {
    lines.push(pc.dim("Not a Git repository"));
    lines.push("");
  }

  if (data.security.available && data.security.data) {
    const security = data.security.data;

    lines.push(pc.bold("Security"));
    lines.push(`.env found: ${yesNo(security.envFile)}`);
    lines.push(`.env.example found: ${yesNo(security.envExample)}`);
    lines.push(`.env ignored by Git: ${formatIgnore(security.envIgnored)}`);
    lines.push(`Lockfile: ${security.lockfile}`);
    lines.push(`Node version pinned: ${yesNo(security.nodeVersionPinned)}`);
    lines.push(`Possible secrets detected: ${security.possibleSecrets}`);

    if (security.possibleSecrets > 0) {
      lines.push(`Files: ${security.secretFiles.join(", ")}`);
    }
  }

  return lines.join("\n");
}

function yesNo(value: boolean): string {
  return value ? "yes" : "no";
}

function formatIgnore(value: boolean | "unknown"): string {
  if (value === "unknown") return "unknown";

  return value ? "yes" : pc.yellow("no");
}
