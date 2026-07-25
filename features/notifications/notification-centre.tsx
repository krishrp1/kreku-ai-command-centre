"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellOff, CheckCheck, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { StatusDot } from "@/components/kreku/status-dot";
import { useSound } from "@/hooks/use-sound";
import { useSystemStore } from "@/store/system-store";
import { formatClock } from "@/utils/format";
import type { NotificationLevel } from "@/types";

const LEVEL_TONE: Record<NotificationLevel, "accent" | "success" | "warning" | "danger"> = {
  info: "accent",
  success: "success",
  warning: "warning",
  danger: "danger",
};

const AMBIENT_EVENTS: [string, string, NotificationLevel][] = [
  ["Uplink", "Telemetry sync completed", "success"],
  ["Security", "Perimeter probe deflected", "warning"],
  ["Core", "Neural lattice recalibrated", "info"],
  ["Power", "Output holding at optimal levels", "success"],
];

/** Slide-in notification drawer plus ambient event generator. */
export function NotificationCentre() {
  const open = useSystemStore((s) => s.notificationsOpen);
  const setOpen = useSystemStore((s) => s.setNotificationsOpen);
  const notifications = useSystemStore((s) => s.notifications);
  const pushNotification = useSystemStore((s) => s.pushNotification);
  const markAllRead = useSystemStore((s) => s.markAllRead);
  const clearNotifications = useSystemStore((s) => s.clearNotifications);
  const playSound = useSound();

  // Ambient events keep the centre alive without being spammy.
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.5) {
        const [title, body, level] =
          AMBIENT_EVENTS[Math.floor(Math.random() * AMBIENT_EVENTS.length)];
        pushNotification(title, body, level);
      }
    }, 45_000);
    return () => clearInterval(id);
  }, [pushNotification]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          aria-label="Notification centre"
          className="glass-strong fixed right-3 top-18 z-50 flex max-h-[70vh] w-80 flex-col rounded-2xl p-4 holo-border"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="font-display text-xs tracking-widest">NOTIFICATIONS</span>
            <button
              type="button"
              onClick={markAllRead}
              aria-label="Mark all as read"
              className="relative ml-auto text-muted-foreground transition-colors before:absolute before:-inset-1 before:content-[''] hover:text-kreku"
            >
              <CheckCheck className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => {
                playSound("click");
                clearNotifications();
              }}
              aria-label="Clear all notifications"
              className="relative text-muted-foreground transition-colors before:absolute before:-inset-1 before:content-[''] hover:text-kreku-danger"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
              className="relative text-muted-foreground transition-colors before:absolute before:-inset-1 before:content-[''] hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                <BellOff className="h-6 w-6" aria-hidden />
                <p className="font-mono text-xs">All clear. No notifications.</p>
              </div>
            )}
            <AnimatePresence initial={false}>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="rounded-xl border border-white/8 bg-white/4 p-3"
                >
                  <div className="flex items-center gap-2">
                    <StatusDot tone={LEVEL_TONE[notification.level]} pulse={!notification.read} />
                    <span className="text-xs font-medium text-foreground">
                      {notification.title}
                    </span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                      {formatClock(notification.timestamp)}
                    </span>
                  </div>
                  <p className="mt-1 pl-4 text-xs text-muted-foreground">{notification.body}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
