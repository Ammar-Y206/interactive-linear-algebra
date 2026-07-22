"use client";

/**
 * VectorsLesson  (Lesson 1)
 * ----------------------------------------------------------------
 * The full lesson page. Composes shared components + lesson-specific
 * simulations into a single scrollable story.
 *
 * Sections:
 *   1. Hero
 *   2. Learning objectives
 *   3. Three perspectives on a vector
 *   4. The coordinate plane (VectorPlayground)
 *   5. Vector addition (VectorAdditionSim)
 *   6. Scalar multiplication (ScalarMultiplicationSim)
 *   7. Mini quiz
 *   8. Summary cards + What's next
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import {
  ListOrdered,
  Sigma,
  ArrowRight,
  Compass,
  Network,
  Crosshair,
  GitBranch,
  FlipVertical2,
  Plus,
  X,
  Lightbulb,
  Quote,
} from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { SimulationContainer } from "@/components/course/simulation-container";
import {
  CoordinatePlane,
  type PlaneVector,
  PLANE_COLORS,
} from "@/components/simulations/coordinate-plane";
import { VectorPlayground } from "@/components/simulations/vector-playground";
import { VectorAdditionSim } from "@/components/simulations/vector-addition-sim";
import { ScalarMultiplicationSim } from "@/components/simulations/scalar-multiplication-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface VectorsLessonProps {
  onNavigate: (slug: string) => void;
}

const TOC = [
  { id: "perspectives", label: "Three perspectives" },
  { id: "coordinates", label: "The coordinate plane" },
  { id: "addition", label: "Vector addition" },
  { id: "scalar", label: "Scalar multiplication" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function VectorsLesson({ onNavigate }: VectorsLessonProps) {
  const lesson = getLessonBySlug("vectors")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("vectors");

  const next = getNextLesson("vectors");
  const prev = getPrevLesson("vectors");
  const hasNext = !!next;
  const hasPrev = !!prev;

  function handleComplete() {
    completeLesson("vectors");
    // continue to the next lesson, or to the completion page if this is the last
    const dest = next ? next.slug : "completion";
    setTimeout(() => onNavigate(dest), 500);
  }

  function handleNav(direction: "prev" | "next") {
    if (direction === "prev" && prev) onNavigate(prev.slug);
    if (direction === "next" && next) onNavigate(next.slug);
    // if no next lesson, go to completion
    if (direction === "next" && !next) onNavigate("completion");
  }

  return (
    <LessonLayout toc={TOC}>
      <HeroSection lesson={lesson} />

      <LearningObjectives objectives={lesson.objectives} />

      {/* ============ 3. THREE PERSPECTIVES ============ */}
      <section id="perspectives" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The big idea"
            title="What even is a vector?"
            description="It depends who you ask. Three communities use the word, and linear algebra lives where they overlap."
            accent="emerald"
            icon={<Network className="size-3.5" />}
          />

          <div className="grid gap-4 lg:grid-cols-3">
            <PerspectiveCard
              index={0}
              icon={<ArrowRight className="size-5" />}
              accent="emerald"
              who="Physics"
              tagline="Arrows in space"
              body="A vector is an arrow: it has a length and a direction, and it can live anywhere. Flat-plane arrows are 2D; arrows in the space around you are 3D."
              formula="↗ length + direction"
            />
            <PerspectiveCard
              index={1}
              icon={<ListOrdered className="size-5" />}
              accent="amber"
              who="Computer Science"
              tagline="Ordered lists of numbers"
              body="A vector is a list of numbers in a specific order. A house with square-footage and price becomes a pair — a 2D vector — where '2D' just means the list has two entries."
              formula="[ sqft, price ]"
            />
            <PerspectiveCard
              index={2}
              icon={<Sigma className="size-5" />}
              accent="rose"
              who="Mathematics"
              tagline="Anything you can add & scale"
              body="The mathematician generalizes both: a vector is anything with a sensible notion of addition and multiplication by numbers. Abstract now — but it hints that those two operations are the whole game."
              formula="add + scale"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <Crosshair className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Our working picture: an arrow rooted at the origin
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Throughout this course, when you hear <em>vector</em>, picture an
                  arrow — but with its tail pinned to the center of a coordinate
                  system (the <strong>origin</strong>). That's the linear-algebra
                  convention, and it's what lets every vector correspond to exactly
                  one point in space.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ 4. THE COORDINATE PLANE ============ */}
      <section id="coordinates" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Where geometry meets numbers"
            title="The coordinate plane"
            description="A horizontal x-axis and a vertical y-axis cross at the origin. The coordinates of a vector are instructions: how far along x, then how far along y."
            accent="emerald"
            icon={<Compass className="size-3.5" />}
          />

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <FactCard
              title="Two numbers, one arrow"
              body="The first number says how far to walk along the x-axis (right is +, left is −). The second says how far to then walk parallel to the y-axis (up is +, down is −)."
              accent="emerald"
            />
            <FactCard
              title="A perfect two-way street"
              body="Every pair of numbers gives exactly one vector, and every vector gives exactly one pair. That bijection is the bridge you'll cross again and again."
              accent="amber"
            />
          </div>

          <VectorPlayground
            initialX={3}
            initialY={2}
            title="Explore a vector"
            description="Drag the glowing tip. The arrow and the pair of numbers are the same object, described two ways."
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-5 rounded-2xl border border-border/50 bg-card/40 p-5"
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-300">
              <Lightbulb className="size-3.5" />
              Into three dimensions
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Add a z-axis perpendicular to both x and y, and each vector becomes a{" "}
              <strong>triplet</strong> (x, y, z): how far along x, then y, then z.
              The same back-and-forth holds — every triplet is one unique arrow in
              space, and every arrow is one unique triplet. We'll mostly stay in 2D
              for intuition, but everything scales up.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ 5. VECTOR ADDITION ============ */}
      <section id="addition" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Operation #1"
            title="Adding vectors: tip-to-tail"
            description="Move the second vector so its tail sits at the first one's tip. The arrow from the origin to the final tip is the sum."
            accent="rose"
            icon={<Plus className="size-3.5" />}
          />

          <VectorAdditionSim />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="mt-5 grid gap-4 lg:grid-cols-2"
          >
            <ExplanationPanel
              icon={<GitBranch className="size-5" />}
              accent="rose"
              title="Why this definition?"
              body="Think of each vector as a step with a distance and direction. Walk the first step, then the second. The net effect — where you end up — is exactly the sum vector. It's the grown-up version of 2 + 5 meaning 'walk 2, then 5, same as walking 7'."
            />
            <ExplanationPanel
              icon={<ListOrdered className="size-5" />}
              accent="amber"
              title="The numeric side"
              body="Tip-to-tail, the path is: walk (x₁, y₁), then (x₂, y₂). Group the rightward steps and the vertical steps and you get (x₁ + x₂, y₁ + y₂). Addition = matching up terms and adding each one."
              formula="(1,2) + (3,−1) = (4,1)"
            />
          </motion.div>
        </div>
      </section>

      {/* ============ 6. SCALAR MULTIPLICATION ============ */}
      <section id="scalar" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Operation #2"
            title="Scaling vectors by numbers"
            description="Multiply a vector by a number and it stretches, squishes, or flips. That number — when it's busy scaling — earns a special name: a scalar."
            accent="emerald"
            icon={<FlipVertical2 className="size-3.5" />}
          />

          <ScalarMultiplicationSim />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-5 rounded-2xl border border-border/50 bg-card/40 p-5"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <ScalarRule factor="2" effect="Stretch to 2× the length" color="emerald" />
              <ScalarRule factor="⅓" effect="Squish to a third" color="amber" />
              <ScalarRule factor="−1.8" effect="Flip, then stretch 1.8×" color="rose" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Numerically, scaling by a factor means multiplying{" "}
              <em>each component</em> by that factor. So{" "}
              <span className="font-mono text-foreground">2 · (3, 2) = (6, 4)</span>. In
              linear algebra, numbers are usually busy scaling vectors — which is why
              you'll hear <strong>scalar</strong> used almost interchangeably with{" "}
              <strong>number</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ 7. MINI QUIZ ============ */}
      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Pause & check"
            title="Check your understanding"
            description="Four quick questions. Don't overthink — trust the picture you just built."
            accent="amber"
          />
          <QuizCard lessonSlug="vectors" questions={lesson.quiz} />
        </div>
      </section>

      {/* ============ 8. SUMMARY ============ */}
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
              icon={<Network className="size-5" />}
              accent="emerald"
              title="A vector is a rooted arrow"
              body="In linear algebra, picture a vector as an arrow with its tail fixed at the origin. Its tip is the point that arrow 'points to'."
            />
            <SummaryCard
              index={1}
              icon={<Crosshair className="size-5" />}
              accent="amber"
              title="Coordinates = instructions"
              body="The pair (x, y) tells you how to walk from the origin to the tip: first along x, then along y. Every vector ↔ exactly one pair."
              formula="v = (x, y)"
            />
            <SummaryCard
              index={2}
              icon={<Plus className="size-5" />}
              accent="rose"
              title="Addition is tip-to-tail"
              body="To add, place the second vector's tail at the first's tip. The sum runs from the origin to the final tip. Numerically: add components."
              formula="(a,b) + (c,d) = (a+c, b+d)"
            />
            <SummaryCard
              index={3}
              icon={<FlipVertical2 className="size-5" />}
              accent="cyan"
              title="Scalars stretch & flip"
              body="Multiplying by a number stretches, squishes, or reverses the vector. Multiply each component by that number. Number = scalar."
              formula="s · (a, b) = (s·a, s·b)"
            />
          </div>

          {/* closing quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6"
          >
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">
              The usefulness of linear algebra has less to do with either view than
              with the ability to translate back and forth between them.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">— the thread running through this whole course</p>
          </motion.blockquote>
        </div>
      </section>

      {/* ============ WHAT'S NEXT ============ */}
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

function PerspectiveCard({
  index,
  icon,
  accent,
  who,
  tagline,
  body,
  formula,
}: {
  index: number;
  icon: React.ReactNode;
  accent: "emerald" | "amber" | "rose";
  who: string;
  tagline: string;
  body: string;
  formula: string;
}) {
  const accents = {
    emerald: { bg: "bg-emerald-500/15", text: "text-emerald-300", ring: "ring-emerald-500/20" },
    amber: { bg: "bg-amber-500/15", text: "text-amber-300", ring: "ring-amber-500/20" },
    rose: { bg: "bg-rose-500/15", text: "text-rose-300", ring: "ring-rose-500/20" },
  }[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-5 ring-1 ring-inset ${accents.ring}`}
    >
      <div className="flex items-center justify-between">
        <div className={`flex size-11 items-center justify-center rounded-xl ${accents.bg} ${accents.text}`}>
          {icon}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {who}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-foreground">{tagline}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-3 inline-flex rounded-lg border border-border/50 bg-background/60 px-3 py-1 font-mono text-xs text-foreground">
        {formula}
      </div>
    </motion.div>
  );
}

function FactCard({
  title,
  body,
  accent,
}: {
  title: string;
  body: string;
  accent: "emerald" | "amber";
}) {
  const dot = accent === "emerald" ? "bg-emerald-400" : "bg-amber-400";
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

function ExplanationPanel({
  icon,
  accent,
  title,
  body,
  formula,
}: {
  icon: React.ReactNode;
  accent: "rose" | "amber";
  title: string;
  body: string;
  formula?: string;
}) {
  const accents = {
    rose: { bg: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/20" },
    amber: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/20" },
  }[accent];
  return (
    <div className={`rounded-2xl border ${accents.border} bg-card/40 p-5`}>
      <div className="flex items-center gap-2.5">
        <div className={`flex size-9 items-center justify-center rounded-xl ${accents.bg} ${accents.text}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
      {formula && (
        <div className="mt-3 inline-flex rounded-lg border border-border/50 bg-background/60 px-3 py-1.5 font-mono text-sm text-foreground">
          {formula}
        </div>
      )}
    </div>
  );
}

function ScalarRule({
  factor,
  effect,
  color,
}: {
  factor: string;
  effect: string;
  color: "emerald" | "amber" | "rose";
}) {
  const c = {
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-300",
    rose: "border-rose-500/20 bg-rose-500/5 text-rose-300",
  }[color];
  return (
    <div className={`rounded-xl border ${c} p-3`}>
      <div className="font-mono text-lg font-bold">× {factor}</div>
      <div className="mt-1 text-xs text-muted-foreground">{effect}</div>
    </div>
  );
}
