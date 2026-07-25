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

/**
 * Streams a KREKU reply from the Gemini API (Google AI Studio key).
 * When no API key is configured, responds 200 with {offline: true} — a JSON
 * body instead of a text stream — so the client falls back to its offline
 * engine without logging a failed request in the console.
 */
export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ offline: true });
  }

  const { messages, telemetry } = (await request.json()) as {
    messages: ChatMessage[];
    telemetry?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const stream = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `${SYSTEM_PROMPT}\n\nLive telemetry snapshot:\n${telemetry ?? "unavailable"}`,
      maxOutputTokens: 1024,
    },
    contents: messages.slice(-20).map((m) => ({
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
        controller.error(error);
      }
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
