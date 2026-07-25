"use client";

import { motion } from "framer-motion";
import {
  FileArchive,
  FileCode2,
  FileLock2,
  FileText,
  Folder,
} from "lucide-react";
import { GlassPanel } from "@/components/nexus/glass-panel";

const FILES = [
  { name: "mission-archives", kind: "folder", size: "—", icon: Folder },
  { name: "neural-models", kind: "folder", size: "—", icon: Folder },
  { name: "telemetry-2026.log", kind: "log", size: "48 MB", icon: FileText },
  { name: "lattice-config.ts", kind: "code", size: "12 KB", icon: FileCode2 },
  { name: "orbital-keys.enc", kind: "secure", size: "4 KB", icon: FileLock2 },
  { name: "boot-snapshots.tar", kind: "archive", size: "1.2 GB", icon: FileArchive },
];

export function FilesView() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {FILES.map((file, index) => {
        const Icon = file.icon;
        return (
          <GlassPanel
            key={file.name}
            className="group cursor-pointer p-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-3">
              <Icon
                className="h-8 w-8 text-nexus transition-transform group-hover:scale-110"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{file.name}</p>
                <p className="font-mono text-[10px] uppercase text-muted-foreground">
                  {file.kind} · {file.size}
                </p>
              </div>
            </div>
          </GlassPanel>
        );
      })}
      <motion.p
        className="col-span-full mt-2 text-center font-mono text-[11px] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Demo file registry — contents are simulated.
      </motion.p>
    </div>
  );
}
