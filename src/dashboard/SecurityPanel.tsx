import { Box, Text } from "ink";
import { Panel } from "./Panel.js";
import type { SecurityPanelProps } from "./types.js";

export function SecurityPanel({ data, theme }: SecurityPanelProps) {
  return (
    <Panel title="Security" theme={theme}>
      {data.available && data.data ? (
        <Box flexDirection="column">
          <Field
            label=".env found"
            value={yesNo(data.data.envFile)}
            theme={theme}
            valueColor={data.data.envFile ? theme.warning : theme.success}
          />
          <Field
            label=".env.example found"
            value={yesNo(data.data.envExample)}
            theme={theme}
          />
          <Field
            label=".env ignored by Git"
            value={formatIgnore(data.data.envIgnored)}
            theme={theme}
            valueColor={ignoreColor(data.data.envIgnored, theme)}
          />
          <Field label="Lockfile" value={data.data.lockfile} theme={theme} />
          <Field
            label="Node version pinned"
            value={yesNo(data.data.nodeVersionPinned)}
            theme={theme}
            valueColor={data.data.nodeVersionPinned ? theme.success : theme.warning}
          />
          <Field
            label="Possible secrets detected"
            value={String(data.data.possibleSecrets)}
            theme={theme}
            valueColor={data.data.possibleSecrets > 0 ? theme.danger : theme.success}
          />
          {data.data.possibleSecrets > 0 ? (
            <Field
              label="Files"
              value={formatFiles(data.data.secretFiles)}
              theme={theme}
              valueColor={theme.warning}
            />
          ) : null}
        </Box>
      ) : (
        <Text color={theme.muted}>Security information unavailable</Text>
      )}
    </Panel>
  );
}

function yesNo(value: boolean): string {
  return value ? "yes" : "no";
}

function formatIgnore(value: boolean | "unknown"): string {
  if (value === "unknown") return "unknown";
  return value ? "yes" : "no";
}

function ignoreColor(
  value: boolean | "unknown",
  theme: SecurityPanelProps["theme"]
): string {
  if (value === "unknown") return theme.muted;
  return value ? theme.success : theme.warning;
}

function formatFiles(files: string[]): string {
  return files.length > 0 ? files.join(", ") : "None";
}

function Field({
  label,
  value,
  theme,
  valueColor,
}: {
  label: string;
  value: string;
  theme: SecurityPanelProps["theme"];
  valueColor?: string;
}) {
  return (
    <Text>
      <Text color={theme.label}>{label}: </Text>
      <Text color={valueColor ?? theme.value}>{value}</Text>
    </Text>
  );
}
