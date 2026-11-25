import { describe, expect, it } from "bun:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { getProjectInfo } from "../src/modules/project.js";

describe("project detection", () => {
  it("detects a pnpm Next.js project", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devfetch-"));

    await fs.writeFile(
      path.join(dir, "package.json"),
      JSON.stringify({
        name: "test-app",
        dependencies: { next: "15.0.0" },
        devDependencies: { typescript: "5.0.0" },
      })
    );

    await fs.writeFile(path.join(dir, "pnpm-lock.yaml"), "");

    const result = await getProjectInfo(dir);

    expect(result.available).toBe(true);
    expect(result.data?.framework).toBe("Next.js");
    expect(result.data?.packageManager).toBe("pnpm");
    expect(result.data?.dependencies).toBe(1);
  });

  it("returns unavailable outside a project", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devfetch-empty-"));
    const result = await getProjectInfo(dir);

    expect(result.available).toBe(false);
  });
});
