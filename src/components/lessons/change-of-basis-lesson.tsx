"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Languages, Network, ArrowRight, Crosshair, Sigma, Quote, ArrowLeft } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ConceptCheck } from "@/components/course/concept-check";
import { Confetti } from "@/components/course/confetti";
import { ChangeOfBasisSim } from "@/components/simulations/change-of-basis-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface ChangeOfBasisLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "language", label: "Coordinates are a language" },
  { id: "matrix", label: "The change-of-basis matrix" },
  { id: "inverse", label: "Going the other way" },
  { id: "transform", label: "Re-expressing transformations: A⁻¹MA" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function ChangeOfBasisLesson({ onNavigate }: ChangeOfBasisLessonProps) {
  const lesson = getLessonBySlug("change-of-basis")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("change-of-basis");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("change-of-basis");
  const prev = getPrevLesson("change-of-basis");

  function handleComplete() {
    completeLesson("change-of-basis");
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

      <section id="language" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The setup" title="Coordinates are a language" description="The same vector has different numbers under different bases. You and Jennifer look at the same arrow — but her (1,0) is your (2,1). The vector is real; the coordinates are a choice." accent="violet" icon={<Languages className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <h3 className="font-semibold text-foreground">Your basis: î, ĵ</h3>
              <p className="mt-2 text-sm text-muted-foreground">î = (1,0), ĵ = (0,1). Coordinates mean 'this much î, this much ĵ'. The grid you see is YOUR construct — space has no intrinsic grid.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
              <h3 className="font-semibold text-foreground">Jennifer's basis: b₁, b₂</h3>
              <p className="mt-2 text-sm text-muted-foreground">b₁ = (2,1), b₂ = (−1,1) in your language. But to her, b₁ IS (1,0) and b₂ IS (0,1). Same space, different words.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="matrix" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The translator" title="The change-of-basis matrix" description="Put Jennifer's basis vectors (in your coordinates) as columns. Multiplying by it takes her coordinates and outputs yours — transforming your grid into hers." accent="cyan" icon={<Network className="size-3.5" />} />
          <ChangeOfBasisSim />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <div className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300"><ArrowLeft className="size-5" /></div><div><h3 className="font-semibold text-foreground">The 'backwards' feeling</h3><p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Geometrically, the matrix moves your basis to hers. But numerically it translates <em>her</em> coordinates to <em>yours</em>. It takes your misconception — plotting her numbers on your grid — and transforms it into the vector she actually meant. Grid one way, meaning the other.</p></div></div>
          </motion.div>
        </div>
      </section>

      <section id="inverse" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Reverse translation" title="The inverse goes the other way" description="To translate your coordinates into Jennifer's, multiply by the inverse of the change-of-basis matrix — playing the transformation in reverse." accent="emerald" icon={<ArrowRight className="size-3.5" />} />
          <div className="mt-5">
            <ConceptCheck accent="emerald" prompt="If the change-of-basis matrix A translates Jennifer's coordinates to yours, what does A⁻¹ do?" answer="A⁻¹ translates your coordinates to Jennifer's. It's the reverse transformation — playing the tape backward. If A moves your grid to hers, A⁻¹ moves her grid back to yours, carrying coordinate meaning the other way." />
          </div>
        </div>
      </section>

      <section id="transform" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Mathematical empathy" title="Re-expressing a transformation: A⁻¹MA" description="To describe transformation M in Jennifer's language: translate her input to yours (A), apply M, translate back (A⁻¹). The sandwich A⁻¹MA is the same transformation, viewed from her coordinate system." accent="rose" icon={<Sigma className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
              <span className="rounded-lg bg-amber-500/10 px-2 py-1 text-amber-300">A⁻¹</span>
              <span className="text-muted-foreground">·</span>
              <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-emerald-300">M</span>
              <span className="text-muted-foreground">·</span>
              <span className="rounded-lg bg-cyan-500/10 px-2 py-1 text-cyan-300">A</span>
            </div>
            <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="text-cyan-300">translate in</span>
              <ArrowRight className="size-3" />
              <span className="text-emerald-300">apply M</span>
              <ArrowRight className="size-3" />
              <span className="text-amber-300">translate out</span>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">The outer A and A⁻¹ are 'empathy' — the shift in perspective. The result is the same transformation, but as Jennifer sees it.</p>
          </motion.div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="change-of-basis" questions={lesson.quiz} />
        </div>
      </section>

      <section id="summary" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Takeaways" title="What to remember" accent="emerald" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard index={0} icon={<Languages className="size-5" />} accent="violet" title="Coordinates are a choice" body="The same vector has different numbers under different bases. î, ĵ are one basis; any two non-collinear vectors form another." />
            <SummaryCard index={1} icon={<Network className="size-5" />} accent="cyan" title="[b₁|b₂] translates hers→yours" body="Columns = her basis in your coords. Multiply by her coordinates; get yours. The grid transforms one way, meaning the other." formula="yours = [b₁|b₂] · hers" />
            <SummaryCard index={2} icon={<ArrowRight className="size-5" />} accent="emerald" title="A⁻¹ translates yours→hers" body="The inverse plays the transformation in reverse, carrying your coordinates into her language." formula="hers = A⁻¹ · yours" />
            <SummaryCard index={3} icon={<Sigma className="size-5" />} accent="rose" title="A⁻¹MA re-expresses M" body="Translate in, apply M, translate out. The same transformation, viewed from Jennifer's coordinate system." formula="M_hers = A⁻¹MA" />
          </div>
          <motion.blockquote initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6">
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">A⁻¹MA suggests a mathematical sort of empathy — a shift in perspective.</p>
            <p className="mt-3 text-sm text-muted-foreground">— the deeper meaning of the sandwich</p>
          </motion.blockquote>
        </div>
      </section>

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}
