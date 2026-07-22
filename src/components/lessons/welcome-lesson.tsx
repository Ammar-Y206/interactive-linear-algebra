"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, MousePointerClick, Brain, Compass, Quote, Map } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { Motivation } from "@/components/course/curriculum-sections";
import { Confetti } from "@/components/course/confetti";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface WelcomeLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "what", label: "What linear algebra is" },
  { id: "how", label: "How this course teaches" },
  { id: "destination", label: "Where you'll arrive" },
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
      <LearningObjectives objectives={lesson.objectives} />

      <section id="what" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The subject" title="What linear algebra actually is" description="Forget the textbook definition for a moment. Linear algebra is the mathematics of space, movement, and structure — the language we use to describe how things stretch, rotate, combine, and transform." accent="emerald" icon={<Compass className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Pillar icon={<Map className="size-5" />} accent="emerald" title="Space" body="Linear algebra describes space itself — the grid, the origin, the directions. It's the geometry under every visual you've ever seen on a screen." />
            <Pillar icon={<Sparkles className="size-5" />} accent="amber" title="Movement" body="Transformations move space around — rotate it, stretch it, squish it. A matrix is just a frozen record of such a movement." />
            <Pillar icon={<Brain className="size-5" />} accent="rose" title="Structure" body="Beneath the movement lies structure: which directions survive, which collapse, which are special. That structure is what AI, physics, and graphics all exploit." />
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The method" title="How this course teaches" description="Most courses throw symbols at you and hope intuition arrives later. We flip it: see it, move it, feel it — then name it. Every concept starts as something you can touch." accent="cyan" icon={<MousePointerClick className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Step n="1" icon={<Eye className="size-5" />} accent="emerald" title="See it" body="Every concept begins as a picture. Vectors as arrows, transformations as morphing grids, eigenvalues as lines that survive." />
            <Step n="2" icon={<MousePointerClick className="size-5" />} accent="amber" title="Move it" body="Drag the tips. Slide the scalars. Watch the math respond in real time. You don't read about linear algebra here — you play with it." />
            <Step n="3" icon={<Brain className="size-5" />} accent="rose" title="Name it" body="Once the intuition clicks, we attach the notation. Now the symbols mean something — they're labels for ideas you already hold." />
          </div>
        </div>
      </section>

      <section id="destination" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The destination" title="Where you'll arrive" description="By the final lesson, you won't just know formulas — you'll hold a mental model of space, transformation, and structure that underlies modern technology. Here's the view from the summit." accent="violet" icon={<Compass className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-semibold text-foreground">You'll understand…</h4>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <li>• Vectors, span, and basis — the atoms of space</li>
                  <li>• Matrices as transformations of space</li>
                  <li>• Determinants as area and volume scaling</li>
                  <li>• Eigenvectors — the directions that survive</li>
                  <li>• Abstract vector spaces — even functions are vectors</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">You'll be ready for…</h4>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <li>• Machine learning and neural networks</li>
                  <li>• 3D graphics and game development</li>
                  <li>• Computer vision and image processing</li>
                  <li>• Physics and robotics simulations</li>
                  <li>• Data science and dimensionality reduction</li>
                </ul>
              </div>
            </div>
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
    <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
      <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${a}`}>{icon}</div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
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
