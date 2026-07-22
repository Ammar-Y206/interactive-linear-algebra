"use client";

import { useState } from "react";
import { Gamepad2, Brain, Bot, Camera, Atom, LineChart, Cpu, Film, Rocket, Satellite } from "lucide-react";
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

export interface WhyLinearAlgebraLessonProps { onNavigate: (slug: string) => void; }
const TOC = [{ id: "where", label: "Where it's used" }, { id: "who", label: "Who uses it" }, { id: "build", label: "Build with it" }, { id: "connections", label: "Connections" }, { id: "quiz", label: "Check your understanding" }];

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
      <LearningObjectives objectives={lesson.objectives} />

      <WhyThisMatters
        applications={[
          { icon: <Gamepad2 className="size-5" />, label: "Video games", detail: "Every 3D frame is matrix math — rotating, projecting, and lighting millions of vertices per second." },
          { icon: <Film className="size-5" />, label: "Film & VFX", detail: "Pixar, Disney, and every CGI shot rely on linear transformations to move virtual cameras and characters." },
          { icon: <Brain className="size-5" />, label: "Machine learning", detail: "Neural networks are chains of matrix multiplications. Training = adjusting the matrix entries." },
          { icon: <Bot className="size-5" />, label: "Robotics", detail: "A robot arm's pose is a chain of matrix transformations. Inverse kinematics solves for the joint angles." },
          { icon: <Camera className="size-5" />, label: "Computer vision", detail: "Face detection, image recognition, and AR filters all run images through matrix operations." },
          { icon: <Satellite className="size-5" />, label: "GPS & navigation", detail: "Triangulating your position from satellite signals is solving a linear system." },
          { icon: <Atom className="size-5" />, label: "Physics", detail: "Quantum mechanics is formulated entirely in linear algebra — states are vectors, observables are matrices." },
          { icon: <LineChart className="size-5" />, label: "Data science", detail: "PCA, regression, and clustering all reduce to eigenvectors and matrix factorizations." },
          { icon: <Cpu className="size-5" />, label: "Search engines", detail: "Google's PageRank ranks pages by finding the dominant eigenvector of a link matrix." },
        ]}
        industries={["Technology", "Finance", "Healthcare", "Entertainment", "Aerospace", "Automotive", "Research", "Gaming"]}
        products={["Google Search", "Netflix recommendations", "Tesla Autopilot", "Pixar films", "Photoshop filters", "ChatGPT", "Google Maps"]}
      />

      <BuildSomething
        items={[
          { icon: <Brain className="size-5" />, title: "A neural network", body: "Build a digit recognizer or text classifier. Each layer is a matrix multiplication — you'll write it from scratch once you reach Lesson 17." },
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

      <Motivation canUnderstand="why every modern technology secretly runs on the ideas you're about to learn — and why this is the most career-valuable math you can study" accent="emerald" />

      <WhatsNext nextTitle={lesson.whatsNext?.title} nextBlurb={lesson.whatsNext?.blurb} isComplete={done} onComplete={handleComplete} onNavigate={handleNav} hasPrev={!!prev} hasNext={!!next || true} accent="emerald" />
    </LessonLayout>
  );
}
