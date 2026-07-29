"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Generic interval-driven random-walk series, for widgets that simulate
 * their own data (e.g. crypto prices) outside the shared metrics-store,
 * which is typed to real system telemetry only. `step` is read from a ref
 * so passing a fresh closure each render doesn't restart the interval.
 */
export function useSimulatedSeries<T>(seed: T[], step: (prev: T) => T, intervalMs: number): T[] {
  const [items, setItems] = useState(seed);
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  });

  useEffect(() => {
    const id = setInterval(() => {
      setItems((current) => current.map((item) => stepRef.current(item)));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return items;
}
