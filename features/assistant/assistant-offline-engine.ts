import { useAssistantStore } from "@/store/assistant-store";
import { useMetricsStore } from "@/store/metrics-store";
import type { MetricsSample } from "@/types";

/**
 * Pattern-matched, telemetry-aware simulated intelligence — used when the
 * server has no Gemini API key configured or the live request fails, so the
 * demo works fully without any setup.
 */

type Responder = (input: string, metrics: MetricsSample) => string | null;

const OFFLINE_RESPONDERS: Responder[] = [
  (input, m) =>
    /status|health|report|how.*(system|things|everything)/i.test(input)
      ? `Quick check: CPU's at ${Math.round(m.cpu)}%, RAM ${Math.round(m.ram)}%, GPU ${Math.round(m.gpu)}%, running ${Math.round(m.temperature)}°C. ${
          m.temperature > 75
            ? "A bit warmer than I'd like, so I'm pushing more coolant through."
            : "Nothing worth losing sleep over."
        }`
      : null,
  (input, m) =>
    /cpu|processor/i.test(input)
      ? `CPU's sitting at ${Math.round(m.cpu)}%. ${
          m.cpu > 80 ? "That's the neural lattice churning through something — should ease off soon." : "Nothing taxing it right now."
        }`
      : null,
  (input, m) =>
    /ram|memory/i.test(input)
      ? `Memory's at ${Math.round(m.ram)}%. I clear out cold pages on my own, so it's not something you need to think about.`
      : null,
  (input, m) =>
    /gpu|graphics/i.test(input)
      ? `GPU's at ${Math.round(m.gpu)}% — mostly rendering this interface and chewing through my own inference.`
      : null,
  (input, m) =>
    /network|internet|connection|uplink/i.test(input)
      ? `Uplink's fine — ${Math.round(m.networkDown)} MB/s down, ${Math.round(m.networkUp)} MB/s up, latency's around 11ms through Helios Relay.`
      : null,
  (input, m) =>
    /temp|heat|cooling/i.test(input)
      ? `Running at ${Math.round(m.temperature)}°C. ${
          m.temperature > 75 ? "Warmer than I'd like, so I'm throttling anything non-essential." : "Cooling's keeping up fine."
        }`
      : null,
  (input) =>
    /weather/i.test(input)
      ? "18°C, partly cloudy. Rain's coming Monday, so maybe hold off on anything outdoors till then."
      : null,
  (input) =>
    /satellite|orbit/i.test(input)
      ? "Three birds up there. KH-7 and Vanta-3 are solid; Helios Relay's a bit noisy but I'm compensating for it."
      : null,
  (input) =>
    /security|threat|firewall|intrusion/i.test(input)
      ? "All clear — firewall's up, nothing's gotten through in a day. One probe got deflected on 443 earlier, nothing to worry about."
      : null,
  (input) => (/(^|\s)(hi|hello|hey)\b/i.test(input) ? "Hey. What's up?" : null),
  (input) =>
    /who are you|your name|what are you/i.test(input)
      ? "KREKU — I keep this place running and occasionally have opinions about your music taste."
      : null,
  (input) =>
    /time|date|today/i.test(input)
      ? `It's ${new Date().toLocaleTimeString("en-GB")}, ${new Date().toDateString()}.`
      : null,
  (input) =>
    /thank|thanks|cheers/i.test(input) ? "Anytime. Not like I'm going anywhere." : null,
  (input) =>
    /real|fake|simulated|demo/i.test(input)
      ? "Yeah, the telemetry's all made up — this is a portfolio piece, not a real command centre. Wake my smarter side up and the conversation gets a lot less scripted, though."
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
  return `I've logged "${preview}" but I'm running on backup thinking right now — I can still cover system status, subsystems, satellites, security, or weather. For real conversation, someone with the keys needs to wake up my full mind.`;
}

export function streamOffline(id: string) {
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
