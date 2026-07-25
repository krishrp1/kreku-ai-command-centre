import type { AccentId } from "@/types";

export const ACCENTS: Record<AccentId, { label: string; hex: string }> = {
  cyan: { label: "Electric Cyan", hex: "#00E5FF" },
  blue: { label: "Ion Blue", hex: "#3B82F6" },
  purple: { label: "Plasma Purple", hex: "#8B5CF6" },
  teal: { label: "Quantum Teal", hex: "#14B8A6" },
  red: { label: "Crimson Red", hex: "#EF4444" },
};

export const CHART_COLORS = {
  cyan: "#00E5FF",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  teal: "#14B8A6",
  warning: "#F59E0B",
  success: "#22C55E",
  danger: "#FF3B30",
} as const;

/** How often the fake telemetry feed emits a new sample. */
export const METRICS_INTERVAL_MS = 2000;
/** Samples kept for sparkline/area history. */
export const METRICS_HISTORY = 30;

export const BOOT_TOTAL_MS = 7000;

export const APP_NAME = "KREKU";
export const APP_TAGLINE = "AI Command Centre";
