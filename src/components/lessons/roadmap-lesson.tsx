"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Compass, Atom, Cog, Trophy, ArrowRight, Sparkles } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ThoughtExperiment } from "@/components/course/thought-experiment";
import { Connections, Motivation } from "@/components/course/curriculum-sections";
import { Confetti } from "@/components/course/confetti";
import { getLessonBySlug, getNextLesson, getPrevLesson, LESSONS } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface RoadmapLessonProps { onNavigate: (slug: string) => void; }
const TOC = [{ id: "journey", label: "An adventure, not a syllabus" }, { id: "acts", label: "The three acts" }, { id: "map", label: "Your map" }, { id: "connections", label: "Connections" }, { id: "quiz", label: "Check your understanding" }];

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

      {/* HOOK — the adventure framing */}
      <ThoughtExperiment
        question="You're about to set off into a territory most people find confusing — not because it's hard, but because they were never given a map. What if you could see the whole journey before taking the first step?"
        tease="Here's the map. Three acts, each escalating the wonder. By the end you won't have memorized a syllabus — you'll have crossed a landscape, and you'll be able to see the world differently because of it."
        accent="violet"
      />

      <LearningObjectives objectives={lesson.objectives} />

      {/* ACTS — the three-act adventure structure */}
      <section id="acts" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The shape of the journey"
            title="Three acts, each bigger than the last"
            description="Every great story has acts. This one has three: build the atoms, build the machinery, achieve mastery. Each act escalates the stakes — and the beauty."
            accent="violet"
            icon={<Compass className="size-3.5" />}
          />
          <div className="grid gap-4 lg:grid-cols-3">
            <Act icon={<Atom className="size-5" />} accent="emerald" act="I" title="The Atoms" lessons={act1} body="What is a vector? How do they combine? What do they span? You'll meet the building blocks of space itself — and discover that two arrows can generate an entire plane." />
            <Act icon={<Cog className="size-5" />} accent="amber" act="II" title="The Machinery" lessons={act2} body="Transformations move space. Matrices record them. Determinants measure the stretch. Inverses undo them. This is where linear algebra becomes a toolkit — and where it starts powering everything." />
            <Act icon={<Trophy className="size-5" />} accent="rose" act="III" title="The Mastery" lessons={act3} body="Cross products, eigenvalues, abstract spaces. You'll find the directions that survive any transformation, see why functions are vectors, and understand the math under AI, graphics, and quantum physics." />
          </div>
        </div>
      </section>

      {/* MAP — the full clickable course map */}
      <section id="map" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Your map"
            title="Every stop on the journey"
            description="Here's the full route — 22 lessons from 'Welcome' to 'Abstract Spaces.' Click any node to jump ahead and preview. You're standing at the trailhead."
            accent="cyan"
            icon={<Map className="size-3.5" />}
          />
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
            <p className="mt-4 text-center text-sm text-muted-foreground">You&apos;re here. The trailhead. Take the first step — the atoms are waiting.</p>
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
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45 }} className={`rounded-2xl border ${a} p-5`}>
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-current/15">{icon}</div>
        <span className="font-mono text-2xl font-bold opacity-30">Act {act}</span>
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
    </motion.div>
  );
}
