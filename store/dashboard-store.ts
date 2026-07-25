"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Layout } from "react-grid-layout";

export type WidgetId =
  | "core"
  | "cpu"
  | "ram"
  | "gpu"
  | "network"
  | "temperature"
  | "ai-processing"
  | "security"
  | "logs"
  | "weather"
  | "tasks"
  | "crypto"
  | "music";

export const DEFAULT_LAYOUT: Layout = [
  { i: "core", x: 4, y: 0, w: 4, h: 9, minW: 3, minH: 6 },
  { i: "cpu", x: 0, y: 0, w: 4, h: 5, minW: 2, minH: 3 },
  { i: "ram", x: 0, y: 5, w: 2, h: 4, minW: 2, minH: 3 },
  { i: "gpu", x: 2, y: 5, w: 2, h: 4, minW: 2, minH: 3 },
  { i: "network", x: 8, y: 0, w: 4, h: 5, minW: 2, minH: 3 },
  { i: "temperature", x: 8, y: 5, w: 2, h: 4, minW: 2, minH: 3 },
  { i: "ai-processing", x: 10, y: 5, w: 2, h: 4, minW: 2, minH: 3 },
  { i: "security", x: 0, y: 9, w: 3, h: 6, minW: 2, minH: 4 },
  { i: "logs", x: 3, y: 9, w: 5, h: 6, minW: 3, minH: 4 },
  { i: "weather", x: 8, y: 9, w: 4, h: 3, minW: 2, minH: 3 },
  { i: "tasks", x: 8, y: 12, w: 4, h: 3, minW: 2, minH: 3 },
  { i: "crypto", x: 0, y: 15, w: 6, h: 5, minW: 3, minH: 4 },
  { i: "music", x: 6, y: 15, w: 6, h: 5, minW: 3, minH: 3 },
];

interface DashboardState {
  layout: Layout;
  setLayout: (layout: Layout) => void;
  resetLayout: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      layout: DEFAULT_LAYOUT,
      setLayout: (layout) => set({ layout }),
      resetLayout: () => set({ layout: DEFAULT_LAYOUT }),
    }),
    { name: "kreku-dashboard" },
  ),
);
