"use client";

import { memo } from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { CountUp } from "@/components/kreku/count-up";
import { WidgetShell } from "@/features/dashboard/widget-shell";
import { useLatestMetrics } from "@/store/metrics-store";
import type { MetricsSample } from "@/types";

interface GaugeWidgetProps {
  title: string;
  metric: keyof Pick<MetricsSample, "ram" | "gpu" | "temperature" | "aiLoad">;
  color: string;
  unit?: string;
  max?: number;
}

/** Ring gauge for a single 0–100 metric (RAM, GPU, temp, AI load). */
function GaugeWidgetImpl({ title, metric, color, unit = "%", max = 100 }: GaugeWidgetProps) {
  const value = useLatestMetrics()[metric];

  return (
    <WidgetShell title={title}>
      <div className="relative h-full">
        {/* Segmented decorative track — "digital/quantized" texture per the
            KREKU Command design system, behind the real smooth value arc. */}
        <div
          aria-hidden
          className="absolute inset-[8%] rounded-full border-[5px] border-dashed border-white/[0.06]"
        />
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={[{ value }]}
            innerRadius="72%"
            outerRadius="100%"
            startAngle={220}
            endAngle={-40}
          >
            <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
            <RadialBar
              dataKey="value"
              fill={color}
              cornerRadius={8}
              background={{ fill: "rgba(255,255,255,0.06)" }}
              isAnimationActive={false}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <CountUp
            value={value}
            format={(v) => `${v}${unit}`}
            className="font-display text-xl tabular-nums"
          />
        </div>
      </div>
    </WidgetShell>
  );
}

export const GaugeWidget = memo(GaugeWidgetImpl);
