import fs from "node:fs/promises";
import path from "node:path";
import type { ModuleResult, ProjectInfo } from "../types.js";

type PackageJson = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const frameworks: Record<string, string> = {
  next: "Next.js",
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
  express: "Express",
  "@nestjs/core": "NestJS",
};

export async function getProjectInfo(
  cwd = process.cwd()
): Promise<ModuleResult<ProjectInfo>> {
  try {
    const raw = await fs.readFile(path.join(cwd, "package.json"), "utf8");
    const pkg = JSON.parse(raw) as PackageJson;

    const dependencies = pkg.dependencies ?? {};
    const devDependencies = pkg.devDependencies ?? {};
    const allDependencies = { ...dependencies, ...devDependencies };

    const framework =
      Object.keys(allDependencies)
        .map((dependency) => frameworks[dependency])
        .find((value): value is string => Boolean(value)) ?? "Unknown";

    const packageManager = await detectPackageManager(cwd);

    const data: ProjectInfo = {
      name: pkg.name ?? path.basename(cwd),
      packageManager,
      framework,
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
    };

    return { available: true, data };
  } catch {
    return { available: false, error: "No project detected" };
  }
}

async function detectPackageManager(cwd: string): Promise<string> {
  const lockfiles = [
    { file: "bun.lock", manager: "Bun" },
    { file: "pnpm-lock.yaml", manager: "pnpm" },
    { file: "yarn.lock", manager: "Yarn" },
    { file: "package-lock.json", manager: "npm" },
  ];

  for (const lockfile of lockfiles) {
    try {
      await fs.access(path.join(cwd, lockfile.file));
      return lockfile.manager;
    } catch {
      continue;
    }
  }

  return "Unknown";
}
