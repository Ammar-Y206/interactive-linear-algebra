"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, ArrowRight, Box, Crosshair, Quote, Network, Layers3 } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ConceptCheck } from "@/components/course/concept-check";
import { Confetti } from "@/components/course/confetti";
import { NonsquareSim } from "@/components/simulations/nonsquare-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface NonsquareLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "shape", label: "Shape = dimension map" },
  { id: "explore", label: "Explore the three cases" },
  { id: "fullrank", label: "Full rank, non-square" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function NonsquareLesson({ onNavigate }: NonsquareLessonProps) {
  const lesson = getLessonBySlug("nonsquare-matrices")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("nonsquare-matrices");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("nonsquare-matrices");
  const prev = getPrevLesson("nonsquare-matrices");

  function handleComplete() {
    completeLesson("nonsquare-matrices");
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

      <section id="shape" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Read the shape" title="m × n: n dimensions in, m out" description="The shape of a matrix tells you the journey. n columns = n input basis vectors (input dimension). m rows = how many coordinates each landing spot needs (output dimension)." accent="cyan" icon={<Network className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-3">
            <ShapeCard icon={<ArrowUp className="size-5" />} shape="3×2" title="2D → 3D" body="2 columns (2D input), 3 rows (3D output). Lifts the plane into a slice of space." accent="emerald" />
            <ShapeCard icon={<ArrowDown className="size-5" />} shape="2×3" title="3D → 2D" body="3 columns (3D input), 2 rows (2D output). Projects space onto the plane." accent="amber" />
            <ShapeCard icon={<ArrowRight className="size-5" />} shape="1×2" title="2D → 1D" body="2 columns (2D input), 1 row (a number). Squishes the plane onto the number line." accent="rose" />
          </div>
        </div>
      </section>

      <section id="explore" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="See it move" title="Travel between dimensions" description="Switch modes and watch an input vector journey to its output — across dimensions. Same basis-vector idea, just crossing a dimension boundary." accent="emerald" icon={<Box className="size-3.5" />} />
          <NonsquareSim />
        </div>
      </section>

      <section id="fullrank" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="A subtlety" title="Full rank doesn't require square" description="A 3×2 matrix's column space is a 2D plane inside 3D — but since the input is also 2D, no information was lost. It's full rank. Rank compares to the input dimension, not the output." accent="amber" icon={<Layers3 className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">When outputs have <strong>fewer</strong> dimensions than inputs (e.g. 3D→2D), a dimension is lost and the null space is non-trivial. When outputs have <strong>more</strong> (2D→3D), nothing is lost — but you can never fill all of the output space, only a slice of it.</p>
          </motion.div>
          <div className="mt-5">
            <ConceptCheck accent="amber" prompt="A 2×3 matrix maps 3D to 2D. Is its null space trivial (just {0})?" answer="No — it's non-trivial. Collapsing 3D to 2D loses a dimension, so there's a whole line of 3D input vectors that get crushed onto the origin. Whenever output dimension < input dimension, information is lost and the null space has dimension ≥ 1." />
          </div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="nonsquare-matrices" questions={lesson.quiz} />
        </div>
      </section>

      <section id="summary" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Takeaways" title="What to remember" accent="emerald" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard index={0} icon={<Network className="size-5" />} accent="cyan" title="Shape = dimension map" body="An m×n matrix takes n-D inputs to m-D outputs. Columns = input dimension; rows = output dimension." formula="m×n : n-D → m-D" />
            <SummaryCard index={1} icon={<ArrowUp className="size-5" />} accent="emerald" title="3×2 lifts 2D → 3D" body="Embeds the plane as a 2D slice of space. Full rank (no loss), but can't reach all of 3D — only the slice." />
            <SummaryCard index={2} icon={<ArrowDown className="size-5" />} accent="amber" title="2×3 projects 3D → 2D" body="Collapses space onto the plane. A line of 3D inputs maps to each 2D point; the null space is non-trivial." />
            <SummaryCard index={3} icon={<ArrowRight className="size-5" />} accent="rose" title="1×2 squishes 2D → 1D" body="Each basis vector lands on a single number. The seed of the dot product — and duality." />
          </div>
          <motion.blockquote initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }} className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6">
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">2D vector inputs are very different animals from 3D vector outputs, living in a completely separate space.</p>
            <p className="mt-3 text-sm text-muted-foreground">— why we show input and output as distinct spaces</p>
          </motion.blockquote>
        </div>
      </section>

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}

function ShapeCard({ icon, shape, title, body, accent }: { icon: React.ReactNode; shape: string; title: string; body: string; accent: "emerald" | "amber" | "rose" }) {
  const a = { emerald: "bg-emerald-500/15 text-emerald-300", amber: "bg-amber-500/15 text-amber-300", rose: "bg-rose-500/15 text-rose-300" }[accent];
  return (
    <div className="card-lift rounded-2xl border border-border/50 bg-card/40 p-5">
      <div className="flex items-center justify-between">
        <div className={`flex size-9 items-center justify-center rounded-xl ${a}`}>{icon}</div>
        <span className="font-mono text-lg font-bold text-foreground">{shape}</span>
      </div>
      <h3 className="mt-3 font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
