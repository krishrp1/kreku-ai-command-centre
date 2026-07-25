"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useSystemStore } from "@/store/system-store";

/**
 * True when animation is allowed: respects both the OS
 * prefers-reduced-motion setting and the in-app toggle.
 */
export function useMotionSafe() {
  const reducedByUser = useSystemStore((s) => s.reducedMotion);
  const reducedByOS = useMediaQuery("(prefers-reduced-motion: reduce)");
  return !reducedByUser && !reducedByOS;
}
