import { Box } from "ink";
import { GitPanel } from "./GitPanel.js";
import { ProjectPanel } from "./ProjectPanel.js";
import { SecurityPanel } from "./SecurityPanel.js";
import { SystemPanel } from "./SystemPanel.js";
import { ToolsPanel } from "./ToolsPanel.js";
import { getDashboardColumns, getDashboardLayout } from "./layout.js";
import { resolveDashboardTheme } from "./theme.js";
import type { DashboardProps } from "./types.js";

export function Dashboard({ data, theme, columns }: DashboardProps) {
  const resolvedTheme = resolveDashboardTheme(theme);
  const width = getDashboardColumns(columns);
  const layout = getDashboardLayout(width);

  const panels = {
    system: <SystemPanel data={data.system} theme={resolvedTheme} />,
    project: <ProjectPanel data={data.project} theme={resolvedTheme} />,
    tools: <ToolsPanel data={data.tools} theme={resolvedTheme} />,
    git: <GitPanel data={data.git} theme={resolvedTheme} />,
    security: <SecurityPanel data={data.security} theme={resolvedTheme} />,
  };

  if (layout === "stacked") {
    return (
      <Box flexDirection="column" width={width}>
        <Box marginBottom={1}>{panels.system}</Box>
        <Box marginBottom={1}>{panels.project}</Box>
        <Box marginBottom={1}>{panels.tools}</Box>
        <Box marginBottom={1}>{panels.git}</Box>
        <Box>{panels.security}</Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="row" width={width}>
      <Box flexDirection="column" width="50%" marginRight={1}>
        <Box marginBottom={1}>{panels.system}</Box>
        <Box marginBottom={1}>{panels.tools}</Box>
        <Box>{panels.security}</Box>
      </Box>
      <Box flexDirection="column" width="50%">
        <Box marginBottom={1}>{panels.project}</Box>
        <Box>{panels.git}</Box>
      </Box>
    </Box>
  );
}
