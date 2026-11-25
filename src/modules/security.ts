import fs from "node:fs/promises";
import path from "node:path";
import type { ModuleResult, SecurityInfo } from "../types.js";
import { runWithStatus } from "../utils/run.js";

// Only generic categories and filenames are reported - never the matched value.
const secretPatterns = [
  {
    label: "possible API key",
    regex: /(?:api[_-]?key|apikey)\s*[:=]\s*['"]?[^\s'"]{8,}/i,
  },
  {
    label: "possible token",
    regex: /(?:token|secret)\s*[:=]\s*['"]?[^\s'"]{8,}/i,
  },
  {
    label: "possible private key",
    regex: /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/,
  },
];

const ignoredExtensions = [
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
  ".lock", ".json", ".md", ".txt",
];

export async function getSecurityInfo(
  cwd = process.cwd()
): Promise<ModuleResult<SecurityInfo>> {
  const [envFile, envExample, envIgnored, lockfile] = await Promise.all([
    fileExists(path.join(cwd, ".env")),
    fileExists(path.join(cwd, ".env.example")),
    isGitIgnored(cwd, ".env"),
    detectLockfile(cwd),
  ]);

  const matches = await scanForPossibleSecrets(cwd);
  const nodeVersionPinned = await hasPinnedNodeVersion(cwd);

  const data: SecurityInfo = {
    envFile,
    envExample,
    envIgnored,
    lockfile,
    possibleSecrets: matches.length,
    secretFiles: [...new Set(matches.map((match) => match.file))],
    nodeVersionPinned,
  };

  return { available: true, data };
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function isGitIgnored(
  cwd: string,
  filePath: string
): Promise<boolean | "unknown"> {
  const { exitCode } = await runWithStatus(
    "git",
    ["check-ignore", "-q", filePath],
    500,
    cwd
  );

  // 0 = ignored, 1 = tracked/not ignored, anything else = cannot tell.
  if (exitCode === 0) return true;
  if (exitCode === 1) return false;

  return "unknown";
}

async function detectLockfile(cwd: string): Promise<string> {
  const files = [
    ["bun.lock", "Bun"],
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "Yarn"],
    ["package-lock.json", "npm"],
  ] as const;

  for (const [file, manager] of files) {
    if (await fileExists(path.join(cwd, file))) {
      return manager;
    }
  }

  return "None";
}

async function hasPinnedNodeVersion(cwd: string): Promise<boolean> {
  try {
    const pkg = JSON.parse(
      await fs.readFile(path.join(cwd, "package.json"), "utf8")
    ) as { engines?: { node?: unknown } };

    const version = pkg.engines?.node;

    return typeof version === "string" && version.trim().length > 0;
  } catch {
    return false;
  }
}

async function scanForPossibleSecrets(cwd: string) {
  const entries = await fs.readdir(cwd, { withFileTypes: true });
  const matches: { file: string; label: string }[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (entry.name.startsWith("node_modules")) continue;

    if (ignoredExtensions.some((extension) => entry.name.endsWith(extension))) {
      continue;
    }

    const filePath = path.join(cwd, entry.name);

    try {
      const content = await fs.readFile(filePath, "utf8");

      for (const pattern of secretPatterns) {
        if (pattern.regex.test(content)) {
          matches.push({ file: entry.name, label: pattern.label });
          break;
        }
      }
    } catch {
      continue;
    }
  }

  return matches;
}
