"use client";

import { GlassPanel } from "@/components/kreku/glass-panel";
import { StatusDot } from "@/components/kreku/status-dot";

const STATS = [
  { label: "Missions", value: "127" },
  { label: "Uptime", value: "99.98%" },
  { label: "Clearance", value: "LEVEL 5" },
];

export function ProfileView() {
  return (
    <div className="mx-auto max-w-xl">
      <GlassPanel className="p-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-kreku/50 bg-kreku/10 font-display text-2xl font-bold text-kreku glow-accent">
          KP
        </div>
        <h1 className="font-display mt-4 text-lg tracking-widest">COMMANDER K. PAREET</h1>
        <p className="mt-1 flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground">
          <StatusDot tone="success" /> ACTIVE DUTY — KREKU OPERATIONS
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/8 bg-white/4 p-3">
              <p className="font-display text-lg text-kreku tabular-nums">{stat.value}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
