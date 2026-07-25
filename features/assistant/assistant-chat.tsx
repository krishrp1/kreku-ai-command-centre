"use client";

import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SUGGESTED_PROMPTS, sendToAssistant } from "@/features/assistant/assistant-engine";
import { VoiceWaveform } from "@/features/assistant/voice-waveform";
import { useSound } from "@/hooks/use-sound";
import { useAssistantStore } from "@/store/assistant-store";
import { cn } from "@/lib/utils";

/** Shared chat body used by both the floating panel and the full view. */
export function AssistantChat({ className }: { className?: string }) {
  const messages = useAssistantStore((s) => s.messages);
  const status = useAssistantStore((s) => s.status);
  const [input, setInput] = useState("");
  const playSound = useSound();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const busy = status === "thinking" || status === "responding";

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    playSound("click");
    setInput("");
    sendToAssistant(trimmed);
  };

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
              message.role === "assistant"
                ? "border border-nexus/20 bg-nexus/8 text-foreground"
                : "ml-auto bg-white/8 text-foreground",
            )}
          >
            {message.content}
            {message.role === "assistant" &&
              status === "responding" &&
              message === messages[messages.length - 1] && (
                <span className="ml-1 inline-block h-3.5 w-1.5 animate-nexus-pulse bg-nexus align-middle" />
              )}
          </motion.div>
        ))}
        {status === "thinking" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-fit items-center gap-1.5 rounded-xl border border-nexus/20 bg-nexus/8 px-3 py-2"
            aria-label="Assistant is thinking"
          >
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-nexus"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => submit(prompt)}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-nexus/50 hover:text-nexus"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <VoiceWaveform status={status} className="w-16 shrink-0" />
        <form
          className="flex min-w-0 flex-1 items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            submit(input);
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={busy ? "NEXUS is responding…" : "Ask NEXUS anything…"}
            disabled={busy}
            aria-label="Message NEXUS"
            className="h-9 min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-nexus/60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-nexus/40 bg-nexus/10 text-nexus transition-all hover:glow-accent disabled:opacity-40"
          >
            <SendHorizonal className="h-4 w-4" aria-hidden />
          </button>
        </form>
      </div>
    </div>
  );
}
