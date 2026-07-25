"use client";

import { ShieldCheck, ShieldAlert, Lock, Radio, Fingerprint } from "lucide-react";
import { StatusDot } from "@/components/kreku/status-dot";
import { WidgetShell } from "@/features/dashboard/widget-shell";

const CHECKS = [
  { icon: ShieldCheck, label: "Firewall", detail: "Active — 0 intrusions", tone: "success" },
  { icon: Lock, label: "Encryption", detail: "AES-256 · rotating keys", tone: "success" },
  { icon: Fingerprint, label: "Biometrics", detail: "2 identities enrolled", tone: "success" },
  { icon: Radio, label: "Uplink", detail: "TLS 1.3 · pinned certs", tone: "success" },
  { icon: ShieldAlert, label: "Perimeter", detail: "1 probe deflected (443)", tone: "warning" },
] as const;

export function SecurityWidget() {
  return (
    <WidgetShell title="Security">
      <ul className="flex h-full flex-col justify-center gap-2.5">
        {CHECKS.map((check) => {
          const Icon = check.icon;
          return (
            <li key={check.label} className="flex items-center gap-3">
              <Icon className="h-4 w-4 shrink-0 text-kreku" aria-hidden />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-xs text-foreground">{check.label}</p>
                <p className="truncate font-mono text-[10px] text-muted-foreground">
                  {check.detail}
                </p>
              </div>
              <StatusDot tone={check.tone} pulse={check.tone !== "success"} />
            </li>
          );
        })}
      </ul>
    </WidgetShell>
  );
}
