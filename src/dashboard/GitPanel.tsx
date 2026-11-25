import { Box, Text } from "ink";
import { Panel } from "./Panel.js";
import type { GitPanelProps } from "./types.js";

export function GitPanel({ data, theme }: GitPanelProps) {
  return (
    <Panel title="Git" theme={theme}>
      {data.available && data.data ? (
        <Box flexDirection="column">
          <Field label="Branch" value={data.data.branch} theme={theme} />
          <Field
            label="Uncommitted files"
            value={String(data.data.dirtyFiles)}
            theme={theme}
            valueColor={data.data.dirtyFiles > 0 ? theme.warning : theme.value}
          />
          {data.data.ahead > 0 || data.data.behind > 0 ? (
            <Field
              label="Ahead/behind"
              value={`${data.data.ahead}/${data.data.behind}`}
              theme={theme}
            />
          ) : null}
          <Field
            label="Last commit"
            value={formatLastCommit(data.data.lastCommit, data.data.lastCommitTime)}
            theme={theme}
          />
        </Box>
      ) : (
        <Text color={theme.muted}>Not a Git repository</Text>
      )}
    </Panel>
  );
}

function formatLastCommit(message: string, time: string): string {
  if (message && time) return `${message} (${time})`;
  if (message) return message;
  if (time) return time;
  return "No commits";
}

function Field({
  label,
  value,
  theme,
  valueColor,
}: {
  label: string;
  value: string;
  theme: GitPanelProps["theme"];
  valueColor?: string;
}) {
  return (
    <Text>
      <Text color={theme.label}>{label}: </Text>
      <Text color={valueColor ?? theme.value}>{value}</Text>
    </Text>
  );
}
