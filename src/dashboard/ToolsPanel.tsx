import { Box, Text } from "ink";
import { Panel } from "./Panel.js";
import type { ToolsPanelProps } from "./types.js";

export function ToolsPanel({ data, theme }: ToolsPanelProps) {
  const tools = data.available ? data.data ?? [] : [];

  return (
    <Panel title="Tools" theme={theme}>
      {!data.available ? (
        <Text color={theme.muted}>Tool information unavailable</Text>
      ) : tools.length === 0 ? (
        <Text color={theme.muted}>No tools detected</Text>
      ) : (
        <Box flexDirection="column">
          {tools.map((tool) => (
            <Text key={tool.name}>
              <Text color={theme.label}>{tool.name}: </Text>
              <Text color={theme.value}>{tool.version}</Text>
            </Text>
          ))}
        </Box>
      )}
    </Panel>
  );
}
