import { cn } from "@/lib/utils";

const TONES = {
  success: "bg-kreku-success",
  warning: "bg-kreku-warning",
  danger: "bg-kreku-danger",
  accent: "bg-kreku",
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
