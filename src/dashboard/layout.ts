import { DASHBOARD_MIN_COLUMNS, type DashboardLayoutMode } from "./types.js";

export function getDashboardColumns(columns?: number): number {
  if (typeof columns === "number" && Number.isFinite(columns) && columns > 0) {
    return Math.floor(columns);
  }

  const stdoutColumns = process.stdout.columns;

  if (typeof stdoutColumns === "number" && stdoutColumns > 0) {
    return stdoutColumns;
  }

  return 80;
}

export function getDashboardLayout(columns: number): DashboardLayoutMode {
  return columns >= DASHBOARD_MIN_COLUMNS ? "two-column" : "stacked";
}
