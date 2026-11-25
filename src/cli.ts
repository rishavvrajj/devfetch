#!/usr/bin/env node
import { Command } from "commander";
import { collectData } from "./index.js";
import { renderTerminal } from "./render/terminal.js";
import { renderJson } from "./render/json.js";
import { renderMinimal } from "./render/minimal.js";
import { renderDashboard } from "./render/dashboard.js";

type CliOptions = {
  json?: boolean;
  minimal?: boolean;
  ascii?: boolean;
  theme?: string;
  project?: boolean;
  security?: boolean;
  dashboard?: boolean;
};

const program = new Command();

program
  .name("devfetch")
  .description("Fast local developer environment and project overview")
  .version("0.1.0")
  .option("--minimal", "Show compact output")
  .option("--json", "Output machine-readable JSON")
  .option("--no-ascii", "Hide ASCII art")
  .option("--theme <theme>", "Select a color theme", "default")
  .option("--project", "Show only project information")
  .option("--security", "Show only security information")
  .option("--dashboard", "Show an interactive dashboard UI")
  .parse(process.argv);

const options = program.opts<CliOptions>();
const data = await collectData();

if (options.json) {
  console.log(renderJson(data));
  process.exit(0);
}

if (options.minimal) {
  console.log(renderMinimal(data));
  process.exit(0);
}

if (options.project) {
  console.log(
    data.project.available && data.project.data
      ? JSON.stringify(data.project.data, null, 2)
      : "No project detected"
  );

  process.exit(0);
}

if (options.security) {
  console.log(
    data.security.available && data.security.data
      ? JSON.stringify(data.security.data, null, 2)
      : "Security information unavailable"
  );

  process.exit(0);
}

const validThemes = ["default", "dracula", "nord"] as const;
const theme = options.theme ?? "default";

if (!validThemes.includes(theme as (typeof validThemes)[number])) {
  console.error(`Invalid theme "${theme}".`);
  console.error(`Available themes: ${validThemes.join(", ")}`);
  process.exit(1);
}

const selectedTheme = theme as (typeof validThemes)[number];

if (options.dashboard) {
  await renderDashboard(data, { theme: selectedTheme });
  process.exit(0);
}

console.log(
  renderTerminal(data, {
    ascii: options.ascii !== false,
    theme: selectedTheme,
  })
);
