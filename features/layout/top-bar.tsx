"use client";

import { motion } from "framer-motion";
import {
  BatteryFull,
  Bell,
  Cloud,
  Search,
  Wifi,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { useClock } from "@/hooks/use-clock";
import { useSound } from "@/hooks/use-sound";
import { useLatestMetrics } from "@/store/metrics-store";
import { useSystemStore } from "@/store/system-store";
import { useAssistantStore } from "@/store/assistant-store";
import { StatusDot } from "@/components/kreku/status-dot";
import { cn } from "@/lib/utils";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function TopBar() {
  const now = useClock();
  const metrics = useLatestMetrics();
  const playSound = useSound();
  const assistantStatus = useAssistantStore((s) => s.status);
  const notifications = useSystemStore((s) => s.notifications);
  const setNotificationsOpen = useSystemStore((s) => s.setNotificationsOpen);
  const notificationsOpen = useSystemStore((s) => s.notificationsOpen);
  const setCommandPaletteOpen = useSystemStore((s) => s.setCommandPaletteOpen);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <motion.header
      className="glass-strong relative z-30 mx-3 mt-3 flex h-12 items-center gap-3 rounded-xl px-4 holo-border"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="font-display text-sm font-bold tracking-[0.25em] text-kreku text-glow">
        {APP_NAME}
      </span>

      <div className="hidden items-center gap-2 md:flex">
        <StatusDot tone="success" />
        <span className="font-mono text-xs text-muted-foreground">
          SYSTEMS NOMINAL
        </span>
      </div>

      <div className="hidden items-center gap-2 lg:flex">
        <StatusDot tone={assistantStatus === "idle" ? "accent" : "warning"} />
        <span className="font-mono text-xs uppercase text-muted-foreground">
          AI {assistantStatus}
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          playSound("click");
          setCommandPaletteOpen(true);
        }}
        className="ml-auto flex h-8 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs text-muted-foreground transition-all hover:border-kreku/50 hover:text-foreground"
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="hidden items-center gap-1.5 text-muted-foreground md:flex">
        <Cloud className="h-4 w-4" aria-hidden />
        <span className="font-mono text-xs">18°C</span>
      </div>

      <div className="hidden items-center gap-1.5 text-muted-foreground sm:flex">
        <Wifi className="h-4 w-4 text-kreku" aria-hidden />
        <BatteryFull className="h-4 w-4 text-kreku-success" aria-hidden />
        <span className="font-mono text-xs">{Math.round(metrics.power)}%</span>
      </div>

      <button
        type="button"
        onClick={() => {
          playSound("click");
          setNotificationsOpen(!notificationsOpen);
        }}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-all hover:border-kreku/50 hover:text-foreground"
        aria-label={`Notifications, ${unread} unread`}
      >
        <Bell className="h-4 w-4" aria-hidden />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-kreku-danger px-1 font-mono text-[10px] text-white">
            {unread}
          </span>
        )}
      </button>

      <div className="flex flex-col items-end leading-tight">
        <span
          className={cn(
            "font-mono text-xs text-foreground tabular-nums",
            !now && "opacity-0",
          )}
        >
          {now ? timeFormat.format(now) : "00:00:00"}
        </span>
        <span className="hidden font-mono text-[10px] text-muted-foreground sm:block">
          {now ? dateFormat.format(now) : ""}
        </span>
      </div>

      <div
        className="flex h-8 w-8 items-center justify-center rounded-full border border-kreku/40 bg-kreku/10 font-display text-xs font-bold text-kreku"
        aria-label="User avatar"
      >
        KP
      </div>
    </motion.header>
  );
}
