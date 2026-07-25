import { APP_NAME } from "@/lib/constants";
import type { MetricsSample } from "@/types";

interface CommandContext {
  metrics: MetricsSample;
}

type CommandHandler = (context: CommandContext) => string[];

const HELP: string[] = [
  "Available commands:",
  "  help      — this list",
  "  status    — live system report",
  "  scan      — run a security sweep",
  "  network   — uplink statistics",
  "  launch    — arm the launch sequence (simulated)",
  "  projects  — active project registry",
  "  skills    — operator capability matrix",
  "  weather   — local conditions",
  "  date      — current date",
  "  time      — current time",
  "  about     — about this terminal",
  "  clear     — wipe the buffer",
];

export const TERMINAL_COMMANDS: Record<string, CommandHandler> = {
  help: () => HELP,
  status: ({ metrics }) => [
    "SYSTEM REPORT",
    `  CPU ............ ${Math.round(metrics.cpu)}%`,
    `  RAM ............ ${Math.round(metrics.ram)}%`,
    `  GPU ............ ${Math.round(metrics.gpu)}%`,
    `  CORE TEMP ...... ${Math.round(metrics.temperature)}°C`,
    `  AI LOAD ........ ${Math.round(metrics.aiLoad)}%`,
    "  VERDICT ........ ALL SYSTEMS NOMINAL",
  ],
  scan: () => [
    "Initiating deep scan…",
    "  ▸ ports 1-1024 ........ clean",
    "  ▸ memory integrity .... verified",
    "  ▸ neural lattice ...... stable",
    "  ▸ intrusion attempts .. 0",
    "Scan complete. No threats detected.",
  ],
  network: ({ metrics }) => [
    "UPLINK STATISTICS",
    `  DOWN ........... ${Math.round(metrics.networkDown)} MB/s`,
    `  UP ............. ${Math.round(metrics.networkUp)} MB/s`,
    "  LATENCY ........ 11 ms",
    "  ROUTE .......... GROUND STATION 7 → HELIOS RELAY",
  ],
  launch: () => [
    "LAUNCH SEQUENCE ARMED (SIMULATION)",
    "  T-10 … 9 … 8 … aborting — this is a portfolio site.",
    "  Nothing was launched. Probably.",
  ],
  projects: () => [
    "ACTIVE PROJECTS",
    "  ▸ KREKU Command Centre ....... this interface",
    "  ▸ Orbital Tracker ............ satellite telemetry",
    "  ▸ Neural Lattice ............. AI subsystem",
  ],
  skills: () => [
    "OPERATOR CAPABILITY MATRIX",
    "  TypeScript ▮▮▮▮▮▮▮▮▮▯  React ▮▮▮▮▮▮▮▮▮▯",
    "  Three.js  ▮▮▮▮▮▮▮▯▯▯   Design ▮▮▮▮▮▮▮▮▯▯",
  ],
  weather: () => ["London: 18°C, partly cloudy. Light rain expected Monday."],
  date: () => [new Date().toDateString()],
  time: () => [new Date().toLocaleTimeString("en-GB")],
  about: () => [
    `${APP_NAME} TERMINAL v5.2.1`,
    "A simulated shell for an AI operating system.",
    "No real commands are executed. Type 'help' to explore.",
  ],
};
