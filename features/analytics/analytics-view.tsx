"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
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
import { GlassPanel } from "@/components/kreku/glass-panel";
import { CHART_COLORS } from "@/lib/constants";
import { useLatestMetrics, useMetricsStore } from "@/store/metrics-store";
import { formatClock } from "@/utils/format";

const STORAGE = [
  { name: "AI Models", value: 42, color: CHART_COLORS.cyan },
  { name: "Telemetry", value: 26, color: CHART_COLORS.purple },
  { name: "Archives", value: 19, color: CHART_COLORS.teal },
  { name: "System", value: 13, color: CHART_COLORS.warning },
];

const THROUGHPUT = [
  { hour: "00", value: 34 },
  { hour: "04", value: 18 },
  { hour: "08", value: 62 },
  { hour: "12", value: 81 },
  { hour: "16", value: 74 },
  { hour: "20", value: 52 },
];

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassPanel
      className="flex min-h-[260px] flex-col p-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </span>
      <div className="min-h-0 flex-1">{children}</div>
    </GlassPanel>
  );
}

export function AnalyticsView() {
  const history = useMetricsStore((s) => s.history);
  const latest = useLatestMetrics();

  const powerSeries = history.map((sample) => ({
    time: formatClock(sample.timestamp),
    power: sample.power,
  }));

  const subsystems = [
    { subject: "CPU", value: latest.cpu },
    { subject: "RAM", value: latest.ram },
    { subject: "GPU", value: latest.gpu },
    { subject: "NET", value: Math.min(100, latest.networkDown / 2.4) },
    { subject: "AI", value: latest.aiLoad },
    { subject: "PWR", value: latest.power },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel title="Power Output — Live">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={powerSeries} margin={{ top: 4, right: 4, bottom: 0, left: -26 }}>
            <AreaGradient id="power-fill" color={CHART_COLORS.teal} />
            <CartesianGrid {...CHART_GRID_PROPS} />
            <XAxis dataKey="time" {...CHART_AXIS_PROPS} interval="preserveStartEnd" minTickGap={48} />
            <YAxis domain={[0, 100]} {...CHART_AXIS_PROPS} />
            <Tooltip content={KrekuTooltip} cursor={{ stroke: "rgba(255,255,255,0.2)" }} />
            <Area
              type="monotone"
              dataKey="power"
              name="Power"
              stroke={CHART_COLORS.teal}
              strokeWidth={2}
              fill="url(#power-fill)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Subsystem Load — Radar">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={subsystems} outerRadius="78%">
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            />
            <Radar
              dataKey="value"
              name="Load"
              stroke={CHART_COLORS.cyan}
              fill={CHART_COLORS.cyan}
              fillOpacity={0.18}
              isAnimationActive={false}
            />
            <Tooltip content={KrekuTooltip} />
          </RadarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Storage Distribution">
        <div className="flex h-full items-center gap-6">
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie
                data={STORAGE}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="88%"
                paddingAngle={3}
                stroke="none"
              >
                {STORAGE.map((slice) => (
                  <Cell key={slice.name} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip content={KrekuTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="flex flex-col gap-2">
            {STORAGE.map((slice) => (
              <li key={slice.name} className="flex items-center gap-2 font-mono text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: slice.color }} aria-hidden />
                <span className="text-muted-foreground">{slice.name}</span>
                <span className="ml-auto tabular-nums text-foreground">{slice.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel title="Uplink Throughput — By Hour">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={THROUGHPUT} margin={{ top: 4, right: 4, bottom: 0, left: -26 }}>
            <CartesianGrid {...CHART_GRID_PROPS} />
            <XAxis dataKey="hour" {...CHART_AXIS_PROPS} />
            <YAxis {...CHART_AXIS_PROPS} />
            <Tooltip content={KrekuTooltip} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Bar
              dataKey="value"
              name="MB/s"
              fill={CHART_COLORS.blue}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
