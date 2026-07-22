"use client";

/**
 * ConceptCheck
 * ----------------------------------------------------------------
 * A reusable inline callout that drops a quick "think before you
 * scroll" prompt into the middle of a lesson. The learner clicks to
 * reveal the answer, reinforcing active reading.
 *
 * Unlike the end-of-lesson QuizCard, these are single, low-stakes
 * moments woven into the explanation.
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConceptCheckProps {
  prompt: string;
  answer: string;
  accent?: "emerald" | "amber" | "rose" | "cyan" | "violet";
}

const accents = {
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    iconBg: "bg-emerald-500/15",
    iconText: "text-emerald-300",
    label: "text-emerald-300",
    reveal: "bg-emerald-500/10 text-emerald-100",
  },
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-300",
    label: "text-amber-300",
    reveal: "bg-amber-500/10 text-amber-100",
  },
  rose: {
    border: "border-rose-500/30",
    bg: "bg-rose-500/5",
    iconBg: "bg-rose-500/15",
    iconText: "text-rose-300",
    label: "text-rose-300",
    reveal: "bg-rose-500/10 text-rose-100",
  },
  cyan: {
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    iconBg: "bg-cyan-500/15",
    iconText: "text-cyan-300",
    label: "text-cyan-300",
    reveal: "bg-cyan-500/10 text-cyan-100",
  },
  violet: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/5",
    iconBg: "bg-violet-500/15",
    iconText: "text-violet-300",
    label: "text-violet-300",
    reveal: "bg-violet-500/10 text-violet-100",
  },
};

export function ConceptCheck({
  prompt,
  answer,
  accent = "amber",
}: ConceptCheckProps) {
  const [revealed, setRevealed] = useState(false);
  const a = accents[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className={cn("overflow-hidden rounded-2xl border p-5", a.border, a.bg)}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            a.iconBg,
            a.iconText
          )}
        >
          <Lightbulb className="size-4" />
        </div>
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-widest",
            a.label
          )}
        >
          Concept check
        </span>
      </div>

      <p className="mt-3 text-[15px] font-medium leading-relaxed text-foreground">
        {prompt}
      </p>

      <AnimatePresence initial={false}>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "rounded-xl border border-border/40 p-4 text-sm leading-relaxed",
                a.reveal
              )}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setRevealed((r) => !r)}
        className="mt-3 gap-1.5 text-muted-foreground hover:text-foreground"
      >
        {revealed ? (
          <>
            <EyeOff className="size-3.5" /> Hide answer
          </>
        ) : (
          <>
            <Eye className="size-3.5" /> Reveal answer
          </>
        )}
      </Button>
    </motion.div>
  );
}
