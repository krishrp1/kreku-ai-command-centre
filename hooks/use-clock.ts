"use client";

import { useEffect, useState } from "react";

/** Ticking clock; returns null until mounted to avoid hydration mismatch. */
export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // First tick is deferred so no state is set synchronously in the effect.
    const first = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [intervalMs]);

  return now;
}
