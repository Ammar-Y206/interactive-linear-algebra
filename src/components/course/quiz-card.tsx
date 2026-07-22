"use client";

/**
 * QuizCard
 * ----------------------------------------------------------------
 * Reusable mini-quiz component. Renders a list of questions, lets the
 * learner pick answers, grades them, and reports the score to the
 * progress store (best score is kept).
 *
 * Props:
 *  - lessonSlug: which lesson this quiz belongs to (for scoring)
 *  - questions:  the QuizQuestion[] from course-config
 * ----------------------------------------------------------------
 */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, RotateCcw, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/lib/progress-store";
import type { QuizQuestion } from "@/lib/course-config";

export interface QuizCardProps {
  lessonSlug: string;
  questions: QuizQuestion[];
}

export function QuizCard({ lessonSlug, questions }: QuizCardProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const setQuizScore = useProgressStore((s) => s.setQuizScore);

  const score = useMemo(() => {
    if (!submitted) return 0;
    const correct = questions.filter((q) => answers[q.id] === q.answer).length;
    return correct / questions.length;
  }, [submitted, answers, questions]);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
    const correct = questions.filter((q) => answers[q.id] === q.answer).length;
    setQuizScore(lessonSlug, correct / questions.length);
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => {
        const selected = answers[q.id];
        const isCorrect = submitted && selected === q.answer;
        const isWrong = submitted && selected !== undefined && selected !== q.answer;
        return (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: qi * 0.05 }}
            className="rounded-2xl border border-border/60 bg-card/50 p-5 sm:p-6"
          >
            <div className="mb-4 flex items-start gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                {qi + 1}
              </span>
              <h4 className="text-base font-medium leading-snug text-foreground">
                {q.prompt}
              </h4>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const isSel = selected === oi;
                const correctOption = submitted && oi === q.answer;
                const wrongSelected = submitted && isSel && oi !== q.answer;
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                      "border-border/50 bg-background/40 hover:border-primary/40 hover:bg-background/70",
                      isSel && !submitted && "border-primary bg-primary/10",
                      correctOption && "border-emerald-500/60 bg-emerald-500/10",
                      wrongSelected && "border-rose-500/60 bg-rose-500/10",
                      submitted && !correctOption && !wrongSelected && "opacity-50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors",
                        isSel && !submitted && "border-primary bg-primary text-primary-foreground",
                        correctOption && "border-emerald-500 bg-emerald-500 text-emerald-950",
                        wrongSelected && "border-rose-500 bg-rose-500 text-rose-950",
                        (!isSel || submitted) &&
                          !correctOption &&
                          !wrongSelected &&
                          "border-border text-muted-foreground"
                      )}
                    >
                      {correctOption ? (
                        <Check className="size-3" />
                      ) : wrongSelected ? (
                        <X className="size-3" />
                      ) : (
                        String.fromCharCode(65 + oi)
                      )}
                    </span>
                    <span
                      className={cn(
                        "flex-1",
                        correctOption && "text-emerald-200",
                        wrongSelected && "text-rose-200"
                      )}
                    >
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div
                    className={cn(
                      "flex gap-3 rounded-xl border p-4 text-sm leading-relaxed",
                      isCorrect
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-100"
                        : isWrong
                          ? "border-rose-500/30 bg-rose-500/5 text-rose-100"
                          : "border-border/50 bg-background/40 text-muted-foreground"
                    )}
                  >
                    <div className="mt-0.5">
                      {isCorrect ? (
                        <Check className="size-4 text-emerald-400" />
                      ) : isWrong ? (
                        <X className="size-4 text-rose-400" />
                      ) : (
                        <ChevronRight className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    <p>{q.explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            size="lg"
            className="w-full sm:w-auto"
          >
            Check answers
            <ChevronRight className="ml-1 size-4" />
          </Button>
        ) : (
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
                <Trophy className="size-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Your score</div>
                <div className="font-mono text-xl font-bold text-foreground">
                  {Math.round(score * 100)}%
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({questions.filter((q) => answers[q.id] === q.answer).length}/
                    {questions.length} correct)
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="mr-1.5 size-4" />
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
