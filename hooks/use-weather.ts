"use client";

import { useQuery } from "@tanstack/react-query";
import type { WeatherData } from "@/types";

async function fetchWeather(): Promise<WeatherData> {
  const res = await fetch("/api/weather");
  if (!res.ok) throw new Error(`weather ${res.status}`);
  return res.json();
}

/** Real weather for the visitor's own location, shared across every consumer. */
export function useWeather() {
  return useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    staleTime: 10 * 60_000,
    retry: 1,
  });
}
