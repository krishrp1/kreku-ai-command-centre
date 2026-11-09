import { describe, expect, it } from "vitest";
import { getClientIp } from "@/lib/client-ip";

function req(headers: Record<string, string>) {
  return new Request("http://localhost/api/x", { headers });
}

describe("getClientIp", () => {
  it("uses the last x-forwarded-for hop, which the client cannot forge", () => {
    expect(getClientIp(req({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" }))).toBe("203.0.113.9");
  });

  it("works with a single hop", () => {
    expect(getClientIp(req({ "x-forwarded-for": "203.0.113.9" }))).toBe("203.0.113.9");
  });

  it("falls back to x-real-ip, then unknown", () => {
    expect(getClientIp(req({ "x-real-ip": "198.51.100.1" }))).toBe("198.51.100.1");
    expect(getClientIp(req({}))).toBe("unknown");
  });
});
