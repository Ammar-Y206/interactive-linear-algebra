"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crosshair, Sigma, Quote, Layers3, Network, ArrowRight, Grid2x2, Zap } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ConceptCheck } from "@/components/course/concept-check";
import { Confetti } from "@/components/course/confetti";
import { CramersRuleSim } from "@/components/simulations/cramers-rule-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface CramersRuleLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "coords", label: "Coordinates as areas" },
  { id: "scale", label: "Areas scale by det(A)" },
  { id: "rule", label: "Cramer's rule" },
  { id: "place", label: "When to use it" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function CramersRuleLesson({ onNavigate }: CramersRuleLessonProps) {
  const lesson = getLessonBySlug("cramers-rule")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("cramers-rule");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("cramers-rule");
  const prev = getPrevLesson("cramers-rule");

  function handleComplete() {
    completeLesson("cramers-rule");
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

      <section id="coords" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="A strange reframe" title="Coordinates as signed areas" description="The y-coordinate of a vector = the signed area of the parallelogram it spans with î. The x-coordinate = the area with ĵ. A roundabout description — but one that survives transformations intact." accent="cyan" icon={<Grid2x2 className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300"><Layers3 className="size-5" /></div><h3 className="font-semibold text-foreground">y = area with î</h3></div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The parallelogram spanned by î = (1,0) and (x,y) has base 1 and height |y|. Its signed area is exactly y — a geometric encoding of the y-coordinate.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300"><Grid2x2 className="size-5" /></div><h3 className="font-semibold text-foreground">x = area with ĵ</h3></div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Symmetrically, the parallelogram with ĵ = (0,1) has signed area x. Two signed areas, two coordinates — a weird but powerful description.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="scale" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The key property" title="Areas scale by det(A)" description="Under a transformation A, every area scales by the same factor — the determinant. So the transformed encoding-parallelogram has area = det(A) × the original coordinate. Divide and you recover the coordinate." accent="emerald" icon={<Sigma className="size-3.5" />} />
          <CramersRuleSim />
          <div className="mt-5">
            <ConceptCheck accent="emerald" prompt="Why is it useful to describe a coordinate as a signed area, rather than just a number?" answer="Because areas scale predictably under linear transformations — every area multiplies by det(A). Numbers (like dot products with basis vectors) don't generally survive a transformation intact, but signed areas do, scaled by the determinant. That invariance is what Cramer's rule exploits." />
          </div>
        </div>
      </section>

      <section id="rule" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The formula" title="Cramer's rule" description="To find coordinate i of the input: replace column i of A with the output vector v, take that determinant, divide by det(A). Each coordinate is a ratio of two determinants." accent="rose" icon={<Network className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-center gap-2">
                <span className="text-amber-300">x</span>
                <span className="text-muted-foreground">= det([v | ĵ']) / det(A)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-300">y</span>
                <span className="text-muted-foreground">= det([î' | v]) / det(A)</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">The numerator is the scaled encoding-area (now in the output space, using v in place of the unknown). The denominator undoes the scaling. The coordinate falls out.</p>
          </motion.div>
        </div>
      </section>

      <section id="place" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Honest perspective" title="Beautiful, not fast" description="Cramer's rule is a cultural excursion — not the method computers use. Gaussian elimination is faster. But as a conceptual unifier of determinants, areas, and linear systems, it's hard to beat." accent="amber" icon={<Zap className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300"><Crosshair className="size-5" /></div><h3 className="font-semibold text-foreground">Its gift: clarity</h3></div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Cramer's rule makes the relationship between determinants and solutions explicit. You SEE why det=0 breaks everything, and why a unique solution exists precisely when det ≠ 0.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300"><Zap className="size-5" /></div><h3 className="font-semibold text-foreground">Its limit: speed</h3></div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Computing many determinants is slower than row-reduction. For real systems, use Gaussian elimination. Cramer's rule is for understanding, not for crunching.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="cramers-rule" questions={lesson.quiz} />
        </div>
      </section>

      <section id="summary" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Takeaways" title="What to remember" accent="emerald" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard index={0} icon={<Grid2x2 className="size-5" />} accent="cyan" title="Coordinates = signed areas" body="The y-coordinate = signed area with î; the x-coordinate = signed area with ĵ. A roundabout encoding, but it survives transformations." />
            <SummaryCard index={1} icon={<Sigma className="size-5" />} accent="emerald" title="Areas scale by det(A)" body="Every area multiplies by the determinant under a transformation. So the encoding-area becomes det(A) × the coordinate." formula="area' = det(A) · coord" />
            <SummaryCard index={2} icon={<Network className="size-5" />} accent="rose" title="Cramer's rule" body="Coordinate i = det(A with column i replaced by v) / det(A). A ratio of two determinants per coordinate." formula="xᵢ = det(Aᵢ)/det(A)" />
            <SummaryCard index={3} icon={<Zap className="size-5" />} accent="amber" title="Elegant, not efficient" body="Conceptually gorgeous — ties determinants, areas, and systems together. Computationally slower than Gaussian elimination. det=0 breaks it (no unique solution)." />
          </div>
          <motion.blockquote initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6">
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">From a purely artistic standpoint the ultimate result here is just really pretty to think about.</p>
            <p className="mt-3 text-sm text-muted-foreground">— why Cramer's rule is worth knowing despite being slower</p>
          </motion.blockquote>
        </div>
      </section>

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}
