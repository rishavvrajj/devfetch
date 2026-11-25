import { Box, Text } from "ink";
import { Panel } from "./Panel.js";
import type { ProjectPanelProps } from "./types.js";

export function ProjectPanel({ data, theme }: ProjectPanelProps) {
  return (
    <Panel title="Project" theme={theme}>
      {data.available && data.data ? (
        <Box flexDirection="column">
          <Field label="Name" value={data.data.name} theme={theme} />
          <Field label="Framework" value={data.data.framework} theme={theme} />
          <Field
            label="Package manager"
            value={data.data.packageManager}
            theme={theme}
          />
          <Field
            label="Dependencies"
            value={String(data.data.dependencies)}
            theme={theme}
          />
          <Field
            label="Dev dependencies"
            value={String(data.data.devDependencies)}
            theme={theme}
          />
        </Box>
      ) : (
        <Text color={theme.muted}>No project detected</Text>
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
  theme: ProjectPanelProps["theme"];
}) {
  return (
    <Text>
      <Text color={theme.label}>{label}: </Text>
      <Text color={theme.value}>{value}</Text>
    </Text>
  );
}
