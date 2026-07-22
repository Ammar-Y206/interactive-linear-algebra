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
  {
    slug: "span-linear-combinations",
    number: 2,
    title: "Linear combinations, span & basis",
    tagline: "Two vectors, infinite possibilities",
    description:
      "See coordinates as scalars scaling î and ĵ, build any vector as a linear combination, and discover the span — the full set of vectors two arrows can reach, from a single line to all of 2D space.",
    durationMin: 20,
    difficulty: "Foundations",
    componentKey: "span",
    objectives: [
      {
        title: "Read coordinates as scalars",
        detail:
          "Understand that the pair (x, y) is really x·î + y·ĵ — each coordinate scales a basis vector, and the result is their sum.",
      },
      {
        title: "Build linear combinations",
        detail:
          "Combine two vectors as a·v + b·w for any scalars a, b — the single operation that generates every vector in the plane.",
      },
      {
        title: "Picture the span",
        detail:
          "Visualize the span of two vectors: the whole plane when they point different ways, a single line when they line up, the origin if both are zero.",
      },
      {
        title: "Spot linear dependence",
        detail:
          "Recognize when a vector is redundant (already in the span of the others) versus when it genuinely adds a new dimension.",
      },
    ],
    quiz: [
      {
        id: "s1",
        prompt:
          "The vector (3, −2) can be written as a linear combination of î and ĵ. Which one?",
        options: [
          "3·î + (−2)·ĵ",
          "(−2)·î + 3·ĵ",
          "3·ĵ + (−2)·î",
          "î + ĵ + 3",
        ],
        answer: 0,
        explanation:
          "Each coordinate is a scalar for the matching basis vector: the x-coordinate scales î, the y-coordinate scales ĵ. So (3, −2) = 3·î + (−2)·ĵ.",
      },
      {
        id: "s2",
        prompt:
          "Two 2D vectors point in the same direction (they line up). What is their span?",
        options: [
          "All of 2D space",
          "A single line through the origin",
          "Just the origin",
          "A flat sheet in 3D",
        ],
        answer: 1,
        explanation:
          "When two vectors are collinear, every linear combination a·v + b·w still lands on the same line through the origin — you never escape it.",
      },
      {
        id: "s3",
        prompt:
          "You add a third vector to a pair that already spans a plane, and it lies ON that plane. What happens to the span?",
        options: [
          "The span becomes all of 3D space",
          "The span doesn't change — the vector is redundant",
          "The span collapses to a line",
          "The span becomes the origin",
        ],
        answer: 1,
        explanation:
          "A vector already inside the span of the others adds nothing new. The three are linearly dependent — you could remove one without shrinking the span.",
      },
      {
        id: "s4",
        prompt:
          "A 'basis' of a space is, technically, a set of vectors that…",
        options: [
          "All have length 1",
          "Point along the coordinate axes",
          "Are linearly independent AND span the space",
          "Add up to the zero vector",
        ],
        answer: 2,
        explanation:
          "A basis is a minimal spanning set: the vectors are linearly independent (none redundant) and together they span the whole space. î and ĵ are one such basis for 2D, but not the only one.",
      },
    ],
    whatsNext: {
      title: "Matrices & Linear Transformations",
      blurb:
        "Now that vectors can move and combine, we'll let the whole space move. Matrices are the language for transforming space — rotating, stretching, and shearing every vector at once.",
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
