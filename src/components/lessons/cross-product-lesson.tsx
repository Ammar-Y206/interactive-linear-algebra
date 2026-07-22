"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crosshair, Box, Hand, Sigma, Quote, Network, Layers3, FlipHorizontal } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { SummaryCard } from "@/components/course/summary-card";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ConceptCheck } from "@/components/course/concept-check";
import { Confetti } from "@/components/course/confetti";
import { CrossProductSim } from "@/components/simulations/cross-product-sim";
import { getLessonBySlug, getNextLesson, getPrevLesson } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface CrossProductLessonProps { onNavigate: (slug: string) => void; }

const TOC = [
  { id: "2d", label: "The 2D cross product" },
  { id: "determinant", label: "= the determinant" },
  { id: "3d", label: "The 3D cross product" },
  { id: "trick", label: "The î/ĵ/k̂ trick" },
  { id: "quiz", label: "Check your understanding" },
  { id: "summary", label: "Summary" },
];

export function CrossProductLesson({ onNavigate }: CrossProductLessonProps) {
  const lesson = getLessonBySlug("cross-products")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("cross-products");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("cross-products");
  const prev = getPrevLesson("cross-products");

  function handleComplete() {
    completeLesson("cross-products");
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

      <section id="2d" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Start in 2D" title="Signed area of the parallelogram" description="Two vectors v and w span a parallelogram. The 2D cross product v × w is its signed area: positive when v is right of w, negative when left." accent="rose" icon={<Layers3 className="size-3.5" />} />
          <CrossProductSim />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
            <div className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300"><FlipHorizontal className="size-5" /></div><div><h3 className="font-semibold text-foreground">Order matters</h3><p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Swapping v and w flips the orientation — so w × v = −(v × w). The mnemonic: î × ĵ is positive (î is right of ĵ), and that ordering defines what 'positive' means.</p></div></div>
          </motion.div>
        </div>
      </section>

      <section id="determinant" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The computation" title="It's the determinant" description="Put v and w as the columns of a 2×2 matrix. The determinant measures area scaling — and the unit square becomes exactly that parallelogram. So v × w = det([v | w])." accent="emerald" icon={<Sigma className="size-3.5" />} />
          <div className="mt-5">
            <ConceptCheck accent="emerald" prompt="Two vectors are nearly parallel. Is their cross product large or small?" answer="Small. When vectors point in nearly the same direction, the parallelogram they span is thin — a tiny area. The cross product is largest when the vectors are perpendicular (the parallelogram is fattest). This is why v × v = 0: parallel vectors span zero area." />
          </div>
        </div>
      </section>

      <section id="3d" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Into 3D" title="A perpendicular vector" description="In 3D, the cross product isn't a number — it's a new vector. Its length is the parallelogram's area; its direction is perpendicular to both v and w, chosen by the right-hand rule." accent="cyan" icon={<Box className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-3">
            <PropCard icon={<Layers3 className="size-5" />} accent="rose" title="Length = area" body="The parallelogram's area. Bigger when v, w are perpendicular; zero when parallel." />
            <PropCard icon={<Crosshair className="size-5" />} accent="cyan" title="Perpendicular" body="v × w is perpendicular to the plane spanned by v and w. Dot it with either — you get 0." />
            <PropCard icon={<Hand className="size-5" />} accent="amber" title="Right-hand rule" body="Forefinger along v, middle along w, thumb = v × w. Picks the consistent direction." />
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-5 rounded-2xl border border-border/50 bg-card/40 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">Try the <strong>3D mode</strong> in the simulator above. Drag v and w on the ground plane and watch the rose cross-product vector stand perpendicular — its length tracks the parallelogram's area, and its direction follows the right-hand rule.</p>
          </motion.div>
        </div>
      </section>

      <section id="trick" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The strange computation" title="The î/ĵ/k̂ determinant trick" description="Write a 3×3 matrix with î, ĵ, k̂ in the first column and v, w in the others. Compute its determinant as if î, ĵ, k̂ were numbers. The result — a linear combination of î, ĵ, k̂ — is v × w. Looks like a notational accident. It isn't (next lesson)." accent="amber" icon={<Network className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-300">The funky matrix</div>
            <div className="flex items-center justify-center gap-1 font-mono text-2xl">
              <span className="text-muted-foreground/60">[</span>
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-5"><span className="w-10 text-center text-violet-300">î</span><span className="w-10 text-center text-amber-300">v₁</span><span className="w-10 text-center text-cyan-300">w₁</span></div>
                <div className="flex gap-5"><span className="w-10 text-center text-violet-300">ĵ</span><span className="w-10 text-center text-amber-300">v₂</span><span className="w-10 text-center text-cyan-300">w₂</span></div>
                <div className="flex gap-5"><span className="w-10 text-center text-violet-300">k̂</span><span className="w-10 text-center text-amber-300">v₃</span><span className="w-10 text-center text-cyan-300">w₃</span></div>
              </div>
              <span className="text-muted-foreground/60">]</span>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">Pretend î, ĵ, k̂ are numbers; expand the determinant; collect their coefficients. The resulting linear combination IS v × w.</p>
          </motion.div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="cross-products" questions={lesson.quiz} />
        </div>
      </section>

      <section id="summary" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Takeaways" title="What to remember" accent="emerald" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard index={0} icon={<Layers3 className="size-5" />} accent="rose" title="2D: signed area" body="v × w = signed area of the parallelogram. Positive if v right of w; flips sign when swapped." formula="v × w = det([v|w])" />
            <SummaryCard index={1} icon={<Box className="size-5" />} accent="cyan" title="3D: perpendicular vector" body="Length = parallelogram area; direction = perpendicular to both v and w, by the right-hand rule." formula="|v × w| = area" />
            <SummaryCard index={2} icon={<FlipHorizontal className="size-5" />} accent="amber" title="Anti-commutative" body="w × v = −(v × w). Order matters; swapping flips the orientation." formula="w × v = −(v × w)" />
            <SummaryCard index={3} icon={<Network className="size-5" />} accent="violet" title="The î/ĵ/k̂ trick" body="A 3×3 determinant with basis vectors in column 1 produces v × w. Why? That's duality — next lesson." formula="det[î,ĵ,k̂ | v | w]" />
          </div>
          <motion.blockquote initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/60 to-background/40 p-6">
            <Quote className="size-5 text-muted-foreground/50" />
            <p className="mt-2 text-balance text-base italic leading-relaxed text-foreground/90">The order of your basis vectors is what defines orientation.</p>
            <p className="mt-3 text-sm text-muted-foreground">— why î × ĵ being positive sets the convention</p>
          </motion.blockquote>
        </div>
      </section>

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}

function PropCard({ icon, accent, title, body }: { icon: React.ReactNode; accent: "rose" | "cyan" | "amber"; title: string; body: string }) {
  const a = { rose: "bg-rose-500/15 text-rose-300", cyan: "bg-cyan-500/15 text-cyan-300", amber: "bg-amber-500/15 text-amber-300" }[accent];
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
      <div className={`mb-3 flex size-9 items-center justify-center rounded-xl ${a}`}>{icon}</div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
