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
import { Check, X, RotateCcw, Trophy, ChevronRight, PartyPopper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/lib/progress-store";
import { Confetti } from "@/components/course/confetti";
import { toast } from "sonner";
import type { QuizQuestion } from "@/lib/course-config";

export interface QuizCardProps {
  lessonSlug: string;
  questions: QuizQuestion[];
}

export function QuizCard({ lessonSlug, questions }: QuizCardProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const setQuizScore = useProgressStore((s) => s.setQuizScore);

  const score = useMemo(() => {
    if (!submitted) return 0;
    const correct = questions.filter((q) => answers[q.id] === q.answer).length;
    return correct / questions.length;
  }, [submitted, answers, questions]);

  const correctCount = questions.filter((q) => answers[q.id] === q.answer).length;
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const isPerfect = submitted && score >= 1;

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
    const correct = questions.filter((q) => answers[q.id] === q.answer).length;
    const ratio = correct / questions.length;
    setQuizScore(lessonSlug, ratio);
    // celebrate a perfect score — fire side effects here, not in an effect
    if (ratio >= 1) {
      setShowConfetti(true);
      toast.success("Perfect score!", {
        description: "Sharp pencil unlocked — you're thinking in vectors now.",
        icon: <PartyPopper className="size-4" />,
      });
      setTimeout(() => setShowConfetti(false), 2600);
    }
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
    setShowConfetti(false);
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
                      "group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all sm:py-3",
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

      {/* confetti burst on perfect score */}
      {showConfetti && <Confetti count={90} durationMs={2600} />}

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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring" }}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4",
                isPerfect
                  ? "border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-emerald-500/10 shadow-[0_0_30px_oklch(0.75_0.16_80/20%)]"
                  : score >= 0.5
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-rose-500/30 bg-rose-500/5"
              )}
            >
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-full",
                  isPerfect
                    ? "bg-gradient-to-br from-amber-400 to-amber-600"
                    : "bg-primary/15"
                )}
              >
                {isPerfect ? (
                  <PartyPopper className="size-6 text-amber-950" />
                ) : (
                  <Trophy className="size-5 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {isPerfect ? "Flawless!" : "Your score"}
                  </span>
                  {isPerfect && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                      <Sparkles className="size-2.5" /> Perfect
                    </span>
                  )}
                </div>
                <div className="font-mono text-2xl font-bold text-foreground">
                  {Math.round(score * 100)}%
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({correctCount}/{questions.length} correct)
                  </span>
                </div>
              </div>
            </motion.div>
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
