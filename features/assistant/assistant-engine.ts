"use client";

import { streamFromApi } from "@/features/assistant/assistant-api";
import { streamOffline } from "@/features/assistant/assistant-offline-engine";
import { useAssistantStore } from "@/store/assistant-store";

/**
 * Reply pipeline: try the /api/chat route (Gemini API via Google AI Studio, streaming).
 * When the server has no API key or the request fails, fall back to
 * the offline engine so the demo works without any configuration.
 */
export function sendToAssistant(input: string) {
  const { addMessage, setStatus, apiUnavailable } = useAssistantStore.getState();
  addMessage("user", input);
  setStatus("thinking");
  const id = addMessage("assistant", "");

  const runOffline = () => {
    // Small pause keeps the "thinking" state readable.
    setTimeout(() => streamOffline(id), 700);
  };

  if (apiUnavailable) {
    runOffline();
    return;
  }

  streamFromApi(id)
    .then((succeeded) => {
      if (succeeded) {
        useAssistantStore.getState().setStatus("idle");
      } else {
        runOffline();
      }
    })
    .catch(runOffline);
}

export const SUGGESTED_PROMPTS = [
  "Run a system status report",
  "How's the CPU doing?",
  "Check satellite telemetry",
  "Who are you?",
];
