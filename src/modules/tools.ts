import type { ModuleResult, ToolInfo } from "../types.js";
import { run } from "../utils/run.js";

const tools = [
  { name: "Node", command: "node", args: ["--version"] },
  { name: "Bun", command: "bun", args: ["--version"] },
  { name: "npm", command: "npm", args: ["--version"] },
  { name: "pnpm", command: "pnpm", args: ["--version"] },
  { name: "Yarn", command: "yarn", args: ["--version"] },
  { name: "Git", command: "git", args: ["--version"] },
  { name: "Docker", command: "docker", args: ["--version"] },
  { name: "Python", command: "python3", args: ["--version"] },
  { name: "Go", command: "go", args: ["version"] },
  { name: "Rust", command: "rustc", args: ["--version"] },
] as const;

export async function getTools(): Promise<ModuleResult<ToolInfo[]>> {
  const results = await Promise.all(tools.map(detectTool));

  return {
    available: true,
    data: results.filter((tool) => tool.version !== ""),
  };
}

async function detectTool(tool: (typeof tools)[number]): Promise<ToolInfo> {
  // Node-based shims are slow to start on Windows; other checks get 2s so
  // parallel process startup does not cause false "missing tool" results.
  const timeoutMs = ["npm", "pnpm", "yarn"].includes(tool.command) ? 4_000 : 2_000;
  let output = await run(tool.command, [...tool.args], timeoutMs);

  // Windows usually exposes Python as `python`, not `python3`.
  if (!output && tool.name === "Python") {
    output = await run("python", ["--version"]);
  }

  return {
    name: tool.name,
    version: output ? cleanVersion(output) : "",
  };
}

function cleanVersion(output: string): string {
  return (output.split("\n")[0] ?? "").replace(/^v/, "").trim();
}
