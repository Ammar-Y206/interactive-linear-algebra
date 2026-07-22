"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Cpu, Network, Eye, MessageSquare, Car, ArrowRight, Layers3 } from "lucide-react";
import { LessonLayout } from "@/components/course/lesson-layout";
import { HeroSection } from "@/components/course/hero-section";
import { LearningObjectives } from "@/components/course/learning-objectives";
import { SectionHeading } from "@/components/course/section-heading";
import { WhatsNext } from "@/components/course/whats-next";
import { QuizCard } from "@/components/course/quiz-card";
import { WhyThisMatters, BuildSomething, Connections, Motivation } from "@/components/course/curriculum-sections";
import { Confetti } from "@/components/course/confetti";
import { getLessonBySlug, getNextLesson, getPrevLesson, LESSONS } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface AiMathLessonProps { onNavigate: (slug: string) => void; }
const TOC = [{ id: "network", label: "A neural network as matrices" }, { id: "gpu", label: "Why GPUs dominate AI" }, { id: "examples", label: "Where it shows up" }, { id: "connections", label: "Connections" }, { id: "quiz", label: "Check your understanding" }];

export function AiMathLesson({ onNavigate }: AiMathLessonProps) {
  const lesson = getLessonBySlug("ai-math")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("ai-math");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("ai-math");
  const prev = getPrevLesson("ai-math");

  function handleComplete() { completeLesson("ai-math"); if (!done) { setCelebrate(true); setTimeout(() => setCelebrate(false), 2600); } const dest = next ? next.slug : "completion"; setTimeout(() => onNavigate(dest), done ? 500 : 1400); }
  function handleNav(d: "prev" | "next") { if (d === "prev" && prev) onNavigate(prev.slug); if (d === "next" && next) onNavigate(next.slug); if (d === "next" && !next) onNavigate("completion"); }
  const L = (slug: string) => LESSONS.find(l => l.slug === slug);

  return (
    <LessonLayout toc={TOC}>
      {celebrate && <Confetti count={100} durationMs={2600} />}
      <HeroSection lesson={lesson} />
      <LearningObjectives objectives={lesson.objectives} />

      <section id="network" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The core idea" title="A neural network is matrix math" description="Strip away the mystique: each layer of a neural network multiplies the input by a weight matrix, adds a bias vector, and applies a simple nonlinearity. That's it. Training = nudging the matrix entries." accent="rose" icon={<Brain className="size-3.5" />} />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/50 bg-card/40 p-6">
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
              <span className="rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-300">input vector</span>
              <ArrowRight className="size-4 text-muted-foreground" />
              <span className="rounded-lg bg-amber-500/10 px-3 py-2 text-amber-300">× weight matrix</span>
              <span className="rounded-lg bg-amber-500/10 px-2 py-2 text-amber-300">+ bias</span>
              <ArrowRight className="size-4 text-muted-foreground" />
              <span className="rounded-lg bg-violet-500/10 px-3 py-2 text-violet-300">nonlinearity</span>
              <ArrowRight className="size-4 text-muted-foreground" />
              <span className="rounded-lg bg-rose-500/10 px-3 py-2 text-rose-300">output vector</span>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">Repeat for each layer. Millions of matrix multiplications per prediction. <strong>Training</strong> = adjust the matrix entries so outputs match targets — gradient descent on a vast landscape of matrix entries.</p>
          </motion.div>
        </div>
      </section>

      <section id="gpu" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="The hardware story" title="Why GPUs dominate AI" description="GPUs were invented to render 3D graphics — which is also just matrix multiplication. When AI turned out to be matrix multiplication too, the same hardware excelled. The AI boom rode on gaming tech." accent="cyan" icon={<Cpu className="size-3.5" />} />
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300"><Layers3 className="size-5" /></div><h3 className="font-semibold text-foreground">Graphics = matrices</h3></div>
              <p className="mt-3 text-sm text-muted-foreground">A GPU renders a frame by multiplying vertex matrices by transformation matrices — rotate, project, light. Thousands of parallel matrix ops per frame.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
              <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300"><Brain className="size-5" /></div><h3 className="font-semibold text-foreground">AI = matrices</h3></div>
              <p className="mt-3 text-sm text-muted-foreground">Training a neural net is the same operation — massive parallel matrix multiplication. Same hardware, same math, different application. That's why NVIDIA pivoted from games to AI.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <WhyThisMatters
        applications={[
          { icon: <MessageSquare className="size-5" />, label: "Language models (GPT)", detail: "Attention layers are matrix products over token embeddings. Billions of parameters = a giant matrix." },
          { icon: <Eye className="size-5" />, label: "Image generation (DALL-E, Midjourney)", detail: "Diffusion models denoise via matrix convolutions. Each step is linear algebra on the pixel grid." },
          { icon: <Car className="size-5" />, label: "Self-driving (Tesla, Waymo)", detail: "Camera feeds → matrix convolutions → object detection → driving decisions, all in real time." },
          { icon: <Network className="size-5" />, label: "Recommendation (TikTok, YouTube)", detail: "User and content embeddings are vectors; the 'for you' feed ranks them by dot-product similarity." },
        ]}
        industries={["Artificial Intelligence", "Autonomous Vehicles", "Healthcare Diagnostics", "Finance", "Content Platforms", "Drug Discovery"]}
        products={["ChatGPT", "Midjourney", "Tesla Autopilot", "TikTok feed", "Google Photos search", "DeepMind AlphaFold"]}
      />

      <BuildSomething
        items={[
          { icon: <Brain className="size-5" />, title: "A neural net from scratch", body: "Once you can multiply matrices (Lesson 10) and find eigenvectors (Lesson 20), you can build and train a real neural network — and understand every line." },
          { icon: <Eye className="size-5" />, title: "An image classifier", body: "Flatten an image to a vector, feed it through matrix layers, output a label. The whole pipeline is linear algebra you'll own." },
          { icon: <Network className="size-5" />, title: "A text embedder", body: "Turn words into vectors so 'king − man + woman ≈ queen.' Vector arithmetic on meaning — pure linear algebra." },
        ]}
      />

      <Connections
        prev={[L("why-linear-algebra")!, L("linear-algebra-real-life")!].map(l => ({ number: l.number, title: l.title, slug: l.slug, relation: "prerequisite" as const }))}
        next={[L("math-as-language")!, L("vectors")!, L("matrix-multiplication")!].map(l => ({ number: l.number, title: l.title, slug: l.slug, relation: "next" as const }))}
        onNavigate={onNavigate}
      />

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="ai-math" questions={lesson.quiz} />
        </div>
      </section>

      <Motivation canUnderstand="the computational heart of modern AI — and exactly which lessons in this course will give you the power to build neural networks yourself" accent="rose" />

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}
