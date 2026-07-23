"use client";

/**
 * LearningObjectives
 * ----------------------------------------------------------------
 * Renders the list of things a learner will master in this lesson.
 * Reused at the top of every lesson for consistency.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { Target } from "lucide-react";
import type { LearningObjective } from "@/lib/course-config";

export interface LearningObjectivesProps {
  objectives: LearningObjective[];
}

export function LearningObjectives({ objectives }: LearningObjectivesProps) {
  return (
    <section className="px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex items-center gap-2.5 sm:mb-6">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <Target className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
              Learning Objectives
            </h2>
            <p className="text-sm text-muted-foreground">
              By the end of this lesson, you will be able to…
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {objectives.map((o, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/15 font-mono text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-medium text-foreground">{o.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {o.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
