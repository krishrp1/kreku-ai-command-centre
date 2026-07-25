export type WeatherCategory =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunderstorm";

interface WeatherCodeInfo {
  label: string;
  category: WeatherCategory;
}

/** WMO weather codes, as returned by Open-Meteo. */
const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { label: "Clear sky", category: "clear" },
  1: { label: "Mainly clear", category: "clear" },
  2: { label: "Partly cloudy", category: "partly-cloudy" },
  3: { label: "Overcast", category: "cloudy" },
  45: { label: "Fog", category: "fog" },
  48: { label: "Fog", category: "fog" },
  51: { label: "Light drizzle", category: "drizzle" },
  53: { label: "Drizzle", category: "drizzle" },
  55: { label: "Dense drizzle", category: "drizzle" },
  56: { label: "Freezing drizzle", category: "drizzle" },
  57: { label: "Freezing drizzle", category: "drizzle" },
  61: { label: "Light rain", category: "rain" },
  63: { label: "Rain", category: "rain" },
  65: { label: "Heavy rain", category: "rain" },
  66: { label: "Freezing rain", category: "rain" },
  67: { label: "Freezing rain", category: "rain" },
  71: { label: "Light snow", category: "snow" },
  73: { label: "Snow", category: "snow" },
  75: { label: "Heavy snow", category: "snow" },
  77: { label: "Snow grains", category: "snow" },
  80: { label: "Rain showers", category: "rain" },
  81: { label: "Rain showers", category: "rain" },
  82: { label: "Violent rain showers", category: "rain" },
  85: { label: "Snow showers", category: "snow" },
  86: { label: "Snow showers", category: "snow" },
  95: { label: "Thunderstorm", category: "thunderstorm" },
  96: { label: "Thunderstorm with hail", category: "thunderstorm" },
  99: { label: "Thunderstorm with hail", category: "thunderstorm" },
};

export function describeWeatherCode(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? { label: "Unknown", category: "cloudy" };
}
