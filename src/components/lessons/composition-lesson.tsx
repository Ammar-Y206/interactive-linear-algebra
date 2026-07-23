"use client";

/**
 * CompositionLesson  (Lesson 4)
 * ----------------------------------------------------------------
 * Matrix multiplication as composition.
 *
 * Sections:
 *   1. Hero
 *   2. Learning objectives
 *   3. Recap: a matrix is a transformation
 *   4. Composing two transformations (CompositionSim)
 *   5. Reading right-to-left
 *   6. Computing the product column by column
 *   7. Order matters (non-commutative) + associativity
 *   8. Mini quiz + summary + what's next
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  ArrowLeft,
  Crosshair,
  ArrowRightLeft,
  Sigma,
  Quote,
  RotateCcw,
  MoveHorizontal,
  Network,
} from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ConceptCheck } from "@/components/course/concept-check";
import { Confetti } from "@/components/course/confetti";
import { CompositionSim } from "@/components/simulations/composition-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface CompositionLessonProps {
  onNavigate: (slug: string) => void;
}

const TOC = [
  { id: "recap", label: "Recap: matrix = transform" },
  { id: "compose", label: "Composing transforms" },
  { id: "order", label: "Read right-to-left" },
  { id: "compute", label: "Compute column by column" },
  { id: "properties", label: "Order matters; grouping doesn't" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function CompositionLesson({ onNavigate }: CompositionLessonProps) {
  const lesson = getLessonBySlug("matrix-multiplication")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("matrix-multiplication");
  const [celebrate, setCelebrate] = useState(false);

  const next = getNextLesson("matrix-multiplication");
  const prev = getPrevLesson("matrix-multiplication");
  const hasPrev = !!prev;
  const hasNext = !!next;

  function handleComplete() {
    completeLesson("matrix-multiplication");
    if (!done) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2600);
    }
    const dest = next ? next.slug : "completion";
    setTimeout(() => onNavigate(dest), done ? 500 : 1400);
  }

  function handleNav(direction: "prev" | "next") {
    if (direction === "prev" && prev) onNavigate(prev.slug);
    if (direction === "next" && next) onNavigate(next.slug);
    if (direction === "next" && !next) onNavigate("completion");
  }

  return (
    <LessonLayout toc={TOC}>
      {celebrate && <Confetti count={100} durationMs={2600} />}
      <HeroSection lesson={lesson} />

      <LearningObjectives objectives={lesson.objectives} />

      {/* ============ 3. RECAP ============ */}
      <section id="recap" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Quick recap"
            title="A matrix is a transformation, packaged"
            description="Last lesson: a linear transformation is fully determined by where î and ĵ land — and those two landing spots become the columns of a matrix. Multiplying that matrix by a vector applies the transformation."
            accent="emerald"
            icon={<Network className="size-3.5" />}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <RecapCard
              icon={<Crosshair className="size-5" />}
              accent="amber"
              title="î → column 1"
              body="Where î lands is the first column of the matrix."
            />
            <RecapCard
              icon={<Crosshair className="size-5" />}
              accent="cyan"
              title="ĵ → column 2"
              body="Where ĵ lands is the second column."
            />
            <RecapCard
              icon={<Sigma className="size-5" />}
              accent="rose"
              title="M·v = linear combo"
              body="Applying M to (x,y) gives x·(col 1) + y·(col 2)."
            />
          </div>
        </div>
      </section>

      {/* ============ 4. COMPOSING ============ */}
      <section id="compose" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The new idea"
            title="Apply one, then another — that's a composition"
            description="Rotate the plane, then shear it. The overall effect is a single new transformation, distinct from either piece. Its matrix is the product of the two."
            accent="cyan"
            icon={<Layers className="size-3.5" />}
          />

          <CompositionSim />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                <Layers className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">One matrix does both</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  The composed transformation is itself linear — so it has its own matrix. Track
                  î through both steps: after M1 it lands on M1&apos;s first column, then M2 sends
                  that to its final spot. That final spot is the first column of the product. Same
                  for ĵ. Four numbers, capturing the whole two-step dance.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ 5. RIGHT-TO-LEFT ============ */}
      <section id="order" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="A quirk of notation"
            title="Read it right-to-left"
            description="In M2·M1·v, M1 acts first, then M2. It feels backwards — but it's just function notation, where the function sits on the left of its input."
            accent="amber"
            icon={<ArrowLeft className="size-3.5" />}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-border/50 bg-card/40 p-6"
          >
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-base sm:text-lg">
              <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-emerald-300">M2</span>
              <span className="text-muted-foreground">·</span>
              <span className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-amber-300">M1</span>
              <span className="text-muted-foreground">·</span>
              <span className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-rose-300">v</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-300">① M1 acts first</span>
              <ArrowLeft className="size-4" />
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">② then M2</span>
            </div>
            <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
              It mirrors how we write <span className="font-mono text-foreground">f(g(x))</span> — g
              applies first, even though f is written on the outside. Same convention, just with
              matrices. Good news for Hebrew readers; a small tax for the rest of us.
            </p>
          </motion.div>

          <div className="mt-5">
            <ConceptCheck
              accent="amber"
              prompt="You see the expression A·B·v. Which transformation touches v first?"
              answer="B does. Reading right-to-left, the matrix nearest v (B) applies first, then A acts on whatever B produced. It's exactly f(g(x)) with A=f, B=g: g touches x first."
            />
          </div>
        </div>
      </section>

      {/* ============ 6. COMPUTE COLUMN BY COLUMN ============ */}
      <section id="compute" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The recipe"
            title="Compute the product one column at a time"
            description="No need to memorize a formula. The first column of M2·M1 is 'where does î end up?' = M2·(M1's first column). The second column is the same for ĵ. That's the whole algorithm."
            accent="rose"
            icon={<Crosshair className="size-3.5" />}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <ComputeCard
              icon={<Crosshair className="size-5" />}
              accent="amber"
              title="Column 1: follow î"
              steps={[
                "î starts at (1, 0).",
                "After M1, î lands on M1's first column.",
                "Apply M2 to that: M2 · (M1's col 1).",
                "That result IS the first column of the product.",
              ]}
              formula="col₁(M2·M1) = M2 · col₁(M1)"
            />
            <ComputeCard
              icon={<Crosshair className="size-5" />}
              accent="cyan"
              title="Column 2: follow ĵ"
              steps={[
                "ĵ starts at (0, 1).",
                "After M1, ĵ lands on M1's second column.",
                "Apply M2 to that: M2 · (M1's col 2).",
                "That result IS the second column of the product.",
              ]}
              formula="col₂(M2·M1) = M2 · col₂(M1)"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-5 rounded-2xl border border-border/50 bg-card/40 p-5"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              The simulator above shows this live: the <span className="text-rose-300">Product</span>{" "}
              matrix on the right is computed exactly this way — its first column is where î ends up
              after both transforms, its second column is where ĵ ends up. Drag M1&apos;s tips and
              watch the product update.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ 7. PROPERTIES ============ */}
      <section id="properties" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Two properties, one obvious, one not"
            title="Order matters; grouping doesn't"
            description="Matrix multiplication is NOT commutative — but it IS associative. The geometric view makes both of these obvious."
            accent="emerald"
            icon={<ArrowRightLeft className="size-3.5" />}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <PropertyCard
              icon={<ArrowRightLeft className="size-5" />}
              accent="rose"
              title="Non-commutative: A·B ≠ B·A"
              tag="order matters"
              body="Shear then rotate usually looks nothing like rotate then shear. Track î and ĵ through each order and you'll see different final spots. Try the two presets in the simulator — the product matrices differ."
            />
            <PropertyCard
              icon={<Sigma className="size-5" />}
              accent="emerald"
              title="Associative: (A·B)·C = A·(B·C)"
              tag="grouping doesn't"
              body="Both sides mean 'apply C, then B, then A' — the same sequence of transformations, just chunked differently. There's nothing to prove; the geometry says it all. A nightmare algebra problem becomes a one-liner."
            />
          </div>

          <div className="mt-5">
            <ConceptCheck
              accent="emerald"
              prompt="Without any calculation: is (A·B)·C the same as A·(B·C)?"
              answer="Yes. Both expressions describe applying C first, then B, then A. The parentheses only change how you group the computation — the sequence of transformations is identical. That's associativity, and it's obvious the moment you read matrices as transformations rather than grids of numbers."
            />
          </div>
        </div>
      </section>

      {/* ============ 8. QUIZ ============ */}
      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Pause & check"
            title="Check your understanding"
            description="Four questions on composition, order, and the column-by-column recipe."
            accent="amber"
          />
          <QuizCard lessonSlug="matrix-multiplication" questions={lesson.quiz} />
        </div>
      </section>

      {/* ============ SUMMARY ============ */}
      <section id="summary" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Takeaways"
            title="What to remember"
            description="If you forget everything else, keep these four ideas."
            accent="emerald"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard
              index={0}
              icon={<Layers className="size-5" />}
              accent="cyan"
              title="Composition = a new transform"
              body="Applying one transformation then another is itself a linear transformation, with its own matrix — the product."
            />
            <SummaryCard
              index={1}
              icon={<ArrowLeft className="size-5" />}
              accent="amber"
              title="Read right-to-left"
              body="In M2·M1·v, M1 acts first, then M2. It's function notation: the matrix nearest v touches it first."
              formula="M2·M1·v = M2(M1(v))"
            />
            <SummaryCard
              index={2}
              icon={<Crosshair className="size-5" />}
              accent="rose"
              title="Product columns = where î, ĵ land"
              body="Col 1 of M2·M1 = M2·(col 1 of M1). Col 2 = M2·(col 2 of M1). Follow each basis vector through both steps."
              formula="colₖ(AB) = A·colₖ(B)"
            />
            <SummaryCard
              index={3}
              icon={<ArrowRightLeft className="size-5" />}
              accent="emerald"
              title="Non-commutative, associative"
              body="A·B ≠ B·A in general — order matters. But (A·B)·C = A·(B·C) trivially: both mean 'C, then B, then A'."
              formula="AB ≠ BA,  (AB)C = A(BC)"
            />
          </div>

          <motion.blockquote
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6"
          >
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">
              Always remember that multiplying two matrices has the geometric meaning of applying
              one transformation then another.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">— the one sentence that makes every matrix formula click</p>
          </motion.blockquote>
        </div>
      </section>

      <WhatsNext
        nextTitle={lesson.whatsNext?.title}
        nextBlurb={lesson.whatsNext?.blurb}
        isComplete={done}
        onComplete={handleComplete}
        onNavigate={handleNav}
        hasPrev={hasPrev}
        hasNext={hasNext || true}
        accent="emerald"
      />
    </LessonLayout>
  );
}

/* ---------------- local helpers ---------------- */

function RecapCard({
  icon,
  accent,
  title,
  body,
}: {
  icon: React.ReactNode;
  accent: "amber" | "cyan" | "rose";
  title: string;
  body: string;
}) {
  const a = {
    amber: { bg: "bg-amber-500/15", text: "text-amber-300" },
    cyan: { bg: "bg-cyan-500/15", text: "text-cyan-300" },
    rose: { bg: "bg-rose-500/15", text: "text-rose-300" },
  }[accent];
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
      <div className={`mb-3 flex size-9 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function ComputeCard({
  icon,
  accent,
  title,
  steps,
  formula,
}: {
  icon: React.ReactNode;
  accent: "amber" | "cyan";
  title: string;
  steps: string[];
  formula: string;
}) {
  const a = {
    amber: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/20" },
    cyan: { bg: "bg-cyan-500/15", text: "text-cyan-300", border: "border-cyan-500/20" },
  }[accent];
  return (
    <div className={`rounded-2xl border ${a.border} bg-card/40 p-5`}>
      <div className="flex items-center gap-2.5">
        <div className={`flex size-9 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>{icon}</div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <ol className="mt-3 space-y-1.5">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
            <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md ${a.bg} font-mono text-[10px] font-bold ${a.text}`}>
              {i + 1}
            </span>
            <span className="leading-relaxed">{s}</span>
          </li>
        ))}
      </ol>
      <div className="mt-3 inline-flex rounded-lg border border-border/50 bg-background/60 px-3 py-1.5 font-mono text-xs text-foreground">
        {formula}
      </div>
    </div>
  );
}

function PropertyCard({
  icon,
  accent,
  title,
  tag,
  body,
}: {
  icon: React.ReactNode;
  accent: "rose" | "emerald";
  title: string;
  tag: string;
  body: string;
}) {
  const a = {
    rose: { bg: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/30" },
    emerald: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30" },
  }[accent];
  return (
    <div className={`rounded-2xl border ${a.border} bg-card/40 p-5`}>
      <div className="flex items-center justify-between">
        <div className={`flex size-9 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>{icon}</div>
        <span className={`rounded-full border ${a.border} px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${a.text}`}>
          {tag}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
