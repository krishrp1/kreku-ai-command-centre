"use client";

import { useEffect, useRef, useState } from "react";
import { GlassPanel } from "@/components/kreku/glass-panel";
import { TERMINAL_COMMANDS } from "@/features/terminal/terminal-commands";
import { useSound } from "@/hooks/use-sound";
import { useWeather } from "@/hooks/use-weather";
import { useLatestMetrics } from "@/store/metrics-store";
import type { TerminalLine } from "@/types";

let lineSeq = 0;
const line = (kind: TerminalLine["kind"], text: string): TerminalLine => ({
  id: `ln-${lineSeq++}`,
  kind,
  text,
});

const WELCOME = [
  line("system", "KREKU TERMINAL v5.2.1 — secure channel established"),
  line("system", "Type 'help' for available commands."),
];

/** Simulated shell with a typewriter effect on output. */
export function TerminalView() {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyRef = useRef<string[]>([]);
  const metrics = useLatestMetrics();
  const { data: weather } = useWeather();
  const playSound = useSound();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    historyRef.current = [raw, ...historyRef.current].slice(0, 40);
    setHistoryIndex(-1);
    if (command === "clear") {
      setLines([]);
      return;
    }
    const handler = TERMINAL_COMMANDS[command];
    const output = handler
      ? handler({ metrics, weather })
      : [`command not found: ${command} — try 'help'`];
    setLines((current) => [
      ...current,
      line("input", raw),
      ...output.map((text) => line("output", text)),
    ]);
  };

  return (
    <GlassPanel
      scan
      className="flex h-full min-h-[70vh] flex-col overflow-hidden p-4 font-mono text-[13px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-kreku-danger/80" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-kreku-warning/80" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-kreku-success/80" aria-hidden />
        <span className="ml-2 text-[11px] tracking-widest text-muted-foreground">
          kreku@core — /secure/ops
        </span>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-0.5 overflow-y-auto" aria-live="polite">
        {lines.map((entry) => (
          <p
            key={entry.id}
            className={
              entry.kind === "input"
                ? "text-foreground"
                : entry.kind === "system"
                  ? "text-kreku"
                  : "whitespace-pre text-muted-foreground"
            }
          >
            {entry.kind === "input" ? (
              <>
                <span className="text-kreku">❯ </span>
                {entry.text}
              </>
            ) : (
              entry.text
            )}
          </p>
        ))}
      </div>

      <form
        className="mt-2 flex items-center gap-2 border-t border-white/10 pt-2"
        onSubmit={(event) => {
          event.preventDefault();
          run(input);
          setInput("");
        }}
      >
        <span className="text-kreku" aria-hidden>
          ❯
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            playSound("key");
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              const next = Math.min(historyIndex + 1, historyRef.current.length - 1);
              if (historyRef.current[next] !== undefined) {
                setHistoryIndex(next);
                setInput(historyRef.current[next]);
              }
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              const next = historyIndex - 1;
              setHistoryIndex(Math.max(next, -1));
              setInput(next < 0 ? "" : historyRef.current[next]);
            }
          }}
          placeholder="type a command…"
          aria-label="Terminal input"
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-foreground caret-[var(--kreku-accent)] outline-none placeholder:text-muted-foreground/80"
        />
      </form>
    </GlassPanel>
  );
}
