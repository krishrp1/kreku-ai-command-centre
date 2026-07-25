"use client";

import { useAssistantStore } from "@/store/assistant-store";
import { useMetricsStore } from "@/store/metrics-store";
import type { MetricsSample } from "@/types";

/**
 * Reply pipeline: try the /api/chat route (real Claude API, streaming).
 * When the server has no API key (501) or the request fails, fall back to
 * the offline engine so the demo works without any configuration.
 */

// Sticky flag: once the server says "no key", stop asking it.
let apiUnavailable = false;

function formatTelemetry(metrics: MetricsSample) {
  return [
    `CPU ${Math.round(metrics.cpu)}%`,
    `RAM ${Math.round(metrics.ram)}%`,
    `GPU ${Math.round(metrics.gpu)}%`,
    `core temp ${Math.round(metrics.temperature)}°C`,
    `network down ${Math.round(metrics.networkDown)} MB/s, up ${Math.round(metrics.networkUp)} MB/s`,
    `AI load ${Math.round(metrics.aiLoad)}%`,
    `power ${Math.round(metrics.power)}%`,
  ].join(", ");
}

async function streamFromApi(id: string): Promise<boolean> {
  const { messages, appendToMessage, setStatus } = useAssistantStore.getState();
  const metrics = useMetricsStore.getState().history.at(-1);

  const history = messages
    .filter((m) => m.id !== id && m.content.trim() !== "")
    .map((m) => ({ role: m.role, content: m.content }));

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: history,
      telemetry: metrics ? formatTelemetry(metrics) : undefined,
    }),
  });

  if (!response.ok || !response.body) return false;
  // A JSON body means the server has no API key — permanent for this session.
  if (response.headers.get("content-type")?.includes("application/json")) {
    apiUnavailable = true;
    return false;
  }

  setStatus("responding");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let receivedAnything = false;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) {
      receivedAnything = true;
      appendToMessage(id, chunk);
    }
  }
  return receivedAnything;
}

// ---------------------------------------------------------------------------
// Offline engine — pattern-matched, telemetry-aware simulated intelligence.
// ---------------------------------------------------------------------------

type Responder = (input: string, metrics: MetricsSample) => string | null;

const OFFLINE_RESPONDERS: Responder[] = [
  (input, m) =>
    /status|health|report|how.*(system|things|everything)/i.test(input)
      ? `Full sweep complete. CPU at ${Math.round(m.cpu)}%, RAM ${Math.round(m.ram)}%, GPU ${Math.round(m.gpu)}%, core temperature ${Math.round(m.temperature)}°C. ${
          m.temperature > 75
            ? "Thermals are running warm — I'm increasing coolant flow."
            : "All parameters within nominal bounds."
        }`
      : null,
  (input, m) =>
    /cpu|processor/i.test(input)
      ? `CPU load is currently ${Math.round(m.cpu)}%. ${
          m.cpu > 80 ? "That spike is the neural lattice re-indexing — it will settle shortly." : "Plenty of headroom."
        }`
      : null,
  (input, m) =>
    /ram|memory/i.test(input)
      ? `Memory sits at ${Math.round(m.ram)}% utilisation. I archive cold pages automatically, so no intervention needed.`
      : null,
  (input, m) =>
    /gpu|graphics/i.test(input)
      ? `GPU utilisation is ${Math.round(m.gpu)}% — mostly holographic rendering and my own inference batches.`
      : null,
  (input, m) =>
    /network|internet|connection|uplink/i.test(input)
      ? `Uplink is healthy: ${Math.round(m.networkDown)} MB/s down, ${Math.round(m.networkUp)} MB/s up, latency 11 ms via Helios Relay.`
      : null,
  (input, m) =>
    /temp|heat|cooling/i.test(input)
      ? `Core temperature reads ${Math.round(m.temperature)}°C. ${
          m.temperature > 75 ? "Warmer than I'd like — throttling non-critical subsystems." : "Cooling loops are performing well."
        }`
      : null,
  (input) =>
    /weather/i.test(input)
      ? "Current conditions: 18°C and partly cloudy. Light rain expected Monday — I'd reschedule any exterior drone maintenance."
      : null,
  (input) =>
    /satellite|orbit/i.test(input)
      ? "Three orbital assets tracked. KH-7 Keystone and Vanta-3 report healthy telemetry; Helios Relay shows minor signal degradation I'm compensating for."
      : null,
  (input) =>
    /security|threat|firewall|intrusion/i.test(input)
      ? "Perimeter is secure. Firewall active, zero intrusions in 24 hours, one deflected probe on port 443. Encryption keys rotated on schedule."
      : null,
  (input) => (/(^|\s)(hi|hello|hey)\b/i.test(input) ? "Hello. KREKU core online and listening. What would you like me to do?" : null),
  (input) =>
    /who are you|your name|what are you/i.test(input)
      ? "I am KREKU — this command centre's resident intelligence. I monitor telemetry, coordinate subsystems, and occasionally judge your taste in music."
      : null,
  (input) =>
    /time|date|today/i.test(input)
      ? `Ship time is ${new Date().toLocaleTimeString("en-GB")} on ${new Date().toDateString()}.`
      : null,
  (input) =>
    /thank|thanks|cheers/i.test(input) ? "Always. I'll be here — I don't really have anywhere else to be." : null,
  (input) =>
    /real|fake|simulated|demo/i.test(input)
      ? "Candidly? The telemetry is simulated — this is a portfolio demonstration. My charm, however, is entirely genuine. Connect an ANTHROPIC_API_KEY and I get a real brain."
      : null,
];

function offlineReply(input: string): string {
  const metrics = useMetricsStore.getState().history.at(-1);
  if (metrics) {
    for (const responder of OFFLINE_RESPONDERS) {
      const reply = responder(input, metrics);
      if (reply) return reply;
    }
  }
  // Echo the topic back so unmatched inputs still feel heard.
  const topic = input.trim().replace(/[?.!]+$/, "");
  const preview = topic.length > 60 ? `${topic.slice(0, 57)}…` : topic;
  return `I've logged "${preview}" but my offline reasoning module is limited — I can discuss system status, subsystems, satellites, security, or weather. For open conversation, the operator can connect an ANTHROPIC_API_KEY to bring my full intelligence online.`;
}

function streamOffline(id: string) {
  const { appendToMessage, setStatus } = useAssistantStore.getState();
  const input = useAssistantStore
    .getState()
    .messages.filter((m) => m.role === "user")
    .at(-1)?.content;
  const words = offlineReply(input ?? "").split(" ");

  setStatus("responding");
  let index = 0;
  const interval = setInterval(() => {
    appendToMessage(id, (index === 0 ? "" : " ") + words[index]);
    index += 1;
    if (index >= words.length) {
      clearInterval(interval);
      setStatus("idle");
    }
  }, 40);
}

export function sendToAssistant(input: string) {
  const { addMessage, setStatus } = useAssistantStore.getState();
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
