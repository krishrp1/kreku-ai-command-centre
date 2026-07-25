import { Skeleton } from "@/components/ui/skeleton";

/** Glassy loading placeholder shown while a view chunk loads. */
export function ViewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3" aria-busy="true" aria-label="Loading view">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton
          key={i}
          className="glass h-40 rounded-xl bg-white/4"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}
