import { Box, Text } from "ink";
import { Panel } from "./Panel.js";
import type { SystemPanelProps } from "./types.js";

export function SystemPanel({ data, theme }: SystemPanelProps) {
  return (
    <Panel title="System" theme={theme}>
      {data.available && data.data ? (
        <Box flexDirection="column">
          <Field label="OS" value={data.data.os} theme={theme} />
          <Field label="Kernel" value={data.data.kernel} theme={theme} />
          <Field label="Shell" value={data.data.shell} theme={theme} />
          <Field label="Terminal" value={data.data.terminal} theme={theme} />
          <Field label="Uptime" value={data.data.uptime} theme={theme} />
          <Field label="CPU" value={data.data.cpu} theme={theme} />
          <Field label="Memory" value={data.data.memory} theme={theme} />
        </Box>
      ) : (
        <Text color={theme.muted}>System information unavailable</Text>
      )}
    </Panel>
  );
}

function Field({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: SystemPanelProps["theme"];
}) {
  return (
    <Text>
      <Text color={theme.label}>{label}: </Text>
      <Text color={theme.value}>{value}</Text>
    </Text>
  );
}
