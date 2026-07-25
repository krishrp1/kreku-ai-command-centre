"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useMetricsStore } from "@/store/metrics-store";
import { useSystemStore } from "@/store/system-store";
import { BootSequence } from "@/features/boot/boot-sequence";
import { LayeredBackground } from "@/features/background/layered-background";
import { TopBar } from "@/features/layout/top-bar";
import { Sidebar } from "@/features/layout/sidebar";
import { Dock } from "@/features/layout/dock";
import { ViewRouter } from "@/features/shell/view-router";
import { CustomCursor } from "@/components/cursor/custom-cursor";

const AssistantPanel = dynamic(
  () =>
    import("@/features/assistant/assistant-panel").then(
      (m) => m.AssistantPanel,
    ),
  { ssr: false },
);
const CommandPalette = dynamic(
  () =>
    import("@/features/command-palette/command-palette").then(
      (m) => m.CommandPalette,
    ),
  { ssr: false },
);
const NotificationCentre = dynamic(
  () =>
    import("@/features/notifications/notification-centre").then(
      (m) => m.NotificationCentre,
    ),
  { ssr: false },
);

export function CommandCentre() {
  const bootPhase = useSystemStore((s) => s.bootPhase);
  const startMetrics = useMetricsStore((s) => s.start);

  useEffect(() => startMetrics(), [startMetrics]);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <LayeredBackground />
      <CustomCursor />
      <AnimatePresence mode="wait">
        {bootPhase === "booting" ? (
          <BootSequence key="boot" />
        ) : (
          <motion.div
            key="os"
            className="relative z-10 flex h-full flex-col"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-nexus focus:px-3 focus:py-2 focus:text-sm focus:text-black"
            >
              Skip to content
            </a>
            <TopBar />
            <div className="flex min-h-0 flex-1">
              <Sidebar />
              <main
                id="main-content"
                className="relative min-w-0 flex-1 overflow-y-auto px-4 pb-28 pt-4 md:px-6"
              >
                <ViewRouter />
              </main>
            </div>
            <Dock />
            <AssistantPanel />
            <CommandPalette />
            <NotificationCentre />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
