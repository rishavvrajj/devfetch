import { Box, Text } from "ink";
import type { PanelProps } from "./types.js";

export function Panel({ title, theme, children, width }: PanelProps) {
  return (
    <Box
      borderStyle="round"
      borderColor={theme.border}
      flexDirection="column"
      paddingX={1}
      paddingY={0}
      width={width}
    >
      <Text bold color={theme.accent}>
        {title}
      </Text>
      <Box flexDirection="column" marginTop={0}>
        {children}
      </Box>
    </Box>
  );
}
