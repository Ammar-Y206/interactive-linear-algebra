"use client";

/**
 * DeterminantLesson  (Lesson 6)
 * ----------------------------------------------------------------
 * The determinant — area scaling, det=0, negative determinants &
 * orientation, the 3D volume version, and the ad−bc formula.
 *
 * Sections:
 *   1. Hero
 *   2. Learning objectives
 *   3. The big idea: area scaling (DeterminantSim)
 *   4. det = 0: the dimension-collapse test
 *   5. Negative determinants & orientation
 *   6. 3D: volumes & the parallelepiped
 *   7. The formula ad − bc
 *   8. Mini quiz + summary + what's next
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Expand,
  Scissors,
  FlipHorizontal,
  Box,
  Sigma,
  Quote,
  Crosshair,
  Network,
  Hand,
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
import { DeterminantSim } from "@/components/simulations/determinant-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface DeterminantLessonProps {
  onNavigate: (slug: string) => void;
}

const TOC = [
  { id: "scaling", label: "Area scaling" },
  { id: "zero", label: "det = 0" },
  { id: "negative", label: "Negative & orientation" },
  { id: "3d", label: "Volumes in 3D" },
  { id: "formula", label: "The ad − bc formula" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function DeterminantLesson({ onNavigate }: DeterminantLessonProps) {
  const lesson = getLessonBySlug("determinant")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("determinant");
  const [celebrate, setCelebrate] = useState(false);

  const next = getNextLesson("determinant");
  const prev = getPrevLesson("determinant");
  const hasPrev = !!prev;
  const hasNext = !!next;

  function handleComplete() {
    completeLesson("determinant");
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

      {/* ============ 3. AREA SCALING ============ */}
      <section id="scaling" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The big idea"
            title="The determinant scales area"
            description="A transformation stretches or squishes space. The single number measuring by how much — the area-scaling factor of any region — is the determinant."
            accent="emerald"
            icon={<Expand className="size-3.5" />}
          />

          <DeterminantSim />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <Network className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">One square tells you everything</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Watch the unit square (the 1×1 region whose sides sit on î and ĵ). After the
                  transformation it becomes a parallelogram of area <em>det</em>. Because grid lines
                  stay parallel and evenly spaced, <strong>every</strong> region — no matter its
                  shape or size — scales by that same factor. So measuring one square measures the
                  whole transformation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ 4. DET = 0 ============ */}
      <section id="zero" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The most important case"
            title="det = 0: a dimension collapsed"
            description="When the determinant is zero, every area becomes zero — space got squished onto a line (or a point). This is the signal that the matrix's columns are linearly dependent."
            accent="amber"
            icon={<Scissors className="size-3.5" />}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300"><Scissors className="size-5" /></div>
                <h3 className="font-semibold text-foreground">What det = 0 means</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The unit square&apos;s area dropped to zero — î and ĵ landed on the same line, so
                the parallelogram collapsed. And since every region scales by the same factor, the
                entire plane got squished onto that one line. A whole dimension vanished.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-2xl border border-border/50 bg-card/40 p-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary"><Network className="size-5" /></div>
                <h3 className="font-semibold text-foreground">Why it matters</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A zero determinant means the transformation can&apos;t be undone — information was
                destroyed. This single test (det = 0?) decides whether a matrix has an inverse,
                whether a system has a unique solution, and whether the columns are independent.
                You&apos;ll meet all of these soon.
              </p>
            </motion.div>
          </div>

          <div className="mt-5">
            <ConceptCheck
              accent="amber"
              prompt="Hit the 'Collapse (det=0)' preset above. What's true about î and ĵ — and what does that imply about the columns of the matrix?"
              answer="î and ĵ point along the same line — one is a scaled copy of the other. That means the matrix's two columns are linearly dependent (recall Lesson 2). A zero determinant and linear dependence are two names for the same geometric event: a dimension got crushed."
            />
          </div>
        </div>
      </section>

      {/* ============ 5. NEGATIVE & ORIENTATION ============ */}
      <section id="negative" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The sign matters"
            title="Negative determinants flip space"
            description="The determinant can be negative. The absolute value is still the area scale — but the sign records whether the transformation turned space inside-out."
            accent="rose"
            icon={<FlipHorizontal className="size-3.5" />}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <NegCard
              icon={<FlipHorizontal className="size-5" />}
              accent="rose"
              title="Orientation flips"
              body="Picture 2D space as a sheet of paper. Some transformations turn the sheet over onto its other side — that's an orientation flip. The determinant goes negative."
            />
            <NegCard
              icon={<Crosshair className="size-5" />}
              accent="cyan"
              title="The î–ĵ swap test"
              body="At rest, ĵ is to the left of î. If after the transform ĵ sits to the right of î, orientation flipped. Try the 'Flip' preset and watch them cross."
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-5 rounded-2xl border border-border/50 bg-card/40 p-5"
          >
            <h3 className="font-semibold text-foreground">Why negative makes sense</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Imagine slowly sliding î toward ĵ. The parallelogram gets thinner — the determinant
              shrinks toward 0. When they line up, det = 0. Push î past ĵ, and instead of jumping,
              the determinant just keeps going — into the negatives. The sign is the natural
              continuation: the area scale is continuous, and crossing zero flips the orientation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ 6. 3D VOLUMES ============ */}
      <section id="3d" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Into 3D"
            title="Volumes, and the parallelepiped"
            description="In 3D, the determinant scales volume instead of area. The unit cube (edges on î, ĵ, k̂) becomes a slanted box — a parallelepiped — whose volume is |det|."
            accent="cyan"
            icon={<Box className="size-3.5" />}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300"><Box className="size-5" /></div>
                <h3 className="font-semibold text-foreground">The unit cube → parallelepiped</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The 1×1×1 cube whose edges rest on î, ĵ, k̂ warps into a slanted box — delightfully
                named a <strong>parallelepiped</strong>. Its volume starts at 1 and becomes the
                determinant. det=0 means the cube got squished flat (a plane, line, or point) — the
                columns are linearly dependent.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-2xl border border-border/50 bg-card/40 p-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Hand className="size-5" /></div>
                <h3 className="font-semibold text-foreground">The right-hand rule</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                To read 3D orientation, point your right hand&apos;s fingers along î, then ĵ, then
                k̂. If your thumb still points along k̂ after the transformation, orientation is
                preserved (det &gt; 0). If you&apos;d need your <em>left</em> hand, space flipped
                (det &lt; 0).
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ 7. THE FORMULA ============ */}
      <section id="formula" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The computation"
            title="det = ad − bc (and why)"
            description="For a 2×2 matrix [a,b | c,d], the determinant is ad − bc. The intuition behind the formula matters more than the formula itself."
            accent="amber"
            icon={<Sigma className="size-3.5" />}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-border/50 bg-card/40 p-6"
          >
            <div className="mb-4 flex items-center justify-center gap-3 font-mono text-2xl">
              <span className="text-muted-foreground/60">[</span>
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-5">
                  <span className="w-8 text-center text-amber-300">a</span>
                  <span className="w-8 text-center text-cyan-300">b</span>
                </div>
                <div className="flex gap-5">
                  <span className="w-8 text-center text-amber-300">c</span>
                  <span className="w-8 text-center text-cyan-300">d</span>
                </div>
              </div>
              <span className="text-muted-foreground/60">]</span>
              <span className="text-lg text-muted-foreground">→</span>
              <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-emerald-300">ad − bc</span>
            </div>

            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">When b = c = 0:</strong> î stretches to (a, 0)
                and ĵ to (0, d). The unit square becomes an a×d rectangle — area <span className="font-mono text-foreground">a·d</span>. That&apos;s the whole
                determinant.
              </p>
              <p>
                <strong className="text-foreground">When only one of b, c is 0:</strong> you get a
                parallelogram with base <span className="font-mono">a</span> and height{" "}
                <span className="font-mono">d</span> — still area <span className="font-mono text-foreground">a·d</span>.
              </p>
              <p>
                <strong className="text-foreground">When both b, c ≠ 0:</strong> the{" "}
                <span className="font-mono text-foreground">−b·c</span> term corrects for the
                diagonal slant — how much the parallelogram gets stretched or squished along the
                diagonal. Subtract it, and you get the true signed area.
              </p>
            </div>
          </motion.div>

          <div className="mt-5">
            <ConceptCheck
              accent="amber"
              prompt="The matrix [3, 0 | 0, 2] has det = 6. The matrix [1, 1 | 0, 1] (a shear) has det = 1. Why does the shear leave area unchanged?"
              answer="In the shear, î stays at (1,0) and ĵ tilts to (1,1). The unit square slants into a parallelogram — but its base is still 1 (î's length) and its height is still 1 (ĵ's vertical reach). Base × height = 1, so det = 1·1 − 1·0 = 1. The shear moves things around but doesn't stretch or squish any area."
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
            description="Four questions on area scaling, det=0, orientation, and the formula."
            accent="amber"
          />
          <QuizCard lessonSlug="determinant" questions={lesson.quiz} />
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
              icon={<Expand className="size-5" />}
              accent="emerald"
              title="det = area scale"
              body="The determinant is the single factor by which a transformation scales every region's area (2D) or volume (3D). det=3 triples areas; det=1 leaves them unchanged."
              formula="det = area scale"
            />
            <SummaryCard
              index={1}
              icon={<Scissors className="size-5" />}
              accent="amber"
              title="det = 0 → dimension lost"
              body="Zero area means space got squished onto a line (or point). The columns are linearly dependent, and the transformation can't be undone. This is the most important test in linear algebra."
              formula="det = 0 ⟺ dependent"
            />
            <SummaryCard
              index={2}
              icon={<FlipHorizontal className="size-5" />}
              accent="rose"
              title="Negative = flipped"
              body="The sign records orientation. |det| is the area scale; a negative det means space was turned inside-out (ĵ crossed past î)."
              formula="sign = orientation"
            />
            <SummaryCard
              index={3}
              icon={<Sigma className="size-5" />}
              accent="cyan"
              title="ad − bc, with intuition"
              body="a·d is the rectangle when there's no slant; −b·c corrects for the diagonal stretch. The formula falls out of the geometry — don't memorize, visualize."
              formula="det = ad − bc"
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
              Understanding what the determinant represents is, trust me, much more important than
              the computation.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">— the whole philosophy of this lesson in one line</p>
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
function NegCard({
  icon,
  accent,
  title,
  body,
}: {
  icon: React.ReactNode;
  accent: "rose" | "cyan";
  title: string;
  body: string;
}) {
  const a = {
    rose: { bg: "bg-rose-500/15", text: "text-rose-300" },
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
