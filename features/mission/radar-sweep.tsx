"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

/** CSS-only radar: concentric rings, blips, and a rotating sweep beam. */
export function RadarSweep({ className }: { className?: string }) {
  const blips = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        left: `${20 + ((i * 37) % 60)}%`,
        top: `${18 + ((i * 53) % 62)}%`,
        delay: `${i * 0.7}s`,
      })),
    [],
  );

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full border border-nexus/25",
        className,
      )}
      role="img"
      aria-label="Radar sweep"
    >
      {[0.75, 0.5, 0.25].map((scale) => (
        <div
          key={scale}
          className="absolute rounded-full border border-nexus/15"
          style={{
            inset: `${((1 - scale) / 2) * 100}%`,
          }}
        />
      ))}
      <div className="absolute inset-x-0 top-1/2 h-px bg-nexus/15" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-nexus/15" />
      <div
        className="animate-nexus-spin-slow absolute inset-0 rounded-full"
        style={{
          animationDuration: "4s",
          background:
            "conic-gradient(from 0deg, var(--nexus-accent-soft), transparent 70deg)",
        }}
      />
      {blips.map((blip) => (
        <span
          key={blip.left + blip.top}
          className="animate-nexus-pulse absolute h-1.5 w-1.5 rounded-full bg-nexus"
          style={{ left: blip.left, top: blip.top, animationDelay: blip.delay }}
        />
      ))}
    </div>
  );
}
