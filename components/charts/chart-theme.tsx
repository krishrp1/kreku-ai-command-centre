"use client";

import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

export const CHART_AXIS_PROPS = {
  stroke: "rgba(255,255,255,0.25)",
  tick: { fill: "rgba(255,255,255,0.45)", fontSize: 10, fontFamily: "var(--font-mono)" },
  tickLine: false,
  axisLine: false,
} as const;

export const CHART_GRID_PROPS = {
  stroke: "rgba(255,255,255,0.06)",
  vertical: false,
} as const;

/** Glass tooltip shared by all recharts instances. */
export function NexusTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 font-mono text-xs">
      {label !== undefined && (
        <p className="mb-1 text-muted-foreground">{label}</p>
      )}
      {payload.map((entry, index) => (
        <p key={`${entry.name}-${index}`} className="flex items-center gap-2 text-foreground">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: entry.color }}
            aria-hidden
          />
          {entry.name}: {typeof entry.value === "number" ? Math.round(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

/** Reusable <defs> gradient for area fills. */
export function AreaGradient({ id, color }: { id: string; color: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0.35} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}
