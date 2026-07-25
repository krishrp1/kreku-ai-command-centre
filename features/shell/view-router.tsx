"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useSystemStore } from "@/store/system-store";
import { ViewSkeleton } from "@/features/shell/view-skeleton";
import type { ViewId } from "@/types";

const loading = () => <ViewSkeleton />;

// Each view is code-split; heavy 3D views only load when opened.
const VIEWS: Record<ViewId, ComponentType> = {
  dashboard: dynamic(
    () => import("@/features/dashboard/dashboard-view").then((m) => m.DashboardView),
    { ssr: false, loading },
  ),
  mission: dynamic(
    () => import("@/features/mission/mission-view").then((m) => m.MissionView),
    { ssr: false, loading },
  ),
  analytics: dynamic(
    () => import("@/features/analytics/analytics-view").then((m) => m.AnalyticsView),
    { ssr: false, loading },
  ),
  assistant: dynamic(
    () => import("@/features/assistant/assistant-view").then((m) => m.AssistantView),
    { ssr: false, loading },
  ),
  satellite: dynamic(
    () => import("@/features/satellite/satellite-view").then((m) => m.SatelliteView),
    { ssr: false, loading },
  ),
  files: dynamic(
    () => import("@/features/files/files-view").then((m) => m.FilesView),
    { ssr: false, loading },
  ),
  terminal: dynamic(
    () => import("@/features/terminal/terminal-view").then((m) => m.TerminalView),
    { ssr: false, loading },
  ),
  settings: dynamic(
    () => import("@/features/settings/settings-view").then((m) => m.SettingsView),
    { ssr: false, loading },
  ),
  profile: dynamic(
    () => import("@/features/profile/profile-view").then((m) => m.ProfileView),
    { ssr: false, loading },
  ),
};

export function ViewRouter() {
  const activeView = useSystemStore((s) => s.activeView);
  const View = VIEWS[activeView];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 16, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.995 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <View />
      </motion.div>
    </AnimatePresence>
  );
}
