"use client";

import { Cloud, CloudRain, Sun, Wind } from "lucide-react";
import { WidgetShell } from "@/features/dashboard/widget-shell";

const FORECAST = [
  { day: "Sat", icon: Sun, high: 21 },
  { day: "Sun", icon: Cloud, high: 19 },
  { day: "Mon", icon: CloudRain, high: 16 },
  { day: "Tue", icon: Wind, high: 18 },
] as const;

export function WeatherWidget() {
  return (
    <WidgetShell title="Weather — London">
      <div className="flex h-full items-center gap-4">
        <div className="flex items-center gap-3">
          <Cloud className="h-9 w-9 text-kreku" aria-hidden />
          <div className="leading-tight">
            <p className="font-display text-2xl tabular-nums">18°C</p>
            <p className="font-mono text-[10px] text-muted-foreground">Partly cloudy</p>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          {FORECAST.map((day) => {
            const Icon = day.icon;
            return (
              <div key={day.day} className="flex flex-col items-center gap-1">
                <span className="font-mono text-[10px] text-muted-foreground">{day.day}</span>
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                <span className="font-mono text-[10px] tabular-nums">{day.high}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetShell>
  );
}
