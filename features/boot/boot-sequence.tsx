"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { APP_NAME, APP_TAGLINE, BOOT_TOTAL_MS } from "@/lib/constants";
import { useSound } from "@/hooks/use-sound";
import { useSystemStore } from "@/store/system-store";

interface BootStep {
  at: number; // progress fraction when this line appears
  text: string;
}

const BOOT_STEPS: BootStep[] = [
  { at: 0.04, text: "Initialising power core" },
  { at: 0.14, text: "Scanning hardware matrix" },
  { at: 0.28, text: "Checking subsystem integrity" },
  { at: 0.42, text: "Mounting encrypted volumes" },
  { at: 0.55, text: "Loading AI modules" },
  { at: 0.68, text: "Calibrating neural lattice" },
  { at: 0.8, text: "Establishing satellite uplink" },
  { at: 0.9, text: "Synchronising voice interface" },
  { at: 0.97, text: "Artificial intelligence online" },
];

/** Full-screen boot: glowing core, scrolling checklist, progress %, skippable. */
export function BootSequence() {
  const completeBoot = useSystemStore((s) => s.completeBoot);
  const playSound = useSound();
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    playSound("boot");
    let raf = 0;
    const tick = (time: number) => {
      startRef.current ??= time;
      const fraction = Math.min(1, (time - startRef.current) / BOOT_TOTAL_MS);
      // Ease the readout so it lingers near the end like real firmware.
      setProgress(Math.round((1 - Math.pow(1 - fraction, 2)) * 100));
      if (fraction >= 1) {
        if (!doneRef.current) {
          doneRef.current = true;
          setTimeout(completeBoot, 400);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [completeBoot, playSound]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") completeBoot();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [completeBoot]);

  const visibleSteps = useMemo(
    () => BOOT_STEPS.filter((step) => progress / 100 >= step.at),
    [progress],
  );

  return (
    <motion.div
      className="relative z-20 flex h-full flex-col items-center justify-center gap-10 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
      transition={{ duration: 0.7 }}
    >
      {/* Power core */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute h-52 w-52 rounded-full bg-nexus/10 blur-2xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-36 w-36 rounded-full border border-nexus/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, var(--nexus-accent-soft) 90deg, transparent 180deg)",
          }}
        />
        <motion.div
          className="absolute h-20 w-20 rounded-full bg-nexus/25 glow-accent"
          animate={{ scale: [0.9, 1.08, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="font-display absolute text-xl font-bold tracking-[0.3em] text-glow">
          {APP_NAME}
        </span>
      </div>

      {/* Progress readout */}
      <div className="flex w-72 flex-col items-center gap-3 sm:w-96">
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Boot progress"
        >
          <motion.div
            className="h-full rounded-full bg-nexus glow-accent"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex w-full items-center justify-between font-mono text-xs text-muted-foreground">
          <span>{APP_TAGLINE.toUpperCase()}</span>
          <span className="text-nexus">{progress}%</span>
        </div>
      </div>

      {/* Boot checklist */}
      <div
        className="flex h-40 w-72 flex-col gap-1.5 overflow-hidden font-mono text-xs sm:w-96"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {visibleSteps.slice(-7).map((step) => (
            <motion.div
              key={step.text}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <span className="text-nexus-success">▸</span>
              <span>{step.text}</span>
              <span className="ml-auto text-nexus-success/80">OK</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={completeBoot}
        className="absolute bottom-8 rounded-full border border-white/10 px-4 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-nexus/50 hover:text-nexus"
      >
        SKIP BOOT — ESC
      </button>
    </motion.div>
  );
}
