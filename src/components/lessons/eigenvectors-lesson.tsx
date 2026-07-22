"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crosshair, Sigma, Network, Quote, Layers3, Grid2x2, RotateCcw } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ConceptCheck } from "@/components/course/concept-check";
import { Confetti } from "@/components/course/confetti";
import { EigenvectorsSim } from "@/components/simulations/eigenvectors-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface EigenvectorsLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "idea", label: "Vectors that stay on their span" },
  { id: "equation", label: "Av = λv" },
  { id: "find", label: "Finding eigenvalues" },
  { id: "explore", label: "Explore eigenvectors" },
  { id: "eigenbasis", label: "Eigenbasis & diagonalization" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function EigenvectorsLesson({ onNavigate }: EigenvectorsLessonProps) {
  const lesson = getLessonBySlug("eigenvectors")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("eigenvectors");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("eigenvectors");
  const prev = getPrevLesson("eigenvectors");

  function handleComplete() {
    completeLesson("eigenvectors");
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

      <section id="idea" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The big idea" title="Vectors that stay on their span" description="Most vectors get knocked off their line during a transformation. But some special ones don't — they just stretch or squish in place. Those are eigenvectors, and the scaling factor is the eigenvalue." accent="emerald" icon={<Layers3 className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="text-2xl font-bold text-emerald-300">λ &gt; 1</div>
              <p className="mt-1 text-sm text-muted-foreground">Stretched along the span.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="text-2xl font-bold text-amber-300">0 &lt; λ &lt; 1</div>
              <p className="mt-1 text-sm text-muted-foreground">Squished toward the origin.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.2 }} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
              <div className="text-2xl font-bold text-rose-300">λ &lt; 0</div>
              <p className="mt-1 text-sm text-muted-foreground">Flipped through the origin.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="equation" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The equation" title="Av = λv" description="Applying the matrix A to an eigenvector v is the same as just scaling v by λ. That's the whole condition — a matrix-vector product that collapses to a scalar multiplication." accent="cyan" icon={<Sigma className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6 text-center">
            <div className="flex items-center justify-center gap-3 font-mono text-2xl">
              <span className="text-amber-300">A</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-emerald-300">v</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-rose-300">λ</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-emerald-300">v</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">A = the transformation. v = an eigenvector. λ = the eigenvalue (the scaling factor).</p>
          </motion.div>
        </div>
      </section>

      <section id="find" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Finding them" title="det(A − λI) = 0" description="Rearrange Av = λv to (A − λI)v = 0. For a non-zero v to exist, A − λI must squish space — and squishing means det = 0. Solve for λ, then find v." accent="rose" icon={<Network className="size-3.5" />} />
          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300"><Crosshair className="size-5" /></div><h3 className="font-semibold text-foreground">Step 1: eigenvalues</h3></div>
              <p className="mt-3 text-sm text-muted-foreground">Set det(A − λI) = 0 and solve the characteristic polynomial for λ. The roots are the eigenvalues.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300"><Layers3 className="size-5" /></div><h3 className="font-semibold text-foreground">Step 2: eigenvectors</h3></div>
              <p className="mt-3 text-sm text-muted-foreground">For each λ, plug into (A − λI) and find the non-zero vectors it sends to zero. Those are the eigenvectors for that eigenvalue.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="explore" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="See it" title="Explore eigenvectors" description="Drag the matrix columns. The green and red lines are the eigenvector spans — they survive the transformation, just stretched. Try the 90° rotation: no eigenvectors at all." accent="emerald" icon={<Grid2x2 className="size-3.5" />} />
          <EigenvectorsSim />
          <div className="mt-5">
            <ConceptCheck accent="emerald" prompt="A 90° rotation has no real eigenvectors. Why? And what's the exception in 3D?" answer="In 2D, a 90° rotation turns every vector off its span — nothing stays on its line (algebraically, λ²+1 has no real roots). But in 3D, every rotation has an axis — a line of vectors that stay put (eigenvalue 1). That axis IS the eigenvector. Finding it turns a hairy 3×3 rotation matrix into a simple axis-plus-angle description." />
          </div>
        </div>
      </section>

      <section id="eigenbasis" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The payoff" title="Eigenbasis & diagonalization" description="If your eigenvectors span the space, use them as a new basis. In that basis the matrix is diagonal — just the eigenvalues down the diagonal. Powers become trivial: raise each eigenvalue to the power." accent="violet" icon={<RotateCcw className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
            <div className="flex items-center justify-center gap-1 font-mono text-2xl">
              <span className="text-muted-foreground/60">[</span>
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-4"><span className="w-10 text-center text-emerald-300">λ₁</span><span className="w-10 text-center text-muted-foreground/30">0</span></div>
                <div className="flex gap-4"><span className="w-10 text-center text-muted-foreground/30">0</span><span className="w-10 text-center text-rose-300">λ₂</span></div>
              </div>
              <span className="text-muted-foreground/60">]</span>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">In an eigenbasis, the matrix is diagonal. The 100th power? Just λ₁¹⁰⁰ and λ₂¹⁰⁰ on the diagonal. A nightmare becomes trivial.</p>
          </motion.div>
          <p className="mt-4 text-sm text-muted-foreground">Not every transformation has an eigenbasis (shears don't have enough eigenvectors; 90° rotations have none). But when one exists, it unlocks enormous computational power — diagonalization, matrix exponentials, and the spectral theory behind quantum mechanics and data analysis (PCA).</p>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="eigenvectors" questions={lesson.quiz} />
        </div>
      </section>

      <section id="summary" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Takeaways" title="What to remember" accent="emerald" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard index={0} icon={<Layers3 className="size-5" />} accent="emerald" title="Eigenvectors stay on their span" body="The transformation only stretches/squishes them — by the eigenvalue λ. They're the transformation's 'fixed directions'." formula="Av = λv" />
            <SummaryCard index={1} icon={<Network className="size-5" />} accent="rose" title="Find λ via det(A − λI) = 0" body="For a non-zero eigenvector to exist, A − λI must squish space — det = 0. The characteristic polynomial's roots are the eigenvalues." />
            <SummaryCard index={2} icon={<Grid2x2 className="size-5" />} accent="cyan" title="Not every matrix has them" body="90° rotations have no real eigenvectors (λ² + 1 = 0 has imaginary roots). Shears have too few to span. Real eigenvalues need det(disc) ≥ 0." />
            <SummaryCard index={3} icon={<RotateCcw className="size-5" />} accent="violet" title="Eigenbasis → diagonalization" body="If eigenvectors span the space, use them as a basis. The matrix becomes diagonal (just λ's) — powers and exponentials become trivial." />
          </div>
          <motion.blockquote initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6">
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">A better way to get at the heart of what the linear transformation does, less dependent on your coordinate system, is to find the eigenvectors and eigenvalues.</p>
            <p className="mt-3 text-sm text-muted-foreground">— why eigenthings are worth the effort</p>
          </motion.blockquote>
        </div>
      </section>

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}
