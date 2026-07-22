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

---
Task ID: 2
Agent: main (Z.ai Code) — webDevReview round 1
Task: QA the platform, then implement styling polish + new features
(reading-progress, keyboard nav, confetti, concept checks, animations).

Work Log:
- Reviewed worklog.md; Lesson 1 (Vectors) was complete and stable.
- QA via agent-browser: all 3 pages return 200, no console/runtime errors,
  quiz scoring works, search empty-state works, prev/next disabled states
  correct, mobile drawer works. No bugs found.
- Implemented new reusable components:
  - `course/use-reading-progress.ts` — scroll-progress hook (0..1).
  - `course/page-order.ts` — linear page ordering for prev/next nav
    (introduction → lessons → completion).
  - `course/confetti.tsx` — dependency-free confetti burst (framer-motion).
  - `course/concept-check.tsx` — inline reveal-answer callout for active
    reading, with 4 accent variants.
- Enhanced `course/course-shell.tsx`:
  - Reading-progress bar (gradient) under the top bar on lesson pages.
  - Reading-progress chip (% + mini bar) in the top bar.
  - Prev/Next arrow buttons in the top bar.
  - Keyboard navigation: ← / → arrows (ignored while typing or dialog open).
  - Footer now shows keyboard-shortcut hints (← → navigate, ⌘K search).
- Enhanced `course/quiz-card.tsx`:
  - Confetti burst + toast on perfect score.
  - Richer result banner: "Flawless!" + "Perfect" badge for 100%, color-
    coded by score (amber/emerald/rose).
- Enhanced `lessons/vectors-lesson.tsx`:
  - 3 inline ConceptCheck callouts (coordinate walking, addition
    commutativity, scaling by zero).
  - Confetti burst on first-time lesson completion.
- Styling polish in `globals.css`:
  - New keyframes: `aurora-drift`, `text-shimmer`.
  - New utilities: `.bg-aurora-animated` (slow-drifting hero bg),
    `.text-shimmer` (gradient text sweep), `.card-lift` (hover translateY
    + shadow).
- Applied animated aurora to introduction hero + lesson HeroSection.
- Applied text-shimmer to the introduction hero gradient text.
- Applied card-lift + hover shadow to: pillars, course-map items,
  SummaryCard, PerspectiveCard (7 lift targets on the lesson page).

Stage Summary:
- All new features verified end-to-end with agent-browser:
  - 3 concept checks present, reveal/hide toggle works.
  - Prev/next arrows in top bar; ← / → keyboard nav works
    (introduction → vectors → back).
  - Reading-progress bar + % chip appear on scroll (10% → 100%).
  - Perfect quiz: 100% + "Flawless!" + "Perfect" badge + confetti toast.
  - Animated aurora + 7 card-lift hover effects on lesson page.
  - No console/runtime errors. Lint clean. Dev server healthy.
- Lesson 1 untouched in behavior; only enriched. Architecture intact for
  50+ lessons (new components are all reusable).

Unresolved issues / risks:
- The 15-min webDevReview cron job (id 285428) hit rate-limit 429 errors
  on 5 of 6 runs because it competes with active sessions for API quota.
  Recommendation: reduce frequency to every 60 min, or disable while the
  user is actively working. (cron tool was unavailable this round, so the
  schedule was not changed.)
- Quiz answer state resets on page unmount (low priority — acceptable for
  a learning platform).

Recommended next-phase priorities:
- Add Lesson 2 ("Span & Linear Combinations") when transcript arrives:
  create `simulations/span-painter.tsx` reusing CoordinatePlane; append to
  LESSONS + registry; do not modify Lesson 1.
- Optionally add a "streak" tracker (consecutive days visited) and a
  glossary/searchable term index once more lessons exist.
- Tune cron frequency to avoid 429s.

---
Task ID: 3
Agent: main (Z.ai Code) — webDevReview round 2
Task: QA, then implement streak tracker + searchable glossary (the
next-phase priorities recommended in the previous worklog entry).

Work Log:
- QA: all pages 200, no console/runtime errors, lint clean. Platform stable.
- Extended `lib/progress-store.ts`:
  - Added `visitDays`, `streak`, `bestStreak` state (persisted).
  - Added `recordVisit()` action: counts one visit per day, computes
    consecutive-day streak (yesterday-anchored), tracks best ever.
  - `markStarted()` now also calls `recordVisit()`.
  - 2 new achievements: "On a Roll" (3-day streak), "Consistency King"
    (7-day streak), auto-unlocked by `recordVisit`.
  - `reset()` clears the new fields.
- Created `lib/glossary.ts`: 8 linear-algebra terms (Vector, Scalar,
  Coordinate, Origin, Vector addition, Scalar multiplication, Tip-to-tail,
  Dimension) with definitions, lesson links, related terms, and 4
  categories. Includes `searchGlossary()` helper.
- Created `course/streak-widget.tsx`: compact flame streak indicator +
  7-day calendar of visits (today highlighted, visited days checkmarked).
  Added to sidebar above ProgressTracker.
- Created `course/glossary-panel.tsx`: searchable + category-filterable
  term index. Animated list (framer-motion layout), click any term to
  jump to its lesson. Color-coded category badges. Added a "Glossary"
  section to the Introduction page.

Stage Summary:
- Verified end-to-end with agent-browser:
  - Streak widget renders in sidebar; today's visit recorded
    (visitDays: ["2026-07-22"], streak: 1) and persisted to localStorage.
  - 1 checkmark on the 7-day calendar (today).
  - Glossary section on Introduction: 8 terms on fresh load.
  - Search filters correctly ("scalar" -> 2 matching terms).
  - Category filter works (Operation -> 2 operation entries).
  - Clicking a glossary term navigates to its lesson (Vector addition ->
    /?page=vectors).
  - No errors. Lint clean. Dev server healthy.
- Lesson 1 behavior untouched. All new components are reusable.

Unresolved issues / risks:
- The 15-min webDevReview cron (id 285428) still hits 429 rate-limits
  when competing with active sessions. cron tool was unavailable again
  this round; schedule unchanged. Strongly recommend reducing to 60 min
  or pausing while the user is actively in session.
- Quiz answer state resets on page unmount (low priority).

Recommended next-phase priorities:
- Add Lesson 2 ("Span & Linear Combinations") when the transcript
  arrives: build `simulations/span-painter.tsx` reusing CoordinatePlane;
  append to LESSONS + GLOSSARY + registry; do not modify Lesson 1.
- Consider a "recently viewed lessons" strip on the Introduction page
  (cheap to add from existing `lastPage`/`visitDays` data).
- Tune cron frequency to avoid 429s.

---
Task ID: 4
Agent: main (Z.ai Code) — add Lesson 2
Task: Add Lesson 2 "Linear combinations, span & basis" to the existing
platform WITHOUT modifying Lesson 1. Then fix a hydration mismatch bug
that surfaced in the sidebar.

Work Log:
- Appended Lesson 2 to `lib/course-config.ts` (slug "span-linear-
  combinations", componentKey "span", number 2). TOTAL_LESSONS,
  TOTAL_DURATION_MIN, sidebar nav, search, and progress all picked it
  up automatically. Quiz has 4 questions; whatsNext teases matrices.
- Registered `SpanLesson` in `lessons/registry.tsx` under componentKey
  "span".
- Appended 9 new glossary terms to `lib/glossary.ts` (Basis vectors,
  î, ĵ, Linear combination, Span, Linearly dependent/independent,
  Basis) — all linked to the new lesson slug.
- Created 3 new reusable simulations (all built on CoordinatePlane):
  - `simulations/basis-explorer.tsx` — î/ĵ coordinate-as-scalars viz
    with x/y sliders; reconstructs (x,y) = x·î + y·ĵ tip-to-tail.
  - `simulations/linear-combination-sim.tsx` — general a·v + b·w with
    draggable v,w + scalar sliders + a "sweep b" animation that shows
    the tip tracing a straight line (the "linear" intuition).
  - `simulations/span-painter.tsx` — dot-grid span visualization with 3
    presets (Span the plane / Line them up / Both zero) showing the
    span collapsing to a line or the origin when vectors are dependent.
- Created `lessons/span-lesson.tsx` with 8 sections: hero, objectives,
  coordinates-as-scalars, linear combinations, the span, vectors-as-
  points, 3D span & dependence, quiz + summary + what's next. Includes
  3 inline ConceptChecks and confetti on completion. Reuses all shared
  components (LessonLayout, HeroSection, SummaryCard, WhatsNext,
  QuizCard, ConceptCheck, Confetti, SectionHeading).

BUG FIX (hydration mismatch):
- Symptom: sidebar rendered `CheckCircle2` (client) vs `Circle` (server)
  for completed lessons → hydration error, because Zustand's persist
  middleware hydrates from localStorage synchronously on the client's
  first render but the server renders with empty state.
- Fix: set `skipHydration: true` on the persist middleware in
  `lib/progress-store.ts`, then call `useProgressStore.persist.
  rehydrate()` in a `useEffect` in `page.tsx` after mount. Now the
  client's first render matches the server (empty), and persisted state
  fills in a frame later with no mismatch. Verified: with a completed
  lesson in localStorage, reload produces no hydration errors and the
  checkmark/progress-ring appear correctly post-mount.
- ALSO fixed a latent routing bug in `registry.tsx`: `resolvePage` was
  looking up `LESSON_REGISTRY[slug]`, but the registry is keyed by
  `componentKey` (e.g. "span"), not the slug ("span-linear-combinations").
  Lesson 1 worked only because its slug happened to equal its
  componentKey ("vectors"). Now `resolvePage` looks the slug up in
  course-config to get the componentKey, then resolves. This was
  blocking Lesson 2 from rendering at all (showed the intro fallback).

Stage Summary:
- Lesson 2 verified end-to-end with agent-browser:
  - Page renders: h1 "Linear combinations, span & basis", 57 SVGs, 7
    sections, 4 sliders, 3 concept checks, all 3 simulations present.
  - SpanPainter presets: "Line them up" → badge "Span = a single line";
    "Both zero" → "Span = { origin }"; "Span the plane" → "Span = all
    of 2D space". Collinearity detected via cross-product.
  - Quiz: answered A,B,B,C → 100% + "Flawless!" + confetti.
  - No hydration errors after the fix (tested with a pre-seeded
    completed lesson in localStorage).
  - Lint clean. Dev server healthy. Lesson 1 completely untouched.
- Course now has 2 lessons, 17 glossary terms, 7 achievements, 3 new
  reusable simulations ready for future lessons.

Unresolved issues / risks:
- The 15-min webDevReview cron (id 285428) still risks 429 rate-limits
  when running concurrently with active sessions. Recommend reducing to
  60 min.
- The "Mark complete & continue" confetti delay is 1.4s on first
  completion (to let confetti play) — feels good but worth noting.

Recommended next-phase priorities:
- Add Lesson 3 ("Matrices & Linear Transformations") when transcript
  arrives: build a reusable `TransformationSim` (watch a grid of points
  move as a matrix is applied); append to LESSONS + GLOSSARY + registry.
- Consider a "recently viewed" strip on the Introduction page using
  existing visitDays/lastPage data.

---
Task ID: 5
Agent: main (Z.ai Code) — add Lesson 3
Task: Add Lesson 3 "Linear transformations & matrices" to the existing
platform WITHOUT modifying Lessons 1–2.

Work Log:
- Appended Lesson 3 to `lib/course-config.ts` (slug "linear-transformations",
  componentKey "transformations", number 3, difficulty "Core"). 4 quiz
  questions; whatsNext teases matrix multiplication & composition.
- Registered `TransformationsLesson` in `lessons/registry.tsx` under
  componentKey "transformations".
- Appended 5 new glossary terms to `lib/glossary.ts` (Transformation,
  Linear transformation, Matrix, Matrix-vector multiplication, Shear).
- Created `simulations/transformation-sim.tsx` — the signature reusable
  visualization for all matrix lessons. Draggable î (amber) and ĵ (cyan)
  define the matrix columns; a full grid morphs in real time; an input
  vector v (emerald) with sliders transforms to its rose image; live
  matrix display + computation readout; 5 presets (identity, 90°
  rotation, shear, scale ×2, squish); detects linear dependence and
  shows a "space squished to a line" badge. Built standalone (not on
  CoordinatePlane) because it needs a morphing point grid.
- Created `lessons/transformations-lesson.tsx` with 8 sections: hero,
  objectives, transformations-as-movement, the two linearity rules,
  matrix-as-where-î-ĵ-land (TransformationSim), matrix-vector
  multiplication as linear combination, worked examples (rotation/shear/
  squish), quiz + summary + what's next. 2 inline ConceptChecks +
  confetti on completion.

Stage Summary:
- Lesson 3 verified end-to-end with agent-browser:
  - Page renders: h1 "Linear transformations & matrices", 55 SVGs, 11
    sections, 2 concept checks, all 5 TransformationSim presets present.
  - 90° rotation preset → matrix [0,-1 | 1,0] ✓
  - Squish preset → "Columns dependent → space squished to a line" badge ✓
  - Identity preset resets correctly ✓
  - Quiz: answered B,A,B,B → 100% + "Flawless!" + confetti ✓
  - Keyboard ← navigates Lesson 3 → Lesson 2 ✓
  - Sidebar shows all 3 lessons ✓
  - No errors. Lint clean. Dev server healthy.
- Lessons 1 & 2 completely untouched. Architecture held: adding Lesson 3
  was purely append-only (config + registry + glossary + 2 new files).
- Course now has 3 lessons, 22 glossary terms, 7 achievements, 4 reusable
  simulations (CoordinatePlane-based + TransformationSim).

Unresolved issues / risks:
- The 15-min webDevReview cron (id 285428) still risks 429 rate-limits
  when running concurrently with active sessions. Recommend reducing to
  60 min.

Recommended next-phase priorities:
- Add Lesson 4 ("Matrix Multiplication & Composition") when transcript
  arrives: build a `CompositionSim` reusing TransformationSim (apply two
  transforms in sequence, show the composed matrix); append to config +
  registry + glossary.
- Consider adding a "determinant" mini-lesson or extending the squish
  detection in TransformationSim to preview the determinant concept.

---
Task ID: 6
Agent: main (Z.ai Code) — add Lesson 4
Task: Add Lesson 4 "Matrix multiplication as composition" to the
existing platform WITHOUT modifying Lessons 1–3.

Work Log:
- Appended Lesson 4 to `lib/course-config.ts` (slug "matrix-
  multiplication", componentKey "composition", number 4, "Core").
  4 quiz questions; whatsNext teases 3D.
- Registered `CompositionLesson` in `lessons/registry.tsx` under
  componentKey "composition".
- Appended 4 glossary terms (Composition, Matrix multiplication,
  Non-commutative, Associative).
- Created `simulations/composition-sim.tsx` — reusable composition
  visualization. Two editable matrices M1 (right, first) and M2 (left,
  second) with draggable î/ĵ; three overlaid grids (original faint →
  after M1 medium → composed boldest); tracked input vector through
  both stages (emerald → violet intermediate → rose final); live
  three-matrix display (M2 · M1 = Product); 4 presets (Rotate→Shear,
  Shear→Rotate, Swap order, Identity). Built standalone (morphing
  multi-grid needs custom SVG, like TransformationSim).
- Created `lessons/composition-lesson.tsx` with 8 sections: hero,
  objectives, recap, composing (CompositionSim), right-to-left order,
  column-by-column computation, non-commutativity + associativity,
  quiz + summary + what's next. 2 inline ConceptChecks + confetti.

Stage Summary:
- Lesson 4 verified end-to-end with agent-browser:
  - Page renders: h1 "Matrix multiplication as composition", 54 SVGs,
    11 sections, 2 concept checks, CompositionSim present, 4 presets.
  - Non-commutativity DEMONSTRATED: Rotate→Shear product = [1,-1|1,0]
    with v→(1,2); Shear→Rotate product = [0,-1|1,1] with v→(-1,3).
    Different products, different destinations — order matters, live.
  - Quiz: answered B,B,B,B → 100% + "Flawless!" + confetti.
  - Sidebar shows all 4 lessons (1 Vectors / 2 Span / 3 Transformations
    / 4 Composition) with correct numbers & difficulties.
  - Keyboard ← navigates Lesson 4 → Lesson 3.
  - No errors. Lint clean. Dev server healthy.
- Lessons 1–3 completely untouched. Architecture held: purely append-
  only (config + registry + glossary + 2 new files).
- Course now has 4 lessons, 26 glossary terms, 7 achievements, 5
  reusable simulations.

Unresolved issues / risks:
- The 15-min webDevReview cron (id 285428) still risks 429 rate-limits
  when running concurrently with active sessions. Recommend reducing to
  60 min.

Recommended next-phase priorities:
- Add Lesson 5 ("Three Dimensions" / determinants) when transcript
  arrives. Determinant would reuse TransformationSim (extend to show
  area scaling) — natural next step.
- The CompositionSim could be extended to show a 3rd matrix (ABC) to
  make associativity tactile.
