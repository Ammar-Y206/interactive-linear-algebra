"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sigma, Zap, Quote, Network, Crosshair, Layers3 } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ConceptCheck } from "@/components/course/concept-check";
import { Confetti } from "@/components/course/confetti";
import { EigenvalueTrickSim } from "@/components/simulations/eigenvalue-trick-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface EigenvalueTrickLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "facts", label: "Three facts" },
  { id: "formula", label: "The mean-product formula" },
  { id: "explore", label: "Try it" },
  { id: "why", label: "Why it's better" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function EigenvalueTrickLesson({ onNavigate }: EigenvalueTrickLessonProps) {
  const lesson = getLessonBySlug("eigenvalue-trick")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("eigenvalue-trick");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("eigenvalue-trick");
  const prev = getPrevLesson("eigenvalue-trick");

  function handleComplete() {
    completeLesson("eigenvalue-trick");
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

      <section id="facts" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The setup" title="Three facts worth knowing" description="Skip the characteristic polynomial. Three facts — each useful on its own — let you read eigenvalues straight off a 2×2 matrix." accent="amber" icon={<Sigma className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-3">
            <FactCard n="1" title="Trace = Σλ" body="The sum of the diagonal entries equals the sum of the eigenvalues. So their mean = mean of the diagonal." accent="amber" />
            <FactCard n="2" title="Det = Πλ" body="The determinant equals the product of the eigenvalues. Both describe overall area scaling." accent="cyan" />
            <FactCard n="3" title="m ± √(m²−p)" body="Two numbers with mean m and product p are m ± √(m²−p). Difference of squares in disguise." accent="emerald" />
          </div>
        </div>
      </section>

      <section id="formula" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The trick" title="λ = trace/2 ± √((trace/2)² − det)" description="Read the trace (mean of eigenvalues) and determinant (product) off the matrix. Plug into the mean-product formula. The eigenvalues fall out — no polynomial, no quadratic formula." accent="emerald" icon={<Zap className="size-3.5" />} />
          <EigenvalueTrickSim />
        </div>
      </section>

      <section id="explore" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Worked example" title="From matrix to eigenvalues in seconds" description="Take the matrix [8, 2 | 4, 6]. Trace = 14, so mean = 7. Det = 48 − 8 = 40. So λ = 7 ± √(49 − 40) = 7 ± 3 = 4 and 10. Done." accent="cyan" icon={<Network className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="space-y-3 font-mono text-sm">
              <div><span className="text-amber-300">trace = 8 + 6 = 14</span> → <span className="text-muted-foreground">mean m = 7</span></div>
              <div><span className="text-cyan-300">det = 8·6 − 2·4 = 40</span> → <span className="text-muted-foreground">product p = 40</span></div>
              <div><span className="text-muted-foreground">λ = 7 ± √(49 − 40) = 7 ± 3 =</span> <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-emerald-300">4</span> <span className="text-muted-foreground">and</span> <span className="rounded bg-rose-500/15 px-2 py-0.5 text-rose-300">10</span></div>
              <div className="text-xs text-muted-foreground">Check: 4 + 10 = 14 = trace ✓ · 4 × 10 = 40 = det ✓</div>
            </div>
          </motion.div>
          <div className="mt-5">
            <ConceptCheck accent="emerald" prompt="For a matrix with trace 10 and determinant 16, what are the eigenvalues?" answer="Mean = 10/2 = 5. Product = 16. So λ = 5 ± √(25 − 16) = 5 ± 3 = 2 and 8. Verify: 2+8 = 10 = trace ✓, 2×8 = 16 = det ✓. The whole computation takes seconds once you know the trick." />
          </div>
        </div>
      </section>

      <section id="why" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The deeper point" title="Meaningful, not just fast" description="This isn't just a shortcut. Each term carries geometric meaning: the trace and determinant are properties of the transformation, readable straight off the matrix. The formula reinforces understanding instead of replacing it." accent="violet" icon={<Layers3 className="size-3.5" />} />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">The mean-product formula is the quadratic formula reframed around meaningful quantities. Instead of memorizing <span className="font-mono">−b ± √(b²−4ac) / 2a</span> as symbols, you read the mean (trace/2) and product (det) off the matrix directly. Each reinforces what eigenvalues ARE: the scaling factors whose sum is the trace and whose product is the determinant.</p>
          </motion.div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="eigenvalue-trick" questions={lesson.quiz} />
        </div>
      </section>

      <section id="summary" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Takeaways" title="What to remember" accent="emerald" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard index={0} icon={<Sigma className="size-5" />} accent="amber" title="Trace = sum of λ" body="The sum of the diagonal entries equals the sum of the eigenvalues. Half the trace is their mean." formula="tr(A) = λ₁ + λ₂" />
            <SummaryCard index={1} icon={<Crosshair className="size-5" />} accent="cyan" title="Det = product of λ" body="The determinant equals the product of the eigenvalues — both describe overall area scaling." formula="det(A) = λ₁ · λ₂" />
            <SummaryCard index={2} icon={<Zap className="size-5" />} accent="emerald" title="The formula" body="λ = m ± √(m² − p) where m = trace/2, p = det. Reads eigenvalues straight off a 2×2 matrix." formula="λ = tr/2 ± √((tr/2)² − det)" />
            <SummaryCard index={3} icon={<Layers3 className="size-5" />} accent="violet" title="Meaningful, not just fast" body="Each term has geometric meaning. The formula reinforces what eigenvalues ARE — not just a rote computation." />
          </div>
          <motion.blockquote initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6">
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">The real advantage is that each term carries more meaning with it.</p>
            <p className="mt-3 text-sm text-muted-foreground">— why this trick is worth memorizing</p>
          </motion.blockquote>
        </div>
      </section>

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}

function FactCard({ n, title, body, accent }: { n: string; title: string; body: string; accent: "amber" | "cyan" | "emerald" }) {
  const a = { amber: "border-amber-500/30 bg-amber-500/5 text-amber-300", cyan: "border-cyan-500/30 bg-cyan-500/5 text-cyan-300", emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300" }[accent];
  return (
    <div className={`rounded-2xl border ${a} p-5`}>
      <div className="font-mono text-3xl font-bold opacity-50">{n}</div>
      <h3 className="mt-2 font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
