import type { ModuleResult, GitInfo } from "../types.js";
import { run } from "../utils/run.js";

export async function getGitInfo(
  cwd = process.cwd()
): Promise<ModuleResult<GitInfo>> {
  const insideRepo = await run(
    "git",
    ["rev-parse", "--is-inside-work-tree"],
    500,
    cwd
  );

  if (insideRepo !== "true") {
    return { available: false, error: "Not a Git repository" };
  }

  const [branch, status, upstream, lastCommit] = await Promise.all([
    run("git", ["branch", "--show-current"], 1_000, cwd),
    run("git", ["status", "--porcelain"], 1_000, cwd),
    run(
      "git",
      ["rev-list", "--left-right", "--count", "@{upstream}...HEAD"],
      1_000,
      cwd
    ),
    run("git", ["log", "-1", "--pretty=%s|%cr"], 1_000, cwd),
  ]);

  const dirtyFiles = status ? status.split("\n").filter(Boolean).length : 0;
  const [behind = "0", ahead = "0"] = upstream?.split(/\s+/) ?? [];
  const [message = "", time = ""] = lastCommit?.split("|") ?? [];

  const data: GitInfo = {
    branch: branch || "detached HEAD",
    dirtyFiles,
    ahead: toCount(ahead),
    behind: toCount(behind),
    lastCommit: message,
    lastCommitTime: time,
  };

  return { available: true, data };
}

function toCount(value: string): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}
