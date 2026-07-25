"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSystemStore } from "@/store/system-store";

/** Reflects store settings onto <html> data-attributes for CSS hooks. */
function SettingsEffects() {
  const accent = useSystemStore((s) => s.accent);
  const reducedMotion = useSystemStore((s) => s.reducedMotion);
  const highContrast = useSystemStore((s) => s.highContrast);
  const glassBlur = useSystemStore((s) => s.glassBlur);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.accent = accent;
    root.dataset.motion = reducedMotion ? "reduced" : "full";
    root.dataset.contrast = highContrast ? "high" : "normal";
    root.style.setProperty("--kreku-glass-blur", `${glassBlur}px`);
  }, [accent, reducedMotion, highContrast, glassBlur]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <SettingsEffects />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
