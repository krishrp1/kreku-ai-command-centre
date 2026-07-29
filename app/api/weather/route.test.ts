import { afterEach, describe, expect, it, vi } from "vitest";

function request(ip: string) {
  return new Request("http://localhost/api/weather", {
    headers: { "x-forwarded-for": ip },
  });
}

const FORECAST_RESPONSE = {
  current: { temperature_2m: 21, weather_code: 1 },
  daily: {
    time: ["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-04", "2026-01-05"],
    weather_code: [1, 2, 3, 61, 71],
    temperature_2m_max: [20, 19, 18, 17, 16],
  },
};

describe("GET /api/weather", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("falls back to the default location + a fixed condition when the forecast fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );
    const { GET } = await import("./route");

    // A private IP skips geolocation, so the only network call is the
    // forecast fetch above, which we've made fail.
    const res = await GET(request("10.0.0.1"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toMatchObject({
      city: "London",
      country: "United Kingdom",
      tempC: 18,
      condition: "Partly cloudy",
      forecast: [],
    });
  });

  it("returns real forecast data on a successful upstream response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => FORECAST_RESPONSE,
      }),
    );
    const { GET } = await import("./route");

    const res = await GET(request("10.0.0.2"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.tempC).toBe(21);
    expect(data.forecast).toHaveLength(4);
  });

  it("rate limits after the per-IP request budget is exhausted", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => FORECAST_RESPONSE,
      }),
    );
    const { GET } = await import("./route");
    const ip = "10.0.0.3";

    let lastStatus = 0;
    for (let i = 0; i < 21; i++) {
      const res = await GET(request(ip));
      lastStatus = res.status;
    }

    expect(lastStatus).toBe(429);
  });
});
