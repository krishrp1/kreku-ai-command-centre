"use client";

import { GlassPanel } from "@/components/nexus/glass-panel";
import { AssistantChat } from "@/features/assistant/assistant-chat";
import { AiCore } from "@/features/core/ai-core";
import { useAssistantStore } from "@/store/assistant-store";

/** Full-screen assistant: core visual on the left, conversation on the right. */
export function AssistantView() {
  const status = useAssistantStore((s) => s.status);

  return (
    <div className="grid h-full min-h-[70vh] gap-4 lg:grid-cols-[1fr_1.2fr]">
      <GlassPanel scan className="relative hidden min-h-[420px] overflow-hidden lg:block">
        <AiCore className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-4 font-mono text-[11px] text-muted-foreground">
          <span>CONVERSATIONAL INTERFACE</span>
          <span className="uppercase text-nexus">{status}</span>
        </div>
      </GlassPanel>
      <GlassPanel className="flex min-h-[60vh] flex-col p-4">
        <AssistantChat />
      </GlassPanel>
    </div>
  );
}
