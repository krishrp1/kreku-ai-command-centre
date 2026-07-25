"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AreaGradient,
  CHART_AXIS_PROPS,
  CHART_GRID_PROPS,
  KrekuTooltip,
} from "@/components/charts/chart-theme";
import { CountUp } from "@/components/kreku/count-up";
import { WidgetShell } from "@/features/dashboard/widget-shell";
import { CHART_COLORS } from "@/lib/constants";
import { useMetricsStore } from "@/store/metrics-store";
import { formatClock, formatPercent } from "@/utils/format";

export function CpuWidget() {
  const history = useMetricsStore((s) => s.history);
  const data = history.map((sample) => ({
    time: formatClock(sample.timestamp),
    cpu: sample.cpu,
  }));
  const current = history[history.length - 1].cpu;

  return (
    <WidgetShell
      title="CPU Usage"
      action={
        <CountUp
          value={current}
          format={formatPercent}
          className="font-display text-lg text-kreku text-glow tabular-nums"
        />
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -26 }}>
          <AreaGradient id="cpu-fill" color={CHART_COLORS.cyan} />
          <CartesianGrid {...CHART_GRID_PROPS} />
          <XAxis dataKey="time" {...CHART_AXIS_PROPS} interval="preserveStartEnd" minTickGap={48} />
          <YAxis domain={[0, 100]} {...CHART_AXIS_PROPS} />
          <Tooltip content={KrekuTooltip} cursor={{ stroke: "rgba(255,255,255,0.2)" }} />
          <Area
            type="monotone"
            dataKey="cpu"
            name="CPU"
            stroke={CHART_COLORS.cyan}
            strokeWidth={2}
            fill="url(#cpu-fill)"
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </WidgetShell>
  );
}
