"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_AXIS_PROPS,
  CHART_GRID_PROPS,
  KrekuTooltip,
} from "@/components/charts/chart-theme";
import { WidgetShell } from "@/features/dashboard/widget-shell";
import { CHART_COLORS } from "@/lib/constants";
import { useMetricsStore } from "@/store/metrics-store";
import { formatClock } from "@/utils/format";

export function NetworkWidget() {
  const history = useMetricsStore((s) => s.history);
  const data = history.map((sample) => ({
    time: formatClock(sample.timestamp),
    down: sample.networkDown,
    up: sample.networkUp,
  }));

  return (
    <WidgetShell title="Network MB/s">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -26 }}>
          <CartesianGrid {...CHART_GRID_PROPS} />
          <XAxis dataKey="time" {...CHART_AXIS_PROPS} interval="preserveStartEnd" minTickGap={48} />
          <YAxis {...CHART_AXIS_PROPS} />
          <Tooltip content={KrekuTooltip} cursor={{ stroke: "rgba(255,255,255,0.2)" }} />
          <Legend
            wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
            iconType="plainline"
          />
          <Line
            type="monotone"
            dataKey="down"
            name="Down"
            stroke={CHART_COLORS.cyan}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="up"
            name="Up"
            stroke={CHART_COLORS.purple}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </WidgetShell>
  );
}
