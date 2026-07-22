"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Gamepad2, Bot, Camera, Atom, LineChart, Cpu, Film, Satellite, Eye, ArrowRight, Sparkles } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { ThoughtExperiment } from "@/components/course/thought-experiment";
import { BuildSomething, Connections, Motivation } from "@/components/course/curriculum-sections";
import { Confetti } from "@/components/course/confetti";
import { getLessonBySlug, getNextLesson, getPrevLesson, LESSONS } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface WhyLinearAlgebraLessonProps { onNavigate: (slug: string) => void; }
const TOC = [{ id: "mystery", label: "A mystery" }, { id: "everywhere", label: "It's everywhere" }, { id: "build", label: "What you can build" }, { id: "connections", label: "Connections" }, { id: "quiz", label: "Check your understanding" }];

export function WhyLinearAlgebraLesson({ onNavigate }: WhyLinearAlgebraLessonProps) {
  const lesson = getLessonBySlug("why-linear-algebra")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("why-linear-algebra");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("why-linear-algebra");
  const prev = getPrevLesson("why-linear-algebra");

  function handleComplete() { completeLesson("why-linear-algebra"); if (!done) { setCelebrate(true); setTimeout(() => setCelebrate(false), 2600); } const dest = next ? next.slug : "completion"; setTimeout(() => onNavigate(dest), done ? 500 : 1400); }
  function handleNav(d: "prev" | "next") { if (d === "prev" && prev) onNavigate(prev.slug); if (d === "next" && next) onNavigate(next.slug); if (d === "next" && !next) onNavigate("completion"); }
  const L = (slug: string) => LESSONS.find(l => l.slug === slug);

  return (
    <LessonLayout toc={TOC}>
      {celebrate && <Confetti count={100} durationMs={2600} />}
      <HeroSection lesson={lesson} />

      {/* HOOK — the face-unlock mystery from the prompt */}
      <ThoughtExperiment
        question="Every time your phone unlocks using your face, thousands of matrix operations happen in milliseconds. Why are matrices so good at understanding the world?"
        tease="The same math that rotates a 3D character in a video game also recognizes your face, recommends your next song, and guides a rover on Mars. What do all these things share?"
        accent="rose"
      />

      <LearningObjectives objectives={lesson.objectives} />

      {/* EVERYWHERE — show, don't tell. Each app is a mini-mystery. */}
      <section id="everywhere" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="It's hiding in plain sight"
            title="The same math, wearing different masks"
            description="Pick any technology you used today. Underneath, there's a good chance it's moving vectors through matrices. Here are nine disguises the same idea wears."
            accent="amber"
            icon={<Sparkles className="size-3.5" />}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Gamepad2 className="size-5" />, label: "Video games", detail: "Every 3D frame is matrix math — rotating, projecting, and lighting millions of vertices per second." },
              { icon: <Film className="size-5" />, label: "Pixar films", detail: "Every CGI shot uses linear transformations to move virtual cameras and characters through space." },
              { icon: <Brain className="size-5" />, label: "ChatGPT", detail: "Each word flows through attention matrices — billions of matrix multiplications per sentence." },
              { icon: <Bot className="size-5" />, label: "Robotics", detail: "A robot arm's pose is a chain of matrix transformations. Moving the hand = multiplying them." },
              { icon: <Camera className="size-5" />, label: "Face ID", detail: "Your face becomes a vector in a high-dimensional space. Unlocking = checking if you're near your stored vector." },
              { icon: <Satellite className="size-5" />, label: "GPS", detail: "Triangulating your position from satellite signals is solving a linear system of equations." },
              { icon: <Atom className="size-5" />, label: "Quantum physics", detail: "States are vectors. Observables are matrices. The whole theory is formulated in linear algebra." },
              { icon: <LineChart className="size-5" />, label: "Data science", detail: "PCA, regression, and clustering all reduce to eigenvectors and matrix factorizations." },
              { icon: <Cpu className="size-5" />, label: "Google Search", detail: "PageRank ranks the entire web by finding the dominant eigenvector of a multi-billion-row matrix." },
            ].map((app, i) => (
              <motion.div
                key={app.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="card-lift rounded-xl border border-border/50 bg-card/40 p-4 hover:border-primary/40"
              >
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">{app.icon}</div>
                <h4 className="font-medium text-foreground">{app.label}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{app.detail}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nine different fields. Nine different problems. <strong>One mathematical idea</strong>,
              wearing a different mask each time. By the end of this course, you won&apos;t just
              recognize the masks — you&apos;ll see the face underneath.
            </p>
          </motion.div>
        </div>
      </section>

      <BuildSomething
        items={[
          { icon: <Brain className="size-5" />, title: "A neural network", body: "Build a digit recognizer or text classifier. Each layer is a matrix multiplication — you'll write it from scratch by Lesson 17." },
          { icon: <Gamepad2 className="size-5" />, title: "A 3D renderer", body: "Rotate, project, and shade a 3D scene onto a 2D screen. Every transformation is a matrix you'll understand by Lesson 13." },
          { icon: <Camera className="size-5" />, title: "An image filter", body: "Blur, sharpen, edge-detect — all matrix operations on the image-as-grid. You'll have the tools by Lesson 11." },
          { icon: <LineChart className="size-5" />, title: "A recommendation engine", body: "Represent users and items as vectors; find neighbors. Eigenvectors (Lesson 20) make it scale." },
        ]}
      />

      <Connections
        prev={[L("welcome")!].map(l => ({ number: l.number, title: l.title, slug: l.slug, relation: "prerequisite" as const }))}
        next={[L("linear-algebra-real-life")!, L("ai-math")!].map(l => ({ number: l.number, title: l.title, slug: l.slug, relation: "next" as const }))}
        onNavigate={onNavigate}
      />

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="why-linear-algebra" questions={lesson.quiz} />
        </div>
      </section>

      <Motivation canUnderstand="why every modern technology secretly runs on the ideas you're about to learn — and why this is the most career-valuable math you can study" accent="rose" />

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}
