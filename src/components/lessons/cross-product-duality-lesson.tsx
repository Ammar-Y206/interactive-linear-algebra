"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Crosshair, Sigma, Quote, Network, Layers3, ArrowRight, Eye } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ConceptCheck } from "@/components/course/concept-check";
import { Confetti } from "@/components/course/confetti";
import { CrossProductDualitySim } from "@/components/simulations/cross-product-duality-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface CrossProductDualityLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "transform", label: "The volume transformation" },
  { id: "dual", label: "Find the dual vector" },
  { id: "connect", label: "Computation = geometry" },
  { id: "perp", label: "Why perpendicular" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function CrossProductDualityLesson({ onNavigate }: CrossProductDualityLessonProps) {
  const lesson = getLessonBySlug("cross-products-duality")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("cross-products-duality");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("cross-products-duality");
  const prev = getPrevLesson("cross-products-duality");

  function handleComplete() {
    completeLesson("cross-products-duality");
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

      <section id="transform" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The setup" title="A transformation to the number line" description="Fix v and w. Map any input (x,y,z) to the signed volume of the parallelepiped it forms with v and w. This is a linear function from 3D to a single number." accent="violet" icon={<Box className="size-3.5" />} />
          <CrossProductDualitySim />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
            <div className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Sigma className="size-5" /></div><div><h3 className="font-semibold text-foreground">It's linear</h3><p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">The signed volume of a parallelepiped scales linearly with any one of its edge vectors. So this is a linear transformation from 3D vectors to numbers — and by duality, it has a dual vector p such that applying it = dotting with p.</p></div></div>
          </motion.div>
        </div>
      </section>

      <section id="dual" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Duality enters" title="The dual vector is v × w" description="By duality (Lesson 9), every 3D→1D linear map has a unique dual vector p where applying the map = dotting with p. For the volume transformation, that dual vector is exactly v × w." accent="rose" icon={<Network className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-sm">
              <span className="text-muted-foreground">volume(u)</span>
              <ArrowRight className="size-4 text-violet-300" />
              <span className="text-muted-foreground">u · p</span>
              <span className="text-muted-foreground">=</span>
              <span className="rounded bg-rose-500/15 px-2 py-1 text-rose-300">u · (v × w)</span>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">The dual vector p is v × w. Computing the volume = dotting with the cross product.</p>
          </motion.div>
        </div>
      </section>

      <section id="connect" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Two paths, one vector" title="Computation meets geometry" description="Computationally, the dual's coordinates come from the î/ĵ/k̂ determinant trick. Geometrically, the dual must be perpendicular to v, w with length = area. Same transformation, same dual — so the trick and the geometry agree." accent="emerald" icon={<Eye className="size-3.5" />} />
          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300"><Sigma className="size-5" /></div><h3 className="font-semibold text-foreground">Computation path</h3></div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Expand det([î,ĵ,k̂ | v | w]) collecting the coefficients of x, y, z. Label them î, ĵ, k̂ — that packages the algebra as a vector. The coefficients are exactly the dual vector's coordinates.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300"><Crosshair className="size-5" /></div><h3 className="font-semibold text-foreground">Geometry path</h3></div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The volume = (area of v,w parallelogram) × (height of u perpendicular to that plane). That's a dot product with a perpendicular vector of that area — so the dual is perpendicular with that length.</p>
            </motion.div>
          </div>
          <div className="mt-5">
            <ConceptCheck accent="emerald" prompt="Why must the computational trick and the geometric reasoning produce the SAME vector?" answer="Duality is one-to-one: each linear transformation to the number line has exactly one dual vector. Both approaches describe the dual of the SAME volume transformation, so they must yield the same vector. The trick isn't a coincidence — it's the algebraic face of the geometry." />
          </div>
        </div>
      </section>

      <section id="perp" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The key insight" title="Why perpendicularity emerges" description="The volume only depends on the component of u perpendicular to v and w's plane — the height of the parallelepiped. So the dual vector points along that perpendicular direction, with length = the base area." accent="cyan" icon={<Layers3 className="size-3.5" />} />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground"><strong>Volume = base area × height.</strong> The base is the v-w parallelogram; the height is how far u sticks out perpendicular to it. Slide u around within the plane of v and w and the volume stays the same — only the perpendicular component matters. That makes the transformation a dot product with a vector pointing perpendicular to the plane, scaled by the base area. That vector is v × w.</p>
          </motion.div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="cross-products-duality" questions={lesson.quiz} />
        </div>
      </section>

      <section id="summary" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Takeaways" title="What to remember" accent="emerald" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard index={0} icon={<Box className="size-5" />} accent="violet" title="Volume transformation" body="Fix v, w; map u to the signed volume of the parallelepiped (u, v, w). Linear — so it has a dual." formula="T(u) = det([u|v|w])" />
            <SummaryCard index={1} icon={<Network className="size-5" />} accent="rose" title="Dual = v × w" body="By duality, T(u) = u · p for a unique p. That p is v × w — perpendicular, length = area." formula="T(u) = u · (v × w)" />
            <SummaryCard index={2} icon={<Sigma className="size-5" />} accent="amber" title="Trick = collecting coefficients" body="The î/ĵ/k̂ determinant just labels the coefficients of x, y, z as vector coordinates. It's algebra packaged as geometry." />
            <SummaryCard index={3} icon={<Crosshair className="size-5" />} accent="cyan" title="Perpendicular from the geometry" body="Volume = base area × perpendicular height. Only u's perpendicular component matters — so the dual points perpendicular to v, w." />
          </div>
          <motion.blockquote initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6">
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">It's just a really elegant piece of math.</p>
            <p className="mt-3 text-sm text-muted-foreground">— why this detour is worth the effort</p>
          </motion.blockquote>
        </div>
      </section>

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}
