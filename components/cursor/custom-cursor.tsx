"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMotionSafe } from "@/hooks/use-motion-safe";

/**
 * Custom cursor: a small accent dot with a trailing ring.
 * Renders nothing on touch devices or under reduced motion —
 * the native cursor is never hidden, this floats alongside it.
 */
export function CustomCursor() {
  const motionSafe = useMotionSafe();
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 24 });
  const ringY = useSpring(y, { stiffness: 260, damping: 24 });

  useEffect(() => {
    if (!motionSafe) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [motionSafe, x, y]);

  if (!motionSafe) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-kreku"
        style={{ x, y, translateX: "-50%", translateY: "-50%", opacity: visible ? 1 : 0 }}
      />
      <motion.div
        className="absolute h-7 w-7 rounded-full border border-kreku/40"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 0.7 : 0,
        }}
      />
    </div>
  );
}
