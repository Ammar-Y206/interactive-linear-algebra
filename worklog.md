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

---
Task ID: 7
Agent: main (Z.ai Code) — add Lesson 5
Task: Add Lesson 5 "Three-dimensional linear transformations" to the
existing platform WITHOUT modifying Lessons 1–4.

Work Log:
- Appended Lesson 5 to `lib/course-config.ts` (slug "3d-transformations",
  componentKey "transform-3d", number 5, "Core", 12 min — a short bridge
  lesson). 4 quiz questions; whatsNext teases the determinant.
- Registered `Transform3DLesson` in `lessons/registry.tsx` under
  componentKey "transform-3d".
- Appended 3 glossary terms (k̂, 3D linear transformation, 3×3 matrix).
- Created `simulations/transform-3d-sim.tsx` — the 3D counterpart to
  TransformationSim. Isometric projection of 3D space with three
  draggable basis vectors î (amber/x), ĵ (cyan/y), k̂ (violet/z);
  ±z buttons to lift each off the ground plane; a 3×3 matrix display
  (columns = î,ĵ,k̂ destinations); a tracked input vector (emerald)
  with x/y/z sliders transforming to its rose image; 3 presets
  (identity, 90° y-rotation, flatten); detects linear dependence via
  the scalar triple product and shows a "space flattened" badge.
  Reusable for future 3D lessons (determinants in 3D, etc.).
- Created `lessons/transform-3d-lesson.tsx` with 7 sections: hero,
  objectives, out-of-flatland, meet k̂ (Transform3DSim), 3×3 matrix,
  multiply & compose in 3D (graphics/robotics hook), quiz + summary +
  what's next. 2 inline ConceptChecks + confetti on completion.

Stage Summary:
- Lesson 5 verified end-to-end with agent-browser:
  - Page renders: h1 "Three-dimensional linear transformations", 51
    SVGs, 10 sections, 2 concept checks, Transform3DSim present, 3
    presets.
  - 90° y-rotation preset → matrix [0,0,1 | 0,1,0 | -1,0,0] ✓
    (î→(0,0,-1), ĵ→(0,1,0), k̂→(1,0,0))
  - Flatten preset → "Vectors dependent → space flattened" badge ✓
    (k̂→(0,0,0) collapses z — previews zero determinant)
  - Quiz: answered B,C,A,B → 100% + "Flawless!" + confetti.
  - Sidebar shows all 5 lessons (1 Vectors / 2 Span / 3 Transformations
    / 4 Composition / 5 3D Transformations).
  - Keyboard ← navigates Lesson 5 → Lesson 4.
  - No errors. Lint clean. Dev server healthy.
- Lessons 1–4 completely untouched. Architecture held: purely append-
  only (config + registry + glossary + 2 new files).
- Course now has 5 lessons, 29 glossary terms, 7 achievements, 6
  reusable simulations (incl. the new 3D one).

Unresolved issues / risks:
- The 15-min webDevReview cron (id 285428) still risks 429 rate-limits
  when running concurrently with active sessions. Recommend reducing to
  60 min.

Recommended next-phase priorities:
- Add Lesson 6 ("The Determinant") when transcript arrives. Natural fit:
  extend TransformationSim to show area scaling (2D) and reuse
  Transform3DSim for volume scaling (3D). The flatten/dependence
  detection already in Transform3DSim is a perfect segue.

---
Task ID: 8
Agent: main (Z.ai Code) — add Lesson 6
Task: Add Lesson 6 "The determinant" to the existing platform WITHOUT
modifying Lessons 1–5.

Work Log:
- Appended Lesson 6 to `lib/course-config.ts` (slug "determinant",
  componentKey "determinant", number 6, "Core", 18 min). 4 quiz
  questions; whatsNext teases inverse matrices & linear systems.
- Registered `DeterminantLesson` in `lessons/registry.tsx`.
- Appended 4 glossary terms (Determinant, Orientation, Parallelepiped,
  Right-hand rule).
- Created `simulations/determinant-sim.tsx` — the determinant viz.
  Draggable î/ĵ define the matrix; the unit square morphs into a
  parallelogram (emerald) with a ghost original square (slate) for
  reference; live det = ad−bc readout, color-coded by sign; 5 presets
  (Scale det=6, Shear det=1, Collapse det=0, Flip det<0, Identity);
  status badges ("space squished to a line" / "orientation FLIPPED" /
  "Areas ×N · orientation preserved"). Reusable for future inverse/
  eigenvalue lessons.
- Created `lessons/determinant-lesson.tsx` with 8 sections: hero,
  objectives, area scaling (DeterminantSim), det=0 dimension collapse,
  negative & orientation, 3D volumes & parallelepiped, the ad−bc
  formula, quiz + summary + what's next. 2 inline ConceptChecks +
  confetti on completion.
- Fixed a JSX parsing error: `<` in button label "Flip (det<0)" was
  parsed as a tag opener; escaped to `&lt;`.

Stage Summary:
- Lesson 6 verified end-to-end with agent-browser:
  - Page renders: h1 "The determinant", 55 SVGs, 11 sections, 2 concept
    checks, DeterminantSim present, 5 presets.
  - Scale preset → det = 6.00 ✓
  - Collapse preset → det = 0.00 + "space squished to a line" badge ✓
  - Flip preset → det = -3.00 + "orientation FLIPPED" badge ✓
  - Quiz: answered B,B,A,A → 100% + "Flawless!" + confetti.
  - Sidebar shows all 6 lessons.
  - Keyboard ← navigates Lesson 6 → Lesson 5.
  - No errors. Lint clean. Dev server healthy.
- Lessons 1–5 completely untouched. Architecture held: purely append-
  only (config + registry + glossary + 2 new files).
- Course now has 6 lessons, 33 glossary terms, 7 achievements, 7
  reusable simulations.

Unresolved issues / risks:
- The 15-min webDevReview cron (id 285428) still risks 429 rate-limits
  when running concurrently with active sessions. Recommend reducing to
  60 min.

Recommended next-phase priorities:
- Add Lesson 7 ("Inverse Matrices & Linear Systems") when transcript
  arrives. Natural fit: det≠0 is the invertibility test (just covered);
  reuse DeterminantSim to show the inverse "un-doing" a transform.

---
Task ID: 9
Agent: main (Z.ai Code) — add Lessons 7, 8, 9
Task: Add three lessons in one batch: "Inverse matrices, column space
& null space" (L7), "Nonsquare matrices" (L8), "Dot products & duality"
(L9). WITHOUT modifying Lessons 1–6.

Work Log:
- Appended all 3 lessons to `lib/course-config.ts` (slugs inverse-matrices,
  nonsquare-matrices, dot-products; componentKeys inverse, nonsquare,
  dot-product; numbers 7/8/9; difficulties Intermediate). 12 quiz
  questions total; whatsNext chains L7→L8→L9→cross products.
- Registered all 3 in `lessons/registry.tsx`.
- Appended 11 glossary terms (Linear system, Inverse matrix, Identity
  matrix, Rank, Column space, Null space, Nonsquare matrix, Full rank
  non-square, Dot product, Projection, Duality).
- Created 3 new reusable simulations:
  - `simulations/inverse-sim.tsx` — solve A·x=v by playing the transform
    in reverse; draggable î/ĵ define A, draggable v sets the target;
    computes A⁻¹·v = x live; play/pause animates x→v forward & reverse;
    det=0 disables the inverse with an explanatory panel. Presets
    include a Collapse case.
  - `simulations/nonsquare-sim.tsx` — three modes (2D→3D, 3D→2D, 2D→1D)
    showing the dimension-crossing map with the matrix shape badge;
    2D→1D mode draws an actual number line at the bottom.
  - `simulations/dot-product-sim.tsx` — draggable v/w, projects w onto v
    (rose), live v·w readout color-coded by sign, |v|/|proj|/angle
    readouts, right-angle marker, perpendicular detection, AND a
    duality panel showing the 1×2 matrix = v tipped over.
- Created 3 lesson pages:
  - `lessons/inverse-lesson.tsx` (7 sections, 2 concept checks)
  - `lessons/nonsquare-lesson.tsx` (5 sections, 1 concept check)
  - `lessons/dot-product-lesson.tsx` (6 sections, 1 concept check)
  Each with confetti on completion, reusing all shared components.

NOTE: A build error occurred mid-way because the registry imported the
three lesson files before they were created. Resolved by creating all
missing files (the three sims + three lesson pages).

Stage Summary:
- All 3 lessons verified with agent-browser:
  - L7 renders: h1 "Inverse matrices…", 53 SVGs, 2 concept checks.
  - L8 renders: h1 "Nonsquare matrices…", 48 SVGs, 1 concept check.
  - L9 renders: h1 "Dot products & duality", 46 SVGs, 1 concept check.
  - L9 quiz: A,B,B,B → 100% + "Flawless!" + confetti.
  - Sidebar shows all 9 lessons.
  - No errors. Lint clean. Dev server healthy.
- Lessons 1–6 completely untouched. Architecture held: purely append-
  only (config + registry + glossary + 6 new files).
- Course now has 9 lessons, 44 glossary terms, 7 achievements, 10
  reusable simulations.

Unresolved issues / risks:
- The 15-min webDevReview cron (id 285428) still risks 429 rate-limits.
  Recommend reducing to 60 min.

Recommended next-phase priorities:
- Add Lesson 10 ("Cross products") when transcript arrives. Natural
  reuse of the duality concept just introduced; build a CrossProductSim
  showing the perpendicular vector + the parallelogram area.

---
Task ID: 10
Agent: main (Z.ai Code) — add Lessons 10, 11, 12
Task: Add three lessons: "Cross products" (L10), "Cross products in the
light of linear transformations" (L11), "Cramer's rule, explained
geometrically" (L12). WITHOUT modifying Lessons 1–9.

Work Log:
- Appended all 3 lessons to `lib/course-config.ts` (slugs cross-products,
  cross-products-duality, cramers-rule; componentKeys cross-product,
  cross-product-duality, cramers-rule; numbers 10/11/12; Advanced).
  12 quiz questions total.
- Registered all 3 in `lessons/registry.tsx`.
- Appended 9 glossary terms (Cross product 2D/3D, Right-hand rule CP,
  Parallelogram, Parallelepiped, Dual vector, Cramer's rule,
  Orthonormal transformation).
- Created 3 new reusable simulations:
  - `simulations/cross-product-sim.tsx` — 2D mode (parallelogram + signed
    area = determinant) and 3D mode (perpendicular cross-product vector
    with right-hand rule). Mode toggle.
  - `simulations/cross-product-duality-sim.tsx` — shows the volume
    transformation (parallelepiped of u, v, w) and its dual = v × w;
    sliders for u; toggle to reveal the dual vector; live
    volume = u · (v × w) readout.
  - `simulations/cramers-rule-sim.tsx` — solves A·x=v via Cramer's rule;
    draggable î', ĵ', v; shows the unit square → det(A) parallelogram,
    the y-encoding parallelogram (î'+v), and the recovered x vector;
    live det(A), det([v|ĵ']), det([î'|v]) readouts and the ratios.
- Created 3 lesson pages (cross-product-lesson, cross-product-duality-
  lesson, cramers-rule-lesson) each with confetti, concept checks, full
  8-section structure.

BUG FIXES (runtime errors caught during verification):
- Extended `SummaryCard`, `SimulationContainer`, and `SectionHeading`
  accent palettes to include "violet" (used by the duality lesson's
  violet-themed sections/sims). Previously these components only
  supported emerald/amber/rose/cyan, causing undefined-access crashes
  when passed accent="violet". Now all three support 5 accents.

Stage Summary:
- All 3 lessons verified with agent-browser:
  - L10 renders: h1 "Cross products", 52 SVGs, 1 concept check, sim
    with 2D/3D toggle.
  - L11 renders: h1 "Cross products in the light of linear
    transformations", 51 SVGs, 1 concept check, duality sim with
    reveal toggle.
  - L12 renders: h1 "Cramer's rule, explained geometrically", 51 SVGs,
    1 concept check, Cramer's rule sim.
  - L11 quiz: A,B,B,B → 100% + "Flawless!" + confetti.
  - Sidebar shows all 12 lessons.
  - No errors. Lint clean. Dev server healthy.
- Lessons 1–9 completely untouched. Architecture held: purely append-
  only (config + registry + glossary + 6 new files + 3 accent-palette
  extensions to shared components).
- Course now has 12 lessons, 53 glossary terms, 7 achievements, 13
  reusable simulations.

Unresolved issues / risks:
- The 15-min webDevReview cron (id 285428) still risks 429 rate-limits.
  Recommend reducing to 60 min.

Recommended next-phase priorities:
- Add Lesson 13 ("Change of Basis") when transcript arrives. Natural
  reuse of the TransformationSim — change of basis is just a
  transformation between coordinate systems.

---
Task ID: 11
Agent: main (Z.ai Code) — add Lessons 13, 14, 15, 16 (FINAL BATCH)
Task: Add four lessons completing the course: "Change of basis" (L13),
"Eigenvectors and eigenvalues" (L14), "A quick trick for computing
eigenvalues" (L15), "Abstract vector spaces" (L16). WITHOUT modifying
Lessons 1–12.

Work Log:
- Appended all 4 lessons to `lib/course-config.ts` (slugs change-of-basis,
  eigenvectors, eigenvalue-trick, abstract-vector-spaces; componentKeys
  match; numbers 13-16; all Advanced). 16 quiz questions total. L16's
  whatsNext points to "Course Complete" — the series is finished.
- Registered all 4 in `lessons/registry.tsx`.
- Appended 14 glossary terms (Change of basis, Change-of-basis matrix,
  Similarity transform, Eigenvector, Eigenvalue, Characteristic polynomial,
  Eigenbasis, Diagonal matrix, Trace, Mean-product formula, Vector space,
  Linear operator, Axioms).
- Created 4 new reusable simulations:
  - `simulations/change-of-basis-sim.tsx` — two coordinate systems (yours
    + Jennifer's); draggable b₁/b₂; live change-of-basis matrix + inverse;
    same vector shown in both languages.
  - `simulations/eigenvectors-sim.tsx` — drag î'/ĵ'; computes eigenvalues
    via the characteristic polynomial; draws eigenvector span lines + the
    stretch arrows; detects no-real-eigenvalues case (rotations).
  - `simulations/eigenvalue-trick-sim.tsx` — editable 2×2 matrix with
    live trace/det/mean-product computation; presets; verification.
  - `simulations/abstract-vector-spaces-sim.tsx` — polynomial coefficient
    sliders; displays the derivative matrix (5×5 slice with 1,2,3,4 on
    the offset diagonal); matrix-vector mult = differentiation.
- Created 4 lesson pages, each with confetti, concept checks, full
  8-section structure.

BUG FIX: Extended `ConceptCheck` accent palette to include "violet"
(used by the change-of-basis and abstract-vector-spaces lessons).
Previously only emerald/amber/rose/cyan were supported. Now all shared
components (SummaryCard, SimulationContainer, SectionHeading,
ConceptCheck) support 5 accents.

Stage Summary:
- All 4 lessons verified with agent-browser:
  - L13: h1 "Change of basis", 53 SVGs, 1 concept check.
  - L14: h1 "Eigenvectors and eigenvalues", 53 SVGs, 1 concept check.
  - L15: h1 "A quick trick for computing eigenvalues", 50 SVGs, 1 check.
  - L16: h1 "Abstract vector spaces", 52 SVGs, 1 concept check, sim present.
  - L16 (capstone) quiz: B,B,B,C → 100% + "Flawless!" + confetti.
  - Sidebar shows all 16 lessons.
  - No errors. Lint clean. Dev server healthy.
- Lessons 1–12 completely untouched. Architecture held: purely append-
  only (config + registry + glossary + 8 new files + 1 accent-palette
  extension to ConceptCheck).

COURSE COMPLETE: The platform now has the full "Essence of Linear
Algebra" series — 16 lessons, 67 glossary terms, 7 achievements, 17
reusable simulations. The append-only architecture held throughout:
each lesson was added by creating new files and appending to config/
registry/glossary, never modifying existing lessons. The foundation
built in Lesson 1 (shared components, progress store, course shell)
served all 16 lessons without structural change.

Unresolved issues / risks:
- The 15-min webDevReview cron (id 285428) still risks 429 rate-limits.
  Recommend reducing to 60 min or disabling now that the course is
  complete.

Recommended next-phase priorities:
- The course is complete. Optional future work: add a "review" mode
  that surfaces random quiz questions across lessons; add a print/
  export progress certificate; or extend with supplementary topics
  (SVD, least squares, PCA) using the same architecture.

---
Task ID: 12
Agent: main (Z.ai Code) — curriculum-design expansion
Task: Act as curriculum designer. Insert 6 introductory lessons before
the existing content, renumber everything, and add the new mandatory
curriculum sections (Why This Matters, Build Something, Connections,
Motivation).

Work Log:
- Renumbered existing 16 lessons +6 (vectors: 1→7, ..., abstract: 16→22)
  via reverse-order sed to avoid collisions. Slugs unchanged (immutable).
- Inserted 6 introductory lessons at the start of the LESSONS array:
  L1 Welcome to Linear Algebra, L2 Why Learn Linear Algebra?, L3 Linear
  Algebra in Real Life, L4 The Hidden Math Behind AI, L5 Mathematics as
  a Language, L6 The Roadmap of This Course. Each has objectives + a
  2-question quiz + whatsNext chaining to the next.
- Registered all 6 in `lessons/registry.tsx` (componentKeys: welcome,
  why-linear-algebra, real-life, ai-math, math-language, roadmap).
- Created `components/course/curriculum-sections.tsx` — 4 reusable
  curriculum-design section components:
  - WhyThisMatters: applications grid + industries + famous products
  - BuildSomething: "what you can make" cards
  - Connections: prev/next lesson links with navigation
  - Motivation: the "after this, you can understand X" closer
  All accept the 5-accent palette (emerald/amber/rose/cyan/violet).
- Created 6 intro lesson pages, each using the new curriculum sections:
  - welcome-lesson.tsx: what LA is, how the course teaches, the destination
  - why-linear-algebra-lesson.tsx: WhyThisMatters (9 apps) + BuildSomething
    (4 projects) + Connections
  - real-life-lesson.tsx: WhyThisMatters (8 everyday apps) + BuildSomething
  - ai-math-lesson.tsx: neural-net-as-matrices + GPU story + WhyThisMatters
  - math-language-lesson.tsx: math as language, 3 registers, notation as
    compression
  - roadmap-lesson.tsx: 3 acts (atoms/machinery/mastery) + full course map
- Fixed a `"use client">` typo (should be `;`) in math-language-lesson.
- Aliased lucide `Image` → `ImageIcon` in real-life-lesson to avoid a
  jsx-a11y false-positive warning.

Stage Summary:
- Verified with agent-browser:
  - All 6 intro lessons render with correct h1s (Welcome, Why Learn, Real
    Life, AI Math, Math as Language, Roadmap).
  - Sidebar shows all 22 lessons; intro lessons 1-6 first, Vectors now 7.
  - Welcome quiz + next-navigation works (→ Why Learn Linear Algebra).
  - No errors. Lint clean. Dev server healthy.
- The course now has a proper motivational on-ramp before the math
  begins: every learner sees WHY (applications, careers, products), WHAT
  they can build, and WHERE each lesson fits — before touching a vector.
- Course total: 22 lessons, 67+ glossary terms, 7 achievements, 17 sims,
  + 4 reusable curriculum-section components.

Unresolved issues / risks:
- Existing 16 content lessons do NOT yet have the new mandatory sections
  (WhyThisMatters, BuildSomething, Connections, Motivation). The intro
  lessons showcase the pattern; retrofitting all 16 is a follow-up.
- The 15-min webDevReview cron still risks 429s.

Recommended next-phase priorities:
- Retrofit the new curriculum sections into existing content lessons
  (start with the high-traffic ones: Vectors, Transformations, Determinant,
  Eigenvectors). Each just needs WhyThisMatters + Motivation added.
- Consider adding bridge/recap lessons between acts (e.g. "Recap: The
  Atoms" after Lesson 9, "Recap: The Machinery" after Lesson 16).
