"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, MousePointerClick, Brain, Compass, Map, Wand2, RotateCw, Expand } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ThoughtExperiment } from "@/components/course/thought-experiment";
import { Motivation } from "@/components/course/curriculum-sections";
import { Confetti } from "@/components/course/confetti";
import {
  CoordinatePlane,
  type PlaneVector,
  PLANE_COLORS,
} from "@/components/simulations/coordinate-plane";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface WelcomeLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "hook", label: "A thought experiment" },
  { id: "what", label: "What this really is" },
  { id: "how", label: "How we'll learn" },
  { id: "quiz", label: "Check your understanding" },
];

export function WelcomeLesson({ onNavigate }: WelcomeLessonProps) {
  const lesson = getLessonBySlug("welcome")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("welcome");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("welcome");
  const prev = getPrevLesson("welcome");

  // a simple live demo for the hook: a vector the learner can drag immediately
  const [v, setV] = useState({ x: 3, y: 2 });
  const hookVec: PlaneVector = {
    id: "hook",
    x: v.x,
    y: v.y,
    color: PLANE_COLORS.primary,
    draggable: true,
    label: `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`,
  };

  function handleComplete() {
    completeLesson("welcome");
    if (!done) { setCelebrate(true); setTimeout(() => setCelebrate(false), 2600); }
    const dest = next ? next.slug : "completion";
    setTimeout(() => onNavigate(dest), done ? 500 : 1400);
  }
  function handleNav(d: "prev" | "next") {
    if (d === "prev" && prev) onNavigate(prev.slug);
    if (d === "next" && next) onNavigate(next.slug);
    if (d === "next" && !next) onNavigate("completion");
  }

  return (
    <LessonLayout toc={TOC}>
      {celebrate && <Confetti count={100} durationMs={2600} />}
      <HeroSection lesson={lesson} />

      {/* HOOK — a visual thought experiment, not an announcement */}
      <ThoughtExperiment
        question="What if you could grab space itself — stretch it, rotate it, squish it flat — and a computer could feel every move?"
        tease="That's not a metaphor. It's literally what's happening inside every video game, every AI, every CGI film, every robot. This course teaches you the language that makes it possible."
        accent="emerald"
      >
        <div className="mx-auto max-w-[340px]">
          <CoordinatePlane
            vectors={[hookVec]}
            range={5}
            size={340}
            onVectorChange={(_id, x, y) => setV({ x, y })}
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Go ahead — drag the tip. That arrow is a <strong>vector</strong>. By Lesson 7 you&apos;ll
            understand exactly what it is, how to describe it with numbers, and why it&apos;s the atom
            everything else is built from.
          </p>
        </div>
      </ThoughtExperiment>

      <LearningObjectives objectives={lesson.objectives} />

      {/* WHAT — intuition first, via the three acts as a visual */}
      <section id="what" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The subject, stripped down"
            title="This isn't a course about formulas"
            description="Linear algebra is the mathematics of space, movement, and structure. Forget the textbook definition — here's what it actually feels like."
            accent="emerald"
            icon={<Compass className="size-3.5" />}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Pillar icon={<Map className="size-5" />} accent="emerald" title="Describe space" body="Vectors pinpoint locations and directions. A grid of numbers becomes a world you can navigate." />
            <Pillar icon={<Wand2 className="size-5" />} accent="amber" title="Move space" body="Transformations rotate, stretch, and shear the whole grid at once. A matrix is a frozen record of such a movement." />
            <Pillar icon={<Brain className="size-5" />} accent="rose" title="Find structure" body="Beneath the movement: which directions survive? Which collapse? Which are special? That structure powers AI, physics, and graphics." />
          </div>
        </div>
      </section>

      {/* HOW — the method as a rhythm, not a lecture */}
      <section id="how" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The method"
            title="See it. Move it. Then name it."
            description="Every concept starts as something you can touch. We build the feeling first, then attach the notation — so the symbols mean something instead of just being noise."
            accent="cyan"
            icon={<MousePointerClick className="size-3.5" />}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Step n="1" icon={<Eye className="size-5" />} accent="emerald" title="See it" body="Every concept begins as a picture — arrows, morphing grids, perpendicular vectors. You watch before you read." />
            <Step n="2" icon={<MousePointerClick className="size-5" />} accent="amber" title="Move it" body="Drag the tips. Slide the scalars. Watch the math respond. You don't read about linear algebra here — you play with it." />
            <Step n="3" icon={<Brain className="size-5" />} accent="rose" title="Name it" body="Once the intuition clicks, we attach the symbol. Now 'det = 6' means something you've already felt — not a formula to memorize." />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-5 rounded-2xl border border-border/50 bg-card/40 p-5 text-sm leading-relaxed text-muted-foreground"
          >
            <p>
              By the final lesson you won&apos;t just know <em>that</em> matrices transform space —
              you&apos;ll <strong>feel</strong> it. You&apos;ll see a matrix and instinctively picture
              the grid morphing. And you&apos;ll understand why a neural network, a Pixar film, and a
              self-driving car are all, at their core, doing the same thing: moving space with numbers.
            </p>
          </motion.div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="welcome" questions={lesson.quiz} />
        </div>
      </section>

      <Motivation canUnderstand="the journey ahead — why every lesson exists and where it's all leading" accent="emerald" />

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}

function Pillar({ icon, accent, title, body }: { icon: React.ReactNode; accent: "emerald" | "amber" | "rose"; title: string; body: string }) {
  const a = { emerald: "bg-emerald-500/15 text-emerald-300", amber: "bg-amber-500/15 text-amber-300", rose: "bg-rose-500/15 text-rose-300" }[accent];
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4 }} className="rounded-2xl border border-border/50 bg-card/40 p-5">
      <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${a}`}>{icon}</div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </motion.div>
  );
}
function Step({ n, icon, accent, title, body }: { n: string; icon: React.ReactNode; accent: "emerald" | "amber" | "rose"; title: string; body: string }) {
  const a = { emerald: "bg-emerald-500/15 text-emerald-300", amber: "bg-amber-500/15 text-amber-300", rose: "bg-rose-500/15 text-rose-300" }[accent];
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
      <div className="flex items-center justify-between">
        <div className={`flex size-10 items-center justify-center rounded-xl ${a}`}>{icon}</div>
        <span className="font-mono text-2xl font-bold text-muted-foreground/30">{n}</span>
      </div>
      <h3 className="mt-3 font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
