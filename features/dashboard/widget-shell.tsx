"use client";

import { GripVertical } from "lucide-react";
import { GlassPanel } from "@/components/kreku/glass-panel";
import { cn } from "@/lib/utils";

interface WidgetShellProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  /** Extra element rendered on the right side of the header. */
  action?: React.ReactNode;
  /** Hide the `[TAG]` mono ID in the header. Defaults to shown. */
  showTag?: boolean;
}

/** Chrome shared by every dashboard widget: header, drag handle, glass body. */
export function WidgetShell({
  title,
  children,
  className,
  action,
  showTag = true,
}: WidgetShellProps) {
  const tag = title.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");

  return (
    <GlassPanel
      className={cn("relative flex h-full flex-col overflow-hidden p-3", className)}
      whileHover={{ boxShadow: "0 0 28px rgba(0,229,255,0.12)" }}
    >
      {/* Corner brackets — HUD/instrument-panel accent per the KREKU Command design system. */}
      <span
        aria-hidden
        className="border-kreku/40 pointer-events-none absolute top-1.5 left-1.5 h-2.5 w-2.5 border-t border-l"
      />
      <span
        aria-hidden
        className="border-kreku/40 pointer-events-none absolute right-1.5 bottom-1.5 h-2.5 w-2.5 border-r border-b"
      />
      <div className="mb-2 flex items-center gap-2">
        <GripVertical
          className="widget-drag-handle h-3.5 w-3.5 cursor-grab text-muted-foreground/60 hover:text-kreku"
          aria-label={`Drag ${title} widget`}
        />
        {showTag && (
          <span className="text-kreku/50 font-mono text-[9px] tracking-[0.1em]">
            [{tag}]
          </span>
        )}
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </span>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </GlassPanel>
  );
}
