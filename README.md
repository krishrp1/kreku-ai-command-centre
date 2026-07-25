# NEXUS — AI Command Centre

A futuristic AI operating system interface built as a flagship frontend portfolio project. Original holographic design — no movie assets, no copied UI.

## Features

- **Boot sequence** — glowing power core, hardware checklist, live progress; skippable with `Esc`
- **Layered animated background** — stars, drifting particles, grid, nebula glows, rotating rings, mouse-reactive lighting, film grain
- **3D AI core** (React Three Fiber) — distorted wireframe energy sphere, counter-rotating rings, orbiting satellites, bloom post-processing, pointer parallax, breathing idle
- **Draggable dashboard** (react-grid-layout v2) — 13 live widgets: CPU/RAM/GPU gauges, network, temperature, AI load, security, live logs, weather, tasks, crypto, music, core; layout persists locally
- **AI assistant** — floating panel + full view, simulated streaming replies, status states (idle/listening/thinking/responding), voice waveform
- **Command palette** — `⌘K` / `Ctrl+K`, keyboard-first navigation, theme switching
- **Terminal** — simulated shell (`help`, `status`, `scan`, `network`, `launch`, …) with history
- **Satellite view** — point-cloud globe with orbit paths and tracked assets
- **Notification centre**, macOS-style dock with magnification, custom cursor, synthesised UI sounds (WebAudio, off by default)
- **Accessibility** — reduced-motion (OS + in-app), high-contrast mode, ARIA labels, keyboard navigation, skip link
- **Theming** — four accent themes (cyan/blue/purple/teal), adjustable glass blur

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Framer Motion · React Three Fiber + drei + postprocessing · Recharts · react-grid-layout v2 · Zustand · TanStack Query · Zod · Lucide

## Run

```bash
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000. Production: `npm run build && npm start`.

## Deploy

Zero-config on [Vercel](https://vercel.com) — import the repo and deploy. All data is simulated client-side; no environment variables required.

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
