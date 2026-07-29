# KREKU — AI Command Centre

A futuristic AI operating system interface built as a flagship frontend portfolio project. Original holographic design — no movie assets, no copied UI.

## Features

- **Boot sequence** — glowing power core, hardware checklist, live progress; skippable with `Esc`
- **Layered animated background** — stars, drifting particles, grid, nebula glows, rotating rings, mouse-reactive lighting, film grain
- **3D AI core** (React Three Fiber) — distorted wireframe energy sphere, counter-rotating rings, orbiting satellites, bloom post-processing, pointer parallax, breathing idle
- **Draggable dashboard** (react-grid-layout v2) — 13 live widgets: CPU/RAM/GPU gauges, network, temperature, AI load, security, live logs, weather, tasks, crypto, music, core; layout persists locally
- **AI assistant** — floating panel + full view, status states, voice waveform. Streams real replies from Gemini (Google AI Studio) when `GEMINI_API_KEY` is set; otherwise falls back to a built-in telemetry-aware offline engine
- **Command palette** — `⌘K` / `Ctrl+K`, keyboard-first navigation, theme switching
- **Terminal** — simulated shell (`help`, `status`, `scan`, `network`, `launch`, …) with history
- **Satellite view** — point-cloud globe with orbit paths and tracked assets
- **Notification centre**, macOS-style dock with magnification, custom cursor, synthesised UI sounds (WebAudio, off by default)
- **Accessibility** — reduced-motion (OS + in-app), high-contrast mode, ARIA labels, keyboard navigation, skip link
- **Theming** — four accent themes (cyan/blue/purple/teal), adjustable glass blur

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Framer Motion · React Three Fiber + drei + postprocessing · Recharts · react-grid-layout v2 · Zustand · TanStack Query · Lucide

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build && npm start`.

Other scripts: `npm run lint`, `npm run typecheck` (`tsc --noEmit`).

## Environment variables

All optional — copy `.env.example` to `.env.local` and fill in what you need; the app works fully with none of them set.

| Variable | Purpose | Without it |
|---|---|---|
| `GEMINI_API_KEY` | Gemini API key ([Google AI Studio](https://aistudio.google.com/apikey)) — powers real, streaming assistant replies. | Assistant falls back to a built-in telemetry-aware offline engine. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Upstash Redis (via `vercel integration add upstash/upstash-kv`, or a raw Upstash account using `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` instead) — backs the `/api/chat` and `/api/weather` rate limiters so limits hold across serverless instances. | Rate limiting falls back to an in-memory, per-instance counter — fine for local dev, not real protection in production. |

## Deploy

Zero-config on [Vercel](https://vercel.com) — import the repo and deploy. No environment variables required; set any of the above to enable that feature.

## Architecture

```
app/          routes, global styles, fonts
components/   shared UI (glass panel, charts theme, cursor, shadcn/ui)
features/     feature modules (boot, background, layout, core, dashboard,
              assistant, terminal, command-palette, notifications, …)
hooks/        useClock, useMediaQuery, useMotionSafe, useSound
lib/          constants, utils
providers/    app-level providers (query client, settings effects)
store/        zustand stores (system, metrics, dashboard, assistant)
types/        shared types
utils/        formatters
```

Every view is code-split via `next/dynamic`; heavy 3D chunks load only when opened. Telemetry is a seeded random-walk simulator ticking every 2s.
