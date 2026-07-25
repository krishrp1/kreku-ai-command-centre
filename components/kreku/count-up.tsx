"use client";

import { animate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { useMotionSafe } from "@/hooks/use-motion-safe";

interface CountUpProps {
  value: number;
  /** Renders the number, e.g. add a unit suffix. */
  format?: (value: number) => string;
  className?: string;
}

/** Animated numeric readout that eases between value changes. */
export function CountUp({ value, format = String, className }: CountUpProps) {
  const motionSafe = useMotionSafe();
  const motionValue = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!motionSafe) return;
    const controls = animate(motionValue, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [value, motionSafe, motionValue]);

  return (
    <span className={className}>
      {format(Math.round(motionSafe ? display : value))}
    </span>
  );
}
