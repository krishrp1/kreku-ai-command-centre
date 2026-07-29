import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContentStream: vi.fn().mockImplementation(async function* () {
        yield { text: "hi" };
      }),
    },
  })),
}));

const ORIGINAL_KEY = process.env.GEMINI_API_KEY;

function request(body: unknown, ip: string) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

describe("POST /api/chat", () => {
  afterEach(() => {
    process.env.GEMINI_API_KEY = ORIGINAL_KEY;
  });

  it("responds with {offline: true} when no API key is configured", async () => {
    delete process.env.GEMINI_API_KEY;
    const { POST } = await import("./route");

    const res = await POST(request({ messages: [{ role: "user", content: "hi" }] }, "9.9.9.1"));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ offline: true });
  });

  it("rejects a request with no messages", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const { POST } = await import("./route");

    const res = await POST(request({ messages: [] }, "9.9.9.2"));

    expect(res.status).toBe(400);
  });

  it("rate limits after the per-IP request budget is exhausted", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const { POST } = await import("./route");
    const ip = "9.9.9.3";
    const body = { messages: [{ role: "user", content: "hi" }] };

    let lastStatus = 0;
    for (let i = 0; i < 6; i++) {
      const res = await POST(request(body, ip));
      lastStatus = res.status;
    }

    expect(lastStatus).toBe(429);
  });
});
