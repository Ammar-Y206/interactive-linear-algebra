"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rewind, Scissors, Layers3, Crosshair, Sigma, Quote, Network, ArrowRight } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ConceptCheck } from "@/components/course/concept-check";
import { Confetti } from "@/components/course/confetti";
import { InverseSim } from "@/components/simulations/inverse-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface InverseLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "system", label: "Ax = v, geometrically" },
  { id: "inverse", label: "The inverse A⁻¹" },
  { id: "singular", label: "det = 0: no inverse" },
  { id: "rank", label: "Rank & column space" },
  { id: "null", label: "The null space" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function InverseLesson({ onNavigate }: InverseLessonProps) {
  const lesson = getLessonBySlug("inverse-matrices")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("inverse-matrices");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("inverse-matrices");
  const prev = getPrevLesson("inverse-matrices");

  function handleComplete() {
    completeLesson("inverse-matrices");
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

      <section id="system" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The reframe" title="A·x = v means 'which x lands on v?'" description="A linear system is a hunt: given a transformation A and a target v, find the input vector x that A sends to v. Geometry makes a tangle of equations into one clean picture." accent="emerald" icon={<Network className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-lg">
              <span className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-amber-300">A</span>
              <span className="text-muted-foreground">·</span>
              <span className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-rose-300">x</span>
              <span className="text-muted-foreground">=</span>
              <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-emerald-300">v</span>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">A is the transformation. x is the unknown input. v is where it should land. Solve = rewind A to find x.</p>
          </motion.div>
        </div>
      </section>

      <section id="inverse" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The reverse" title="The inverse plays the tape backward" description="When det ≠ 0, there's a unique reverse transformation A⁻¹. Apply it to v and you recover x. A⁻¹·A = I: doing A then A⁻¹ is the same as doing nothing." accent="cyan" icon={<Rewind className="size-3.5" />} />
          <InverseSim />
          <div className="mt-5">
            <ConceptCheck accent="cyan" prompt="If A is a 90° counterclockwise rotation, what is A⁻¹?" answer="A 90° clockwise rotation — the exact reverse. Applying A then A⁻¹ returns every vector to where it started, which is the identity. The inverse of any rotation is just rotating back the same amount." />
          </div>
        </div>
      </section>

      <section id="singular" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="When it breaks" title="det = 0: no inverse" description="If the transformation squished space into a lower dimension, information was lost — many inputs map to the same output. A function can't undo that. No inverse exists." accent="rose" icon={<Scissors className="size-3.5" />} />
          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300"><Scissors className="size-5" /></div><h3 className="font-semibold text-foreground">You can't un-squish</h3></div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A line can't be turned back into a plane by a function — each input would have to map to a whole line of outputs, but functions give one output per input. The dimension loss is permanent.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-2xl border border-border/50 bg-card/40 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300"><Crosshair className="size-5" /></div><h3 className="font-semibold text-foreground">But a solution might still exist</h3></div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Even with det=0, if v happens to lie on the squished line, there are infinitely many solutions (every input on a parallel line maps to it). If v is off the line, there are none.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="rank" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Measuring the output" title="Rank & column space" description="Column space = the span of the columns = every possible output. Rank = its dimension. Full rank means no dimension was lost; otherwise the transformation collapsed something." accent="emerald" icon={<Layers3 className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-3">
            <RankCard n="1" desc="All outputs land on a line. Rank 1." color="rose" />
            <RankCard n="2" desc="Outputs fill a plane. Rank 2." color="amber" />
            <RankCard n="3" desc="Outputs fill all of 3D. Rank 3 — full rank." color="emerald" />
          </div>
        </div>
      </section>

      <section id="null" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="What lands on zero" title="The null space" description="The set of input vectors that the transformation crushes onto the origin. Full rank → just {0}. Each dimension lost adds a line or plane to the null space." accent="cyan" icon={<Sigma className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <h3 className="font-semibold text-foreground">The bigger the collapse, the bigger the null space</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><ArrowRight className="mt-0.5 size-4 shrink-0 text-cyan-300" />3D → plane: a <strong>line</strong> of vectors lands on zero.</li>
              <li className="flex gap-2"><ArrowRight className="mt-0.5 size-4 shrink-0 text-cyan-300" />3D → line: a whole <strong>plane</strong> of vectors lands on zero.</li>
              <li className="flex gap-2"><ArrowRight className="mt-0.5 size-4 shrink-0 text-cyan-300" />Full rank: only the <strong>zero vector</strong> lands on zero.</li>
            </ul>
          </motion.div>
          <div className="mt-5">
            <ConceptCheck accent="cyan" prompt="A 3D transformation squishes space onto a 2D plane. Roughly how big is its null space?" answer="A whole line of input vectors gets crushed onto the origin — a 1-dimensional null space. Every dimension you lose becomes a dimension in the null space: 3D→2D loses 1, so null space is 1D; 3D→line loses 2, so null space is 2D." />
          </div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="inverse-matrices" questions={lesson.quiz} />
        </div>
      </section>

      <section id="summary" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Takeaways" title="What to remember" accent="emerald" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard index={0} icon={<Rewind className="size-5" />} accent="emerald" title="A·x = v: find the input" body="Solving a linear system = rewinding the transformation to find which input lands on v." formula="x = A⁻¹·v" />
            <SummaryCard index={1} icon={<Scissors className="size-5" />} accent="rose" title="det = 0 → no inverse" body="A squished transformation can't be undone. Information was lost; multiple inputs map to each output." formula="det ≠ 0 ⟺ A⁻¹ exists" />
            <SummaryCard index={2} icon={<Layers3 className="size-5" />} accent="amber" title="Column space = all outputs" body="The span of the columns. Rank is its dimension. Full rank = no dimension lost." formula="rank = dim(col space)" />
            <SummaryCard index={3} icon={<Sigma className="size-5" />} accent="cyan" title="Null space = what lands on 0" body="The inputs crushed to the origin. Bigger when more dimensions are lost; just {0} when full rank." formula="null(A) = {x : Ax = 0}" />
          </div>
          <motion.blockquote initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }} className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6">
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">You can hold in your head this really complicated idea just by thinking about squishing and morphing space.</p>
            <p className="mt-3 text-sm text-muted-foreground">— why the geometric view is worth the effort</p>
          </motion.blockquote>
        </div>
      </section>

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}

function RankCard({ n, desc, color }: { n: string; desc: string; color: "rose" | "amber" | "emerald" }) {
  const a = { rose: "border-rose-500/30 bg-rose-500/5 text-rose-300", amber: "border-amber-500/30 bg-amber-500/5 text-amber-300", emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300" }[color];
  return (
    <div className={`rounded-2xl border ${a} p-5 text-center`}>
      <div className="font-mono text-3xl font-bold">rank {n}</div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
