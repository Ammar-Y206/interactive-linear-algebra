"use client";

/**
 * ThoughtExperiment
 * ----------------------------------------------------------------
 * A visual hook component — opens a lesson with a surprising question
 * or scenario instead of an announcement. Designed to match the
 * original 16 lessons' "show, don't tell" rhythm: a bold question,
 * a teasing visual or interactive, and a bridge into the content.
 *
 * Usage: place right after <HeroSection>, before <LearningObjectives>,
 * to hook the learner immediately.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { Sparkles, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThoughtExperimentProps {
  /** the hook question — make it surprising, concrete, specific */
  question: string;
  /** a short teasing framing that deepens the mystery */
  tease?: string;
  /** optional interactive/visual element shown beside the question */
  children?: React.ReactNode;
  accent?: "emerald" | "amber" | "rose" | "cyan" | "violet";
}

const accentMap = {
  emerald: { border: "border-emerald-500/30", glow: "from-emerald-500/15", text: "text-emerald-300", icon: "bg-emerald-500/15" },
  amber: { border: "border-amber-500/30", glow: "from-amber-500/15", text: "text-amber-300", icon: "bg-amber-500/15" },
  rose: { border: "border-rose-500/30", glow: "from-rose-500/15", text: "text-rose-300", icon: "bg-rose-500/15" },
  cyan: { border: "border-cyan-500/30", glow: "from-cyan-500/15", text: "text-cyan-300", icon: "bg-cyan-500/15" },
  violet: { border: "border-violet-500/30", glow: "from-violet-500/15", text: "text-violet-300", icon: "bg-violet-500/15" },
};

export function ThoughtExperiment({
  question,
  tease,
  children,
  accent = "emerald",
}: ThoughtExperimentProps) {
  const a = accentMap[accent];
  return (
    <section className="relative overflow-hidden px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent", a.glow)} />
      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn("rounded-3xl border bg-card/50 p-6 backdrop-blur-sm sm:p-10", a.border)}
        >
          <div className="flex items-start gap-4">
            <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", a.icon, a.text)}>
              <HelpCircle className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className={cn("mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest", a.text)}>
                <Sparkles className="size-3" />
                Think about this
              </div>
              <h2 className="text-balance text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {question}
              </h2>
              {tease && (
                <p className="mt-3 text-balance text-base leading-relaxed text-muted-foreground">
                  {tease}
                </p>
              )}
            </div>
          </div>
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
