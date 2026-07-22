"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FunctionSquare, Sigma, Network, Quote, Crosshair, Layers3, Box } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ConceptCheck } from "@/components/course/concept-check";
import { Confetti } from "@/components/course/confetti";
import { AbstractVectorSpacesSim } from "@/components/simulations/abstract-vector-spaces-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface AbstractVectorSpacesLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "functions", label: "Functions as vectors" },
  { id: "derivative", label: "The derivative is linear" },
  { id: "matrix", label: "The derivative as a matrix" },
  { id: "explore", label: "Differentiate via matrix" },
  { id: "axioms", label: "The 8 axioms" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function AbstractVectorSpacesLesson({ onNavigate }: AbstractVectorSpacesLessonProps) {
  const lesson = getLessonBySlug("abstract-vector-spaces")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("abstract-vector-spaces");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("abstract-vector-spaces");
  const prev = getPrevLesson("abstract-vector-spaces");

  function handleComplete() {
    completeLesson("abstract-vector-spaces");
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

      <section id="functions" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="What is a vector?" title="Functions are vectors too" description="You can add two functions (pointwise) and scale one (scale all outputs). That's the same structure as adding and scaling arrows — just with infinitely many 'coordinates'. So functions live in a vector space." accent="violet" icon={<FunctionSquare className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300"><Sigma className="size-5" /></div><h3 className="font-semibold text-foreground">Adding functions</h3></div>
              <p className="mt-3 font-mono text-sm text-foreground">(f + g)(x) = f(x) + g(x)</p>
              <p className="mt-2 text-sm text-muted-foreground">At each input, add the outputs. Just like adding vectors coordinate-by-coordinate — but infinitely many 'coordinates'.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300"><Crosshair className="size-5" /></div><h3 className="font-semibold text-foreground">Scaling functions</h3></div>
              <p className="mt-3 font-mono text-sm text-foreground">(c · f)(x) = c · f(x)</p>
              <p className="mt-2 text-sm text-muted-foreground">Scale every output by c. Same as scaling a vector — just applied to infinitely many values.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="derivative" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The key example" title="The derivative is a linear transformation" description="The derivative turns one function into another — and it's linear: (f+g)' = f' + g' and (c·f)' = c·f'. Same two properties (additivity, scaling) that define linear transformations on arrows." accent="cyan" icon={<Network className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <div className="space-y-3 font-mono text-sm">
              <div><span className="text-emerald-300">(f + g)' = f' + g'</span> <span className="text-muted-foreground">— additivity</span></div>
              <div><span className="text-emerald-300">(c · f)' = c · f'</span> <span className="text-muted-foreground">— scaling</span></div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">These are exactly the two properties that make a transformation linear. Calculus students use them constantly — they just don't phrase it this way.</p>
          </motion.div>
        </div>
      </section>

      <section id="matrix" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The stunning payoff" title="The derivative AS a matrix" description="Using the basis {1, x, x², x³, …} for polynomials, the derivative becomes an infinite matrix with 1, 2, 3, … counting down an offset diagonal. Matrix-vector multiplication IS differentiation." accent="violet" icon={<Box className="size-3.5" />} />
          <AbstractVectorSpacesSim />
          <div className="mt-5">
            <ConceptCheck accent="violet" prompt="The derivative of xⁿ is n·xⁿ⁻¹. How does that put 1, 2, 3, … on the matrix's offset diagonal?" answer="The n-th basis function xⁿ maps to n·xⁿ⁻¹ — which is n times the (n−1)-th basis function. So in column n (the image of xⁿ), row n−1 has the entry n. That's the offset diagonal: 1, 2, 3, 4, … counting down one below the main diagonal. Multiplying this matrix by a polynomial's coordinate vector literally differentiates it." />
          </div>
        </div>
      </section>

      <section id="axioms" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The abstract definition" title="The 8 axioms of a vector space" description="A vector space is any set with sensible addition and scaling satisfying 8 rules. Arrows, lists of numbers, functions, and more all qualify — so the entire theory of linear algebra applies to all of them at once." accent="emerald" icon={<Layers3 className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="flex gap-2"><span className="font-mono text-emerald-300">1.</span><span className="text-muted-foreground">u + v = v + u (commutativity)</span></div>
              <div className="flex gap-2"><span className="font-mono text-emerald-300">2.</span><span className="text-muted-foreground">(u + v) + w = u + (v + w) (associativity)</span></div>
              <div className="flex gap-2"><span className="font-mono text-emerald-300">3.</span><span className="text-muted-foreground">There's a zero vector: u + 0 = u</span></div>
              <div className="flex gap-2"><span className="font-mono text-emerald-300">4.</span><span className="text-muted-foreground">Every u has an inverse −u: u + (−u) = 0</span></div>
              <div className="flex gap-2"><span className="font-mono text-cyan-300">5.</span><span className="text-muted-foreground">c(u + v) = cu + cv (distributivity over +)</span></div>
              <div className="flex gap-2"><span className="font-mono text-cyan-300">6.</span><span className="text-muted-foreground">(c + d)u = cu + du (distributivity over scalars)</span></div>
              <div className="flex gap-2"><span className="font-mono text-amber-300">7.</span><span className="text-muted-foreground">c(du) = (cd)u (compatibility)</span></div>
              <div className="flex gap-2"><span className="font-mono text-amber-300">8.</span><span className="text-muted-foreground">1u = u (identity scalar)</span></div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">These aren't fundamental laws of nature — they're an <strong>interface</strong>. If your objects satisfy these 8 rules, the entire theory of linear algebra applies. Arrows, lists, functions, and far stranger things all qualify.</p>
          </motion.div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="abstract-vector-spaces" questions={lesson.quiz} />
        </div>
      </section>

      <section id="summary" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Takeaways" title="What to remember" accent="emerald" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard index={0} icon={<FunctionSquare className="size-5" />} accent="violet" title="Functions are vectors" body="Add pointwise, scale all outputs. Same structure as arrows — just infinitely many 'coordinates'." formula="(f+g)(x)=f(x)+g(x)" />
            <SummaryCard index={1} icon={<Network className="size-5" />} accent="cyan" title="The derivative is linear" body="(f+g)' = f'+g' and (c·f)' = c·f'. The two linearity properties — so it's a linear transformation on function space." />
            <SummaryCard index={2} icon={<Box className="size-5" />} accent="emerald" title="Derivative = a matrix" body="In the basis {1,x,x²,…}, the derivative is an infinite matrix with 1,2,3,… on an offset diagonal. Matrix-vector mult = differentiation." />
            <SummaryCard index={3} icon={<Layers3 className="size-5" />} accent="amber" title="8 axioms define a vector space" body="Any set with sensible + and · satisfying the axioms qualifies. The whole theory applies — arrows, lists, functions, and beyond." />
          </div>
          <motion.blockquote initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6">
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">The form that vectors take doesn't really matter — arrows, lists of numbers, functions — so long as there's some notion of adding and scaling that follows the rules.</p>
            <p className="mt-3 text-sm text-muted-foreground">— the mathematician's answer to 'what is a vector?'</p>
          </motion.blockquote>
        </div>
      </section>

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}
