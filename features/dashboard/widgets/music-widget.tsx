"use client";

import { useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { motion } from "framer-motion";
import { WidgetShell } from "@/features/dashboard/widget-shell";
import { useMotionSafe } from "@/hooks/use-motion-safe";
import { useSound } from "@/hooks/use-sound";

const BARS = Array.from({ length: 28 }, (_, i) => i);

/** Mock music player with an animated waveform. No real audio playback. */
export function MusicWidget() {
  const [playing, setPlaying] = useState(true);
  const motionSafe = useMotionSafe();
  const playSound = useSound();
  const animateBars = playing && motionSafe;

  return (
    <WidgetShell title="Now Playing">
      <div className="flex h-full flex-col justify-center gap-3">
        <div className="leading-tight">
          <p className="text-sm text-foreground">Orbital Drift</p>
          <p className="font-mono text-[10px] text-muted-foreground">Signal Array — Deep Systems</p>
        </div>

        <div className="flex h-10 items-end gap-1" aria-hidden>
          {BARS.map((bar) => (
            <motion.span
              key={bar}
              className="w-1 flex-1 rounded-full bg-kreku/70"
              animate={
                animateBars
                  ? { height: ["20%", `${30 + ((bar * 37) % 60)}%`, "20%"] }
                  : { height: "24%" }
              }
              transition={
                animateBars
                  ? { duration: 0.9 + (bar % 5) * 0.12, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            className="text-muted-foreground transition-colors hover:text-kreku"
            aria-label="Previous track"
            onClick={() => playSound("click")}
          >
            <SkipBack className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => {
              playSound("click");
              setPlaying((p) => !p);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-kreku/40 bg-kreku/10 text-kreku transition-all hover:glow-accent"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          </button>
          <button
            type="button"
            className="text-muted-foreground transition-colors hover:text-kreku"
            aria-label="Next track"
            onClick={() => playSound("click")}
          >
            <SkipForward className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </WidgetShell>
  );
}
