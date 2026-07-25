"use client";

import { useEffect } from "react";
import { GlassPanel } from "@/components/kreku/glass-panel";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Client-side boundary — this only reaches the visitor's own browser
    // console, not a server log. Wire a real error-tracking service
    // (Sentry, etc.) here for production-wide visibility.
    console.error("Unhandled render error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <GlassPanel className="max-w-sm p-8 text-center">
        <p className="font-display text-sm tracking-[0.25em] text-kreku text-glow">
          {APP_NAME}
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold">Something glitched</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A subsystem hit an unexpected fault. It&apos;s been logged — try again.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </GlassPanel>
    </div>
  );
}
