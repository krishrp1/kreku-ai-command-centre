"use client";

import { memo, useEffect, useRef } from "react";
import { useMotionSafe } from "@/hooks/use-motion-safe";

interface Star {
  x: number;
  y: number;
  radius: number;
  twinkleSpeed: number;
  phase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const STAR_COUNT = 160;
const PARTICLE_COUNT = 46;

/** Inline SVG turbulence used as a film-grain overlay. */
const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")";

/**
 * Seven-layer animated backdrop: stars + drifting particles on one canvas,
 * plus CSS grid lines, nebula glows, rotating rings, a mouse-tracked light
 * and a noise texture. Canvas work pauses under reduced motion.
 */
function LayeredBackgroundImpl() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const motionSafe = useMotionSafe();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let particles: Particle[] = [];
    let raf = 0;

    const seed = () => {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.1 + 0.2,
        twinkleSpeed: Math.random() * 1.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
      }));
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.8 + 0.6,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = time / 1000;

      for (const star of stars) {
        const alpha = 0.35 + 0.5 * Math.abs(Math.sin(t * star.twinkleSpeed + star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      for (const p of particles) {
        p.x = (p.x + p.vx + width) % width;
        p.y = (p.y + p.vy + height) % height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,229,255,0.28)";
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    if (motionSafe) {
      raf = requestAnimationFrame(draw);
    } else {
      // Single static frame so the scene is not empty.
      draw(0);
      cancelAnimationFrame(raf);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [motionSafe]);

  useEffect(() => {
    if (!motionSafe) return;
    const onMove = (event: PointerEvent) => {
      const light = lightRef.current;
      if (!light) return;
      light.style.background = `radial-gradient(600px circle at ${event.clientX}px ${event.clientY}px, var(--kreku-accent-soft), transparent 70%)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [motionSafe]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* L4: nebula glows */}
      <div className="absolute -left-40 top-[-20%] h-[60vh] w-[60vh] rounded-full bg-kreku-purple/12 blur-[120px]" />
      <div className="absolute -right-32 bottom-[-15%] h-[55vh] w-[55vh] rounded-full bg-kreku-cyan/10 blur-[120px]" />
      <div className="absolute left-1/3 top-1/2 h-[40vh] w-[40vh] rounded-full bg-kreku-blue/8 blur-[100px]" />
      {/* L3: grid lines */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      {/* L1 + L2: stars and particles */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* L5: slow rotating rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-kreku-spin-slow h-[85vmin] w-[85vmin] rounded-full border border-white/4" />
        <div
          className="animate-kreku-spin-slow absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-kreku/6"
          style={{ animationDirection: "reverse", animationDuration: "36s" }}
        />
      </div>
      {/* L6: mouse-reactive lighting */}
      <div ref={lightRef} className="absolute inset-0 transition-none" />
      {/* L7: noise texture */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: NOISE_URI }}
      />
    </div>
  );
}

export const LayeredBackground = memo(LayeredBackgroundImpl);
