import { useAssistantStore } from "@/store/assistant-store";
import { useMetricsStore } from "@/store/metrics-store";
import type { MetricsSample } from "@/types";

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

/**
 * Streams a reply from /api/chat (Gemini API via Google AI Studio) into the
 * given assistant message. Returns false when the server has no API key,
 * the request fails, or the stream produced no text — the caller falls
 * back to the offline engine in every one of those cases.
 */
export async function streamFromApi(id: string): Promise<boolean> {
  const { messages, appendToMessage, setStatus, setApiUnavailable } = useAssistantStore.getState();
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
    setApiUnavailable(true);
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
