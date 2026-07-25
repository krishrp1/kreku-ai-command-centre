import Link from "next/link";
import { GlassPanel } from "@/components/kreku/glass-panel";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <GlassPanel className="max-w-sm p-8 text-center">
        <p className="font-display text-sm tracking-[0.25em] text-kreku text-glow">
          {APP_NAME}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This sector isn&apos;t on the map. The route you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Return to command centre</Link>
        </Button>
      </GlassPanel>
    </div>
  );
}
