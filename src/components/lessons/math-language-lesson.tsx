"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Eye, MessageSquare, Sigma, ArrowRight, Languages, MapPin } from "lucide-react";
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

export interface MathLanguageLessonProps { onNavigate: (slug: string) => void; }
const TOC = [{ id: "mystery", label: "A treasure hunt" }, { id: "registers", label: "Three ways to see" }, { id: "compression", label: "Notation as compression" }, { id: "connections", label: "Connections" }, { id: "quiz", label: "Check your understanding" }];

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

      {/* HOOK — the treasure hunt thought experiment */}
      <ThoughtExperiment
        question="Suppose I asked you to tell a robot where to find a treasure hidden somewhere in a desert. What is the smallest amount of information you would need to give it?"
        tease="Think about it before scrolling on. How few numbers could pin down a single spot in an endless wasteland — and what does that tell us about how math describes space?"
        accent="violet"
      />

      <LearningObjectives objectives={lesson.objectives} />

      {/* REGISTERS — the three ways to see */}
      <section id="registers" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The answer, three ways"
            title="Every idea lives in three registers"
            description="Back to the treasure: you could draw a map (picture), say 'three miles east, two miles north' (sentence), or write (3, 2) (symbol). Same spot, three languages. Fluency = moving freely between all three."
            accent="cyan"
            icon={<Eye className="size-3.5" />}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Register icon={<Eye className="size-5" />} accent="emerald" title="Picture" body="A map with an X. An arrow on a grid. A morphing parallelogram. The geometry you can see and move — the register this course leads with." />
            <Register icon={<MessageSquare className="size-5" />} accent="amber" title="Sentence" body="'Three miles east, two miles north.' 'The transformation squishes space onto a line.' The intuition in words — what you'd say to a friend." />
            <Register icon={<Sigma className="size-5" />} accent="rose" title="Symbol" body="(3, 2). det(A) = 6. Av = λv. The compressed algebra — tiny, precise, and manipulable. The register textbooks jump to too fast." />
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Most courses teach only the symbol register — and learners drown. This course leads with the
              picture, anchors it with the sentence, and only then attaches the symbol. By the time you see{" "}
              <span className="font-mono text-foreground">Av = λv</span>, you&apos;ll already{" "}
              <em>feel</em> what it means.
            </p>
          </motion.div>
        </div>
      </section>

      {/* COMPRESSION — notation as a tool, not a barrier */}
      <section id="compression" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Why symbols exist"
            title="Notation is compression, not intimidation"
            description="Math symbols look scary because they're dense. But density is the point: a single equation can hold an idea that would take a paragraph to say in English. The compression lets you hold bigger thoughts in your head."
            accent="emerald"
            icon={<BookOpen className="size-3.5" />}
          />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">In English</div>
                <p className="mt-2 text-sm text-foreground">&ldquo;There is a transformation A. Find the input vector x that, after A is applied, lands exactly on the output vector v.&rdquo;</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">In math</div>
                <div className="mt-2 text-center font-mono text-3xl text-foreground">A · x = v</div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">Four symbols. An entire word problem. That compression isn&apos;t a barrier — it&apos;s a lever. Once you read it fluently, you can hold systems in your head that prose could never carry.</p>
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
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4 }} className="rounded-2xl border border-border/50 bg-card/40 p-5">
      <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${a}`}>{icon}</div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </motion.div>
  );
}
