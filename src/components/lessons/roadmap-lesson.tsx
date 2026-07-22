"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Compass, Atom, Cog, Trophy, ArrowRight } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { Connections, Motivation } from "@/components/course/curriculum-sections";
import { Confetti } from "@/components/course/confetti";
import { getLessonBySlug, getNextLesson, getPrevLesson, LESSONS } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface RoadmapLessonProps { onNavigate: (slug: string) => void; }
const TOC = [{ id: "acts", label: "The three acts" }, { id: "map", label: "The course map" }, { id: "connections", label: "Connections" }, { id: "quiz", label: "Check your understanding" }];

export function RoadmapLesson({ onNavigate }: RoadmapLessonProps) {
  const lesson = getLessonBySlug("roadmap")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("roadmap");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("roadmap");
  const prev = getPrevLesson("roadmap");

  function handleComplete() { completeLesson("roadmap"); if (!done) { setCelebrate(true); setTimeout(() => setCelebrate(false), 2600); } const dest = next ? next.slug : "completion"; setTimeout(() => onNavigate(dest), done ? 500 : 1400); }
  function handleNav(d: "prev" | "next") { if (d === "prev" && prev) onNavigate(prev.slug); if (d === "next" && next) onNavigate(next.slug); if (d === "next" && !next) onNavigate("completion"); }
  const L = (slug: string) => LESSONS.find(l => l.slug === slug);

  const act1 = LESSONS.filter(l => l.slug === "vectors" || l.slug === "span-linear-combinations").map(l => ({ n: l.number, t: l.title }));
  const act2 = LESSONS.filter(l => ["linear-transformations", "matrix-multiplication", "3d-transformations", "determinant", "inverse-matrices", "nonsquare-matrices", "dot-products"].includes(l.slug)).map(l => ({ n: l.number, t: l.title }));
  const act3 = LESSONS.filter(l => ["cross-products", "cross-products-duality", "cramers-rule", "change-of-basis", "eigenvectors", "eigenvalue-trick", "abstract-vector-spaces"].includes(l.slug)).map(l => ({ n: l.number, t: l.title }));

  return (
    <LessonLayout toc={TOC}>
      {celebrate && <Confetti count={100} durationMs={2600} />}
      <HeroSection lesson={lesson} />
      <LearningObjectives objectives={lesson.objectives} />

      <section id="acts" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The structure" title="The three acts of this course" description="Every story has acts. This one has three: build the atoms, build the machinery, achieve mastery. Each act escalates the stakes and the beauty." accent="violet" icon={<Compass className="size-3.5" />} />
          <div className="grid gap-4 lg:grid-cols-3">
            <Act icon={<Atom className="size-5" />} accent="emerald" act="I" title="The Atoms" lessons={act1} body="What is a vector? How do they combine? What do they span? The building blocks of space itself." />
            <Act icon={<Cog className="size-5" />} accent="amber" act="II" title="The Machinery" lessons={act2} body="Transformations move space. Matrices record them. Determinants measure them. Inverses undo them." />
            <Act icon={<Trophy className="size-5" />} accent="rose" act="III" title="The Mastery" lessons={act3} body="Cross products, eigenvalues, abstract spaces. The ideas that power AI, graphics, and physics." />
          </div>
        </div>
      </section>

      <section id="map" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The map" title="Your journey, at a glance" description="Here's every lesson in the course, in order. You're at the start. The sidebar's progress ring and this map update as you go — so you always know where you are." accent="cyan" icon={<Map className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-5">
            <div className="flex flex-wrap items-center gap-2">
              {LESSONS.map((l, i) => (
                <div key={l.slug} className="flex items-center gap-2">
                  <button onClick={() => onNavigate(l.slug)} className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                    <span className="font-mono font-bold text-primary/70">{l.number}</span>
                    <span className="hidden sm:inline">{l.title.split(":")[0].split("(")[0].trim()}</span>
                  </button>
                  {i < LESSONS.length - 1 && <ArrowRight className="size-3 text-muted-foreground/30" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Connections
        prev={[L("welcome")!, L("math-as-language")!].map(l => ({ number: l.number, title: l.title, slug: l.slug, relation: "prerequisite" as const }))}
        next={[L("vectors")!, L("span-linear-combinations")!].map(l => ({ number: l.number, title: l.title, slug: l.slug, relation: "next" as const }))}
        onNavigate={onNavigate}
      />

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="roadmap" questions={lesson.quiz} />
        </div>
      </section>

      <Motivation canUnderstand="the shape of the entire journey ahead — the three acts, how they connect, and why each lesson exists exactly where it does" accent="violet" />

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}

function Act({ icon, accent, act, title, lessons, body }: { icon: React.ReactNode; accent: "emerald" | "amber" | "rose"; act: string; title: string; lessons: { n: number; t: string }[]; body: string }) {
  const a = { emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300", amber: "border-amber-500/30 bg-amber-500/5 text-amber-300", rose: "border-rose-500/30 bg-rose-500/5 text-rose-300" }[accent];
  return (
    <div className={`rounded-2xl border ${a} p-5`}>
      <div className="flex items-center justify-between">
        <div className={`flex size-10 items-center justify-center rounded-xl bg-current/15`}>{icon}</div>
        <span className="font-mono text-3xl font-bold opacity-30">Act {act}</span>
      </div>
      <h3 className="mt-3 font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
      <div className="mt-3 space-y-1">
        {lessons.map(l => (
          <div key={l.n} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono font-bold opacity-60">{l.n}</span>
            <span>{l.t.split(":")[0].split("(")[0].trim()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
