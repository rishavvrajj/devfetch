import { describe, expect, it } from "bun:test";
import { render } from "ink-testing-library";
import { Text } from "ink";
import { Dashboard } from "../src/dashboard/Dashboard.js";
import { GitPanel } from "../src/dashboard/GitPanel.js";
import { Panel } from "../src/dashboard/Panel.js";
import { ProjectPanel } from "../src/dashboard/ProjectPanel.js";
import { SecurityPanel } from "../src/dashboard/SecurityPanel.js";
import { SystemPanel } from "../src/dashboard/SystemPanel.js";
import { ToolsPanel } from "../src/dashboard/ToolsPanel.js";
import {
  DASHBOARD_MIN_COLUMNS,
  DASHBOARD_THEMES,
  getDashboardLayout,
  resolveDashboardTheme,
} from "../src/dashboard/index.js";
import type { DevFetchData } from "../src/types.js";

function createData(overrides: Partial<DevFetchData> = {}): DevFetchData {
  const base: DevFetchData = {
    system: {
      available: true,
      data: {
        os: "Windows_NT 10.0",
        kernel: "10.0",
        shell: "powershell",
        terminal: "Windows Terminal",
        uptime: "2h 5m",
        cpu: "Test CPU",
        memory: "8.0 GB / 16.0 GB",
      },
    },
    tools: {
      available: true,
      data: [
        { name: "Node", version: "22.0.0" },
        { name: "Git", version: "2.45.0" },
      ],
    },
    project: {
      available: true,
      data: {
        name: "devfetch",
        packageManager: "Bun",
        framework: "Unknown",
        dependencies: 2,
        devDependencies: 3,
      },
    },
    git: {
      available: true,
      data: {
        branch: "main",
        dirtyFiles: 1,
        ahead: 0,
        behind: 0,
        lastCommit: "feat: add dashboard",
        lastCommitTime: "2 hours ago",
      },
    },
    security: {
      available: true,
      data: {
        envFile: true,
        envExample: false,
        envIgnored: "unknown",
        lockfile: "Bun",
        possibleSecrets: 1,
        secretFiles: [".env"],
        nodeVersionPinned: true,
      },
    },
  };

  return { ...base, ...overrides };
}

const theme = DASHBOARD_THEMES.default;

describe("dashboard theme and layout", () => {
  it("supports default, dracula, and nord themes", () => {
    expect(resolveDashboardTheme("default").name).toBe("default");
    expect(resolveDashboardTheme("dracula").name).toBe("dracula");
    expect(resolveDashboardTheme("nord").name).toBe("nord");
  });

  it("falls back to default theme for unknown values", () => {
    expect(resolveDashboardTheme("unknown").name).toBe("default");
  });

  it("uses two-column layout at or above 100 columns", () => {
    expect(DASHBOARD_MIN_COLUMNS).toBe(100);
    expect(getDashboardLayout(100)).toBe("two-column");
    expect(getDashboardLayout(140)).toBe("two-column");
  });

  it("stacks panels below 100 columns", () => {
    expect(getDashboardLayout(99)).toBe("stacked");
    expect(getDashboardLayout(80)).toBe("stacked");
  });
});

describe("Panel", () => {
  it("renders title and content", () => {
    const { lastFrame, unmount } = render(
      <Panel title="Test" theme={theme}>
        <Text>Body content</Text>
      </Panel>
    );

    expect(lastFrame()).toContain("Test");
    expect(lastFrame()).toContain("Body content");
    unmount();
  });
});

describe("data panels", () => {
  it("renders system data", () => {
    const { lastFrame, unmount } = render(
      <SystemPanel data={createData().system} theme={theme} />
    );
    const frame = lastFrame() ?? "";

    expect(frame).toContain("System");
    expect(frame).toContain("Windows_NT 10.0");
    expect(frame).toContain("powershell");
    unmount();
  });

  it("renders missing system data gracefully", () => {
    const { lastFrame, unmount } = render(
      <SystemPanel
        data={{ available: false, error: "System detection failed" }}
        theme={theme}
      />
    );

    expect(lastFrame()).toContain("System information unavailable");
    unmount();
  });

  it("renders project data", () => {
    const { lastFrame, unmount } = render(
      <ProjectPanel data={createData().project} theme={theme} />
    );
    const frame = lastFrame() ?? "";

    expect(frame).toContain("Project");
    expect(frame).toContain("devfetch");
    expect(frame).toContain("Bun");
    unmount();
  });

  it("renders missing project data gracefully", () => {
    const { lastFrame, unmount } = render(
      <ProjectPanel data={{ available: false, error: "No project detected" }} theme={theme} />
    );

    expect(lastFrame()).toContain("No project detected");
    unmount();
  });

  it("renders tools data", () => {
    const { lastFrame, unmount } = render(
      <ToolsPanel data={createData().tools} theme={theme} />
    );
    const frame = lastFrame() ?? "";

    expect(frame).toContain("Tools");
    expect(frame).toContain("Node");
    expect(frame).toContain("22.0.0");
    unmount();
  });

  it("renders empty tools gracefully", () => {
    const { lastFrame, unmount } = render(
      <ToolsPanel data={{ available: true, data: [] }} theme={theme} />
    );

    expect(lastFrame()).toContain("No tools detected");
    unmount();
  });

  it("renders git data", () => {
    const { lastFrame, unmount } = render(
      <GitPanel data={createData().git} theme={theme} />
    );
    const frame = lastFrame() ?? "";

    expect(frame).toContain("Git");
    expect(frame).toContain("main");
    expect(frame).toContain("feat: add dashboard");
    unmount();
  });

  it("renders missing git data gracefully", () => {
    const { lastFrame, unmount } = render(
      <GitPanel data={{ available: false, error: "Not a Git repository" }} theme={theme} />
    );

    expect(lastFrame()).toContain("Not a Git repository");
    unmount();
  });

  it("renders security data", () => {
    const { lastFrame, unmount } = render(
      <SecurityPanel data={createData().security} theme={theme} />
    );
    const frame = lastFrame() ?? "";

    expect(frame).toContain("Security");
    expect(frame).toContain(".env found");
    expect(frame).toContain("unknown");
    expect(frame).toContain(".env");
    unmount();
  });

  it("renders missing security data gracefully", () => {
    const { lastFrame, unmount } = render(
      <SecurityPanel
        data={{ available: false, error: "Security information unavailable" }}
        theme={theme}
      />
    );

    expect(lastFrame()).toContain("Security information unavailable");
    unmount();
  });
});

describe("Dashboard", () => {
  it("renders all panels in stacked layout below 100 columns", () => {
    const { lastFrame, unmount } = render(
      <Dashboard data={createData()} theme="default" columns={80} />
    );
    const frame = lastFrame() ?? "";

    expect(frame).toContain("System");
    expect(frame).toContain("Project");
    expect(frame).toContain("Tools");
    expect(frame).toContain("Git");
    expect(frame).toContain("Security");
    unmount();
  });

  it("renders all panels in two-column layout at 100+ columns", () => {
    const { lastFrame, unmount } = render(
      <Dashboard data={createData()} theme="default" columns={120} />
    );
    const frame = lastFrame() ?? "";

    expect(frame).toContain("System");
    expect(frame).toContain("Project");
    expect(frame).toContain("Tools");
    expect(frame).toContain("Git");
    expect(frame).toContain("Security");
    unmount();
  });

  it("renders with dracula and nord themes", () => {
    const dracula = render(<Dashboard data={createData()} theme="dracula" columns={120} />);
    expect(dracula.lastFrame()).toContain("System");
    dracula.unmount();

    const nord = render(<Dashboard data={createData()} theme="nord" columns={120} />);
    expect(nord.lastFrame()).toContain("System");
    nord.unmount();
  });

  it("handles missing data across panels", () => {
    const data = createData({
      system: { available: false, error: "unavailable" },
      project: { available: false, error: "No project detected" },
      tools: { available: true, data: [] },
      git: { available: false, error: "Not a Git repository" },
      security: { available: false, error: "unavailable" },
    });

    const { lastFrame, unmount } = render(<Dashboard data={data} theme="nord" columns={90} />);
    const frame = lastFrame() ?? "";

    expect(frame).toContain("System information unavailable");
    expect(frame).toContain("No project detected");
    expect(frame).toContain("No tools detected");
    expect(frame).toContain("Not a Git repository");
    expect(frame).toContain("Security information unavailable");
    unmount();
  });
});
