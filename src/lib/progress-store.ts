"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LESSONS, TOTAL_LESSONS, completionPercent } from "./course-config";

/**
 * progress-store.ts
 * -----------------------------------------------------------------
 * Tracks the learner's journey: completed lessons, quiz scores,
 * unlocked achievements, and the last page they visited.
 *
 * Persisted to localStorage so progress survives refreshes.
 * -----------------------------------------------------------------
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** lucide icon name resolved by the badge component */
  icon: string;
  /** the moment it was earned, epoch ms */
  earnedAt?: number;
}

/** All achievements that exist in the course. Unlocked dynamically. */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Open the course for the first time.",
    icon: "Footprints",
  },
  {
    id: "lesson-1",
    title: "Vector Thinker",
    description: "Complete Lesson 1: Vectors.",
    icon: "ArrowUpRight",
  },
  {
    id: "quiz-perfect",
    title: "Sharp Pencil",
    description: "Ace a lesson quiz with a perfect score.",
    icon: "BadgeCheck",
  },
  {
    id: "halfway",
    title: "Halfway There",
    description: "Complete half of all lessons.",
    icon: "Flag",
  },
  {
    id: "course-complete",
    title: "Linear Algebraist",
    description: "Finish every lesson in the course.",
    icon: "Trophy",
  },
];

interface ProgressState {
  /** set of completed lesson slugs */
  completed: string[];
  /** best quiz score per lesson slug, 0..1 */
  quizScores: Record<string, number>;
  /** ids of earned achievements */
  achievements: string[];
  /** last visited page slug (lesson slug or 'introduction'/'completion') */
  lastPage: string;
  /** whether the user has ever opened the course */
  hasStarted: boolean;

  // actions
  markStarted: () => void;
  completeLesson: (slug: string) => void;
  setQuizScore: (slug: string, score: number) => void;
  unlockAchievement: (id: string) => boolean;
  setLastPage: (slug: string) => void;
  reset: () => void;

  // selectors
  isComplete: (slug: string) => boolean;
  bestScore: (slug: string) => number;
  percent: () => number;
  hasAchievement: (id: string) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: [],
      quizScores: {},
      achievements: [],
      lastPage: "introduction",
      hasStarted: false,

      markStarted: () => {
        if (!get().hasStarted) {
          set({ hasStarted: true });
          get().unlockAchievement("first-steps");
        }
      },

      completeLesson: (slug) => {
        const state = get();
        if (state.completed.includes(slug)) return;
        const next = [...state.completed, slug];
        set({ completed: next });

        // achievement: lesson-specific
        if (slug === "vectors") get().unlockAchievement("lesson-1");

        // achievement: halfway
        if (next.length >= Math.ceil(TOTAL_LESSONS / 2)) {
          get().unlockAchievement("halfway");
        }

        // achievement: course complete
        if (next.length >= TOTAL_LESSONS) {
          get().unlockAchievement("course-complete");
        }
      },

      setQuizScore: (slug, score) => {
        const prev = get().quizScores[slug] ?? 0;
        if (score <= prev) return; // keep the best
        set({ quizScores: { ...get().quizScores, [slug]: score } });
        if (score >= 1) get().unlockAchievement("quiz-perfect");
      },

      unlockAchievement: (id) => {
        if (get().achievements.includes(id)) return false;
        set({
          achievements: [...get().achievements, id],
        });
        return true;
      },

      setLastPage: (slug) => set({ lastPage: slug }),

      reset: () =>
        set({
          completed: [],
          quizScores: {},
          achievements: [],
          lastPage: "introduction",
          hasStarted: false,
        }),

      isComplete: (slug) => get().completed.includes(slug),
      bestScore: (slug) => get().quizScores[slug] ?? 0,
      percent: () => completionPercent(new Set(get().completed)),
      hasAchievement: (id) => get().achievements.includes(id),
    }),
    {
      name: "vectorflow-progress-v1",
    }
  )
);

/** Earned achievements with metadata, for display. */
export function earnedAchievements(ids: string[]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => ids.includes(a.id));
}
