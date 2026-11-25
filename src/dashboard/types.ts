import type { ReactNode } from "react";
import type {
  DevFetchData,
  GitInfo,
  ModuleResult,
  ProjectInfo,
  SecurityInfo,
  SystemInfo,
  ToolInfo,
} from "../types.js";

export const DASHBOARD_MIN_COLUMNS = 100;

export type DashboardThemeName = "default" | "dracula" | "nord";

export type DashboardLayoutMode = "two-column" | "stacked";

export type DashboardTheme = {
  name: DashboardThemeName;
  accent: string;
  border: string;
  text: string;
  muted: string;
  label: string;
  value: string;
  success: string;
  warning: string;
  danger: string;
};

export type DashboardProps = {
  data: DevFetchData;
  theme: DashboardThemeName;
  columns?: number;
};

export type PanelProps = {
  title: string;
  theme: DashboardTheme;
  children: ReactNode;
  width?: number | string;
};

export type SystemPanelProps = {
  data: ModuleResult<SystemInfo>;
  theme: DashboardTheme;
};

export type ProjectPanelProps = {
  data: ModuleResult<ProjectInfo>;
  theme: DashboardTheme;
};

export type ToolsPanelProps = {
  data: ModuleResult<ToolInfo[]>;
  theme: DashboardTheme;
};

export type GitPanelProps = {
  data: ModuleResult<GitInfo>;
  theme: DashboardTheme;
};

export type SecurityPanelProps = {
  data: ModuleResult<SecurityInfo>;
  theme: DashboardTheme;
};
