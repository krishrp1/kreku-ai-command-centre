"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/kreku/glass-panel";
import { StatusDot } from "@/components/kreku/status-dot";
import { AiCore } from "@/features/core/ai-core";
import { RadarSweep } from "@/features/mission/radar-sweep";
import { useMetricsStore, useLatestMetrics } from "@/store/metrics-store";
import { formatClock } from "@/utils/format";

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.5 },
  }),
};

/** Mission Control: the AI core front-and-centre with live ops readouts. */
export function MissionView() {
  const metrics = useLatestMetrics();
  const activity = useMetricsStore((s) => s.activity);

  const readouts = [
    { label: "AI LOAD", value: `${Math.round(metrics.aiLoad)}%`, tone: "accent" },
    { label: "CORE TEMP", value: `${Math.round(metrics.temperature)}°C`, tone: metrics.temperature > 75 ? "danger" : "success" },
    { label: "POWER", value: `${Math.round(metrics.power)}%`, tone: "success" },
    { label: "UPLINK", value: `${Math.round(metrics.networkUp)} MB/s`, tone: "accent" },
  ] as const;

  return (
    <div className="grid h-full min-h-[70vh] gap-4 lg:grid-cols-[1fr_2fr_1fr]">
      {/* Left: readouts */}
      <div className="flex flex-col gap-4">
        {readouts.map((readout, index) => (
          <GlassPanel
            key={readout.label}
            className="p-4"
            custom={index}
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-widest text-muted-foreground">
                {readout.label}
              </span>
              <StatusDot tone={readout.tone} />
            </div>
            <p className="font-display mt-2 text-2xl text-kreku text-glow tabular-nums">
              {readout.value}
            </p>
          </GlassPanel>
        ))}
        <GlassPanel className="p-4" custom={4} variants={stagger} initial="initial" animate="animate">
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground">
            RADAR
          </span>
          <RadarSweep className="mt-3" />
        </GlassPanel>
      </div>

      {/* Centre: the core */}
      <GlassPanel
        scan
        className="relative min-h-[420px] overflow-hidden"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AiCore className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-4 font-mono text-[11px] text-muted-foreground">
          <span>KREKU CORE v5.2.1</span>
          <span className="flex items-center gap-2">
            <StatusDot tone="accent" /> HOLOGRAPHIC LINK STABLE
          </span>
        </div>
      </GlassPanel>

      {/* Right: live ops feed */}
      <GlassPanel
        className="flex min-h-[300px] flex-col p-4"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground">
          LIVE OPERATIONS FEED
        </span>
        <ul className="mt-3 flex flex-1 flex-col gap-2 overflow-y-auto font-mono text-xs">
          {activity.length === 0 && (
            <li className="text-muted-foreground">Awaiting telemetry…</li>
          )}
          {activity.map((event) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-baseline gap-2 border-b border-white/5 pb-2"
            >
              <span className="shrink-0 text-kreku/70">{formatClock(event.timestamp)}</span>
              <span>
                <span className="text-foreground">{event.label}</span>{" "}
                <span className="text-muted-foreground">{event.detail}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  );
}
