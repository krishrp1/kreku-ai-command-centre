"use client";

import { motion } from "framer-motion";
import { WidgetShell } from "@/features/dashboard/widget-shell";
import { useMetricsStore } from "@/store/metrics-store";
import { formatClock } from "@/utils/format";

export function LogsWidget() {
  const activity = useMetricsStore((s) => s.activity);

  return (
    <WidgetShell title="Live Logs">
      <ul className="flex h-full flex-col gap-1.5 overflow-y-auto font-mono text-[11px]" aria-live="polite">
        {activity.length === 0 && (
          <li className="text-muted-foreground">Awaiting events…</li>
        )}
        {activity.map((event) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            <span className="shrink-0 text-kreku/60">{formatClock(event.timestamp)}</span>
            <span className="text-foreground">{event.label}</span>
            <span className="truncate text-muted-foreground">{event.detail}</span>
          </motion.li>
        ))}
      </ul>
    </WidgetShell>
  );
}
