"use client";

import { useAssistantStore } from "@/store/assistant-store";

const RESPONSES: { pattern: RegExp; reply: string }[] = [
  {
    pattern: /status|health|system/i,
    reply:
      "All primary systems are nominal. CPU load is within expected bounds, the neural lattice is stable, and no security anomalies have been detected in the last 24 hours.",
  },
  {
    pattern: /weather/i,
    reply:
      "Current conditions: 18°C and partly cloudy. Expect light rain Monday — I would recommend rescheduling any exterior drone maintenance.",
  },
  {
    pattern: /satellite|orbit/i,
    reply:
      "Three orbital assets are currently tracked. KH-7 Keystone and Vanta-3 report healthy telemetry; Helios Relay shows minor signal degradation that I am compensating for.",
  },
  {
    pattern: /hello|hi|hey/i,
    reply: "Hello. KREKU core online and listening. What would you like me to do?",
  },
  {
    pattern: /who are you|your name/i,
    reply:
      "I am KREKU — the command centre's resident intelligence. I monitor telemetry, coordinate subsystems, and occasionally judge your taste in music.",
  },
];

const FALLBACKS = [
  "Understood. I've logged that request and queued the relevant subsystems for analysis.",
  "Processing complete. No anomalies detected in relation to your query.",
  "I've cross-referenced that against mission archives — everything checks out.",
  "Acknowledged. Diagnostic routines report optimal parameters across the board.",
];

function pickReply(input: string) {
  const match = RESPONSES.find((r) => r.pattern.test(input));
  return match?.reply ?? FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

/**
 * Simulates a streaming AI reply: thinking pause, then word-by-word chunks.
 * Drives the shared assistant store so every surface stays in sync.
 */
export function sendToAssistant(input: string) {
  const { addMessage, appendToMessage, setStatus } = useAssistantStore.getState();
  addMessage("user", input);
  setStatus("thinking");

  const reply = pickReply(input);
  const words = reply.split(" ");

  setTimeout(() => {
    setStatus("responding");
    const id = addMessage("assistant", "");
    let index = 0;
    const interval = setInterval(() => {
      appendToMessage(id, (index === 0 ? "" : " ") + words[index]);
      index += 1;
      if (index >= words.length) {
        clearInterval(interval);
        setStatus("idle");
      }
    }, 45);
  }, 900);
}

export const SUGGESTED_PROMPTS = [
  "Run a system status report",
  "What's the weather looking like?",
  "Check satellite telemetry",
  "Who are you?",
];
