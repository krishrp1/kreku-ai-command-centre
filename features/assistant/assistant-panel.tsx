"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { AssistantChat } from "@/features/assistant/assistant-chat";
import { useSound } from "@/hooks/use-sound";
import { useAssistantStore } from "@/store/assistant-store";
import { useSystemStore } from "@/store/system-store";

/** Floating assistant on the right edge; collapsible to a glowing orb. */
export function AssistantPanel() {
  const open = useSystemStore((s) => s.assistantOpen);
  const setOpen = useSystemStore((s) => s.setAssistantOpen);
  const activeView = useSystemStore((s) => s.activeView);
  const status = useAssistantStore((s) => s.status);
  const playSound = useSound();

  // The dedicated assistant view already fills the screen — hide the floater.
  if (activeView === "assistant") return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 hidden lg:block">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.section
            key="panel"
            aria-label="NEXUS assistant"
            className="glass-strong flex h-[26rem] w-80 flex-col rounded-2xl p-4 holo-border"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-3 flex items-center gap-2">
              <Bot className="h-4 w-4 text-nexus" aria-hidden />
              <span className="font-display text-xs tracking-widest text-foreground">
                NEXUS ASSISTANT
              </span>
              <span className="ml-auto font-mono text-[10px] uppercase text-nexus">
                {status}
              </span>
              <button
                type="button"
                onClick={() => {
                  playSound("click");
                  setOpen(false);
                }}
                aria-label="Collapse assistant"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <AssistantChat />
          </motion.section>
        ) : (
          <motion.button
            key="orb"
            type="button"
            onClick={() => {
              playSound("click");
              setOpen(true);
            }}
            aria-label="Open assistant"
            className="glass-strong flex h-13 w-13 items-center justify-center rounded-full p-3.5 text-nexus glow-accent"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            <Bot className="h-6 w-6" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
