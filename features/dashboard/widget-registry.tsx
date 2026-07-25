"use client";

import type { ComponentType } from "react";
import { CHART_COLORS } from "@/lib/constants";
import type { WidgetId } from "@/store/dashboard-store";
import { CoreWidget } from "@/features/dashboard/widgets/core-widget";
import { CpuWidget } from "@/features/dashboard/widgets/cpu-widget";
import { CryptoWidget } from "@/features/dashboard/widgets/crypto-widget";
import { GaugeWidget } from "@/features/dashboard/widgets/gauge-widget";
import { LogsWidget } from "@/features/dashboard/widgets/logs-widget";
import { MusicWidget } from "@/features/dashboard/widgets/music-widget";
import { NetworkWidget } from "@/features/dashboard/widgets/network-widget";
import { SecurityWidget } from "@/features/dashboard/widgets/security-widget";
import { TasksWidget } from "@/features/dashboard/widgets/tasks-widget";
import { WeatherWidget } from "@/features/dashboard/widgets/weather-widget";

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
