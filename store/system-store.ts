"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AccentId,
  AppNotification,
  BootPhase,
  NotificationLevel,
  ViewId,
} from "@/types";

let notificationSeq = 0;

interface SystemState {
  bootPhase: BootPhase;
  activeView: ViewId;
  accent: AccentId;
  soundEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  /** Glass blur radius in px, user adjustable in settings. */
  glassBlur: number;
  commandPaletteOpen: boolean;
  notificationsOpen: boolean;
  assistantOpen: boolean;
  notifications: AppNotification[];

  completeBoot: () => void;
  setView: (view: ViewId) => void;
  setAccent: (accent: AccentId) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setHighContrast: (high: boolean) => void;
  setGlassBlur: (px: number) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setAssistantOpen: (open: boolean) => void;
  pushNotification: (
    title: string,
    body: string,
    level?: NotificationLevel,
  ) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      bootPhase: "booting",
      activeView: "dashboard",
      accent: "cyan",
      soundEnabled: false,
      reducedMotion: false,
      highContrast: false,
      glassBlur: 18,
      commandPaletteOpen: false,
      notificationsOpen: false,
      assistantOpen: true,
      notifications: [],

      completeBoot: () => set({ bootPhase: "online" }),
      setView: (activeView) => set({ activeView }),
      setAccent: (accent) => set({ accent }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setGlassBlur: (glassBlur) => set({ glassBlur }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
      setNotificationsOpen: (notificationsOpen) => set({ notificationsOpen }),
      setAssistantOpen: (assistantOpen) => set({ assistantOpen }),
      pushNotification: (title, body, level = "info") =>
        set((state) => ({
          notifications: [
            {
              id: `ntf-${Date.now()}-${notificationSeq++}`,
              title,
              body,
              level,
              timestamp: Date.now(),
              read: false,
            },
            ...state.notifications,
          ].slice(0, 50),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "kreku-system",
      partialize: (state) => ({
        accent: state.accent,
        soundEnabled: state.soundEnabled,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
        glassBlur: state.glassBlur,
      }),
    },
  ),
);
