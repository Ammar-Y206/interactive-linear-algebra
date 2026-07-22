"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Eye, MessageSquare, Sigma, ArrowRight, Languages } from "lucide-react";
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

export interface MathLanguageLessonProps { onNavigate: (slug: string) => void; }
const TOC = [{ id: "language", label: "Math is a language" }, { id: "registers", label: "Three registers" }, { id: "compression", label: "Notation as compression" }, { id: "connections", label: "Connections" }, { id: "quiz", label: "Check your understanding" }];

export function MathLanguageLesson({ onNavigate }: MathLanguageLessonProps) {
  const lesson = getLessonBySlug("math-as-language")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("math-as-language");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("math-as-language");
  const prev = getPrevLesson("math-as-language");

  function handleComplete() { completeLesson("math-as-language"); if (!done) { setCelebrate(true); setTimeout(() => setCelebrate(false), 2600); } const dest = next ? next.slug : "completion"; setTimeout(() => onNavigate(dest), done ? 500 : 1400); }
  function handleNav(d: "prev" | "next") { if (d === "prev" && prev) onNavigate(prev.slug); if (d === "next" && next) onNavigate(next.slug); if (d === "next" && !next) onNavigate("completion"); }
  const L = (slug: string) => LESSONS.find(l => l.slug === slug);

  return (
    <LessonLayout toc={TOC}>
      {celebrate && <Confetti count={100} durationMs={2600} />}
      <HeroSection lesson={lesson} />
      <LearningObjectives objectives={lesson.objectives} />

      <section id="language" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The mindset" title="Mathematics is a language" description="Math isn't a collection of rules to memorize — it's a language honed over millennia to describe patterns precisely. Every symbol is a word. Every equation is a sentence. Learn to hear the meaning." accent="violet" icon={<Languages className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="font-mono text-lg text-foreground">v = (3, 2)</div>
                <p className="mt-1 text-xs text-muted-foreground">The symbols…</p>
              </div>
              <div>
                <div className="text-lg text-foreground">&ldquo;A vector named v, with coordinates 3 and 2.&rdquo;</div>
                <p className="mt-1 text-xs text-muted-foreground">…is a sentence.</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">When you read <span className="font-mono">v = (3, 2)</span>, don&apos;t see symbols — hear the sentence. That shift is the difference between struggling with math and flowing through it.</p>
          </motion.div>
        </div>
      </section>

      <section id="registers" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Fluency" title="Every concept lives in three registers" description="A picture (geometry), a sentence (intuition), and a symbol (algebra). True fluency = moving freely between all three. This course trains you in all three simultaneously." accent="cyan" icon={<Eye className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Register icon={<Eye className="size-5" />} accent="emerald" title="Picture" body="An arrow. A morphing grid. A perpendicular vector. The geometry you can see and move." />
            <Register icon={<MessageSquare className="size-5" />} accent="amber" title="Sentence" body="'This vector points right and up.' 'The transformation squishes space.' The intuition in words." />
            <Register icon={<Sigma className="size-5" />} accent="rose" title="Symbol" body="v = (3, 2). det(A) = 6. Av = λv. The compressed algebra you can manipulate." />
          </div>
        </div>
      </section>

      <section id="compression" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Why notation exists" title="Notation is compression, not intimidation" description="A single matrix equation can capture a system that would take a paragraph in English. The compactness lets you hold complex ideas in your mind — and manipulate them as single objects." accent="emerald" icon={<BookOpen className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="text-center">
              <div className="font-mono text-2xl text-foreground">A · x = v</div>
              <p className="mt-3 text-sm text-muted-foreground">Four symbols. They say: <em>&ldquo;There is a transformation A. Find the input vector x that it sends to the output vector v.&rdquo;</em> That&apos;s an entire word problem — a system of equations — in four characters.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Connections
        prev={[L("welcome")!, L("ai-math")!].map(l => ({ number: l.number, title: l.title, slug: l.slug, relation: "prerequisite" as const }))}
        next={[L("roadmap")!, L("vectors")!].map(l => ({ number: l.number, title: l.title, slug: l.slug, relation: "next" as const }))}
        onNavigate={onNavigate}
      />

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="math-as-language" questions={lesson.quiz} />
        </div>
      </section>

      <Motivation canUnderstand="how to read math as a language — turning intimidating symbols into sentences you can hear, and using notation as a tool for thought rather than a barrier" accent="violet" />

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}

function Register({ icon, accent, title, body }: { icon: React.ReactNode; accent: "emerald" | "amber" | "rose"; title: string; body: string }) {
  const a = { emerald: "bg-emerald-500/15 text-emerald-300", amber: "bg-amber-500/15 text-amber-300", rose: "bg-rose-500/15 text-rose-300" }[accent];
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
      <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${a}`}>{icon}</div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
