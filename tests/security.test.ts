import { describe, expect, it } from "bun:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { getSecurityInfo } from "../src/modules/security.js";

describe("security hygiene", () => {
  it("does not expose secret values", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devfetch-sec-"));

    await fs.writeFile(
      path.join(dir, ".env"),
      "API_KEY=super-secret-value-123456\n"
    );

    const result = await getSecurityInfo(dir);

    expect(result.available).toBe(true);
    expect(result.data?.envFile).toBe(true);
    expect(result.data?.secretFiles).toContain(".env");
    expect(JSON.stringify(result)).not.toContain("super-secret-value-123456");
  });

  it("reports git ignore state without leaking values", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devfetch-ignore-"));

    await fs.writeFile(path.join(dir, ".gitignore"), ".env\n");
    await fs.writeFile(path.join(dir, ".env"), "TOKEN=abcdefghijklmnop\n");

    const result = await getSecurityInfo(dir);

    // No Git repository here, so the ignore state is explicitly unknown.
    expect(result.data?.envIgnored).toBe("unknown");
    expect(JSON.stringify(result)).not.toContain("abcdefghijklmnop");
  });
});
