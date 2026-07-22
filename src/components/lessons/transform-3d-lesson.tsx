"use client";

/**
 * Transform3DLesson  (Lesson 5)
 * ----------------------------------------------------------------
 * Three-dimensional linear transformations — a short bridge out of
 * flatland. Introduces k̂, the 3×3 matrix, and shows the same
 * column-as-landing-spot idea scales to 3D.
 *
 * Sections:
 *   1. Hero
 *   2. Learning objectives
 *   3. Out of flatland (why 3D, why mostly-still-2D)
 *   4. Meet k̂ — the third basis vector (Transform3DSim)
 *   5. A 3×3 matrix = nine numbers
 *   6. Multiplication & composition in 3D
 *   7. Mini quiz + summary + what's next
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Crosshair,
  Layers3,
  Plus,
  ArrowLeft,
  Cpu,
  Quote,
  Sigma,
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
import { Transform3DSim } from "@/components/simulations/transform-3d-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface Transform3DLessonProps {
  onNavigate: (slug: string) => void;
}

const TOC = [
  { id: "flatland", label: "Out of flatland" },
  { id: "khat", label: "Meet k̂" },
  { id: "matrix", label: "A 3×3 matrix" },
  { id: "compute", label: "Multiply & compose in 3D" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function Transform3DLesson({ onNavigate }: Transform3DLessonProps) {
  const lesson = getLessonBySlug("3d-transformations")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("3d-transformations");
  const [celebrate, setCelebrate] = useState(false);

  const next = getNextLesson("3d-transformations");
  const prev = getPrevLesson("3d-transformations");
  const hasPrev = !!prev;
  const hasNext = !!next;

  function handleComplete() {
    completeLesson("3d-transformations");
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

      {/* ============ 3. OUT OF FLATLAND ============ */}
      <section id="flatland" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="A short bridge"
            title="Peeking out of flatland"
            description="We've lived in the plane for four lessons. The ideas travel to 3D almost unchanged — but it's worth climbing out now and then to see them in fuller space."
            accent="cyan"
            icon={<Box className="size-3.5" />}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FlatCard
              icon={<Layers3 className="size-5" />}
              accent="emerald"
              title="Why we mostly stay in 2D"
              body="It's easier to see, easier to draw, and easier to wrap your mind around. The core ideas live in the plane — and once they click there, they lift into any dimension."
            />
            <FlatCard
              icon={<Box className="size-5" />}
              accent="cyan"
              title="Why peek at 3D"
              body="To confirm the ideas generalize. A 3D transformation still keeps grid lines parallel and evenly spaced, still fixes the origin, and is still fully determined by where the basis vectors land — there are just more of them."
            />
          </div>
        </div>
      </section>

      {/* ============ 4. MEET K̂ ============ */}
      <section id="khat" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The new guy"
            title="Meet k̂ — the third basis vector"
            description="In 2D, î and ĵ spanned the plane. In 3D we add k̂ — the unit vector along the z-axis, pointing 'up and out' of the screen. Three basis vectors, three dimensions."
            accent="cyan"
            icon={<Crosshair className="size-3.5" />}
          />

          <Transform3DSim />

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
                <h3 className="font-semibold text-foreground">Three landing spots, that's all</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Just like 2D: record where î, ĵ, and k̂ each land, and you&apos;ve captured the
                  whole transformation. Any input vector <span className="font-mono">(x, y, z)</span>{" "}
                  is <span className="font-mono">x·î + y·ĵ + z·k̂</span>, and after the transform
                  it&apos;s the same linear combination of where they <em>landed</em>. Drag the tips
                  in the simulator and watch the rose output update.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="mt-5">
            <ConceptCheck
              accent="cyan"
              prompt="A 90° rotation around the y-axis leaves ĵ untouched. Where do î and k̂ go?"
              answer="î swings from the x-axis down to the negative z-axis: î → (0, 0, −1). k̂ swings from the z-axis over to the positive x-axis: k̂ → (1, 0, 0). ĵ stays at (0, 1, 0). The three landing spots become the three columns of the rotation matrix. (Try the '90° y-rotation' preset above!)"
            />
          </div>
        </div>
      </section>

      {/* ============ 5. A 3×3 MATRIX ============ */}
      <section id="matrix" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Nine numbers"
            title="A 3×3 matrix is three landing spots"
            description="Pack the three columns — î's destination, ĵ's destination, k̂'s destination — into a 3×3 grid. That's nine numbers, and they completely describe the transformation."
            accent="amber"
            icon={<Layers3 className="size-3.5" />}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-border/50 bg-card/40 p-6"
          >
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
              <Crosshair className="size-3.5" />
              The 90° y-rotation matrix
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 font-mono">
              <div className="flex items-center gap-1 text-2xl">
                <span className="text-muted-foreground/60">[</span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-5">
                    <span className="w-8 text-center text-amber-300">0</span>
                    <span className="w-8 text-center text-cyan-300">0</span>
                    <span className="w-8 text-center text-violet-300">1</span>
                  </div>
                  <div className="flex gap-5">
                    <span className="w-8 text-center text-amber-300">0</span>
                    <span className="w-8 text-center text-cyan-300">1</span>
                    <span className="w-8 text-center text-violet-300">0</span>
                  </div>
                  <div className="flex gap-5">
                    <span className="w-8 text-center text-amber-300">−1</span>
                    <span className="w-8 text-center text-cyan-300">0</span>
                    <span className="w-8 text-center text-violet-300">0</span>
                  </div>
                </div>
                <span className="text-muted-foreground/60">]</span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
              Column 1 (amber) = î → (0, 0, −1). Column 2 (cyan) = ĵ → (0, 1, 0).{" "}
              Column 3 (violet) = k̂ → (1, 0, 0). Read the columns as destinations, not as rows.
            </p>
          </motion.div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SummaryCard
              index={0}
              icon={<Plus className="size-5" />}
              accent="rose"
              title="Apply: same recipe, three terms"
              body="To transform (x, y, z): take x·(column 1) + y·(column 2) + z·(column 3). The coordinates are scalars; the columns are the new basis. Identical to 2D, with one extra term."
              formula="M·(x,y,z)ᵀ = x·î' + y·ĵ' + z·k̂'"
            />
            <SummaryCard
              index={1}
              icon={<ArrowLeft className="size-5" />}
              accent="cyan"
              title="Compose: still right-to-left"
              body="Multiplying two 3×3 matrices means applying the right transformation first, then the left. Same composition rule, just in 3D."
              formula="M₂·M₁ : M₁ first, then M₂"
            />
          </div>
        </div>
      </section>

      {/* ============ 6. COMPUTE / COMPOSE ============ */}
      <section id="compute" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Why it matters"
            title="3D composition powers graphics & robotics"
            description="Hard 3D rotations break into chains of simple ones — rotate around x, then y, then z. Matrix multiplication composes them into one matrix the computer can apply to every point."
            accent="emerald"
            icon={<Cpu className="size-3.5" />}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <Cpu className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Why 3D matrix multiplication is worth it</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Describing an arbitrary 3D rotation directly is genuinely hard. But breaking it
                  into a sequence — a roll, a pitch, a yaw — is easy. Multiply the three simple
                  rotation matrices together (right-to-left) and you get one matrix that captures
                  the full motion. That single matrix is what a graphics engine applies to millions
                  of points each frame, and what a robot uses to plan where its arm ends up.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="mt-5">
            <ConceptCheck
              accent="emerald"
              prompt="A 3×3 matrix's columns are linearly dependent (e.g. k̂ lands on the span of î and ĵ). What happens to 3D space?"
              answer="The transformation flattens 3D space into a 2D plane (or a line, or a point) — a dimension is lost. The grid still keeps lines straight and the origin fixed, but everything gets squished into the lower-dimensional span. (Hit the 'Flatten' preset above to see it.) This 'dimension loss' is exactly what a zero determinant will detect in the next lesson."
            />
          </div>
        </div>
      </section>

      {/* ============ 7. QUIZ ============ */}
      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Pause & check"
            title="Check your understanding"
            description="Four quick questions on the leap to 3D."
            accent="amber"
          />
          <QuizCard lessonSlug="3d-transformations" questions={lesson.quiz} />
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
              icon={<Crosshair className="size-5" />}
              accent="cyan"
              title="k̂ joins the basis"
              body="3D has three standard basis vectors: î (x), ĵ (y), k̂ (z). Every 3D vector is a linear combination x·î + y·ĵ + z·k̂."
              formula="î=(1,0,0), ĵ=(0,1,0), k̂=(0,0,1)"
            />
            <SummaryCard
              index={1}
              icon={<Layers3 className="size-5" />}
              accent="amber"
              title="3×3 matrix = three columns"
              body="The columns are where î, ĵ, k̂ land. Nine numbers fully describe any 3D linear transformation — no new ideas, just one more basis vector."
              formula="M = [ î' | ĵ' | k̂' ]"
            />
            <SummaryCard
              index={2}
              icon={<Plus className="size-5" />}
              accent="rose"
              title="Multiplication = linear combo"
              body="Apply M to (x,y,z): x·(col 1) + y·(col 2) + z·(col 3). Same recipe as 2D, with a third term."
              formula="M·v = x·î' + y·ĵ' + z·k̂'"
            />
            <SummaryCard
              index={3}
              icon={<ArrowLeft className="size-5" />}
              accent="emerald"
              title="Composition is unchanged"
              body="3D matrix multiplication is still composition, read right-to-left. It's the engine behind computer graphics and robotics — compose simple rotations into one matrix."
              formula="M₂·M₁ : apply M₁, then M₂"
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
              Once you get all the core ideas in two dimensions, they carry over pretty seamlessly
              to higher dimensions.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">— why we spent so long in the plane before climbing out</p>
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

/* ---------------- local helper ---------------- */
function FlatCard({
  icon,
  accent,
  title,
  body,
}: {
  icon: React.ReactNode;
  accent: "emerald" | "cyan";
  title: string;
  body: string;
}) {
  const a = {
    emerald: { bg: "bg-emerald-500/15", text: "text-emerald-300" },
    cyan: { bg: "bg-cyan-500/15", text: "text-cyan-300" },
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
