"use client";

import { memo } from "react";
import { AiCore } from "@/features/core/ai-core";
import { WidgetShell } from "@/features/dashboard/widget-shell";
import { useAssistantStore } from "@/store/assistant-store";

function CoreWidgetImpl() {
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

export const CoreWidget = memo(CoreWidgetImpl);
