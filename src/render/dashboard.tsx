import { render } from "ink";
import { useApp } from "ink";
import { useEffect } from "react";
import { Dashboard } from "../dashboard/Dashboard.js";
import type { DevFetchData } from "../types.js";
import type { DashboardThemeName } from "../dashboard/types.js";

type RenderDashboardOptions = {
  theme: DashboardThemeName;
};

function DashboardApp({
  data,
  theme,
}: {
  data: DevFetchData;
  theme: DashboardThemeName;
}) {
  const { exit } = useApp();

  useEffect(() => {
    exit();
  }, [exit]);

  return <Dashboard data={data} theme={theme} />;
}

export async function renderDashboard(
  data: DevFetchData,
  options: RenderDashboardOptions
): Promise<void> {
  const { waitUntilExit } = render(
    <DashboardApp data={data} theme={options.theme} />
  );

  await waitUntilExit();
}
