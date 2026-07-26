"use client";

import { useCallback } from "react";
import { getAudioContext } from "@/lib/audio-context";
import { useSystemStore } from "@/store/system-store";

type SoundKind = "hover" | "click" | "boot" | "ping" | "key";

/**
 * Tiny WebAudio synth for UI feedback — no audio assets needed.
 * All sounds are short sine/square blips at low gain.
 */
export function useSound() {
  const enabled = useSystemStore((s) => s.soundEnabled);

  const play = useCallback(
    (kind: SoundKind) => {
      if (!enabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === "suspended") void ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const presets: Record<
        SoundKind,
        { freq: number; end: number; dur: number; type: OscillatorType }
      > = {
        hover: { freq: 880, end: 990, dur: 0.04, type: "sine" },
        click: { freq: 520, end: 320, dur: 0.08, type: "sine" },
        boot: { freq: 120, end: 640, dur: 0.9, type: "sawtooth" },
        ping: { freq: 1320, end: 880, dur: 0.25, type: "sine" },
        key: { freq: 240, end: 200, dur: 0.03, type: "square" },
      };
      const p = presets[kind];
      osc.type = p.type;
      osc.frequency.setValueAtTime(p.freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        p.end,
        ctx.currentTime + p.dur,
      );
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + p.dur);
      osc.start();
      osc.stop(ctx.currentTime + p.dur);
    },
    [enabled],
  );

  return play;
}
