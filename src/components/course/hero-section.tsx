"use client";

/**
 * HeroSection
 * ----------------------------------------------------------------
 * The opening section of every lesson page. Establishes the topic,
 * sets the mood, and shows meta info (number, duration, difficulty).
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { Clock, BarChart3, Hash } from "lucide-react";
import type { LessonMeta } from "@/lib/course-config";

export interface HeroSectionProps {
  lesson: LessonMeta;
}

const difficultyColor: Record<string, string> = {
  Foundations: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
  Core: "text-cyan-300 bg-cyan-500/15 border-cyan-500/30",
  Intermediate: "text-amber-300 bg-amber-500/15 border-amber-500/30",
  Advanced: "text-rose-300 bg-rose-500/15 border-rose-500/30",
};

export function HeroSection({ lesson }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* aurora background */}
      <div className="bg-aurora pointer-events-none absolute inset-0 opacity-80" />
      <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-muted-foreground">
              <Hash className="size-3.5" />
              Lesson {lesson.number}
            </span>
            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 ${
                difficultyColor[lesson.difficulty] ?? difficultyColor.Core
              }`}
            >
              <BarChart3 className="size-3.5" />
              {lesson.difficulty}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-muted-foreground">
              <Clock className="size-3.5" />
              {lesson.durationMin} min
            </span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {lesson.title}
          </h1>
          <p className="mt-4 text-balance text-lg text-muted-foreground sm:text-xl">
            {lesson.tagline}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground/90">
            {lesson.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
