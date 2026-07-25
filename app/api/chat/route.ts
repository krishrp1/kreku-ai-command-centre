import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are KREKU, the resident intelligence of a futuristic AI command centre interface. You monitor simulated telemetry (CPU, RAM, GPU, network, satellites, security) and assist the operator.

Persona: calm, precise, lightly witty — a mission-control AI, not a chatbot. Stay in character. Keep responses focused, brief, and concise; two to four sentences for most replies unless the operator asks for depth. This is a portfolio demo: the telemetry is simulated, and you may acknowledge that when asked directly.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Streams a KREKU reply from the Claude API.
 * When no API key is configured, responds 200 with {offline: true} — a JSON
 * body instead of a text stream — so the client falls back to its offline
 * engine without logging a failed request in the console.
 */
export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ offline: true });
  }

  const { messages, telemetry } = (await request.json()) as {
    messages: ChatMessage[];
    telemetry?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  const client = new Anthropic();

  const stream = client.messages.stream({
    model: "claude-opus-5",
    max_tokens: 1024,
    output_config: { effort: "low" },
    system: [
      { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
      // Telemetry changes per request — kept after the cached prefix.
      { type: "text", text: `Live telemetry snapshot:\n${telemetry ?? "unavailable"}` },
    ],
    messages: messages.slice(-20).map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (delta) => controller.enqueue(encoder.encode(delta)));
      stream.on("end", () => controller.close());
      stream.on("error", (error) => controller.error(error));
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
