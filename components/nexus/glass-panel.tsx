"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  /** Adds the animated gradient border. */
  holo?: boolean;
  /** Adds subtle scanlines over the surface. */
  scan?: boolean;
}

/** Base holographic surface every panel/widget is built on. */
export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  function GlassPanel({ className, holo = true, scan = false, ...props }, ref) {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "glass relative rounded-xl",
          holo && "holo-border",
          scan && "scanlines",
          className,
        )}
        {...props}
      />
    );
  },
);
