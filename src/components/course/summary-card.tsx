"use client";

/**
 * SummaryCard
 * ----------------------------------------------------------------
 * A reusable "key takeaway" card. Lessons compose several of these
 * into a summary grid at the end.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SummaryCardProps {
  title: string;
  /** the core idea, ideally one sentence */
  body: string;
  /** optional small formula or keyword shown in mono */
  formula?: string;
  icon?: React.ReactNode;
  accent?: "emerald" | "amber" | "rose" | "cyan" | "violet";
  index?: number;
}

const accentMap = {
  emerald: { ring: "ring-emerald-500/20", text: "text-emerald-300", bg: "bg-emerald-500/10" },
  amber: { ring: "ring-amber-500/20", text: "text-amber-300", bg: "bg-amber-500/10" },
  rose: { ring: "ring-rose-500/20", text: "text-rose-300", bg: "bg-rose-500/10" },
  cyan: { ring: "ring-cyan-500/20", text: "text-cyan-300", bg: "bg-cyan-500/10" },
  violet: { ring: "ring-violet-500/20", text: "text-violet-300", bg: "bg-violet-500/10" },
};

export function SummaryCard({
  title,
  body,
  formula,
  icon,
  accent = "emerald",
  index = 0,
}: SummaryCardProps) {
  const a = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "card-lift relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-5 ring-1 ring-inset hover:border-primary/40 hover:shadow-[0_8px_30px_oklch(0.7_0.16_165/8%)]",
        a.ring
      )}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              a.bg,
              a.text
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
          {formula && (
            <div className="mt-3 inline-flex rounded-lg border border-border/50 bg-background/60 px-3 py-1.5 font-mono text-sm text-foreground">
              {formula}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
