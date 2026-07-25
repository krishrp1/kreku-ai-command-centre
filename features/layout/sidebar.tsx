"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { NAV_ITEMS } from "@/features/layout/nav-items";
import { useSound } from "@/hooks/use-sound";
import { useSystemStore } from "@/store/system-store";
import { cn } from "@/lib/utils";

/** Icon rail that expands to labels on hover/focus. */
export function Sidebar() {
  const activeView = useSystemStore((s) => s.activeView);
  const setView = useSystemStore((s) => s.setView);
  const playSound = useSound();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.nav
      aria-label="Primary"
      className="glass-strong z-30 mx-3 my-3 hidden flex-col gap-1 self-start rounded-xl p-2 holo-border md:flex"
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: expanded ? 192 : 56 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setExpanded(false);
        }
      }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = activeView === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              playSound("click");
              setView(item.id);
            }}
            onMouseEnter={() => playSound("hover")}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex h-11 items-center gap-3 overflow-hidden rounded-lg px-2.5 text-muted-foreground transition-colors",
              "hover:bg-white/6 hover:text-foreground",
              active && "text-kreku",
            )}
          >
            {active && (
              <motion.span
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-lg bg-kreku/10 shadow-[inset_2px_0_0_var(--kreku-accent)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="relative h-5 w-5 shrink-0" aria-hidden />
            <span
              className={cn(
                "relative whitespace-nowrap text-sm transition-opacity",
                expanded ? "opacity-100" : "opacity-0",
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
