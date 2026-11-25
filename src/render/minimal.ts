import type { DevFetchData } from "../types.js";

export function renderMinimal(data: DevFetchData): string {
  const parts: string[] = [];

  if (data.system.available && data.system.data) {
    parts.push(`OS ${data.system.data.os}`);
  }

  if (data.project.available && data.project.data) {
    parts.push(
      `${data.project.data.name} · ${data.project.data.framework} · ${data.project.data.packageManager}`
    );
  }

  if (data.git.available && data.git.data) {
    parts.push(`${data.git.data.branch} · ${data.git.data.dirtyFiles} changed`);
  }

  if (data.security.available && data.security.data) {
    parts.push(
      `security: ${data.security.data.possibleSecrets} possible secrets`
    );
  }

  return parts.join(" | ");
}
