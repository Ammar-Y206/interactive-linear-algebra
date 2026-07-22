"use client";

import { useState } from "react";
import { Camera, Search, Film, MapPin, Music, MessageSquare, Image as ImageIcon, Headphones } from "lucide-react";
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

export interface RealLifeLessonProps { onNavigate: (slug: string) => void; }
const TOC = [{ id: "everyday", label: "In your everyday tech" }, { id: "images", label: "Images as matrices" }, { id: "recs", label: "Recommendations as vectors" }, { id: "connections", label: "Connections" }, { id: "quiz", label: "Check your understanding" }];

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
      <LearningObjectives objectives={lesson.objectives} />

      <WhyThisMatters
        applications={[
          { icon: <Camera className="size-5" />, label: "Your phone camera", detail: "Every photo is a matrix. HDR, portrait mode, night mode — all real-time matrix operations on the image grid." },
          { icon: <ImageIcon className="size-5" />, label: "Instagram filters", detail: "Every filter is a matrix transformation of the pixel grid. A 'warm' filter multiplies red channels; a blur averages neighbors." },
          { icon: <Search className="size-5" />, label: "Google Search", detail: "PageRank ranks the entire web by computing the dominant eigenvector of a multi-billion-row link matrix." },
          { icon: <Music className="size-5" />, label: "Spotify recommendations", detail: "Songs and listeners live as vectors in 'audio feature space.' 'Discover Weekly' finds songs near your vector." },
          { icon: <Film className="size-5" />, label: "Netflix & YouTube", detail: "Streaming compression (H.264/AV1) breaks video into blocks and applies matrix transforms — that's linear algebra at 60 fps." },
          { icon: <MapPin className="size-5" />, label: "Google Maps", detail: "GPS triangulation solves a linear system. Route optimization uses graph matrices." },
          { icon: <MessageSquare className="size-5" />, label: "ChatGPT", detail: "Every token flows through attention matrices — billions of matrix multiplications per word." },
          { icon: <Headphones className="size-5" />, label: "Noise cancellation", detail: "Adaptive filters (matrix-based) invert the noise signal in real time to cancel it out." },
        ]}
        products={["iPhone camera", "Instagram", "Google Search", "Spotify", "Netflix", "Google Maps", "ChatGPT", "AirPods Pro"]}
      />

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
