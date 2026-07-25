"use client";

import { create } from "zustand";
import type { AssistantMessage, AssistantStatus } from "@/types";

let messageSeq = 0;

interface AssistantState {
  status: AssistantStatus;
  messages: AssistantMessage[];
  setStatus: (status: AssistantStatus) => void;
  addMessage: (role: AssistantMessage["role"], content: string) => string;
  appendToMessage: (id: string, chunk: string) => void;
  clear: () => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  status: "idle",
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "All systems nominal. I am KREKU, your command centre intelligence. How can I assist?",
      timestamp: Date.now(),
    },
  ],
  setStatus: (status) => set({ status }),
  addMessage: (role, content) => {
    const id = `msg-${Date.now()}-${messageSeq++}`;
    set((state) => ({
      messages: [
        ...state.messages,
        { id, role, content, timestamp: Date.now() },
      ],
    }));
    return id;
  },
  appendToMessage: (id, chunk) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + chunk } : m,
      ),
    })),
  clear: () => set({ messages: [] }),
}));
