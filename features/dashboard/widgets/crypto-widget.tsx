"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import { NexusTooltip } from "@/components/charts/chart-theme";
import { WidgetShell } from "@/features/dashboard/widget-shell";
import { CHART_COLORS } from "@/lib/constants";
import { METRICS_INTERVAL_MS } from "@/lib/constants";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

interface Asset {
  symbol: string;
  price: number;
  history: { value: number }[];
  color: string;
}

const seedHistory = (base: number) =>
  Array.from({ length: 24 }, (_, i) => ({
    value: base * (1 + Math.sin(i / 4) * 0.02 + (Math.random() - 0.5) * 0.01),
  }));

const INITIAL_ASSETS: Asset[] = [
  { symbol: "BTC", price: 118_400, history: seedHistory(118_400), color: CHART_COLORS.cyan },
  { symbol: "ETH", price: 4_120, history: seedHistory(4_120), color: CHART_COLORS.purple },
];

export function CryptoWidget() {
  const [assets, setAssets] = useState(INITIAL_ASSETS);

  useEffect(() => {
    const id = setInterval(() => {
      setAssets((current) =>
        current.map((asset) => {
          const price = asset.price * (1 + (Math.random() - 0.5) * 0.006);
          return {
            ...asset,
            price,
            history: [...asset.history.slice(1), { value: price }],
          };
        }),
      );
    }, METRICS_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <WidgetShell title="Markets — Crypto">
      <div className="grid h-full grid-cols-2 gap-3">
        {assets.map((asset) => {
          const first = asset.history[0].value;
          const change = ((asset.price - first) / first) * 100;
          const up = change >= 0;
          return (
            <div key={asset.symbol} className="flex min-h-0 flex-col">
              <div className="flex items-baseline gap-2">
                <span className="flex items-center gap-1.5 font-mono text-xs text-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: asset.color }} aria-hidden />
                  {asset.symbol}
                </span>
                <span className="font-display text-sm tabular-nums">{formatCurrency(asset.price)}</span>
                <span
                  className={cn(
                    "ml-auto flex items-center gap-0.5 font-mono text-[10px] tabular-nums",
                    up ? "text-nexus-success" : "text-nexus-danger",
                  )}
                >
                  {up ? <TrendingUp className="h-3 w-3" aria-hidden /> : <TrendingDown className="h-3 w-3" aria-hidden />}
                  {change.toFixed(2)}%
                </span>
              </div>
              <div className="min-h-0 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={asset.history}>
                    <YAxis domain={["dataMin", "dataMax"]} hide />
                    <Tooltip content={NexusTooltip} cursor={{ stroke: "rgba(255,255,255,0.2)" }} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name={asset.symbol}
                      stroke={asset.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetShell>
  );
}
