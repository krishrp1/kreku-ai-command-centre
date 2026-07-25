"use client";

import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun } from "lucide-react";
import { WidgetShell } from "@/features/dashboard/widget-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeather } from "@/hooks/use-weather";
import type { WeatherCategory } from "@/lib/weather-codes";

const CATEGORY_ICONS: Record<WeatherCategory, typeof Cloud> = {
  clear: Sun,
  "partly-cloudy": CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  thunderstorm: CloudLightning,
};

export function WeatherWidget() {
  const { data, isLoading } = useWeather();
  const Icon = data ? CATEGORY_ICONS[data.category] : Cloud;

  return (
    <WidgetShell title={data ? `Weather — ${data.city}` : "Weather"}>
      <div className="flex h-full items-center gap-4">
        {isLoading || !data ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Icon className="h-9 w-9 text-kreku" aria-hidden />
            <div className="leading-tight">
              <p className="font-display text-2xl tabular-nums">{data.tempC}°C</p>
              <p className="font-mono text-[10px] text-muted-foreground">{data.condition}</p>
            </div>
          </div>
        )}
        {data && data.forecast.length > 0 && (
          <div className="ml-auto flex gap-3">
            {data.forecast.map((day) => {
              const DayIcon = CATEGORY_ICONS[day.category];
              return (
                <div key={day.day} className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[10px] text-muted-foreground">{day.day}</span>
                  <DayIcon className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <span className="font-mono text-[10px] tabular-nums">{day.high}°</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
