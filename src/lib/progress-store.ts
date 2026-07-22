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
  {
    id: "streak-3",
    title: "On a Roll",
    description: "Practice 3 days in a row.",
    icon: "Flame",
  },
  {
    id: "streak-7",
    title: "Consistency King",
    description: "Practice 7 days in a row.",
    icon: "Flame",
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
  /** ISO date strings (yyyy-mm-dd) of days the learner visited */
  visitDays: string[];
  /** current consecutive-day streak */
  streak: number;
  /** longest streak ever reached */
  bestStreak: number;

  // actions
  markStarted: () => void;
  recordVisit: () => void;
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
      visitDays: [],
      streak: 0,
      bestStreak: 0,

      markStarted: () => {
        if (!get().hasStarted) {
          set({ hasStarted: true });
          get().unlockAchievement("first-steps");
        }
        get().recordVisit();
      },

      recordVisit: () => {
        const today = new Date().toISOString().slice(0, 10);
        const state = get();
        if (state.visitDays.includes(today)) return; // already counted today

        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .slice(0, 10);
        const newStreak = state.visitDays.includes(yesterday)
          ? state.streak + 1
          : 1;
        const newBest = Math.max(state.bestStreak, newStreak);
        set({
          visitDays: [...state.visitDays, today],
          streak: newStreak,
          bestStreak: newBest,
        });
        if (newStreak >= 3) get().unlockAchievement("streak-3");
        if (newStreak >= 7) get().unlockAchievement("streak-7");
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
          visitDays: [],
          streak: 0,
          bestStreak: 0,
        }),

      isComplete: (slug) => get().completed.includes(slug),
      bestScore: (slug) => get().quizScores[slug] ?? 0,
      percent: () => completionPercent(new Set(get().completed)),
      hasAchievement: (id) => get().achievements.includes(id),
    }),
    {
      name: "vectorflow-progress-v1",
      // Skip auto-hydration so the client's first render matches the
      // server's (empty) state — preventing hydration mismatches on any
      // UI that depends on persisted progress (sidebar checkmarks, the
      // progress ring, streak widget, …). We rehydrate manually after
      // mount in page.tsx.
      skipHydration: true,
    }
  )
);

/** Earned achievements with metadata, for display. */
export function earnedAchievements(ids: string[]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => ids.includes(a.id));
}
