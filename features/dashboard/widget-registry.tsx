"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { CHART_COLORS } from "@/lib/constants";
import type { WidgetId } from "@/store/dashboard-store";

// Code-split per widget — dashboard's chart/gauge weight (recharts, three.js
// core widget) only ships once a view that actually renders the grid mounts.
const CoreWidget = dynamic(() =>
  import("@/features/dashboard/widgets/core-widget").then((m) => m.CoreWidget),
);
const CpuWidget = dynamic(() =>
  import("@/features/dashboard/widgets/cpu-widget").then((m) => m.CpuWidget),
);
const CryptoWidget = dynamic(() =>
  import("@/features/dashboard/widgets/crypto-widget").then((m) => m.CryptoWidget),
);
const GaugeWidget = dynamic(() =>
  import("@/features/dashboard/widgets/gauge-widget").then((m) => m.GaugeWidget),
);
const LogsWidget = dynamic(() =>
  import("@/features/dashboard/widgets/logs-widget").then((m) => m.LogsWidget),
);
const MusicWidget = dynamic(() =>
  import("@/features/dashboard/widgets/music-widget").then((m) => m.MusicWidget),
);
const NetworkWidget = dynamic(() =>
  import("@/features/dashboard/widgets/network-widget").then((m) => m.NetworkWidget),
);
const SecurityWidget = dynamic(() =>
  import("@/features/dashboard/widgets/security-widget").then((m) => m.SecurityWidget),
);
const TasksWidget = dynamic(() =>
  import("@/features/dashboard/widgets/tasks-widget").then((m) => m.TasksWidget),
);
const WeatherWidget = dynamic(() =>
  import("@/features/dashboard/widgets/weather-widget").then((m) => m.WeatherWidget),
);

const RamWidget = () => (
  <GaugeWidget title="RAM" metric="ram" color={CHART_COLORS.blue} />
);
const GpuWidget = () => (
  <GaugeWidget title="GPU" metric="gpu" color={CHART_COLORS.purple} />
);
const TemperatureWidget = () => (
  <GaugeWidget title="Core Temp" metric="temperature" color={CHART_COLORS.warning} unit="°C" />
);
const AiProcessingWidget = () => (
  <GaugeWidget title="AI Processing" metric="aiLoad" color={CHART_COLORS.cyan} />
);

export const WIDGETS: Record<WidgetId, ComponentType> = {
  core: CoreWidget,
  cpu: CpuWidget,
  ram: RamWidget,
  gpu: GpuWidget,
  network: NetworkWidget,
  temperature: TemperatureWidget,
  "ai-processing": AiProcessingWidget,
  security: SecurityWidget,
  logs: LogsWidget,
  weather: WeatherWidget,
  tasks: TasksWidget,
  crypto: CryptoWidget,
  music: MusicWidget,
};
