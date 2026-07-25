"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NAV_ITEMS, type NavItem } from "@/features/layout/nav-items";
import { useMotionSafe } from "@/hooks/use-motion-safe";
import { useSound } from "@/hooks/use-sound";
import { useSystemStore } from "@/store/system-store";
import { cn } from "@/lib/utils";

const DOCK_ITEMS = NAV_ITEMS.filter((item) =>
  ["dashboard", "mission", "analytics", "assistant", "terminal", "settings"].includes(
    item.id,
  ),
);

function DockIcon({
  item,
  mouseX,
  magnify,
}: {
  item: NavItem;
  mouseX: MotionValue<number>;
  magnify: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const playSound = useSound();
  const activeView = useSystemStore((s) => s.activeView);
  const setView = useSystemStore((s) => s.setView);

  const distance = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return 300;
    return x - (bounds.x + bounds.width / 2);
  });
  const sizeRaw = useTransform(distance, [-120, 0, 120], [44, magnify ? 68 : 44, 44]);
  const size = useSpring(sizeRaw, { stiffness: 380, damping: 26 });

  const Icon = item.icon;
  const active = activeView === item.id;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          ref={ref}
          type="button"
          style={{ width: size, height: size }}
          onClick={() => {
            playSound("click");
            setView(item.id);
          }}
          onMouseEnter={() => playSound("hover")}
          aria-label={item.label}
          aria-current={active ? "page" : undefined}
          className={cn(
            "glass relative flex items-center justify-center rounded-xl text-muted-foreground transition-colors",
            "hover:text-kreku hover:glow-accent",
            active && "text-kreku",
          )}
        >
          <Icon className="h-1/2 w-1/2" aria-hidden />
          {active && (
            <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-kreku" />
          )}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="font-mono text-xs">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

/** Floating macOS-style dock with hover magnification. */
export function Dock() {
  const mouseX = useMotionValue<number>(Infinity);
  const motionSafe = useMotionSafe();

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        aria-label="Dock"
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass-strong pointer-events-auto flex items-end gap-2 rounded-2xl p-2 holo-border"
      >
        {DOCK_ITEMS.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} magnify={motionSafe} />
        ))}
      </nav>
    </motion.div>
  );
}
