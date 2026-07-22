"use client";

/**
 * ProgressTracker
 * ----------------------------------------------------------------
 * Shows overall course completion as a ring + percentage, plus a
 * compact achievement strip. Used in the sidebar footer.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { useProgressStore, earnedAchievements, ACHIEVEMENTS } from "@/lib/progress-store";
import { TOTAL_LESSONS } from "@/lib/course-config";

export function ProgressTracker() {
  const completed = useProgressStore((s) => s.completed);
  const achievementIds = useProgressStore((s) => s.achievements);
  const earned = earnedAchievements(achievementIds);

  const count = completed.length;
  const percent = TOTAL_LESSONS ? Math.round((count / TOTAL_LESSONS) * 100) : 0;
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="rounded-xl border border-border/40 bg-card/40 p-3">
      <div className="flex items-center gap-3">
        {/* progress ring */}
        <div className="relative size-16 shrink-0">
          <svg viewBox="0 0 64 64" className="size-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="oklch(1 0 0 / 8%)"
              strokeWidth="5"
            />
            <motion.circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="oklch(0.7 0.16 165)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-sm font-bold text-foreground">{percent}%</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-foreground">Course progress</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            {count} of {TOTAL_LESSONS} lessons complete
          </div>
          <div className="mt-1.5 flex gap-1">
            {ACHIEVEMENTS.map((a) => {
              const isEarned = earned.some((e) => e.id === a.id);
              return (
                <div
                  key={a.id}
                  title={`${a.title} — ${a.description}`}
                  className={`size-2 rounded-full transition-colors ${
                    isEarned
                      ? "bg-amber-400 shadow-[0_0_8px_oklch(0.75_0.16_80/60%)]"
                      : "bg-muted-foreground/30"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
