import type { DevFetchData } from "../types.js";

export function renderJson(data: DevFetchData): string {
  return JSON.stringify(data, null, 2);
}
