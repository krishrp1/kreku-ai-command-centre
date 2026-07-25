"use client";

import { create } from "zustand";
import { METRICS_HISTORY, METRICS_INTERVAL_MS } from "@/lib/constants";
import type { ActivityEvent, MetricsSample } from "@/types";

/** Random walk that keeps a value drifting smoothly inside [min, max]. */
function drift(current: number, min: number, max: number, step: number) {
  const next = current + (Math.random() - 0.5) * 2 * step;
  return Math.min(max, Math.max(min, next));
}

function nextSample(prev: MetricsSample): MetricsSample {
  return {
    timestamp: Date.now(),
    cpu: drift(prev.cpu, 8, 96, 9),
    ram: drift(prev.ram, 30, 88, 4),
    gpu: drift(prev.gpu, 5, 98, 12),
    disk: drift(prev.disk, 52, 60, 0.4),
    networkUp: drift(prev.networkUp, 1, 80, 10),
    networkDown: drift(prev.networkDown, 5, 240, 26),
    temperature: drift(prev.temperature, 38, 82, 2.5),
    aiLoad: drift(prev.aiLoad, 12, 94, 11),
    power: drift(prev.power, 62, 100, 1.2),
  };
}

const INITIAL_SAMPLE: MetricsSample = {
  timestamp: Date.now(),
  cpu: 34,
  ram: 52,
  gpu: 41,
  disk: 56,
  networkUp: 18,
  networkDown: 96,
  temperature: 54,
  aiLoad: 47,
  power: 92,
};

const LOG_MESSAGES = [
  ["Neural core", "inference batch completed"],
  ["Sensor grid", "sweep finished — no anomalies"],
  ["Uplink", "telemetry packet acknowledged"],
  ["Power core", "output stabilised"],
  ["Firewall", "probe deflected on port 443"],
  ["Satellite KH-7", "orbit correction applied"],
  ["Cache", "cold segments evicted"],
  ["Diagnostics", "subsystem check passed"],
] as const;

let eventSeq = 0;

interface MetricsState {
  history: MetricsSample[];
  activity: ActivityEvent[];
  /** Interval owner guard so only one ticker runs app-wide. */
  running: boolean;
  start: () => () => void;
}

export const useMetricsStore = create<MetricsState>((set, get) => ({
  history: [INITIAL_SAMPLE],
  activity: [],
  running: false,
  start: () => {
    if (get().running) return () => undefined;
    set({ running: true });
    const interval = setInterval(() => {
      set((state) => {
        const sample = nextSample(state.history[state.history.length - 1]);
        const history = [...state.history, sample].slice(-METRICS_HISTORY);
        let activity = state.activity;
        if (Math.random() < 0.4) {
          const [label, detail] =
            LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
          activity = [
            { id: `evt-${eventSeq++}`, label, detail, timestamp: Date.now() },
            ...activity,
          ].slice(0, 24);
        }
        return { history, activity };
      });
    }, METRICS_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      set({ running: false });
    };
  },
}));

export const useLatestMetrics = () =>
  useMetricsStore((state) => state.history[state.history.length - 1]);
