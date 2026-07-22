# Vectorflow — Project Worklog

This is the shared handover document for the **Vectorflow** interactive
linear-algebra course platform. All agents append their work below.

---
Task ID: 1
Agent: main (Z.ai Code)
Task: Build Lesson 1 ("Vectors") from scratch — establish the entire
interactive learning platform foundation, including architecture for 50+
future lessons.

Work Log:
- Explored existing Next.js 16 scaffold (App Router, Tailwind v4, shadcn/ui,
  Prisma, Zustand, framer-motion, cmdk all pre-installed).
- Replaced `src/app/globals.css` with a premium dark-first theme (oklch
  palette: emerald primary, amber/rose/cyan accents, custom scrollbar,
  aurora + grid backgrounds, glow utilities).
- Rewrote `src/app/layout.tsx` for dark-by-default (`<html className="dark">`),
  updated metadata, added Sonner toaster, and added
  `suppressHydrationWarning` to both `<html>` and `<body>` (the latter
  fixes Grammarly-extension hydration warnings).
- Created `src/lib/course-config.ts` — single source of truth for all
  lessons. Append-only `LESSONS` array with full metadata (slug, number,
  title, tagline, description, duration, difficulty, objectives, quiz,
  whatsNext). Derived helpers: TOTAL_LESSONS, completionPercent,
  getLessonBySlug, getNextLesson, getPrevLesson.
- Created `src/lib/progress-store.ts` — Zustand store with localStorage
  persistence. Tracks completed lessons, best quiz scores, achievements,
  last page, hasStarted. 5 achievements (first-steps, lesson-1,
  quiz-perfect, halfway, course-complete) with auto-unlock logic.
- Built reusable simulation components:
  - `simulations/coordinate-plane.tsx` — controlled SVG coordinate system
    with draggable vector tips, projections, ghost vectors, color-coded
    arrowheads. THE backbone for all vector viz.
  - `simulations/vector-playground.tsx` — reusable draggable single-vector
    explorer with live coordinate/length/angle readout.
  - `simulations/vector-addition-sim.tsx` — tip-to-tail addition with
    toggleable ghost + translated-w overlay + numeric breakdown.
  - `simulations/scalar-multiplication-sim.tsx` — slider-driven scaling
    with stretch/squish/flip badges + original ghost.
- Built shared course components:
  - `course/simulation-container.tsx` — consistent sim frame (title,
    badge, accent bar, controls slot).
  - `course/quiz-card.tsx` — multi-question quiz with grading, score
    reporting to progress store, explanations, retry.
  - `course/hero-section.tsx`, `learning-objectives.tsx`,
    `section-heading.tsx`, `summary-card.tsx`, `whats-next.tsx`,
    `achievement-badge.tsx`, `lesson-layout.tsx` (with sticky TOC rail).
  - `course/sidebar.tsx` — persistent nav with completion state +
    active highlight + progress tracker.
  - `course/progress-tracker.tsx` — animated SVG ring + achievement dots.
  - `course/search-dialog.tsx` — cmdk search over all pages/lessons.
  - `course/course-shell.tsx` — top-level layout: sidebar + mobile drawer
    + top bar (⌘K) + sticky footer.
- Built lesson pages:
  - `lessons/introduction.tsx` — hero, 3 pillars, course map, achievements,
    final CTA.
  - `lessons/vectors-lesson.tsx` — full 8-section lesson: hero, objectives,
    3 perspectives, coordinate plane (VectorPlayground), vector addition
    (VectorAdditionSim), scalar multiplication (ScalarMultiplicationSim),
    quiz, summary cards + closing quote, what's next.
  - `lessons/course-completion.tsx` — celebratory finish with stats,
    achievements gallery, lesson recap, reset.
  - `lessons/registry.tsx` — maps componentKey -> React component; the ONLY
    file to touch when adding a new lesson.
- Wired `src/app/page.tsx` — client-side routing via `?page=` query,
  Suspense boundary, progress hydration, createElement for dynamic page
  resolver (satisfies react-hooks/static-components lint rule).

Stage Summary:
- Lesson 1 "Vectors" is COMPLETE and fully interactive, verified end-to-end
  with agent-browser:
  - Introduction page renders (hero, pillars, course map, achievements).
  - Vectors lesson renders all 8 sections (43 SVGs).
  - Quiz: answered all 4 correctly -> 100% score -> persisted to localStorage.
  - "Mark complete & continue" -> navigates to completion page -> shows
    "Course complete!" with trophy + 100% progress ring.
  - Scalar slider: dragging updates the scaled vector live (e.g. 2.8 ->
    (5.60, 2.80) + "Stretch" badge).
  - Search (⌘K): opens, filters lessons by title/description/objectives.
  - Mobile (390x844): sidebar hidden, menu button visible, drawer opens,
    no horizontal overflow.
  - Desktop (1440x900): sticky TOC rail, footer at bottom.
  - Lint: clean. No runtime errors. Hydration mismatch from Grammarly
    extension fixed via suppressHydrationWarning on <body>.
- Architecture is built for 50+ lessons: adding a new lesson = create one
  component + add one array entry + one registry line. Existing lessons
  are never touched.

Unresolved issues / risks:
- None blocking. The platform is stable and ready for Lesson 2.
- Next lesson ("Span & Linear Combinations") will likely need a new
  reusable simulation (e.g. a "span painter" that sweeps linear
  combinations). Reuse CoordinatePlane + SimulationContainer.

Recommended next-phase priorities (for the webDevReview cron or next lesson):
- When Lesson 2 arrives: create `simulations/span-painter.tsx` reusing
  CoordinatePlane; add entry to LESSONS + registry; do NOT modify Lesson 1.
- Consider adding a subtle "reading progress" bar in the top bar that fills
  as the learner scrolls a lesson (nice-to-have).
- Consider persisting quiz answer state per lesson (currently resets on
  unmount) — low priority.
