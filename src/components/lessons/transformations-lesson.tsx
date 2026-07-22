"use client";

/**
 * TransformationsLesson  (Lesson 3)
 * ----------------------------------------------------------------
 * Linear transformations and matrices.
 *
 * Sections:
 *   1. Hero
 *   2. Learning objectives
 *   3. Transformations as movement
 *   4. The two linearity rules
 *   5. A matrix is where î & ĵ land (TransformationSim)
 *   6. Matrix-vector multiplication = linear combination
 *   7. Worked examples (rotation, shear) + the squish
 *   8. Mini quiz + summary + what's next
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Move,
  Grid2x2,
  Anchor,
  Crosshair,
  ArrowDownRight,
  MoveHorizontal,
  RotateCcw,
  Scissors,
  Sigma,
  Quote,
  Plus,
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
import { TransformationSim } from "@/components/simulations/transformation-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface TransformationsLessonProps {
  onNavigate: (slug: string) => void;
}

const TOC = [
  { id: "movement", label: "Transformations as movement" },
  { id: "rules", label: "The two linearity rules" },
  { id: "matrix", label: "A matrix is where î, ĵ land" },
  { id: "multiply", label: "Matrix-vector multiplication" },
  { id: "examples", label: "Worked examples" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function TransformationsLesson({ onNavigate }: TransformationsLessonProps) {
  const lesson = getLessonBySlug("linear-transformations")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("linear-transformations");
  const [celebrate, setCelebrate] = useState(false);

  const next = getNextLesson("linear-transformations");
  const prev = getPrevLesson("linear-transformations");
  const hasPrev = !!prev;
  const hasNext = !!next;

  function handleComplete() {
    completeLesson("linear-transformations");
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

      {/* ============ 3. TRANSFORMATIONS AS MOVEMENT ============ */}
      <section id="movement" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The mental move"
            title="A transformation is movement"
            description="'Transformation' is just a fancy word for function — but the word hints at how to see it: watch every vector travel from its input home to its output home."
            accent="cyan"
            icon={<Move className="size-3.5" />}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <MovementCard
              icon={<ArrowDownRight className="size-5" />}
              accent="emerald"
              title="One vector → arrow"
              body="A single input vector moves to its output. Follow the arrow — where does it land?"
            />
            <MovementCard
              icon={<Grid2x2 className="size-5" />}
              accent="amber"
              title="All vectors → points"
              body="Too crowded to track every arrow. Drop the shafts, keep only the tips as points, and watch the whole grid of points flow to its image. Space itself morphs."
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Picture an infinite grid of points. A transformation sends each one somewhere new.
              Keep a ghost of the original grid in the background and you can see exactly how space
              was <strong>squished, stretched, rotated, or sheared</strong>. That morph — the
              feeling of space itself moving — is the whole aesthetic of this lesson.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ 4. THE TWO LINEARITY RULES ============ */}
      <section id="rules" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="What makes it 'linear'"
            title="Two rules, that's all"
            description="Arbitrary transformations get messy fast. Linear algebra studies the well-behaved ones — and 'linear' comes down to just two visual rules."
            accent="emerald"
            icon={<Anchor className="size-3.5" />}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <RuleCard
              index={0}
              icon={<Grid2x2 className="size-5" />}
              accent="emerald"
              title="Grid lines stay straight & parallel"
              body="No curving. Horizontal, vertical, and diagonal lines all remain lines, and parallel lines stay parallel — evenly spaced. The grid can stretch or slant, but never bend."
              bad="If lines curve, it's not linear."
            />
            <RuleCard
              index={1}
              icon={<Anchor className="size-5" />}
              accent="amber"
              title="The origin stays fixed"
              body="The center holds. The point (0, 0) never moves. A transformation that keeps lines straight but slides the origin is still not linear."
              bad="If the origin drifts, it's not linear."
            />
          </div>

          <div className="mt-5">
            <ConceptCheck
              accent="emerald"
              prompt="A transformation keeps all horizontal and vertical grid lines straight and the origin fixed — but bends a diagonal line into a curve. Is it linear?"
              answer="No. Linearity requires that ALL lines stay straight — not just the axis-aligned ones. A sneaky non-linear transformation can look linear on the horizontal and vertical grid alone; you have to check diagonals (and indeed every line) to be sure. The rule is: grid lines parallel, evenly spaced, and the origin fixed."
            />
          </div>
        </div>
      </section>

      {/* ============ 5. A MATRIX IS WHERE Î, Ĵ LAND ============ */}
      <section id="matrix" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The big idea"
            title="A matrix is just 'where î and ĵ land'"
            description="Here's the magic: because grid lines stay parallel and evenly spaced, the entire transformation is locked in once you know where the two basis vectors go. Four numbers. That's a matrix."
            accent="cyan"
            icon={<Crosshair className="size-3.5" />}
          />

          <TransformationSim />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                <Sigma className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Why four numbers suffice</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Any vector v = x·î + y·ĵ. After the transformation, v lands on{" "}
                  <strong>x·(where î landed) + y·(where ĵ landed)</strong> — the same linear
                  combination, just of the new basis. So if you record î → (a, c) and ĵ → (b, d),
                  you can deduce where <em>any</em> vector goes. Pack those four numbers as columns
                  into a 2×2 grid: that&apos;s your matrix.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ 6. MATRIX-VECTOR MULTIPLICATION ============ */}
      <section id="multiply" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="No memorization"
            title="Matrix-vector multiplication is a linear combination"
            description="Forget the formula. To apply a matrix to (x, y): scale the first column by x, scale the second column by y, add. That's the transformation, applied."
            accent="rose"
            icon={<Plus className="size-3.5" />}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-border/50 bg-card/40 p-6"
          >
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-300">
              <Crosshair className="size-3.5" />
              The general case
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 font-mono">
              <div className="flex items-center gap-1 text-2xl">
                <span className="text-muted-foreground/60">[</span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-4">
                    <span className="w-6 text-center text-amber-300">a</span>
                    <span className="w-6 text-center text-cyan-300">b</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 text-center text-amber-300">c</span>
                    <span className="w-6 text-center text-cyan-300">d</span>
                  </div>
                </div>
                <span className="text-muted-foreground/60">]</span>
              </div>
              <div className="flex items-center gap-1 text-2xl">
                <span className="text-muted-foreground/60">[</span>
                <div className="flex flex-col gap-1.5">
                  <span className="w-6 text-center text-emerald-300">x</span>
                  <span className="w-6 text-center text-emerald-300">y</span>
                </div>
                <span className="text-muted-foreground/60">]</span>
              </div>
              <span className="text-2xl text-muted-foreground">=</span>
              <div className="text-base leading-relaxed">
                <span className="text-emerald-300">x</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-amber-300">[a, c]</span>
                <span className="text-muted-foreground"> + </span>
                <span className="text-emerald-300">y</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-cyan-300">[b, d]</span>
              </div>
              <span className="text-2xl text-muted-foreground">=</span>
              <div className="text-base rounded-md bg-rose-500/15 px-2 py-1 text-rose-300">
                [ax+by, cx+dy]
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              The columns are where î and ĵ land. The result is the linear combination that defines
              where <em>(x, y)</em> lands.
            </p>
          </motion.div>

          <div className="mt-5">
            <ConceptCheck
              accent="rose"
              prompt="A transformation sends î → (1, −2) and ĵ → (3, 0). Using only that, where does (−1, 2) land?"
              answer="(−1, 2) = −1·î + 2·ĵ, so it lands on −1·(1,−2) + 2·(3,0) = (−1+6, 2+0) = (5, 2). You never needed to see the full transformation — knowing where the basis vectors went was enough. That's the whole power of matrices."
            />
          </div>
        </div>
      </section>

      {/* ============ 7. WORKED EXAMPLES ============ */}
      <section id="examples" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Practice"
            title="A few transformations, as matrices"
            description="Read each matrix as 'where do î and ĵ go?' and the transformation becomes obvious. Try these in the simulator above."
            accent="amber"
            icon={<RotateCcw className="size-3.5" />}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ExampleCard
              icon={<RotateCcw className="size-5" />}
              accent="emerald"
              name="90° rotation"
              iHat="(0, 1)"
              jHat="(−1, 0)"
              body="î swings up to where ĵ was; ĵ swings left to where −î was. Every vector rotates 90° counterclockwise around the origin."
            />
            <ExampleCard
              icon={<MoveHorizontal className="size-5" />}
              accent="amber"
              name="Horizontal shear"
              iHat="(1, 0)"
              jHat="(1, 1)"
              body="î stays put. ĵ tilts right to (1, 1). Vertical lines slant but stay parallel — space gets pushed sideways."
            />
            <ExampleCard
              icon={<Scissors className="size-5" />}
              accent="rose"
              name="Squish (dependent)"
              iHat="(1, 1)"
              jHat="(2, 2)"
              body="ĵ = 2·î — the columns are dependent. The whole plane collapses onto the single line y = x. A dimension is crushed."
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-300">
              <Scissors className="size-3.5" />
              When the columns line up
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If the transformed î and ĵ are <strong>linearly dependent</strong> (one a scaled copy
              of the other), the transformation squishes all of 2D space onto the single line they
              share — their one-dimensional span. The grid stays straight and parallel, but it loses
              a dimension. This is the seed of the idea behind determinants (next lessons).
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ 8. MINI QUIZ ============ */}
      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Pause & check"
            title="Check your understanding"
            description="Four questions on linearity, matrices as columns, and what happens when things line up."
            accent="amber"
          />
          <QuizCard lessonSlug="linear-transformations" questions={lesson.quiz} />
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
              icon={<Move className="size-5" />}
              accent="cyan"
              title="Transformations move space"
              body="A transformation is a function from vectors to vectors, seen as movement: every point flows to its image. Drop the arrows, keep the tips, and watch the grid morph."
            />
            <SummaryCard
              index={1}
              icon={<Anchor className="size-5" />}
              accent="emerald"
              title="Linear = two rules"
              body="Grid lines stay straight, parallel, evenly spaced — and the origin stays fixed. That's it. Bend a line or drift the origin and it's not linear."
            />
            <SummaryCard
              index={2}
              icon={<Crosshair className="size-5" />}
              accent="amber"
              title="Matrix = where î, ĵ land"
              body="Four numbers, packed as columns, fully describe any 2D linear transformation. The first column is î's destination; the second is ĵ's."
              formula="M = [ î' | ĵ' ]"
            />
            <SummaryCard
              index={3}
              icon={<Plus className="size-5" />}
              accent="rose"
              title="Multiplication = combination"
              body="M·v = x·(column 1) + y·(column 2). It's a linear combination of the transformed basis vectors — never a formula to memorize."
              formula="M·(x,y)ᵀ = x·î' + y·ĵ'"
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
              Every time you see a matrix, you can interpret it as a certain transformation of
              space.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">— the lens that unlocks the rest of linear algebra</p>
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

/* ---------------- local helpers (lesson-specific) ---------------- */

function MovementCard({
  icon,
  accent,
  title,
  body,
}: {
  icon: React.ReactNode;
  accent: "emerald" | "amber";
  title: string;
  body: string;
}) {
  const a = {
    emerald: { bg: "bg-emerald-500/15", text: "text-emerald-300" },
    amber: { bg: "bg-amber-500/15", text: "text-amber-300" },
  }[accent];
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
      <div className="flex items-center gap-2.5">
        <div className={`flex size-9 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>{icon}</div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function RuleCard({
  index,
  icon,
  accent,
  title,
  body,
  bad,
}: {
  index: number;
  icon: React.ReactNode;
  accent: "emerald" | "amber";
  title: string;
  body: string;
  bad: string;
}) {
  const a = {
    emerald: { bg: "bg-emerald-500/15", text: "text-emerald-300", ring: "ring-emerald-500/20" },
    amber: { bg: "bg-amber-500/15", text: "text-amber-300", ring: "ring-amber-500/20" },
  }[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className={`card-lift rounded-2xl border border-border/50 bg-card/40 p-5 ring-1 ring-inset ${a.ring}`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`flex size-9 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>{icon}</div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs text-rose-300/90">{bad}</p>
    </motion.div>
  );
}

function ExampleCard({
  icon,
  accent,
  name,
  iHat,
  jHat,
  body,
}: {
  icon: React.ReactNode;
  accent: "emerald" | "amber" | "rose";
  name: string;
  iHat: string;
  jHat: string;
  body: string;
}) {
  const a = {
    emerald: { bg: "bg-emerald-500/15", text: "text-emerald-300" },
    amber: { bg: "bg-amber-500/15", text: "text-amber-300" },
    rose: { bg: "bg-rose-500/15", text: "text-rose-300" },
  }[accent];
  return (
    <div className="card-lift rounded-2xl border border-border/50 bg-card/40 p-5">
      <div className="flex items-center gap-2.5">
        <div className={`flex size-9 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>{icon}</div>
        <h3 className="font-semibold text-foreground">{name}</h3>
      </div>
      <div className="mt-3 flex items-center gap-2 font-mono text-xs">
        <span className="text-amber-300">î → {iHat}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-cyan-300">ĵ → {jHat}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
