"use client";

/**
 * SimulationContainer
 * ----------------------------------------------------------------
 * A consistent frame around every interactive simulation in the course.
 * Provides a title, an optional subtitle/description, a themed canvas
 * area, and a slot for controls (sliders, buttons, toggles).
 *
 * Reused by every lesson so the visual language stays uniform.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SimulationContainerProps {
  title: string;
  description?: string;
  /** small label, e.g. "Interactive" or the concept name */
  badge?: string;
  /** the visualization itself */
  children: React.ReactNode;
  /** controls below the canvas (sliders, buttons) */
  controls?: React.ReactNode;
  className?: string;
  /** accent color used for the badge + left border glow */
  accent?: "emerald" | "amber" | "rose" | "cyan" | "violet";
}

const accentMap = {
  emerald: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    bar: "from-emerald-500/60 to-emerald-400/0",
  },
  amber: {
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    bar: "from-amber-500/60 to-amber-400/0",
  },
  rose: {
    badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    bar: "from-rose-500/60 to-rose-400/0",
  },
  cyan: {
    badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    bar: "from-cyan-500/60 to-cyan-400/0",
  },
  violet: {
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    bar: "from-violet-500/60 to-violet-400/0",
  },
};

export function SimulationContainer({
  title,
  description,
  badge,
  children,
  controls,
  className,
  accent = "emerald",
}: SimulationContainerProps) {
  const a = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm",
        className
      )}
    >
      {/* accent bar */}
      <div className={cn("absolute left-0 top-0 h-full w-1 bg-gradient-to-b", a.bar)} />

      <div className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              {badge && (
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                    a.badge
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/40 bg-background/40 p-3 sm:p-4">
          {children}
        </div>

        {controls && (
          <div className="mt-4 rounded-xl border border-border/40 bg-background/20 p-4">
            {controls}
          </div>
        )}
      </div>
    </motion.div>
  );
}
