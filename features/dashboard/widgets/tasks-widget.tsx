"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { WidgetShell } from "@/features/dashboard/widget-shell";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

const INITIAL_TASKS = [
  { id: "t1", label: "Review satellite telemetry", done: false },
  { id: "t2", label: "Recalibrate neural lattice", done: false },
  { id: "t3", label: "Rotate encryption keys", done: true },
  { id: "t4", label: "Archive mission logs", done: false },
];

export function TasksWidget() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const playSound = useSound();

  const toggle = (id: string) => {
    playSound("click");
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  };

  return (
    <WidgetShell
      title="Tasks"
      action={
        <span className="font-mono text-[10px] text-muted-foreground">
          {tasks.filter((t) => t.done).length}/{tasks.length}
        </span>
      }
    >
      <ul className="flex h-full flex-col justify-center gap-1.5">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              type="button"
              onClick={() => toggle(task.id)}
              className="group flex w-full items-center gap-2.5 rounded-md px-1 py-0.5 text-left hover:bg-white/5"
            >
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                  task.done
                    ? "border-nexus bg-nexus/20 text-nexus"
                    : "border-white/20 text-transparent group-hover:border-nexus/50",
                )}
                aria-hidden
              >
                <Check className="h-3 w-3" />
              </span>
              <span
                className={cn(
                  "truncate text-xs",
                  task.done ? "text-muted-foreground line-through" : "text-foreground",
                )}
              >
                {task.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </WidgetShell>
  );
}
