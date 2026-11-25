import type { DashboardTheme, DashboardThemeName } from "./types.js";

export const DASHBOARD_THEMES: Record<DashboardThemeName, DashboardTheme> = {
  default: {
    name: "default",
    accent: "cyan",
    border: "gray",
    text: "white",
    muted: "gray",
    label: "cyan",
    value: "white",
    success: "green",
    warning: "yellow",
    danger: "red",
  },
  dracula: {
    name: "dracula",
    accent: "magenta",
    border: "magenta",
    text: "white",
    muted: "gray",
    label: "cyan",
    value: "white",
    success: "green",
    warning: "yellow",
    danger: "red",
  },
  nord: {
    name: "nord",
    accent: "blue",
    border: "blue",
    text: "white",
    muted: "gray",
    label: "cyan",
    value: "white",
    success: "green",
    warning: "yellow",
    danger: "red",
  },
};

export function resolveDashboardTheme(theme: string): DashboardTheme {
  if (theme === "dracula" || theme === "nord" || theme === "default") {
    return DASHBOARD_THEMES[theme];
  }

  return DASHBOARD_THEMES.default;
}
