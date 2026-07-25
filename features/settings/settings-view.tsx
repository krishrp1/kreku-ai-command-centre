"use client";

import { GlassPanel } from "@/components/kreku/glass-panel";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ACCENTS } from "@/lib/constants";
import { useSound } from "@/hooks/use-sound";
import { useSystemStore } from "@/store/system-store";
import type { AccentId } from "@/types";
import { cn } from "@/lib/utils";

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-white/6 py-4 last:border-none">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function SettingsView() {
  const accent = useSystemStore((s) => s.accent);
  const setAccent = useSystemStore((s) => s.setAccent);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);
  const setSoundEnabled = useSystemStore((s) => s.setSoundEnabled);
  const reducedMotion = useSystemStore((s) => s.reducedMotion);
  const setReducedMotion = useSystemStore((s) => s.setReducedMotion);
  const highContrast = useSystemStore((s) => s.highContrast);
  const setHighContrast = useSystemStore((s) => s.setHighContrast);
  const glassBlur = useSystemStore((s) => s.glassBlur);
  const setGlassBlur = useSystemStore((s) => s.setGlassBlur);
  const playSound = useSound();

  return (
    <div className="mx-auto max-w-2xl">
      <GlassPanel className="p-6">
        <h1 className="font-display text-lg tracking-widest text-foreground">SETTINGS</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Preferences persist locally on this device.
        </p>

        <div className="mt-4">
          <SettingRow label="Accent theme" description="Primary hue for the whole interface">
            <div className="flex gap-2" role="radiogroup" aria-label="Accent theme">
              {(Object.keys(ACCENTS) as AccentId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={accent === id}
                  aria-label={ACCENTS[id].label}
                  onClick={() => {
                    playSound("click");
                    setAccent(id);
                  }}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-all",
                    accent === id
                      ? "scale-110 border-white"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                  style={{ background: ACCENTS[id].hex }}
                />
              ))}
            </div>
          </SettingRow>

          <SettingRow label="Interface sounds" description="Subtle synth feedback on interactions">
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              aria-label="Toggle interface sounds"
            />
          </SettingRow>

          <SettingRow label="Reduced motion" description="Minimise animation across the OS">
            <Switch
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
              aria-label="Toggle reduced motion"
            />
          </SettingRow>

          <SettingRow label="High contrast" description="Solid panels and brighter text">
            <Switch
              checked={highContrast}
              onCheckedChange={setHighContrast}
              aria-label="Toggle high contrast"
            />
          </SettingRow>

          <SettingRow label="Glass blur" description={`Panel backdrop blur — ${glassBlur}px`}>
            <Slider
              value={[glassBlur]}
              min={0}
              max={32}
              step={1}
              onValueChange={([value]) => setGlassBlur(value)}
              className="w-40"
              aria-label="Glass blur amount"
            />
          </SettingRow>
        </div>
      </GlassPanel>
    </div>
  );
}
