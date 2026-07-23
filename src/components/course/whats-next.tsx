"use client";

/**
 * WhatsNext
 * ----------------------------------------------------------------
 * The closing section of every lesson. Teases the next lesson and
 * provides Previous/Next navigation + a "complete & continue" button.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/lib/progress-store";
import { toast } from "sonner";

export interface WhatsNextProps {
  nextTitle?: string;
  nextBlurb?: string;
  isComplete: boolean;
  onComplete: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  hasPrev: boolean;
  hasNext: boolean;
  accent?: "emerald" | "amber" | "rose" | "cyan";
}

export function WhatsNext({
  nextTitle,
  nextBlurb,
  isComplete,
  onComplete,
  onNavigate,
  hasPrev,
  hasNext,
  accent = "emerald",
}: WhatsNextProps) {
  function handleComplete() {
    onComplete();
    toast.success("Lesson complete!", {
      description: "Your progress has been saved.",
    });
  }

  const accentBg = {
    emerald: "from-emerald-500/15 to-transparent border-emerald-500/20",
    amber: "from-amber-500/15 to-transparent border-amber-500/20",
    rose: "from-rose-500/15 to-transparent border-rose-500/20",
    cyan: "from-cyan-500/15 to-transparent border-cyan-500/20",
  }[accent];

  return (
    <section className="px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        {nextTitle && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className={cn(
              "relative mb-6 overflow-hidden rounded-2xl border bg-gradient-to-br p-6 sm:p-8",
              accentBg
            )}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="size-4" />
              What&apos;s next
            </div>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {nextTitle}
            </h3>
            {nextBlurb && (
              <p className="mt-3 max-w-2xl text-balance leading-relaxed text-muted-foreground">
                {nextBlurb}
              </p>
            )}
          </motion.div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onNavigate("prev")}
            disabled={!hasPrev}
            className="order-2 sm:order-1"
          >
            <ArrowLeft className="mr-1.5 size-4" />
            Previous
          </Button>

          <Button
            onClick={handleComplete}
            variant={isComplete ? "secondary" : "default"}
            className={cn("order-1 sm:order-2", isComplete && "border border-emerald-500/40")}
          >
            {isComplete ? (
              <>
                <CheckCircle2 className="mr-1.5 size-4 text-emerald-400" />
                Completed
              </>
            ) : (
              "Mark complete & continue"
            )}
            <ArrowRight className="ml-1.5 size-4" />
          </Button>

          <Button
            onClick={() => onNavigate("next")}
            disabled={!hasNext}
            className="order-3"
          >
            Next lesson
            <ArrowRight className="ml-1.5 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
