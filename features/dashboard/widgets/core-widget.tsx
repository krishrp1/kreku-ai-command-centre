"use client";

import { AiCore } from "@/features/core/ai-core";
import { WidgetShell } from "@/features/dashboard/widget-shell";
import { useAssistantStore } from "@/store/assistant-store";

export function CoreWidget() {
  const status = useAssistantStore((s) => s.status);
  return (
    <WidgetShell
      title="Kreku Core"
      action={
        <span className="font-mono text-[10px] uppercase text-kreku">{status}</span>
      }
    >
      <AiCore className="h-full w-full" bloom={false} />
    </WidgetShell>
  );
}
