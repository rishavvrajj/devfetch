import { getSystemInfo } from "./modules/system.js";
import { getTools } from "./modules/tools.js";
import { getProjectInfo } from "./modules/project.js";
import { getGitInfo } from "./modules/git.js";
import { getSecurityInfo } from "./modules/security.js";
import type { DevFetchData } from "./types.js";

export async function collectData(): Promise<DevFetchData> {
  const [system, tools, project, git, security] = await Promise.all([
    getSystemInfo(),
    getTools(),
    getProjectInfo(),
    getGitInfo(),
    getSecurityInfo(),
  ]);

  return { system, tools, project, git, security };
}
