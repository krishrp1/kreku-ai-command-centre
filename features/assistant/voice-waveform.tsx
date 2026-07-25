"use client";

import { motion } from "framer-motion";
import { useMotionSafe } from "@/hooks/use-motion-safe";
import type { AssistantStatus } from "@/types";
import { cn } from "@/lib/utils";

const BAR_COUNT = 16;

/** Compact voice-style waveform that reacts to the assistant status. */
export function VoiceWaveform({
  status,
  className,
}: {
  status: AssistantStatus;
  className?: string;
}) {
  const motionSafe = useMotionSafe();
  const active = motionSafe && status !== "idle";
  const intensity = status === "responding" ? 90 : status === "thinking" ? 45 : 65;

  return (
    <div className={cn("flex h-6 items-center gap-0.5", className)} aria-hidden>
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <motion.span
          key={i}
          className="w-0.5 flex-1 rounded-full bg-kreku/80"
          animate={
            active
              ? { height: ["18%", `${20 + ((i * 41) % intensity)}%`, "18%"] }
              : { height: "18%" }
          }
          transition={
            active
              ? { duration: 0.5 + (i % 4) * 0.09, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}
