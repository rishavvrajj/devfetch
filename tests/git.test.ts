import { describe, expect, it } from "bun:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { getGitInfo } from "../src/modules/git.js";
import { run } from "../src/utils/run.js";

describe("git detection", () => {
  it("returns unavailable outside a repository", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devfetch-nogit-"));
    const result = await getGitInfo(dir);

    expect(result.available).toBe(false);
    expect(result.error).toBe("Not a Git repository");
  });

  it("detects an initialized repository", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devfetch-git-"));

    await run("git", ["init", "-q"], 2_000, dir);

    expect(
      await run("git", ["rev-parse", "--is-inside-work-tree"], 1_000, dir)
    ).toBe("true");

    const result = await getGitInfo(dir);

    expect(result.available).toBe(true);
    expect(result.data?.dirtyFiles).toBe(0);
    expect(result.data?.ahead).toBe(0);
    expect(result.data?.behind).toBe(0);
  });
});
