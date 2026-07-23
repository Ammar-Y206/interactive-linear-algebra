"use client";

/**
 * CourseCompletionPage
 * ----------------------------------------------------------------
 * The celebratory finish line. Shows earned achievements, final stats,
 * and a recap of every lesson. Also reachable before finishing (as a
 * progress preview) but framed differently.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import {
  Trophy,
  CheckCircle2,
  Circle,
  RotateCcw,
  ArrowRight,
  PartyPopper,
  BookOpen,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/course/section-heading";
import { AchievementBadge } from "@/components/course/achievement-badge";
import {
  LESSONS,
  TOTAL_LESSONS,
  TOTAL_DURATION_MIN,
} from "@/lib/course-config";
import {
  ACHIEVEMENTS,
  useProgressStore,
  earnedAchievements,
} from "@/lib/progress-store";
import { toast } from "sonner";

export interface CourseCompletionPageProps {
  onNavigate: (slug: string) => void;
}

export function CourseCompletionPage({ onNavigate }: CourseCompletionPageProps) {
  const completed = useProgressStore((s) => s.completed);
  const reset = useProgressStore((s) => s.reset);
  const achievementIds = useProgressStore((s) => s.achievements);
  const earned = earnedAchievements(achievementIds);

  const allDone = completed.length >= TOTAL_LESSONS;
  const percent = TOTAL_LESSONS ? Math.round((completed.length / TOTAL_LESSONS) * 100) : 0;

  function handleReset() {
    reset();
    toast.success("Progress reset", {
      description: "Fresh start — ready when you are.",
    });
    onNavigate("introduction");
  }

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-aurora pointer-events-none absolute inset-0" />
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:py-28">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8, delay: 0.1 }}
            className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_40px_oklch(0.75_0.16_80/40%)]"
          >
            {allDone ? (
              <Trophy className="size-10 text-amber-950" />
            ) : (
              <PartyPopper className="size-10 text-amber-950" />
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            {allDone ? "Course complete!" : `${percent}% of the way there`}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted-foreground"
          >
            {allDone
              ? "You've worked through every lesson. The intuitions you've built are the foundation for everything that comes next in linear algebra."
              : "Keep going — the finish line is in sight. Every lesson you finish is a permanent upgrade to how you see space and data."}
          </motion.p>

          {/* stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3"
          >
            <Stat label="Lessons" value={`${completed.length}/${TOTAL_LESSONS}`} />
            <Stat label="Progress" value={`${percent}%`} />
            <Stat label="Badges" value={`${earned.length}/${ACHIEVEMENTS.length}`} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            {!allDone && (
              <Button
                size="lg"
                onClick={() => {
                  const next = LESSONS.find((l) => !completed.includes(l.slug));
                  if (next) onNavigate(next.slug);
                }}
              >
                Continue learning
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={handleReset}>
              <RotateCcw className="mr-1.5 size-4" />
              Reset progress
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Your collection"
            title="Achievements"
            description={`${earned.length} of ${ACHIEVEMENTS.length} unlocked.`}
            accent="amber"
            icon={<Trophy className="size-3.5" />}
          />
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/50 bg-card/40 p-6 sm:grid-cols-3 lg:grid-cols-5">
            {ACHIEVEMENTS.map((a, i) => (
              <AchievementBadge
                key={a.id}
                achievement={a}
                earned={earned.some((e) => e.id === a.id)}
                index={i}
                size="lg"
              />
            ))}
          </div>
        </div>
      </section>

      {/* LESSON RECAP */}
      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The road so far"
            title="Lessons covered"
            accent="emerald"
            icon={<BookOpen className="size-3.5" />}
          />
          <div className="space-y-2">
            {LESSONS.map((lesson, i) => {
              const done = completed.includes(lesson.slug);
              return (
                <motion.button
                  key={lesson.slug}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => onNavigate(lesson.slug)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-border/50 bg-card/40 p-3 text-left transition-all hover:border-primary/40 hover:bg-card/70"
                >
                  {done ? (
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="size-5 shrink-0 text-muted-foreground/40" />
                  )}
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/40 font-mono text-xs font-bold text-muted-foreground">
                    {lesson.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {lesson.title}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {lesson.tagline}
                    </div>
                  </div>
                  <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                    <Clock className="size-3" />
                    {lesson.durationMin}m
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-4 text-center">
      <div className="font-mono text-2xl font-bold text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
