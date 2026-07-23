"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Search, Film, MapPin, Music, MessageSquare, ImageIcon, Headphones, Sparkles } from "lucide-react";
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

export interface RealLifeLessonProps { onNavigate: (slug: string) => void; }
const TOC = [{ id: "morning", label: "Your morning, decoded" }, { id: "images", label: "A photo is a matrix" }, { id: "recs", label: "Recommendations as vectors" }, { id: "connections", label: "Connections" }, { id: "quiz", label: "Check your understanding" }];

export function RealLifeLesson({ onNavigate }: RealLifeLessonProps) {
  const lesson = getLessonBySlug("linear-algebra-real-life")!;
  const isComplete = useProgressStore((s) => s.isComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const done = isComplete("linear-algebra-real-life");
  const [celebrate, setCelebrate] = useState(false);
  const next = getNextLesson("linear-algebra-real-life");
  const prev = getPrevLesson("linear-algebra-real-life");

  function handleComplete() { completeLesson("linear-algebra-real-life"); if (!done) { setCelebrate(true); setTimeout(() => setCelebrate(false), 2600); } const dest = next ? next.slug : "completion"; setTimeout(() => onNavigate(dest), done ? 500 : 1400); }
  function handleNav(d: "prev" | "next") { if (d === "prev" && prev) onNavigate(prev.slug); if (d === "next" && next) onNavigate(next.slug); if (d === "next" && !next) onNavigate("completion"); }
  const L = (slug: string) => LESSONS.find(l => l.slug === slug);

  return (
    <LessonLayout toc={TOC}>
      {celebrate && <Confetti count={100} durationMs={2600} />}
      <HeroSection lesson={lesson} />

      {/* HOOK — your morning, decoded */}
      <ThoughtExperiment
        question="You woke up, unlocked your phone with your face, checked a feed ranked by an algorithm, skipped a song you didn't like, and navigated to work. How many times did linear algebra touch your life before breakfast?"
        tease="The answer might surprise you. Let's walk through a single morning and find the math hiding in each tap."
        accent="cyan"
      />

      <LearningObjectives objectives={lesson.objectives} />

      {/* MORNING — a narrative, not a list */}
      <section id="morning" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="A morning, decoded"
            title="The invisible math in your routine"
            description="Every app you open is doing linear algebra in the background. Here's the same idea — vectors and matrices — wearing a different disguise each time."
            accent="cyan"
            icon={<Sparkles className="size-3.5" />}
          />
          <div className="space-y-3">
            {[
              { icon: <Camera className="size-5" />, time: "7:00 AM", label: "Face ID unlocks your phone", detail: "Your face becomes a vector in a 128-dimensional space. Unlocking = checking if today's vector is close enough to your stored one. That's a distance calculation — pure linear algebra." },
              { icon: <Search className="size-5" />, time: "7:05 AM", label: "Google ranks your search", detail: "PageRank ranks the entire web by computing the dominant eigenvector of a multi-billion-row link matrix. The 'importance' of a page IS an eigenvector." },
              { icon: <ImageIcon className="size-5" />, time: "7:10 AM", label: "Instagram applies a filter", detail: "Every filter is a matrix transformation of the pixel grid. A 'warm' filter multiplies red channels; a blur averages neighbors. Your selfie = a matrix being multiplied." },
              { icon: <Music className="size-5" />, time: "7:15 AM", label: "Spotify serves Discover Weekly", detail: "Songs and listeners live as vectors in 'audio feature space.' 'You might like this' means 'this song's vector is near yours.' Linear algebra measures that nearness." },
              { icon: <Film className="size-5" />, time: "7:20 AM", label: "Netflix streams without buffering", detail: "Video compression breaks each frame into blocks and applies matrix transforms. That's linear algebra running at 60 frames per second in your pocket." },
              { icon: <MapPin className="size-5" />, time: "7:30 AM", label: "Maps routes you to work", detail: "GPS triangulation solves a linear system. Route optimization uses graph matrices. The blue line is the solution to a matrix equation." },
              { icon: <MessageSquare className="size-5" />, time: "7:45 AM", label: "ChatGPT drafts your email", detail: "Every token flows through attention matrices — billions of matrix multiplications per word. The entire language model is a sequence of linear algebra operations." },
              { icon: <Headphones className="size-5" />, time: "8:00 AM", label: "AirPods cancel the train noise", detail: "Adaptive filters (matrix-based) invert the noise signal in real time to cancel it out. Silence, engineered by linear algebra." },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="card-lift flex items-start gap-4 rounded-xl border border-border/50 bg-card/40 p-4 hover:border-primary/40"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">{item.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{item.time}</span>
                    <h4 className="font-medium text-foreground">{item.label}</h4>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGES — a concrete reveal */}
      <section id="images" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="A concrete reveal"
            title="A photo is a matrix. A filter is matrix math."
            description="This one idea — that an image is a grid of numbers — explains why your phone can edit, compress, and recognize photos instantly. Every pixel is a number; every operation is matrix algebra."
            accent="emerald"
            icon={<Camera className="size-3.5" />}
          />
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-border/50 bg-card/40 p-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="font-semibold text-foreground">The picture</h4>
                <p className="mt-2 text-sm text-muted-foreground">A 12-megapixel photo is a grid of 12 million cells. Each cell holds three numbers (red, green, blue). That&apos;s a matrix — 4000 × 3000 × 3.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">The operations</h4>
                <p className="mt-2 text-sm text-muted-foreground">Rotate? Matrix multiply. Crop? Submatrix. Compress? Matrix factorization. Blur? Multiply by a neighborhood-averaging matrix. Every edit is linear algebra.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RECS — the vector-space intuition */}
      <section id="recs" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="The vector-space intuition"
            title="A recommendation is a measurement of distance"
            description="Netflix doesn't know what you 'like.' It knows where your vector sits in taste-space — and which show vectors are nearby. That's all a recommendation is."
            accent="amber"
            icon={<Music className="size-3.5" />}
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Imagine every show and every user as a point in a vast space — one dimension per
              &lsquo;feature&rsquo; (genre, pace, darkness, humor…). Your viewing history drops you
              somewhere in that space. A recommendation is just: <strong>&ldquo;here&apos;s a show
              whose point is near yours.&rdquo;</strong> Measuring nearness, finding neighbors,
              projecting into fewer dimensions — all linear algebra. By Lesson 20 you&apos;ll know
              exactly how it works.
            </p>
          </motion.div>
        </div>
      </section>

      <BuildSomething
        items={[
          { icon: <ImageIcon className="size-5" />, title: "An image processor", body: "Load an image as a matrix, apply filters (blur, sharpen, edge-detect) by multiplying — you'll have the tools by Lesson 11." },
          { icon: <Music className="size-5" />, title: "A mini recommender", body: "Turn 'users × ratings' into vectors, compute similarity, suggest the closest unseen item. Eigenvectors (L20) make it scale." },
          { icon: <Search className="size-5" />, title: "A search ranker", body: "Build a tiny PageRank: represent links as a matrix, find its dominant eigenvector. That's Lesson 20 in action." },
        ]}
      />

      <Connections
        prev={[L("welcome")!, L("why-linear-algebra")!].map(l => ({ number: l.number, title: l.title, slug: l.slug, relation: "prerequisite" as const }))}
        next={[L("ai-math")!, L("vectors")!].map(l => ({ number: l.number, title: l.title, slug: l.slug, relation: "next" as const }))}
        onNavigate={onNavigate}
      />

      <section id="quiz" className="scroll-mt-20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pause & check" title="Check your understanding" accent="amber" />
          <QuizCard lessonSlug="linear-algebra-real-life" questions={lesson.quiz} />
        </div>
      </section>

      <Motivation canUnderstand="that the apps on your phone are, under the hood, doing exactly the math you're about to learn — matrices, vectors, and eigenvectors" accent="cyan" />

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}
