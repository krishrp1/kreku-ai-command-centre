/** Views reachable from the sidebar. The app is a single-route OS shell. */
export type ViewId =
  | "dashboard"
  | "mission"
  | "analytics"
  | "assistant"
  | "satellite"
  | "files"
  | "terminal"
  | "settings"
  | "profile";

export type AccentId = "cyan" | "blue" | "purple" | "teal" | "red";

export type BootPhase = "booting" | "online";

export type AssistantStatus = "idle" | "listening" | "thinking" | "responding";

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export type NotificationLevel = "info" | "success" | "warning" | "danger";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  level: NotificationLevel;
  timestamp: number;
  read: boolean;
}

export interface ActivityEvent {
  id: string;
  label: string;
  detail: string;
  timestamp: number;
}

/** One sample of the simulated telemetry feed driving the widgets. */
export interface MetricsSample {
  timestamp: number;
  cpu: number;
  ram: number;
  gpu: number;
  disk: number;
  networkUp: number;
  networkDown: number;
  temperature: number;
  aiLoad: number;
  power: number;
}

export interface TerminalLine {
  id: string;
  kind: "input" | "output" | "system";
  text: string;
}

export interface WeatherForecastDay {
  day: string;
  high: number;
  category: import("@/lib/weather-codes").WeatherCategory;
}

export interface WeatherData {
  city: string;
  country: string;
  tempC: number;
  condition: string;
  category: import("@/lib/weather-codes").WeatherCategory;
  forecast: WeatherForecastDay[];
}
