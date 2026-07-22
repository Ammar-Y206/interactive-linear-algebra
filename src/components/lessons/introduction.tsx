"use client";

/**
 * IntroductionPage
 * ----------------------------------------------------------------
 * The course landing page. Sets the tone, previews the journey,
 * shows achievements to chase, and gets the learner started.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Sparkles,
  Eye,
  MousePointerClick,
  Brain,
  Trophy,
  Compass,
  Layers,
  TrendingUp,
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

export interface IntroductionPageProps {
  onNavigate: (slug: string) => void;
}

export function IntroductionPage({ onNavigate }: IntroductionPageProps) {
  const markStarted = useProgressStore((s) => s.markStarted);
  const completed = useProgressStore((s) => s.completed);
  const achievementIds = useProgressStore((s) => s.achievements);
  const earned = earnedAchievements(achievementIds);
  const firstLesson = LESSONS[0];

  function start() {
    markStarted();
    onNavigate(firstLesson.slug);
  }

  const pillars = [
    {
      icon: <Eye className="size-5" />,
      title: "See it first",
      body: "Every concept begins as a picture. Geometry before symbols, intuition before proofs.",
      accent: "text-emerald-300 bg-emerald-500/15",
    },
    {
      icon: <MousePointerClick className="size-5" />,
      title: "Play with it",
      body: "Drag vectors, tweak scalars, watch the math respond. Simulations, not lectures.",
      accent: "text-amber-300 bg-amber-500/15",
    },
    {
      icon: <Brain className="size-5" />,
      title: "Then name it",
      body: "Once the intuition clicks, the notation and theorems slot right in — and stick.",
      accent: "text-rose-300 bg-rose-500/15",
    },
  ];

  return (
    <div className="relative">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="bg-aurora pointer-events-none absolute inset-0" />
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm"
          >
            <Sparkles className="size-3.5 text-emerald-400" />
            An interactive course in linear algebra
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Learn linear algebra
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
              by seeing it move.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Vectors, spaces, and transformations — built up one intuition at a time.
            Drag, stretch, and combine. The math will follow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button size="lg" onClick={start} className="group h-12 px-7 text-base">
              <GraduationCap className="mr-1.5 size-5" />
              {completed.length > 0 ? "Continue learning" : "Start lesson 1"}
              <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Layers className="size-4 text-emerald-400" />
                {TOTAL_LESSONS} lesson{TOTAL_LESSONS > 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="size-4 text-amber-400" />~{TOTAL_DURATION_MIN} min
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== PILLARS ===== */}
      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="The method"
            title="See. Play. Then name it."
            description="Most courses throw symbols at you and hope intuition shows up later. We flip the order."
            accent="emerald"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="rounded-2xl border border-border/50 bg-card/40 p-6"
              >
                <div
                  className={`mb-4 flex size-11 items-center justify-center rounded-xl ${p.accent}`}
                >
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COURSE MAP ===== */}
      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="The journey"
            title="What you'll learn"
            description="A growing map of the territory. Each lesson links the geometric picture to the numbers underneath."
            accent="amber"
            icon={<Compass className="size-3.5" />}
          />
          <div className="space-y-3">
            {LESSONS.map((lesson, i) => {
              const done = completed.includes(lesson.slug);
              return (
                <motion.button
                  key={lesson.slug}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => {
                    markStarted();
                    onNavigate(lesson.slug);
                  }}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-card/40 p-4 text-left transition-all hover:border-primary/40 hover:bg-card/70 sm:p-5"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/40 font-mono text-lg font-bold text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                    {lesson.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                      {done && <Trophy className="size-4 text-amber-400" />}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {lesson.tagline}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {lesson.objectives.slice(0, 3).map((o) => (
                        <span
                          key={o.title}
                          className="rounded-full border border-border/40 bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {o.title}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden shrink-0 flex-col items-end gap-1 text-right sm:flex">
                    <span className="text-xs text-muted-foreground">
                      {lesson.durationMin} min
                    </span>
                    <span className="text-xs font-medium text-primary">{lesson.difficulty}</span>
                  </div>
                  <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ACHIEVEMENTS ===== */}
      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Motivation"
            title="Achievements to earn"
            description="Small milestones that mark real understanding. They stick around in your sidebar."
            accent="amber"
            icon={<Trophy className="size-3.5" />}
          />
          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-border/50 bg-card/40 p-6 sm:grid-cols-5">
            {ACHIEVEMENTS.map((a, i) => (
              <AchievementBadge
                key={a.id}
                achievement={a}
                earned={earned.some((e) => e.id === a.id)}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="px-5 pb-20 pt-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card/40 to-amber-500/10 p-8 text-center sm:p-12"
          >
            <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 opacity-20" />
            <div className="relative">
              <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Ready to meet the vector?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-balance text-muted-foreground">
                It's the atom everything else is built from. Ten minutes from now
                you'll see why.
              </p>
              <Button size="lg" onClick={start} className="mt-6 h-12 px-7 text-base">
                Begin Lesson 1
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
