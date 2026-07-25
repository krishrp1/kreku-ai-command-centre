"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NAV_ITEMS } from "@/features/layout/nav-items";
import { ACCENTS } from "@/lib/constants";
import { useSound } from "@/hooks/use-sound";
import { useSystemStore } from "@/store/system-store";
import type { AccentId } from "@/types";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

/** ⌘K / Ctrl+K palette with keyboard navigation. */
export function CommandPalette() {
  const open = useSystemStore((s) => s.commandPaletteOpen);
  const setOpen = useSystemStore((s) => s.setCommandPaletteOpen);
  const setView = useSystemStore((s) => s.setView);
  const setAccent = useSystemStore((s) => s.setAccent);
  const setAssistantOpen = useSystemStore((s) => s.setAssistantOpen);
  const setNotificationsOpen = useSystemStore((s) => s.setNotificationsOpen);
  const playSound = useSound();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!useSystemStore.getState().commandPaletteOpen);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      // Wait a frame so the input exists before resetting and focusing.
      requestAnimationFrame(() => {
        setQuery("");
        setSelected(0);
        inputRef.current?.focus();
      });
    }
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const navigate: Command[] = NAV_ITEMS.map((item) => ({
      id: `nav-${item.id}`,
      label: `Go to ${item.label}`,
      hint: "Navigate",
      run: () => setView(item.id),
    }));
    const themes: Command[] = (Object.keys(ACCENTS) as AccentId[]).map((accent) => ({
      id: `accent-${accent}`,
      label: `Theme: ${ACCENTS[accent].label}`,
      hint: "Appearance",
      run: () => setAccent(accent),
    }));
    return [
      ...navigate,
      ...themes,
      {
        id: "assistant-open",
        label: "Launch AI Assistant",
        hint: "AI",
        run: () => setAssistantOpen(true),
      },
      {
        id: "notifications",
        label: "Open Notification Centre",
        hint: "System",
        run: () => setNotificationsOpen(true),
      },
    ];
  }, [setAccent, setAssistantOpen, setNotificationsOpen, setView]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) => command.label.toLowerCase().includes(q));
  }, [commands, query]);

  const execute = (command: Command) => {
    playSound("click");
    command.run();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[18vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="glass-strong w-full max-w-lg overflow-hidden rounded-2xl holo-border"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="h-4 w-4 text-nexus" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setSelected((s) => Math.min(s + 1, filtered.length - 1));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setSelected((s) => Math.max(s - 1, 0));
                  } else if (event.key === "Enter" && filtered[selected]) {
                    execute(filtered[selected]);
                  }
                }}
                placeholder="Type a command…"
                aria-label="Search commands"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto p-2" role="listbox">
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center font-mono text-xs text-muted-foreground">
                  No matching commands
                </li>
              )}
              {filtered.map((command, index) => (
                <li key={command.id} role="option" aria-selected={index === selected}>
                  <button
                    type="button"
                    onClick={() => execute(command)}
                    onMouseEnter={() => setSelected(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      index === selected
                        ? "bg-nexus/12 text-nexus"
                        : "text-foreground hover:bg-white/5",
                    )}
                  >
                    <span className="flex-1">{command.label}</span>
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      {command.hint}
                    </span>
                    {index === selected && (
                      <CornerDownLeft className="h-3.5 w-3.5 text-nexus" aria-hidden />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
