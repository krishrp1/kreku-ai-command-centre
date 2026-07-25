"use client";

import { GripVertical } from "lucide-react";
import { GlassPanel } from "@/components/nexus/glass-panel";
import { cn } from "@/lib/utils";

interface WidgetShellProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  /** Extra element rendered on the right side of the header. */
  action?: React.ReactNode;
}

/** Chrome shared by every dashboard widget: header, drag handle, glass body. */
export function WidgetShell({ title, children, className, action }: WidgetShellProps) {
  return (
    <GlassPanel
      className={cn("flex h-full flex-col overflow-hidden p-3", className)}
      whileHover={{ boxShadow: "0 0 28px rgba(0,229,255,0.12)" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <GripVertical
          className="widget-drag-handle h-3.5 w-3.5 cursor-grab text-muted-foreground/60 hover:text-nexus"
          aria-label={`Drag ${title} widget`}
        />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </span>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </GlassPanel>
  );
}
