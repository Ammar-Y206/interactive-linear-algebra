"use client";

/**
 * SpanLesson  (Lesson 2)
 * ----------------------------------------------------------------
 * Linear combinations, span, and basis vectors.
 *
 * Sections:
 *   1. Hero
 *   2. Learning objectives
 *   3. Coordinates as scalars (BasisExplorer)
 *   4. Linear combinations (LinearCombinationSim)
 *   5. The span (SpanPainter)
 *   6. Vectors as points
 *   7. 3D span + linear (in)dependence
 *   8. Mini quiz + summary + what's next
 *
 * Reuses: LessonLayout, HeroSection, LearningObjectives, SectionHeading,
 * SummaryCard, WhatsNext, QuizCard, ConceptCheck, Confetti.
 * New sims: BasisExplorer, LinearCombinationSim, SpanPainter.
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Plus,
  Layers3,
  CircleDot,
  GitBranch,
  Grid3x3,
  Box,
  Unlink,
  Link2,
  Sigma,
  Quote,
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
import { BasisExplorer } from "@/components/simulations/basis-explorer";
import { LinearCombinationSim } from "@/components/simulations/linear-combination-sim";
import { SpanPainter } from "@/components/simulations/span-painter";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface SpanLessonProps {
  onNavigate: (slug: string) => void;
}

const TOC = [
  { id: "basis", label: "Coordinates as scalars" },
  { id: "combination", label: "Linear combinations" },
  { id: "span", label: "The span" },
  { id: "points", label: "Vectors as points" },
  { id: "dependence", label: "3D span & dependence" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function SpanLesson({ onNavigate }: SpanLessonProps) {
  const lesson = getLessonBySlug("span-linear-combinations")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("span-linear-combinations");
  const [celebrate, setCelebrate] = useState(false);

  const next = getNextLesson("span-linear-combinations");
  const prev = getPrevLesson("span-linear-combinations");
  const hasPrev = !!prev;
  const hasNext = !!next;

  function handleComplete() {
    completeLesson("span-linear-combinations");
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

      {/* ============ 3. COORDINATES AS SCALARS ============ */}
      <section id="basis" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The big reframe"
            title="Coordinates are scalars in disguise"
            description="You've seen (3, −2) as 'walk 3 right, 2 down'. Now see it as: scale î by 3, scale ĵ by −2, and add. Same vector — a deeper view."
            accent="cyan"
            icon={<Compass className="size-3.5" />}
          />

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <BasisFact
              title="The two special vectors"
              body="î (i-hat) points right with length 1: (1, 0). ĵ (j-hat) points up with length 1: (0, 1). Together they're the standard basis of the xy-plane."
              accent="cyan"
            />
            <BasisFact
              title="What 'basis' means"
              body="When you think of coordinates as scalars, the basis vectors are what those scalars actually scale. î and ĵ are the default — but any two non-collinear vectors form a valid basis."
              accent="emerald"
            />
          </div>

          <BasisExplorer />

          <div className="mt-5">
            <ConceptCheck
              accent="cyan"
              prompt="Using the standard basis î = (1,0) and ĵ = (0,1), how would you write the vector (5, 0) as a linear combination?"
              answer="It's 5·î + 0·ĵ — five copies of î and zero copies of ĵ. Any vector on the x-axis has a zero ĵ-component; any on the y-axis has a zero î-component. The coordinates literally tell you how much of each basis vector you need."
            />
          </div>
        </div>
      </section>

      {/* ============ 4. LINEAR COMBINATIONS ============ */}
      <section id="combination" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The one operation"
            title="Linear combinations: a·v + b·w"
            description="Take two vectors, scale each by a number, add them. That's it — and it's the single most important construction in linear algebra."
            accent="emerald"
            icon={<Plus className="size-3.5" />}
          />

          <LinearCombinationSim />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <GitBranch className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Why is it called 'linear'?</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Fix one scalar and let the other roam free — the tip of the resulting vector
                  traces a <strong>straight line</strong>. (Hit “Sweep b” in the simulation above to
                  watch it.) With both scalars free, you sweep out a whole plane. Lines and planes —
                  that&apos;s where the word comes from.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ 5. THE SPAN ============ */}
      <section id="span" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Reachable vectors"
            title="The span: everything you can reach"
            description="The span of two vectors is the set of every linear combination you can build from them. Most pairs span the whole plane — but line them up, and the span collapses to a line."
            accent="rose"
            icon={<Layers3 className="size-3.5" />}
          />

          <SpanPainter />

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <SpanCase
              icon={<Grid3x3 className="size-5" />}
              accent="emerald"
              title="Independent"
              body="v and w point different ways. Their span is all of 2D space — every point reachable."
            />
            <SpanCase
              icon={<GitBranch className="size-5" />}
              accent="amber"
              title="Collinear"
              body="v and w line up. Every combination stays on one line through the origin — the span is that line."
            />
            <SpanCase
              icon={<CircleDot className="size-5" />}
              accent="rose"
              title="Both zero"
              body="If both vectors are zero, every combination is zero. The span is just the origin."
            />
          </div>

          <div className="mt-5">
            <ConceptCheck
              accent="rose"
              prompt="If two vectors are collinear, is there any linear combination that lands off their shared line?"
              answer="No. If w = k·v for some scalar k, then a·v + b·w = a·v + b·(k·v) = (a + b·k)·v — which is always a scalar multiple of v, always on the same line. That's exactly why collinear vectors are 'linearly dependent': one is redundant."
            />
          </div>
        </div>
      </section>

      {/* ============ 6. VECTORS AS POINTS ============ */}
      <section id="points" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="A change of view"
            title="Arrows for one, points for many"
            description="A single vector wants to be an arrow. But a whole collection — like a span — is easier to see as a cloud of points: one dot at each tip."
            accent="cyan"
            icon={<CircleDot className="size-3.5" />}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="grid gap-4 lg:grid-cols-2"
          >
            <PointView
              icon={<Plus className="size-5" />}
              accent="emerald"
              title="One vector → arrow"
              body="When you're thinking about a single vector — where it points, how long it is — picture the arrow. Its tail sits at the origin; its tip is the destination."
            />
            <PointView
              icon={<Grid3x3 className="size-5" />}
              accent="amber"
              title="Many vectors → points"
              body="When you're dealing with a whole set (a span, a collection), drop the arrows and keep only the tips. Each vector becomes a dot. The span is then just the region the dots fill."
            />
          </motion.div>

          <p className="mt-5 rounded-2xl border border-border/50 bg-card/40 p-5 text-sm leading-relaxed text-muted-foreground">
            Look back at the SpanPainter: those dots <em>are</em> the span, drawn as points. When
            the vectors line up, the dots collapse to a line; when they don&apos;t, they fill the
            sheet of 2D space. Same idea, two ways to see it.
          </p>
        </div>
      </section>

      {/* ============ 7. 3D SPAN & DEPENDENCE ============ */}
      <section id="dependence" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Into 3D"
            title="Span in three dimensions"
            description="Two 3D vectors sweep out a flat sheet through the origin. Add a third vector: if it's on the sheet, nothing changes; if it's off it, you unlock all of 3D space."
            accent="emerald"
            icon={<Box className="size-3.5" />}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <DependenceCard
              icon={<Link2 className="size-5" />}
              accent="amber"
              title="Linearly dependent"
              tag="redundant"
              body="One vector already sits in the span of the others — you could remove it without shrinking the span. Equivalently, it can be written as a linear combination of the rest."
            />
            <DependenceCard
              icon={<Unlink className="size-5" />}
              accent="emerald"
              title="Linearly independent"
              tag="adds a dimension"
              body="Each vector genuinely points in a new direction. None can be built from the others. Removing any one would shrink the span."
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="mt-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 p-6"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-300">
              <Sigma className="size-3.5" />
              The technical definition
            </div>
            <p className="mt-3 text-lg font-medium leading-relaxed text-foreground">
              A <strong>basis</strong> of a space is a set of{" "}
              <span className="text-emerald-300">linearly independent</span> vectors that{" "}
              <span className="text-cyan-300">span</span> that space.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Read it carefully: it ties together everything in this lesson. A basis is a minimal
              spanning set — enough vectors to reach everywhere (span), with none wasted
              (independent). î and ĵ are a basis for 2D; add a third î-and-ĵ combination and you
              lose independence; remove one and you lose the span.
            </p>
          </motion.div>

          <div className="mt-5">
            <ConceptCheck
              accent="emerald"
              prompt="In 3D, you have two vectors that span a plane. You add a third vector that does NOT lie on that plane. Are the three linearly independent?"
              answer="Yes. Because the third vector points off the plane, it genuinely adds a third direction — the span jumps from a flat sheet to all of 3D space. None of the three is redundant, so they're linearly independent. (And together they form a basis for 3D!)"
            />
          </div>
        </div>
      </section>

      {/* ============ 8. MINI QUIZ ============ */}
      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Pause & check"
            title="Check your understanding"
            description="Four questions on basis, span, and independence. Trust the pictures you've built."
            accent="amber"
          />
          <QuizCard lessonSlug="span-linear-combinations" questions={lesson.quiz} />
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
              icon={<Compass className="size-5" />}
              accent="cyan"
              title="Coordinates scale the basis"
              body="(x, y) is shorthand for x·î + y·ĵ. Each coordinate is a scalar; î and ĵ are what it scales. Any two non-collinear vectors can serve as a basis."
              formula="(x, y) = x·î + y·ĵ"
            />
            <SummaryCard
              index={1}
              icon={<Plus className="size-5" />}
              accent="emerald"
              title="Linear combination = scale & add"
              body="a·v + b·w — scale each vector, add the results. The single construction underlying all of linear algebra. Fix one scalar and the tip traces a line."
              formula="a·v + b·w"
            />
            <SummaryCard
              index={2}
              icon={<Layers3 className="size-5" />}
              accent="rose"
              title="Span = everything reachable"
              body="The set of all linear combinations of given vectors. Two independent 2D vectors span the plane; two collinear ones span a line; two zero vectors span only the origin."
              formula="span{v,w}"
            />
            <SummaryCard
              index={3}
              icon={<Unlink className="size-5" />}
              accent="amber"
              title="Dependence = redundancy"
              body="Vectors are linearly dependent if one is already in the span of the others (removable). Independent if each adds a new dimension. A basis = independent + spanning."
              formula="basis = indep. ∩ spanning"
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
              Any time we describe vectors numerically, it depends on an implicit choice of what
              basis vectors we&apos;re using.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">— the subtle point this whole lesson turns on</p>
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

function BasisFact({ title, body, accent }: { title: string; body: string; accent: "cyan" | "emerald" }) {
  const dot = accent === "cyan" ? "bg-cyan-400" : "bg-emerald-400";
  return (
    <div className="rounded-xl border border-border/50 bg-card/40 p-5">
      <div className="flex items-center gap-2">
        <span className={`size-2 rounded-full ${dot}`} />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function SpanCase({
  icon,
  accent,
  title,
  body,
}: {
  icon: React.ReactNode;
  accent: "emerald" | "amber" | "rose";
  title: string;
  body: string;
}) {
  const a = {
    emerald: { bg: "bg-emerald-500/15", text: "text-emerald-300", ring: "ring-emerald-500/20" },
    amber: { bg: "bg-amber-500/15", text: "text-amber-300", ring: "ring-amber-500/20" },
    rose: { bg: "bg-rose-500/15", text: "text-rose-300", ring: "ring-rose-500/20" },
  }[accent];
  return (
    <div className={`card-lift rounded-2xl border border-border/50 bg-card/40 p-5 ring-1 ring-inset ${a.ring}`}>
      <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function PointView({
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
        <div className={`flex size-9 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function DependenceCard({
  icon,
  accent,
  title,
  tag,
  body,
}: {
  icon: React.ReactNode;
  accent: "amber" | "emerald";
  title: string;
  tag: string;
  body: string;
}) {
  const a = {
    amber: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
    emerald: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30" },
  }[accent];
  return (
    <div className={`rounded-2xl border ${a.border} bg-card/40 p-5`}>
      <div className="flex items-center justify-between">
        <div className={`flex size-9 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>
          {icon}
        </div>
        <span className={`rounded-full border ${a.border} px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${a.text}`}>
          {tag}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
