"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crosshair, FlipHorizontal, Sigma, Quote, Network, ArrowRight, Box } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ConceptCheck } from "@/components/course/concept-check";
import { Confetti } from "@/components/course/confetti";
import { DotProductSim } from "@/components/simulations/dot-product-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface DotProductLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "compute", label: "The computation" },
  { id: "geometry", label: "Projection × length" },
  { id: "order", label: "Why order doesn't matter" },
  { id: "duality", label: "Duality" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function DotProductLesson({ onNavigate }: DotProductLessonProps) {
  const lesson = getLessonBySlug("dot-products")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("dot-products");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("dot-products");
  const prev = getPrevLesson("dot-products");

  function handleComplete() {
    completeLesson("dot-products");
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

      <section id="compute" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The arithmetic" title="Pair, multiply, add" description="The dot product is simple arithmetic: pair up coordinates, multiply each pair, sum the results. The geometry is the prize — but first, the computation." accent="emerald" icon={<Sigma className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-lg">
              <span>(1, 2)</span><span className="text-muted-foreground">·</span><span>(3, 4)</span><span className="text-muted-foreground">=</span>
              <span className="text-amber-300">1·3</span><span className="text-muted-foreground">+</span><span className="text-emerald-300">2·4</span><span className="text-muted-foreground">=</span>
              <span className="rounded-md bg-rose-500/15 px-2 py-1 font-bold text-rose-300">11</span>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">Pair coordinates, multiply each pair, add. That's the entire computation.</p>
          </motion.div>
        </div>
      </section>

      <section id="geometry" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The geometry" title="Projection × length" description="v·w = (length of w's projection onto v) × (length of v). The sign tells you direction: positive (same way), zero (perpendicular), negative (opposite)." accent="cyan" icon={<Crosshair className="size-3.5" />} />
          <DotProductSim />
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <SignCard sign="+" title="Same direction" body="Vectors point broadly the same way. The projection is positive." color="emerald" />
            <SignCard sign="0" title="Perpendicular" body="Projection lands on the origin — zero length, zero dot product." color="amber" />
            <SignCard sign="−" title="Opposite" body="Vectors point away from each other. Projection is negative." color="rose" />
          </div>
        </div>
      </section>

      <section id="order" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="A surprise" title="Order doesn't matter" description="Projecting w onto v × |v| feels different from projecting v onto w × |w|. Yet they give the same number. Here's why." accent="amber" icon={<FlipHorizontal className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <h3 className="font-semibold text-foreground">Symmetry, then scaling</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">If v and w had equal length, the two views are mirror images — same answer. If you scale one (say double v), the projection of w onto v doesn't change, but |v| doubles — so the product doubles. Under the other view, the projection of v onto w doubles, but |w| stays — product still doubles. Both interpretations scale identically, so they always agree.</p>
          </motion.div>
          <div className="mt-5">
            <ConceptCheck accent="amber" prompt="Two vectors are perpendicular. What's their dot product, and why?" answer="Zero. If they're perpendicular, projecting one onto the other lands on the origin — a zero-length projection. And projection × length = 0 × anything = 0. This is why v·w = 0 is the standard test for perpendicularity." />
          </div>
        </div>
      </section>

      <section id="duality" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The deep reason" title="Duality: a vector IS a tipped-over matrix" description="A transformation from 2D to the number line is described by a 1×2 matrix — where î and ĵ each land as numbers. That row of two numbers is exactly a 2D vector tipped on its side. Applying the matrix = taking a dot product with that vector." accent="rose" icon={<Network className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-rose-300">The correspondence</div>
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-base">
              <div className="flex items-center gap-0.5"><span className="text-muted-foreground/60">[</span><div className="flex flex-col gap-0.5"><span className="w-8 text-center text-amber-300">u_x</span><span className="w-8 text-center text-amber-300">u_y</span></div><span className="text-muted-foreground/60">]</span></div>
              <ArrowRight className="size-4 text-rose-300" />
              <span className="rounded bg-amber-500/15 px-2 py-1 text-amber-300">û</span>
              <span className="text-muted-foreground">(a vector)</span>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">Any linear map from vectors to numbers corresponds to a unique vector. Applying the map = dotting with that vector. The vector is the physical embodiment of the transformation.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-5 rounded-2xl border border-border/50 bg-card/40 p-5">
            <h3 className="font-semibold text-foreground">Why this explains projection</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Projecting space onto a diagonal number line <em>is</em> a linear map from 2D to 1D. By duality, that map corresponds to a vector — the unit vector û along the line. So projecting onto the line = dotting with û. The dot product's connection to projection isn't a coincidence; it's duality.</p>
          </motion.div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="dot-products" questions={lesson.quiz} />
        </div>
      </section>

      <section id="summary" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Takeaways" title="What to remember" accent="emerald" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard index={0} icon={<Sigma className="size-5" />} accent="emerald" title="Pair, multiply, add" body="The dot product pairs coordinates, multiplies, and sums. Simple arithmetic — but it encodes geometry." formula="(a,b)·(c,d) = ac+bd" />
            <SummaryCard index={1} icon={<Crosshair className="size-5" />} accent="cyan" title="= projection × length" body="v·w = |proj of w onto v| × |v|. Sign tracks direction; zero means perpendicular." formula="v·w = |proj|·|v|" />
            <SummaryCard index={2} icon={<FlipHorizontal className="size-5" />} accent="amber" title="Order doesn't matter" body="v·w = w·v. Both projection views scale identically, so they always agree." formula="v·w = w·v" />
            <SummaryCard index={3} icon={<Network className="size-5" />} accent="rose" title="Duality" body="A 1×2 matrix (a map to the number line) IS a vector tipped over. Every vector embodies a transformation; applying it = dotting." formula="1×2 matrix ↔ vector" />
          </div>
          <motion.blockquote initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }} className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6">
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">Dotting two vectors together is a way to translate one of them into the world of transformations.</p>
            <p className="mt-3 text-sm text-muted-foreground">— the deeper meaning of the dot product</p>
          </motion.blockquote>
        </div>
      </section>

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}

function SignCard({ sign, title, body, color }: { sign: string; title: string; body: string; color: "emerald" | "amber" | "rose" }) {
  const a = { emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300", amber: "border-amber-500/30 bg-amber-500/5 text-amber-300", rose: "border-rose-500/30 bg-rose-500/5 text-rose-300" }[color];
  return (
    <div className={`rounded-2xl border ${a} p-5 text-center`}>
      <div className="font-mono text-3xl font-bold">{sign}</div>
      <h3 className="mt-2 font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
