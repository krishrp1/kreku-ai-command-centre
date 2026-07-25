"use client";

import { RotateCcw } from "lucide-react";
import ReactGridLayout, { useContainerWidth, type Layout } from "react-grid-layout";
import { WIDGETS } from "@/features/dashboard/widget-registry";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDashboardStore, type WidgetId } from "@/store/dashboard-store";
import { useSound } from "@/hooks/use-sound";

/** Drag-and-drop widget dashboard; layout persists to localStorage. */
export function DashboardView() {
  const { width, containerRef, mounted } = useContainerWidth();
  const layout = useDashboardStore((s) => s.layout);
  const setLayout = useDashboardStore((s) => s.setLayout);
  const resetLayout = useDashboardStore((s) => s.resetLayout);
  const playSound = useSound();
  // Below md the grid collapses into stacked cards.
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (isMobile) {
    // Stacked cards preserve the aesthetic without drag mechanics on touch.
    return (
      <div className="flex flex-col gap-4">
        {layout.map((item) => {
          const Widget = WIDGETS[item.i as WidgetId];
          return (
            <div key={item.i} className="min-h-44" style={{ height: item.h * 34 }}>
              <Widget />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          playSound("click");
          resetLayout();
        }}
        className="absolute -top-1 right-0 z-20 flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-nexus/50 hover:text-nexus"
        aria-label="Reset dashboard layout"
      >
        <RotateCcw className="h-3 w-3" aria-hidden />
        RESET LAYOUT
      </button>
      {mounted && (
        <ReactGridLayout
          layout={layout}
          width={width}
          gridConfig={{ cols: 12, rowHeight: 34, margin: [16, 16] }}
          dragConfig={{ enabled: true, handle: ".widget-drag-handle" }}
          resizeConfig={{ enabled: true, handles: ["se"] }}
          onLayoutChange={(next: Layout) => setLayout(next)}
        >
          {layout.map((item) => {
            const Widget = WIDGETS[item.i as WidgetId];
            return (
              <div key={item.i}>
                <Widget />
              </div>
            );
          })}
        </ReactGridLayout>
      )}
    </div>
  );
}
