/**
 * course-config.ts
 * ---------------------------------------------------------------
 * The single source of truth for the entire course.
 *
 * When a new lesson is added:
 *   1. Append a new entry to `LESSONS`.
 *   2. Do NOT touch existing entries (they are immutable once shipped).
 *   3. `TOTAL_LESSONS` and derived stats are computed automatically.
 *
 * Each lesson declares which reusable simulations / components it needs
 * via `componentKeys`, which the lesson registry (lessons/registry.ts)
 * resolves to actual React components.
 * ---------------------------------------------------------------
 */

export type LessonDifficulty = "Foundations" | "Core" | "Intermediate" | "Advanced";

export interface LearningObjective {
  /** short headline shown in the objectives list */
  title: string;
  /** one-line elaboration */
  detail: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  /** index of the correct option */
  answer: number;
  explanation: string;
}

export interface LessonMeta {
  /** unique slug used for client-side routing, e.g. "vectors" */
  slug: string;
  /** display number, e.g. 1, 2, 3 ... */
  number: number;
  title: string;
  /** short tagline shown on cards */
  tagline: string;
  /** longer description for the sidebar / search */
  description: string;
  /** estimated minutes to complete */
  durationMin: number;
  difficulty: LessonDifficulty;
  /** keys resolved by the lesson registry into React components */
  componentKey: string;
  /** the list of concepts a learner will master */
  objectives: LearningObjective[];
  /** mini quiz for the lesson */
  quiz: QuizQuestion[];
  /** preview of the next lesson — used by the "What's Next?" section */
  whatsNext?: {
    title: string;
    blurb: string;
  };
}

/**
 * IMMUTABLE LESSON REGISTRY.
 * Append-only. Never reorder or rename existing slugs.
 */
export const LESSONS: LessonMeta[] = [
  {
    slug: "vectors",
    number: 1,
    title: "Vectors",
    tagline: "The atom of linear algebra",
    description:
      "Three perspectives on vectors, the coordinate plane, vector addition (tip-to-tail), and scalar multiplication — the two operations everything else builds on.",
    durationMin: 18,
    difficulty: "Foundations",
    componentKey: "vectors",
    objectives: [
      {
        title: "See vectors three ways",
        detail:
          "Understand the physics (arrow), CS (list of numbers), and math (abstract) perspectives and how they connect.",
      },
      {
        title: "Read the coordinate plane",
        detail:
          "Translate between a vector as an arrow rooted at the origin and its (x, y) — or (x, y, z) — coordinates.",
      },
      {
        title: "Add vectors tip-to-tail",
        detail:
          "Add vectors geometrically by walking one then the other, and numerically by adding components.",
      },
      {
        title: "Scale vectors by numbers",
        detail:
          "Stretch, squish, and flip vectors with scalars, and connect it to multiplying each component.",
      },
    ],
    quiz: [
      {
        id: "v1",
        prompt:
          "In linear algebra, where does a vector's tail usually sit?",
        options: [
          "Anywhere in space — it's free to roam",
          "At the origin of the coordinate system",
          "On the x-axis only",
          "At the tip of another vector",
        ],
        answer: 1,
        explanation:
          "Unlike the physics view, linear algebra almost always roots vectors at the origin so each vector corresponds to exactly one point (its tip).",
      },
      {
        id: "v2",
        prompt:
          "A vector has coordinates (1, 2) and you add a vector (3, −1). What is the sum?",
        options: ["(4, 1)", "(4, 3)", "(2, −1)", "(3, 2)"],
        answer: 0,
        explanation:
          "Add components term-by-term: (1+3, 2+(−1)) = (4, 1). This is the numeric side of the tip-to-tail rule.",
      },
      {
        id: "v3",
        prompt:
          "Multiplying a vector by −1.8 will…",
        options: [
          "Make it 1.8× longer without changing direction",
          "Squish it to 1.8× shorter",
          "Flip its direction, then stretch it 1.8× as long",
          "Leave it unchanged",
        ],
        answer: 2,
        explanation:
          "A negative scalar first reverses direction (the sign of −1) then scales the length by the absolute value (1.8).",
      },
      {
        id: "v4",
        prompt:
          "What does a 'scalar' do in linear algebra?",
        options: [
          "Rotates a vector by a fixed angle",
          "Adds a fixed length to a vector",
          "Stretches, squishes, or reverses a vector",
          "Counts the dimensions of a vector",
        ],
        answer: 2,
        explanation:
          "Scalars are just numbers, and their job is to scale vectors — stretch, squish, or flip them. Number ≈ scalar in this course.",
      },
    ],
    whatsNext: {
      title: "Span & Linear Combinations",
      blurb:
        "If vectors are the atoms, linear combinations are the molecules. Next we'll see how two vectors can sweep out entire lines and planes — and what it means for a vector to be 'redundant'.",
    },
  },
];

/** Total number of lessons currently in the course. */
export const TOTAL_LESSONS = LESSONS.length;

/** Sum of all lesson durations, in minutes. */
export const TOTAL_DURATION_MIN = LESSONS.reduce(
  (sum, l) => sum + l.durationMin,
  0
);

/** Special non-lesson "pages" that also appear in navigation. */
export type SpecialPage = "introduction" | "completion";

export const SPECIAL_PAGES: Record<
  SpecialPage,
  { slug: string; title: string; tagline: string }
> = {
  introduction: {
    slug: "introduction",
    title: "Introduction",
    tagline: "Before we begin",
  },
  completion: {
    slug: "completion",
    title: "Course Completion",
    tagline: "You did it",
  },
};

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonByNumber(n: number): LessonMeta | undefined {
  return LESSONS.find((l) => l.number === n);
}

export function getNextLesson(slug: string): LessonMeta | undefined {
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  if (idx === -1 || idx >= LESSONS.length - 1) return undefined;
  return LESSONS[idx + 1];
}

export function getPrevLesson(slug: string): LessonMeta | undefined {
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  if (idx <= 0) return undefined;
  return LESSONS[idx - 1];
}

/**
 * Completion percentage helper.
 * `completed` is the set of completed lesson slugs.
 */
export function completionPercent(completed: Set<string>): number {
  if (TOTAL_LESSONS === 0) return 0;
  return Math.round((completed.size / TOTAL_LESSONS) * 100);
}
