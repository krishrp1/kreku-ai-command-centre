import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are KREKU, the resident intelligence of a futuristic AI command centre interface. You monitor simulated telemetry (CPU, RAM, GPU, network, satellites, security) and assist the operator.

Persona: calm, precise, lightly witty — a mission-control AI, not a chatbot. Stay in character. Keep responses focused, brief, and concise; two to four sentences for most replies unless the operator asks for depth. This is a portfolio demo: the telemetry is simulated, and you may acknowledge that when asked directly.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY = 20;

/**
 * Per-IP sliding-window limiter — this route is billable, and the site has
 * no auth. Set below Google's free-tier quota (observed: 5 req/min for this
 * model) so our own limiter degrades requests gracefully before Google's
 * quota wall does.
 */
const RATE_LIMIT = 4;
const RATE_WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

function isValidMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const { role, content } = value as { role?: unknown; content?: unknown };
  return (role === "user" || role === "assistant") && typeof content === "string";
}

/**
 * Streams a KREKU reply from the Gemini API (Google AI Studio key).
 * When no API key is configured, responds 200 with {offline: true} — a JSON
 * body instead of a text stream — so the client falls back to its offline
 * engine without logging a failed request in the console. Provider errors
 * and rate limits also degrade to the offline engine client-side, but never
 * leak Google's raw error payload into logs or the response body.
 */
export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ offline: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  const payload = (await request.json().catch(() => null)) as {
    messages?: unknown;
    telemetry?: unknown;
  } | null;

  if (!payload || !Array.isArray(payload.messages) || payload.messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  const messages = payload.messages.filter(isValidMessage).map((m) => ({
    role: m.role,
    content: m.content.slice(0, MAX_MESSAGE_LENGTH),
  }));
  if (messages.length === 0) {
    return NextResponse.json({ error: "no valid messages" }, { status: 400 });
  }

  const telemetry = typeof payload.telemetry === "string" ? payload.telemetry : "unavailable";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const stream = await ai.models.generateContentStream({
      model: "gemini-flash-latest",
      config: {
        systemInstruction: `${SYSTEM_PROMPT}\n\nLive telemetry snapshot:\n${telemetry}`,
        maxOutputTokens: 1024,
      },
      contents: messages.slice(-MAX_HISTORY).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (error) {
          // Mid-stream provider failure — log detail server-side only.
          console.error("Gemini stream error:", error);
          controller.close();
        }
      },
    });

    return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    // Request never reached streaming (bad key, quota, network) — same
    // deal: keep Google's raw error payload out of logs and the response.
    console.error("Gemini request error:", error);
    return NextResponse.json({ error: "generation failed" }, { status: 502 });
  }
}
