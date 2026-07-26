import { NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/rate-limit";
import { describeWeatherCode } from "@/lib/weather-codes";
import type { WeatherData } from "@/types";

export const runtime = "nodejs";

const FETCH_TIMEOUT_MS = 5000;
const CACHE_TTL_MS = 10 * 60_000;
const MAX_CACHE_ENTRIES = 2000;

// Public, no auth. The cache alone doesn't stop an attacker from rotating
// X-Forwarded-For to bypass it and hammer the (free-tier) upstream services.
const isRateLimited = createRateLimiter({ limit: 20, windowMs: 60_000 });

// Used for local dev / private IPs, where there's nothing real to geolocate.
const DEFAULT_LOCATION = { city: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 };

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const cache = new Map<string, { data: WeatherData; expiresAt: number }>();

function isPrivateIp(ip: string): boolean {
  return (
    ip === "unknown" ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    /^10\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

async function geolocateIp(ip: string) {
  if (isPrivateIp(ip)) return DEFAULT_LOCATION;
  try {
    const res = await fetch(`https://ipwho.is/${ip}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const json = await res.json();
    if (!json.success || typeof json.latitude !== "number") return DEFAULT_LOCATION;
    return {
      city: json.city ?? DEFAULT_LOCATION.city,
      country: json.country ?? DEFAULT_LOCATION.country,
      lat: json.latitude,
      lon: json.longitude,
    };
  } catch (error) {
    console.error("Weather geolocation error:", error);
    return DEFAULT_LOCATION;
  }
}

async function fetchForecast(lat: number, lon: number) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("daily", "temperature_2m_max,weather_code");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "5");

  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`open-meteo ${res.status}`);
  return res.json();
}

/**
 * Real weather for wherever the visitor actually is: geolocate their IP
 * (free, key-less lookup), then pull live conditions from Open-Meteo (also
 * key-less). Cached per IP for a few minutes so repeat loads don't hammer
 * either upstream service. Always resolves to usable data — geolocation or
 * forecast failures fall back to a fixed default location rather than
 * surfacing an error to the widget.
 */
export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  const cached = cache.get(ip);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  if (cache.size > MAX_CACHE_ENTRIES) {
    const now = Date.now();
    for (const [key, entry] of cache) {
      if (entry.expiresAt <= now) cache.delete(key);
    }
  }

  const location = await geolocateIp(ip);

  let data: WeatherData;
  try {
    const forecast = await fetchForecast(location.lat, location.lon);
    const current = describeWeatherCode(forecast.current.weather_code);

    const days: WeatherData["forecast"] = forecast.daily.time
      .slice(1, 5)
      .map((iso: string, i: number) => {
        const date = new Date(iso);
        const code = forecast.daily.weather_code[i + 1];
        return {
          day: DAY_LABELS[date.getUTCDay()],
          high: Math.round(forecast.daily.temperature_2m_max[i + 1]),
          category: describeWeatherCode(code).category,
        };
      });

    data = {
      city: location.city,
      country: location.country,
      tempC: Math.round(forecast.current.temperature_2m),
      condition: current.label,
      category: current.category,
      forecast: days,
    };
  } catch (error) {
    console.error("Weather forecast error:", error);
    data = {
      city: location.city,
      country: location.country,
      tempC: 18,
      condition: "Partly cloudy",
      category: "partly-cloudy",
      forecast: [],
    };
  }

  cache.set(ip, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return NextResponse.json(data);
}
