"use client";

/**
 * StreakWidget
 * ----------------------------------------------------------------
 * A compact flame-streak indicator for the sidebar. Shows the
 * current consecutive-day streak and a tiny 7-day calendar of past
 * visits.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useProgressStore } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

export function StreakWidget() {
  const streak = useProgressStore((s) => s.streak);
  const visitDays = useProgressStore((s) => s.visitDays);

  // last 7 days, oldest -> newest, today last
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    return {
      iso,
      label: d.toLocaleDateString("en", { weekday: "narrow" }),
      visited: visitDays.includes(iso),
      isToday: i === 6,
    };
  });

  return (
    <div className="rounded-xl border border-border/40 bg-card/40 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-lg transition-colors",
              streak > 0
                ? "bg-amber-500/20 text-amber-300"
                : "bg-muted/40 text-muted-foreground"
            )}
          >
            <Flame
              className={cn("size-4", streak > 0 && "drop-shadow-[0_0_6px_oklch(0.75_0.16_80/60%)]")}
            />
          </div>
          <div>
            <div className="font-mono text-lg font-bold leading-none text-foreground">
              {streak}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              day streak
            </div>
          </div>
        </div>
      </div>

      {/* 7-day calendar */}
      <div className="mt-3 flex items-center justify-between gap-1">
        {days.map((d) => (
          <div key={d.iso} className="flex flex-col items-center gap-1">
            <span className="text-[9px] uppercase text-muted-foreground">
              {d.label}
            </span>
            <motion.div
              initial={false}
              animate={{ scale: d.visited ? 1 : 0.85 }}
              className={cn(
                "flex size-5 items-center justify-center rounded-md text-[9px] font-bold transition-colors",
                d.visited
                  ? "bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950"
                  : "bg-muted/40 text-transparent",
                d.isToday && !d.visited && "ring-1 ring-amber-500/40"
              )}
            >
              {d.visited ? "✓" : ""}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
