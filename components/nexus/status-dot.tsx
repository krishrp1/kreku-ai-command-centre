import { cn } from "@/lib/utils";

const TONES = {
  success: "bg-nexus-success",
  warning: "bg-nexus-warning",
  danger: "bg-nexus-danger",
  accent: "bg-nexus",
} as const;

export function StatusDot({
  tone = "success",
  pulse = true,
  className,
}: {
  tone?: keyof typeof TONES;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex h-2 w-2", className)}>
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
            TONES[tone],
          )}
        />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", TONES[tone])} />
    </span>
  );
}
