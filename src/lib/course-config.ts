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
  {
    slug: "linear-transformations",
    number: 3,
    title: "Linear transformations & matrices",
    tagline: "When space itself moves",
    description:
      "See a transformation as movement of the whole grid. Learn the two rules that make it 'linear', discover that a matrix is just 'where î and ĵ land', and read matrix-vector multiplication as a linear combination — no memorization.",
    durationMin: 22,
    difficulty: "Core",
    componentKey: "transformations",
    objectives: [
      {
        title: "See transformations as movement",
        detail:
          "Picture a function from vectors to vectors as every point in space moving to a new home — the grid morphing as a whole.",
      },
      {
        title: "Know the two linearity rules",
        detail:
          "A transformation is linear iff grid lines stay straight and parallel, evenly spaced, and the origin stays fixed. Everything else follows from these.",
      },
      {
        title: "Read a matrix as transformed basis",
        detail:
          "A 2×2 matrix's columns are simply where î and ĵ land. Four numbers fully describe any 2D linear transformation.",
      },
      {
        title: "Multiply without memorizing",
        detail:
          "Matrix-vector multiplication is a linear combination: x·(transformed î) + y·(transformed ĵ). Compute it from the columns, not a formula.",
      },
    ],
    quiz: [
      {
        id: "t1",
        prompt:
          "Which two properties must a transformation have to be called 'linear'?",
        options: [
          "It scales all vectors by the same factor and keeps the origin fixed",
          "Grid lines stay straight & parallel (evenly spaced), and the origin stays fixed",
          "It maps î to ĵ and keeps all lengths the same",
          "It is a rotation, and every vector stays on its own line",
        ],
        answer: 1,
        explanation:
          "Linearity means grid lines remain lines, parallel, and evenly spaced — and the origin doesn't move. That's it; no curvature, no shifting of the origin.",
      },
      {
        id: "t2",
        prompt:
          "A transformation sends î → (1, −2) and ĵ → (3, 0). Where does the vector (−1, 2) land?",
        options: [
          "(5, 2)",
          "(2, 5)",
          "(−5, −2)",
          "(1, 2)",
        ],
        answer: 0,
        explanation:
          "(−1, 2) = −1·î + 2·ĵ, so it lands on −1·(1,−2) + 2·(3,0) = (−1+6, 2+0) = (5, 2). The transformed vector is the same linear combination of where î and ĵ landed.",
      },
      {
        id: "t3",
        prompt:
          "A 2×2 matrix has columns (1, 0) and (1, 1). What transformation is this?",
        options: [
          "A 90° counterclockwise rotation",
          "A horizontal shear (î stays put, ĵ tilts right)",
          "A reflection across the x-axis",
          "A uniform scaling by 2",
        ],
        answer: 1,
        explanation:
          "î lands at (1,0) — unchanged. ĵ lands at (1,1) — tilted over to the right. That's the classic horizontal shear: vertical lines slant but stay parallel and evenly spaced.",
      },
      {
        id: "t4",
        prompt:
          "If a matrix's two columns are linearly dependent (one is a scaled copy of the other), the transformation…",
        options: [
          "is a rotation",
          "squishes all of 2D space onto a single line through the origin",
          "leaves every vector unchanged",
          "doubles the area of space",
        ],
        answer: 1,
        explanation:
          "When the transformed î and ĵ line up, the whole grid collapses onto their shared span — a single line. The transformation still keeps the origin fixed and lines straight, but it crushes a dimension.",
      },
    ],
    whatsNext: {
      title: "Matrix Multiplication & Composition",
      blurb:
        "If one transformation follows another, what single matrix does the job of both? Matrix multiplication is composition — and once you see it geometrically, the formula writes itself.",
    },
  },
  {
    slug: "matrix-multiplication",
    number: 4,
    title: "Matrix multiplication as composition",
    tagline: "Two transforms, one matrix",
    description:
      "When one transformation follows another, the overall effect is a new transformation — a composition. Its matrix is the product, read right-to-left, and computed column by column. See why order matters and why associativity is obvious.",
    durationMin: 20,
    difficulty: "Core",
    componentKey: "composition",
    objectives: [
      {
        title: "Compose transformations",
        detail:
          "Understand that applying one transformation then another yields a single new transformation — the composition — with its own matrix.",
      },
      {
        title: "Read products right-to-left",
        detail:
          "In M2·M1·v, M1 applies first, then M2. The order comes from function notation — you read the sequence from right to left.",
      },
      {
        title: "Compute the product by columns",
        detail:
          "Column 1 of the product = left matrix × column 1 of the right matrix (where î ends up). Column 2 = left × column 2 (where ĵ ends up).",
      },
      {
        title: "Feel non-commutativity & associativity",
        detail:
          "Order matters — a shear-then-rotate ≠ rotate-then-shear. But grouping doesn't: (AB)C = A(BC) because both mean 'apply C, then B, then A'.",
      },
    ],
    quiz: [
      {
        id: "m1",
        prompt:
          "In the product M2 · M1 · v, which transformation applies FIRST?",
        options: [
          "M2, because it's written on the left",
          "M1, because composition reads right-to-left",
          "They apply simultaneously",
          "It depends on the matrices",
        ],
        answer: 1,
        explanation:
          "Matrix multiplication mirrors function composition, and functions are written on the left of their input. So the rightmost matrix (M1) touches v first, then M2 acts on the result. Always read right-to-left.",
      },
      {
        id: "m2",
        prompt:
          "To find the FIRST COLUMN of the product M2·M1, you compute…",
        options: [
          "M1's first column, unchanged",
          "M2 times M1's first column",
          "M1 times M2's first column",
          "The sum of all columns",
        ],
        answer: 1,
        explanation:
          "î starts at (1,0). After M1 it lands on M1's first column. After M2 it lands on M2·(that column). So the first column of the product is M2 times the first column of M1 — that's where î ultimately ends up.",
      },
      {
        id: "m3",
        prompt:
          "Is matrix multiplication commutative — does A·B = B·A?",
        options: [
          "Yes, always",
          "No — order matters; a shear-then-rotate usually differs from rotate-then-shear",
          "Only when both matrices are rotations",
          "Only for 2×2 matrices",
        ],
        answer: 1,
        explanation:
          "Order matters. Applying a shear then a rotation generally produces a different final arrangement than rotating then shearing — you can see it by tracking where î and ĵ land in each case. Matrix multiplication is NOT commutative.",
      },
      {
        id: "m4",
        prompt:
          "Why is matrix multiplication associative — (A·B)·C = A·(B·C)?",
        options: [
          "It's a tedious algebraic identity with no intuition",
          "Both sides mean 'apply C, then B, then A' — the same sequence, just grouped differently",
          "Because matrices are square",
          "Because the identity matrix cancels out",
        ],
        answer: 1,
        explanation:
          "Associativity is obvious geometrically: both groupings describe applying C first, then B, then A. The parentheses only change how you chunk the computation, not the sequence of transformations. The geometric view turns a horrible algebra proof into a one-liner.",
      },
    ],
    whatsNext: {
      title: "Three Dimensions & Beyond",
      blurb:
        "We've lived in the plane long enough. Next we lift everything — vectors, matrices, transformations — into 3D space, where the same ideas scale up and new geometry emerges.",
    },
  },
  {
    slug: "3d-transformations",
    number: 5,
    title: "Three-dimensional linear transformations",
    tagline: "Lifting out of flatland",
    description:
      "A short bridge into 3D. Meet k̂, the third basis vector. A 3×3 matrix is just where î, ĵ, and k̂ each land — nine numbers describing any transformation of space. The same ideas scale up effortlessly.",
    durationMin: 12,
    difficulty: "Core",
    componentKey: "transform-3d",
    objectives: [
      {
        title: "Meet the third basis vector k̂",
        detail:
          "Beyond î (x) and ĵ (y) sits k̂ — the unit vector along the z-axis. Three basis vectors span all of 3D space.",
      },
      {
        title: "Read a 3×3 matrix as three landing spots",
        detail:
          "A 3×3 matrix's three columns are simply where î, ĵ, and k̂ land. Nine numbers fully describe any 3D linear transformation.",
      },
      {
        title: "Apply a 3D matrix to a vector",
        detail:
          "Matrix-vector multiplication is the same linear-combination idea, now with three terms: x·(col 1) + y·(col 2) + z·(col 3).",
      },
      {
        title: "Compose 3D transformations",
        detail:
          "3D matrix multiplication is composition, read right-to-left — vital for computer graphics and robotics, where complex rotations break into simpler ones.",
      },
    ],
    quiz: [
      {
        id: "td1",
        prompt:
          "In 3D, how many basis vectors are there, and what are they?",
        options: [
          "Two: î and ĵ",
          "Three: î, ĵ, and k̂ — along the x, y, and z axes",
          "Three: x, y, and z (the axes themselves)",
          "Four: î, ĵ, k̂, and the origin",
        ],
        answer: 1,
        explanation:
          "3D has three standard basis vectors: î = (1,0,0) along x, ĵ = (0,1,0) along y, and k̂ = (0,0,1) along z. Every 3D vector is a linear combination of these three.",
      },
      {
        id: "td2",
        prompt:
          "A 3×3 matrix completely describes a 3D linear transformation using how many numbers?",
        options: ["Three", "Six", "Nine", "Twelve"],
        answer: 2,
        explanation:
          "Nine — three columns (where î, ĵ, k̂ each land), each with three coordinates. Just as a 2×2 matrix needed four numbers (two columns × two coords), a 3×3 needs nine.",
      },
      {
        id: "td3",
        prompt:
          "A 90° rotation around the y-axis sends î → (0,0,−1), leaves ĵ → (0,1,0), and sends k̂ → (1,0,0). What's the matrix?",
        options: [
          "Columns (0,0,−1), (0,1,0), (1,0,0)",
          "Columns (1,0,0), (0,1,0), (0,0,1)",
          "Columns (0,1,0), (0,0,−1), (1,0,0)",
          "Columns (1,0,0), (0,0,−1), (0,1,0)",
        ],
        answer: 0,
        explanation:
          "The columns are, in order, where î, ĵ, k̂ land: î → (0,0,−1) is column 1, ĵ → (0,1,0) is column 2, k̂ → (1,0,0) is column 3. Read the landing spots off as columns.",
      },
      {
        id: "td4",
        prompt:
          "To apply a 3D matrix M to the vector (x, y, z), you compute…",
        options: [
          "The sum of all nine matrix entries, times x+y+z",
          "x·(column 1) + y·(column 2) + z·(column 3)",
          "The dot product of the vector with each row",
          "(x, y, z) read directly as a column",
        ],
        answer: 1,
        explanation:
          "Same as 2D: the coordinates are scalars for the basis vectors, so the image is x·(where î landed) + y·(where ĵ landed) + z·(where k̂ landed) — a linear combination of the three columns.",
      },
    ],
    whatsNext: {
      title: "The Determinant",
      blurb:
        "How much does a transformation stretch or squish space? The determinant measures the scaling factor of area (and volume) — and reveals when a transformation collapses a dimension entirely.",
    },
  },
  {
    slug: "determinant",
    number: 6,
    title: "The determinant",
    tagline: "How much a transformation stretches space",
    description:
      "The determinant is the single number measuring how a transformation scales area — stretch, squish, or flip. Zero means a dimension collapsed; negative means space got turned inside-out. See why det=0 is the most important test in linear algebra.",
    durationMin: 18,
    difficulty: "Core",
    componentKey: "determinant",
    objectives: [
      {
        title: "Read the determinant as an area scale",
        detail:
          "A transformation scales every region's area by one factor — the determinant. det=3 triples areas; det=½ halves them; det=1 leaves areas unchanged (like a shear).",
      },
      {
        title: "Decode det = 0",
        detail:
          "If the determinant is zero, the transformation squished all of space onto a line (or a point) — a dimension was lost. The matrix columns are linearly dependent.",
      },
      {
        title: "Interpret negative determinants",
        detail:
          "A negative determinant means the transformation flips space over — inverting orientation. The absolute value is still the area scale; the sign is the flip.",
      },
      {
        title: "Compute ad − bc, and why",
        detail:
          "For a 2×2 matrix [a,b | c,d], det = ad − bc. a·d is the rectangle area when b,c=0; the −bc term corrects for diagonal stretching. The intuition matters more than the formula.",
      },
    ],
    quiz: [
      {
        id: "d1",
        prompt:
          "A transformation has determinant 6. What does that tell you?",
        options: [
          "It rotates space by 6 degrees",
          "Every region's area is scaled by a factor of 6",
          "It has 6 columns",
          "It flips space over",
        ],
        answer: 1,
        explanation:
          "The determinant is the area-scaling factor. det=6 means every region's area becomes 6 times what it was. Orientation is unchanged (the sign is positive).",
      },
      {
        id: "d2",
        prompt:
          "A 2×2 matrix has determinant 0. What does that mean geometrically?",
        options: [
          "The transformation is a rotation",
          "Space gets squished onto a line (or a point) — a dimension is lost",
          "Areas double",
          "The matrix is the identity",
        ],
        answer: 1,
        explanation:
          "det=0 means every area becomes zero — the whole plane collapsed to a line (or point). The matrix's columns are linearly dependent: one is a scaled copy of the other. This is why det=0 is the key test for whether a transformation crushes a dimension.",
      },
      {
        id: "d3",
        prompt:
          "A transformation has determinant −3. What happened to space?",
        options: [
          "It scaled areas by 3 and flipped the orientation",
          "It shrunk areas by a factor of −3",
          "It rotated space 180°",
          "Nothing — the sign is irrelevant",
        ],
        answer: 0,
        explanation:
          "The absolute value |−3| = 3 is the area scale; the negative sign means orientation was inverted (space got flipped over, like turning a sheet of paper onto its other side). Both pieces of information matter.",
      },
      {
        id: "d4",
        prompt:
          "For the matrix [3, 0 | 0, 2], what is the determinant, and why?",
        options: [
          "6 — it's a·d − b·c = 3·2 − 0·0, scaling î by 3 and ĵ by 2",
          "5 — the sum of the diagonal",
          "0 — because the off-diagonals are zero",
          "1 — the unit square stays unit area",
        ],
        answer: 0,
        explanation:
          "det = ad − bc = 3·2 − 0·0 = 6. î stretches to length 3, ĵ to length 2, so the unit square becomes a 3×2 rectangle of area 6. The off-diagonal zeros mean no diagonal slant, so the rectangle area is just the product of the stretches.",
      },
    ],
    whatsNext: {
      title: "Inverse Matrices & Linear Systems",
      blurb:
        "If a transformation squishes space to a line, you can't undo it — information is lost. The determinant tells you when an inverse exists. Next we solve linear systems by asking: which vector maps to this one?",
    },
  },
  {
    slug: "inverse-matrices",
    number: 7,
    title: "Inverse matrices, column space & null space",
    tagline: "Playing the transformation in reverse",
    description:
      "Solving Ax = v means asking: which vector x lands on v? If det ≠ 0 you can play the transformation in reverse — the inverse. If det = 0, space got squished and information was lost. Rank, column space, and null space describe exactly what's recoverable.",
    durationMin: 24,
    difficulty: "Intermediate",
    componentKey: "inverse",
    objectives: [
      {
        title: "Read Ax = v geometrically",
        detail:
          "A linear system is the question 'which input vector x lands on v after the transformation A?' Solving it means rewinding the transformation.",
      },
      {
        title: "Understand the inverse A⁻¹",
        detail:
          "When det ≠ 0, there's a unique reverse transformation A⁻¹ with A⁻¹A = I (the identity). Apply it to v to recover x. No inverse exists when det = 0 — you can't un-squish a line into a plane.",
      },
      {
        title: "Decode rank & column space",
        detail:
          "The column space is the span of the columns — every possible output. Rank is its dimension. Full rank means outputs fill the whole target space; otherwise a dimension was lost.",
      },
      {
        title: "Interpret the null space",
        detail:
          "The set of vectors that land on the origin. For full-rank matrices it's just {0}; when a dimension collapses, a whole line or plane of inputs gets crushed to zero.",
      },
    ],
    quiz: [
      {
        id: "i1",
        prompt:
          "Solving the matrix equation A·x = v geometrically means finding…",
        options: [
          "The determinant of A",
          "The vector x that, after transformation A, lands on v",
          "The inverse of A",
          "A vector perpendicular to v",
        ],
        answer: 1,
        explanation:
          "A·x = v asks: which input x, when transformed by A, lands on v? You're rewinding the transformation to find the input that produced the given output.",
      },
      {
        id: "i2",
        prompt:
          "When does a matrix A have an inverse A⁻¹?",
        options: [
          "Always, for any square matrix",
          "Only when det(A) ≠ 0 — the transformation didn't collapse a dimension",
          "Only when A is the identity",
          "Only when A is symmetric",
        ],
        answer: 1,
        explanation:
          "An inverse exists iff the transformation is reversible — iff det ≠ 0, meaning no dimension was squished away. If det = 0, multiple inputs map to the same output, so a function can't undo it.",
      },
      {
        id: "i3",
        prompt:
          "The 'column space' of a matrix is…",
        options: [
          "The space of all valid inputs",
          "The span of its columns — the set of all possible outputs",
          "The set of vectors that land on zero",
          "The number of rows",
        ],
        answer: 1,
        explanation:
          "The columns are where the basis vectors land, so their span is every vector the transformation can produce — the column space. It tells you which outputs v are even reachable.",
      },
      {
        id: "i4",
        prompt:
          "A 3D transformation squishes all of space onto a single line. What is its null space?",
        options: [
          "Just the zero vector",
          "A single line of vectors that land on zero",
          "An entire plane of vectors that land on the origin",
          "All of 3D space",
        ],
        answer: 2,
        explanation:
          "When 3D collapses to a line (rank 1), a whole 2D plane of input vectors gets crushed onto the origin. That plane is the null space. The more dimensions you lose, the bigger the null space.",
      },
    ],
    whatsNext: {
      title: "Nonsquare Matrices",
      blurb:
        "So far every matrix was square — same dimensions in and out. But a 3×2 or 2×3 matrix maps between spaces of different dimension, lifting 2D into 3D or projecting 3D down to 2D.",
    },
  },
  {
    slug: "nonsquare-matrices",
    number: 8,
    title: "Nonsquare matrices: transformations between dimensions",
    tagline: "Mapping across dimensions",
    description:
      "A 3×2 matrix lifts 2D into 3D; a 2×3 matrix projects 3D down to 2D; a 1×2 matrix squishes 2D onto the number line. The shape of the matrix tells you exactly which dimensions you're traveling between.",
    durationMin: 11,
    difficulty: "Intermediate",
    componentKey: "nonsquare",
    objectives: [
      {
        title: "Read a matrix's shape as a dimension map",
        detail:
          "An m×n matrix takes n-dimensional inputs to m-dimensional outputs: n columns (input basis vectors), m rows (coordinates of each landing spot).",
      },
      {
        title: "See 2D → 3D embeddings",
        detail:
          "A 3×2 matrix lifts the plane into a 2D slice of 3D space. The column space is a plane through the origin — full rank even though it's 'in' 3D.",
      },
      {
        title: "See 3D → 2D projections",
        detail:
          "A 2×3 matrix collapses 3D onto the plane. Information is lost; the null space is generally a line of vectors that get squished to zero.",
      },
      {
        title: "Meet 2D → 1D (the number line)",
        detail:
          "A 1×2 matrix takes 2D vectors to single numbers. Linearity means evenly-spaced dots stay evenly spaced on the number line. This sets up the dot product.",
      },
    ],
    quiz: [
      {
        id: "n1",
        prompt:
          "A matrix is 3 rows by 2 columns (3×2). What transformation does it represent?",
        options: [
          "3D → 3D",
          "2D → 3D (lifts the plane into space)",
          "3D → 2D (projects space onto the plane)",
          "2D → 2D",
        ],
        answer: 1,
        explanation:
          "2 columns = 2 input basis vectors (so 2D input). 3 rows = each landing spot has 3 coordinates (so 3D output). A 3×2 matrix lifts 2D vectors into 3D space.",
      },
      {
        id: "n2",
        prompt:
          "What does a 1×2 matrix do, geometrically?",
        options: [
          "Rotates 2D space",
          "Takes 2D vectors to single numbers — a projection onto the number line",
          "Doubles every vector's length",
          "Maps 3D to 2D",
        ],
        answer: 1,
        explanation:
          "2 columns (2D input), 1 row (1D output = the number line). Each basis vector lands on a single number. Linearity keeps evenly-spaced dots evenly spaced. This is the seed of the dot product.",
      },
      {
        id: "n3",
        prompt:
          "A 3×2 matrix's column space is a 2D plane inside 3D space. Is it full rank?",
        options: [
          "No — it's not 3D",
          "Yes — the column space's dimension (2) equals the input dimension (2)",
          "Only if the determinant is non-zero",
          "It depends on the entries",
        ],
        answer: 1,
        explanation:
          "Full rank means the output dimension equals the input dimension. Here both are 2, so the matrix is full rank even though it lives inside 3D. No information was lost; the plane is faithfully embedded.",
      },
      {
        id: "n4",
        prompt:
          "A 2×3 matrix (3D → 2D) generally has a non-trivial null space. Why?",
        options: [
          "Because 2 < 3, a whole line of 3D vectors gets crushed to zero",
          "Because the determinant is always 1",
          "Because non-square matrices can't be linear",
          "Because 3D vectors are longer than 2D vectors",
        ],
        answer: 0,
        explanation:
          "Collapsing 3D to 2D loses a dimension. The vectors that get squished onto the origin form a line (a 1D null space). Whenever outputs have fewer dimensions than inputs, the null space is non-trivial.",
      },
    ],
    whatsNext: {
      title: "Dot Products & Duality",
      blurb:
        "A 1×2 matrix takes 2D vectors to numbers — and looks suspiciously like a tipped-over vector. That's no coincidence: it's duality, and it's why the dot product computes projections.",
    },
  },
  {
    slug: "dot-products",
    number: 9,
    title: "Dot products & duality",
    tagline: "Why projecting is the same as multiplying",
    description:
      "The dot product pairs coordinates, multiplies, and adds — but geometrically it's a projection times a length. The deep reason: a 1×2 matrix (a transformation to the number line) IS a tipped-over vector. That's duality.",
    durationMin: 19,
    difficulty: "Intermediate",
    componentKey: "dot-product",
    objectives: [
      {
        title: "Compute a dot product",
        detail:
          "Pair the coordinates, multiply each pair, sum the results: (1,2)·(3,4) = 1·3 + 2·4 = 11. Straightforward arithmetic — but the geometry is the prize.",
      },
      {
        title: "Read the dot product as a projection",
        detail:
          "v·w = (length of w's projection onto v) × (length of v). Positive when they point the same way; zero when perpendicular; negative when opposite.",
      },
      {
        title: "See why order doesn't matter",
        detail:
          "Projecting w onto v × |v| gives the same number as projecting v onto w × |w|. Scaling either vector scales the product the same way under both views — symmetry survives.",
      },
      {
        title: "Grasp duality",
        detail:
          "A linear transformation from vectors to numbers is described by a 1×2 matrix — which is just a vector tipped on its side. Every vector embodies a transformation to the number line; that's duality.",
      },
    ],
    quiz: [
      {
        id: "dp1",
        prompt:
          "What is (1, 2) · (3, 4)?",
        options: ["11", "7", "24", "14"],
        answer: 0,
        explanation:
          "Pair coordinates, multiply, add: 1·3 + 2·4 = 3 + 8 = 11. That's the numerical definition of the dot product.",
      },
      {
        id: "dp2",
        prompt:
          "Geometrically, v · w equals…",
        options: [
          "The sum of the vectors' lengths",
          "(length of w's projection onto v) × (length of v)",
          "The angle between the vectors",
          "The area of the parallelogram they span",
        ],
        answer: 1,
        explanation:
          "Project w onto the line through v, then multiply that projected length by |v|. Sign tracks direction: positive (same way), zero (perpendicular), negative (opposite).",
      },
      {
        id: "dp3",
        prompt:
          "Two vectors are perpendicular. What is their dot product?",
        options: [
          "1",
          "0 — the projection of one onto the other is zero",
          "Negative",
          "Their lengths multiplied",
        ],
        answer: 1,
        explanation:
          "If they're perpendicular, projecting one onto the other lands on the origin — a zero-length projection. So the dot product is 0. This is why dot=0 is the standard perpendicularity test.",
      },
      {
        id: "dp4",
        prompt:
          "Why is a 1×2 matrix the same as a 2D vector tipped on its side?",
        options: [
          "It's a coincidence of notation",
          "Duality: any linear map from 2D to the number line corresponds to a unique vector, and applying it = taking a dot product with that vector",
          "Because matrices and vectors are the same object",
          "Only true for unit vectors",
        ],
        answer: 1,
        explanation:
          "A transformation from 2D to 1D is described by a 1×2 matrix (where î and ĵ each land on the number line). That row of two numbers is exactly a 2D vector tipped over. Applying the matrix = dotting with that vector. This correspondence is duality.",
      },
    ],
    whatsNext: {
      title: "Cross Products & Geometry",
      blurb:
        "If the dot product collapses two vectors to a number, the cross product builds a new vector perpendicular to both. It's duality in reverse — and it computes areas and orientations in 3D.",
    },
  },
  {
    slug: "cross-products",
    number: 10,
    title: "Cross products",
    tagline: "Area, orientation, and the perpendicular vector",
    description:
      "In 2D, the cross product is the signed area of the parallelogram two vectors span — positive if v is right of w, negative otherwise. In 3D, it's a new vector: perpendicular to both, length = area, direction by the right-hand rule. And yes, it's computed with a determinant.",
    durationMin: 16,
    difficulty: "Advanced",
    componentKey: "cross-product",
    objectives: [
      {
        title: "Read the 2D cross product as signed area",
        detail:
          "v × w = the signed area of the parallelogram spanned by v and w. Positive when v is to the right of w; negative when it's to the left. Order matters: w × v = −(v × w).",
      },
      {
        title: "Compute it as a determinant",
        detail:
          "Put v and w as the columns of a 2×2 matrix and take its determinant. The determinant measures area scaling — and the unit square becomes exactly that parallelogram.",
      },
      {
        title: "Meet the 3D cross product",
        detail:
          "Two 3D vectors produce a new 3D vector: perpendicular to both, with length = the parallelogram's area, direction set by the right-hand rule.",
      },
      {
        title: "Use the î/ĵ/k̂ determinant trick",
        detail:
          "Write a 3×3 matrix with î, ĵ, k̂ in the first column and v, w in the others; compute its determinant. The result is a vector — the cross product. (Why this works is the next lesson.)",
      },
    ],
    quiz: [
      {
        id: "cp1",
        prompt:
          "In 2D, v × w equals…",
        options: [
          "The dot product of v and w",
          "The signed area of the parallelogram spanned by v and w",
          "The length of v plus the length of w",
          "The angle between v and w",
        ],
        answer: 1,
        explanation:
          "The 2D cross product is the signed area of the parallelogram the two vectors define. Sign tracks orientation: positive when v is right of w, negative when left.",
      },
      {
        id: "cp2",
        prompt:
          "How is w × v related to v × w?",
        options: [
          "They're equal",
          "w × v = −(v × w) — order matters; swapping flips the sign",
          "w × v = 2(v × w)",
          "w × v is always zero",
        ],
        answer: 1,
        explanation:
          "Swapping the order flips the orientation, so the sign reverses: w × v = −(v × w). This anti-commutativity is a defining feature of the cross product.",
      },
      {
        id: "cp3",
        prompt:
          "The 3D cross product v × w is a vector. What are its length and direction?",
        options: [
          "Length = |v| + |w|; direction = along v",
          "Length = area of the parallelogram; direction = perpendicular to both, by the right-hand rule",
          "Length = 1; direction = along w",
          "Length = |v|·|w|; direction = the bisector of v and w",
        ],
        answer: 1,
        explanation:
          "The cross product's length is the parallelogram's area; its direction is perpendicular to the plane of v and w, chosen by the right-hand rule (forefinger v, middle finger w, thumb = v × w).",
      },
      {
        id: "cp4",
        prompt:
          "Two vectors are parallel. What is their cross product?",
        options: [
          "A unit vector",
          "Zero — the parallelogram has zero area",
          "Equal to their dot product",
          "A vector along v",
        ],
        answer: 1,
        explanation:
          "Parallel vectors span a degenerate parallelogram of area zero, so the cross product is the zero vector. This is the standard test for parallelism in 3D.",
      },
    ],
    whatsNext: {
      title: "Cross Products via Linear Transformations",
      blurb:
        "Why does sticking î, ĵ, k̂ into a matrix and taking a determinant produce the right vector? It's duality again — the cross product is the dual of a volume-measuring transformation.",
    },
  },
  {
    slug: "cross-products-duality",
    number: 11,
    title: "Cross products in the light of linear transformations",
    tagline: "Why the determinant trick works",
    description:
      "The cross product's determinant computation looks like a notational accident. It's not. Define a transformation from 3D to the number line — the signed volume of a parallelepiped — and its dual vector IS v × w. Geometry meets computation through duality.",
    durationMin: 18,
    difficulty: "Advanced",
    componentKey: "cross-product-duality",
    objectives: [
      {
        title: "Define the volume transformation",
        detail:
          "Fix v and w; map any input (x,y,z) to the signed volume of the parallelepiped it forms with v and w. This is a linear function from 3D to the number line.",
      },
      {
        title: "Find its dual vector",
        detail:
          "By duality, every 3D→1D linear map corresponds to a unique vector p such that applying the map = dotting with p. For the volume transformation, p = v × w.",
      },
      {
        title: "Connect the computation to the geometry",
        detail:
          "Computationally, the dual vector's coordinates come from the determinant-with-î-ĵ-k̂ trick. Geometrically, p must be perpendicular to v and w with length = parallelogram area. Same vector, two paths.",
      },
      {
        title: "See why perpendicularity emerges",
        detail:
          "The volume = (area of v,w parallelogram) × (height of (x,y,z) perpendicular to that plane) = dot of (x,y,z) with a perpendicular vector of that area. That perpendicular vector is the dual — the cross product.",
      },
    ],
    quiz: [
      {
        id: "cpd1",
        prompt:
          "What linear transformation's dual vector is v × w?",
        options: [
          "The one mapping (x,y,z) to the signed volume of the parallelepiped formed by (x,y,z), v, and w",
          "The one mapping (x,y,z) to its own length",
          "The one rotating (x,y,z) by 90°",
          "The one projecting (x,y,z) onto v",
        ],
        answer: 0,
        explanation:
          "Fix v, w and map any (x,y,z) to the determinant of the 3×3 matrix with columns (x,y,z), v, w — i.e. the parallelepiped's signed volume. This is linear, so by duality it has a dual vector. That dual vector is v × w.",
      },
      {
        id: "cpd2",
        prompt:
          "Why does the dual vector end up perpendicular to v and w?",
        options: [
          "Because duality always produces perpendicular vectors",
          "Because the volume only depends on the component of (x,y,z) perpendicular to v and w's plane — so the dual points along that perpendicular direction",
          "Because the determinant is always perpendicular",
          "It's a coincidence",
        ],
        answer: 1,
        explanation:
          "The parallelepiped's volume = (base area) × (height perpendicular to the base). The height is exactly the component of (x,y,z) perpendicular to v and w's plane. So the transformation measures projection onto that perpendicular direction — which means its dual vector points that way.",
      },
      {
        id: "cpd3",
        prompt:
          "Why does putting î, ĵ, k̂ in the first column of the matrix produce the right answer?",
        options: [
          "It's pure notation — there's no real reason",
          "Computing the dual vector's coordinates means collecting the coefficients of x, y, z in the determinant — and labeling them with î, ĵ, k̂ packages those coefficients as a vector",
          "Because î, ĵ, k̂ are numbers",
          "It only works for unit vectors",
        ],
        answer: 1,
        explanation:
          "The dual vector p = (p₁, p₂, p₃) satisfies: dot(p, (x,y,z)) = the determinant. Expanding the determinant collects terms as p₁·x + p₂·y + p₃·z. Writing î, ĵ, k̂ in column 1 is just a way to label those coefficients as vector coordinates — packaging the algebra as a vector.",
      },
      {
        id: "cpd4",
        prompt:
          "Both the computational trick and the geometric reasoning produce a dual vector. Why must they be the same vector?",
        options: [
          "They don't have to be — it's a lucky coincidence",
          "Duality guarantees a UNIQUE dual vector for each linear transformation — so two approaches to the same transformation must yield the same vector",
          "Because both involve determinants",
          "Only when v and w are perpendicular",
        ],
        answer: 1,
        explanation:
          "Duality is a one-to-one correspondence: each linear transformation to the number line has exactly one dual vector. Since both the î-ĵ-k̂ computation and the geometric reasoning describe the dual of the SAME volume transformation, they must produce the same vector. That's why the trick works.",
      },
    ],
    whatsNext: {
      title: "Cramer's Rule, Geometrically",
      blurb:
        "A beautiful way to solve linear systems: read each coordinate of the input as a signed area (or volume) that scales uniformly with the transformation. Divide by det(A) and you've solved Ax = v.",
    },
  },
  {
    slug: "cramers-rule",
    number: 12,
    title: "Cramer's rule, explained geometrically",
    tagline: "Solving systems with areas and volumes",
    description:
      "Cramer's rule solves Ax = v by a gorgeous trick: each coordinate of the input is a signed area (or volume) that the transformation scales by det(A). Swap one column for v, take the determinant, divide — and you have that coordinate. Not the fastest method, but arguably the prettiest.",
    durationMin: 17,
    difficulty: "Advanced",
    componentKey: "cramers-rule",
    objectives: [
      {
        title: "Read coordinates as signed areas",
        detail:
          "The y-coordinate of a vector = the signed area of the parallelogram it spans with î. The x-coordinate = the area it spans with ĵ. A roundabout way to describe coordinates — but it survives transformations.",
      },
      {
        title: "See areas scale by det(A)",
        detail:
          "Under a transformation, every area scales by the same factor — the determinant. So the transformed parallelogram's area = det(A) × the original coordinate. Divide to recover the coordinate.",
      },
      {
        title: "Apply Cramer's rule",
        detail:
          "To find coordinate i: replace column i of A with the output vector v, take that determinant, divide by det(A). Each coordinate is a ratio of two determinants.",
      },
      {
        title: "Know its place",
        detail:
          "Cramer's rule is elegant but not efficient — Gaussian elimination is faster. Its value is conceptual: it ties determinants, areas, and linear systems into one picture.",
      },
    ],
    quiz: [
      {
        id: "cr1",
        prompt:
          "Cramer's rule expresses the solution to A·x = v in terms of…",
        options: [
          "Inverse matrices only",
          "Ratios of determinants — one det(A) in the denominator, and a swapped-column determinant per coordinate",
          "Gaussian elimination",
          "Dot products with the columns",
        ],
        answer: 1,
        explanation:
          "Each coordinate xᵢ = det(A with column i replaced by v) / det(A). The numerator is the scaled signed area/volume encoding that coordinate; dividing by det(A) undoes the scaling.",
      },
      {
        id: "cr2",
        prompt:
          "Why does the y-coordinate of a vector equal the signed area of the parallelogram it spans with î?",
        options: [
          "Because î has length 1, so the parallelogram's area = base (1) × height (the y-coordinate)",
          "It's a coincidence",
          "Because î is perpendicular to everything",
          "Because the determinant is always 1",
        ],
        answer: 0,
        explanation:
          "The parallelogram spanned by î = (1,0) and (x,y) has base 1 and perpendicular height |y|. Area = base × height = |y|. With orientation, the signed area is exactly y — a geometric encoding of the coordinate.",
      },
      {
        id: "cr3",
        prompt:
          "Under a transformation A, the parallelogram encoding the y-coordinate becomes…",
        options: [
          "Unchanged",
          "Scaled by det(A) — every area scales by the same factor",
          "Scaled by |v|",
          "Squished to zero",
        ],
        answer: 1,
        explanation:
          "The determinant is the universal area-scaling factor. So the transformed parallelogram has area = det(A) × (the original y-coordinate). That's the key: the coordinate is encoded in a quantity that scales predictably.",
      },
      {
        id: "cr4",
        prompt:
          "When does Cramer's rule fail?",
        options: [
          "Never — it always works",
          "When det(A) = 0 — you can't divide by zero (and the system has no unique solution anyway)",
          "When A is square",
          "When v is the zero vector",
        ],
        answer: 1,
        explanation:
          "Cramer's rule divides by det(A), so it needs det(A) ≠ 0. That's exactly the case where A has an inverse and the system has a unique solution. When det = 0, the transformation squished space and there's no unique input to recover.",
      },
    ],
    whatsNext: {
      title: "Change of Basis",
      blurb:
        "Every coordinate depends on a choice of basis. Next we'll see what it means to switch coordinate systems — and how matrices translate between the language of one basis and another.",
    },
  },
  {
    slug: "change-of-basis",
    number: 13,
    title: "Change of basis",
    tagline: "Speaking different coordinate languages",
    description:
      "Coordinates are not intrinsic — they depend on your basis vectors. Jennifer's (1,0) is your (2,1). The change-of-basis matrix translates her coordinates to yours; its inverse does the reverse. And A⁻¹MA re-expresses a transformation in her language.",
    durationMin: 19,
    difficulty: "Advanced",
    componentKey: "change-of-basis",
    objectives: [
      {
        title: "See coordinates as basis-dependent",
        detail:
          "The same vector has different coordinate descriptions under different bases. î, ĵ are one basis; any two non-collinear vectors form another — and the numbers change even though the vector doesn't.",
      },
      {
        title: "Translate with the change-of-basis matrix",
        detail:
          "Put Jennifer's basis vectors (written in YOUR coordinates) as columns of a matrix. Multiplying it by her coordinates yields yours — it transforms your grid into hers, translating her language to yours.",
      },
      {
        title: "Go the other way with the inverse",
        detail:
          "The inverse of the change-of-basis matrix translates your coordinates to hers — playing the transformation backward.",
      },
      {
        title: "Re-express transformations: A⁻¹MA",
        detail:
          "To describe a transformation M in Jennifer's language: translate in (A), apply M, translate out (A⁻¹). The sandwich A⁻¹MA is the same transformation, viewed from her coordinate system.",
      },
    ],
    quiz: [
      {
        id: "cb1",
        prompt:
          "Jennifer's basis vectors b₁, b₂ are (2,1) and (−1,1) in your coordinates. She describes a vector as (−1, 2). What is it in your coordinates?",
        options: ["(−4, 1)", "(1, 3)", "(−1, 2)", "(3, −1)"],
        answer: 0,
        explanation:
          "Her (−1, 2) means −1·b₁ + 2·b₂ = −1·(2,1) + 2·(−1,1) = (−2−2, −1+2) = (−4, 1). The change-of-basis matrix [b₁|b₂] times her coordinates gives yours.",
      },
      {
        id: "cb2",
        prompt:
          "The change-of-basis matrix with Jennifer's basis as columns translates…",
        options: [
          "Your coordinates to hers",
          "Her coordinates to yours — it transforms your grid into hers",
          "Nothing — it's just notation",
          "Vectors to numbers",
        ],
        answer: 1,
        explanation:
          "Geometrically it moves your basis (î, ĵ) to hers (b₁, b₂). Numerically it takes a vector described in her coordinates and outputs the same vector in yours. Grid transforms one way; the coordinate translation goes the other — that's the 'backwards' feeling.",
      },
      {
        id: "cb3",
        prompt:
          "To express a transformation M in Jennifer's coordinate system, you compute…",
        options: [
          "M · A",
          "A · M · A⁻¹",
          "A⁻¹ · M · A — translate in, apply M, translate out",
          "Just M — it's the same in any basis",
        ],
        answer: 2,
        explanation:
          "Start with her coordinates. Multiply by A (translate to yours), then M (apply the transformation), then A⁻¹ (translate back to hers). The sandwich A⁻¹MA is the same transformation, but written in her language.",
      },
      {
        id: "cb4",
        prompt:
          "Why does the change-of-basis matrix feel 'backwards' — transforming the grid one way but translating coordinates the other?",
        options: [
          "It's a bug in the notation",
          "Because it takes your MISconception (using her coordinates in your system) and transforms it into the vector she actually meant",
          "Because matrices commute",
          "It only works for square matrices",
        ],
        answer: 1,
        explanation:
          "When Jennifer says (−1,2), your first instinct is to plot (−1,2) on YOUR grid — a misconception. The matrix transforms that misconception into the vector she actually meant. The grid moves one way; the coordinate meaning translates the other.",
      },
    ],
    whatsNext: {
      title: "Eigenvectors & Eigenvalues",
      blurb:
        "Some special vectors survive a transformation on their own span — just stretched or squished. Finding these eigenvectors and their eigenvalues reveals what a transformation is really doing, independent of coordinates.",
    },
  },
  {
    slug: "eigenvectors",
    number: 14,
    title: "Eigenvectors and eigenvalues",
    tagline: "Vectors that stay on their own span",
    description:
      "Most vectors get knocked off their span during a transformation. Eigenvectors don't — they just stretch or squish. The eigenvalue is the scaling factor. Finding them (Av = λv) reveals the transformation's essence, independent of coordinates — and an eigenbasis diagonalizes the matrix.",
    durationMin: 20,
    difficulty: "Advanced",
    componentKey: "eigenvectors",
    objectives: [
      {
        title: "Spot an eigenvector",
        detail:
          "An eigenvector stays on its own line (span) during the transformation — only stretched or squished, never rotated off. The eigenvalue λ is the scaling factor (positive, negative, or fractional).",
      },
      {
        title: "Read the equation Av = λv",
        detail:
          "Applying A to an eigenvector v equals scaling v by λ. This is the symbolic heart: a matrix-vector product that reduces to a scalar multiplication.",
      },
      {
        title: "Find eigenvalues via det(A − λI) = 0",
        detail:
          "Rearrange to (A − λI)v = 0. For a non-zero v to exist, the transformation must squish space — so det(A − λI) = 0. Solve for λ.",
      },
      {
        title: "Use an eigenbasis to diagonalize",
        detail:
          "If eigenvectors span the space, use them as a new basis. In that basis the matrix is diagonal (just the eigenvalues) — and powers become trivial.",
      },
    ],
    quiz: [
      {
        id: "e1",
        prompt:
          "An eigenvector of a transformation is a vector that…",
        options: [
          "Becomes the zero vector",
          "Stays on its own span — only stretched or squished, not rotated off",
          "Has length 1",
          "Points along the x-axis",
        ],
        answer: 1,
        explanation:
          "Eigenvectors remain on their own line through the origin; the transformation only scales them (by the eigenvalue λ). They don't get knocked off their span.",
      },
      {
        id: "e2",
        prompt:
          "The eigenvalue equation is Av = λv. What do A, v, and λ represent?",
        options: [
          "A = area, v = vector, λ = length",
          "A = the transformation matrix, v = an eigenvector, λ = its eigenvalue (the scaling factor)",
          "A = angle, v = volume, λ = limit",
          "A = axis, v = value, λ = lambda-function",
        ],
        answer: 1,
        explanation:
          "A is the matrix representing the transformation. v is an eigenvector. λ is the eigenvalue — the factor by which A stretches (or squishes, or flips) v. Av = λv says: applying A to v is the same as just scaling v by λ.",
      },
      {
        id: "e3",
        prompt:
          "To find eigenvalues, you solve det(A − λI) = 0. Why must the determinant be zero?",
        options: [
          "Because eigenvalues are always zero",
          "Because (A − λI)v = 0 needs a non-zero v, which requires the transformation to squish space — and squishing means det = 0",
          "Because the identity matrix has determinant zero",
          "It's just a convention",
        ],
        answer: 1,
        explanation:
          "From Av = λv you get (A − λI)v = 0. For a non-zero v to satisfy this, A − λI must squish space to a lower dimension (collapsing v onto zero). And a transformation squishes iff its determinant is zero. So det(A − λI) = 0 finds the λ values that allow non-zero eigenvectors.",
      },
      {
        id: "e4",
        prompt:
          "A 90° rotation in 2D has no (real) eigenvectors. Why?",
        options: [
          "Rotations can't have eigenvectors in any dimension",
          "Every vector gets rotated off its span — no vector stays on its own line (except the zero vector)",
          "Its determinant is zero",
          "It's not a linear transformation",
        ],
        answer: 1,
        explanation:
          "A 90° rotation turns every vector away from its original line — nothing stays on its span. Algebraically, the characteristic polynomial (λ² + 1) has only imaginary roots (±i), signaling no real eigenvectors. (In 3D, though, a rotation DOES have an eigenvector: the axis of rotation.)",
      },
    ],
    whatsNext: {
      title: "A Quick Trick for Eigenvalues",
      blurb:
        "For 2×2 matrices, there's a faster way to find eigenvalues than the full characteristic polynomial: read the trace (sum of eigenvalues) and determinant (product) straight off the matrix, then use the mean-product formula.",
    },
  },
  {
    slug: "eigenvalue-trick",
    number: 15,
    title: "A quick trick for computing eigenvalues",
    tagline: "Mean and product, straight off the matrix",
    description:
      "For 2×2 matrices, skip the characteristic polynomial. The eigenvalues' mean = trace/2; their product = determinant. So λ = trace/2 ± √((trace/2)² − det). Three facts, one formula — read eigenvalues straight off the matrix.",
    durationMin: 13,
    difficulty: "Advanced",
    componentKey: "eigenvalue-trick",
    objectives: [
      {
        title: "Know the trace = sum of eigenvalues",
        detail:
          "The trace (sum of diagonal entries) equals the sum of the eigenvalues. So the mean of the eigenvalues = mean of the diagonal entries.",
      },
      {
        title: "Know the determinant = product of eigenvalues",
        detail:
          "The determinant equals the product of the eigenvalues — both describe how the transformation scales area overall.",
      },
      {
        title: "Recover two numbers from mean and product",
        detail:
          "If two numbers have mean m and product p, they are m ± √(m² − p). This is the difference-of-squares formula in disguise.",
      },
      {
        title: "Apply it: λ = trace/2 ± √((trace/2)² − det)",
        detail:
          "Read the trace and determinant off the matrix, plug in, and the eigenvalues fall out — no characteristic polynomial needed. Faster and more meaningful for 2×2 matrices.",
      },
    ],
    quiz: [
      {
        id: "et1",
        prompt:
          "The trace of a 2×2 matrix (sum of diagonal entries) equals…",
        options: [
          "The product of the eigenvalues",
          "The sum of the eigenvalues",
          "The determinant",
          "The largest eigenvalue",
        ],
        answer: 1,
        explanation:
          "The trace = sum of the eigenvalues. So the mean of the eigenvalues = mean of the two diagonal entries. This is one of the two facts behind the trick.",
      },
      {
        id: "et2",
        prompt:
          "The determinant of a 2×2 matrix equals…",
        options: [
          "The sum of the eigenvalues",
          "The product of the eigenvalues",
          "The trace",
          "Always 1",
        ],
        answer: 1,
        explanation:
          "The determinant = product of the eigenvalues. This makes sense: the determinant is the area-scaling factor, and the eigenvalues are the scaling factors along the eigenvector directions — their product is the overall area scale.",
      },
      {
        id: "et3",
        prompt:
          "For a matrix with trace 10 and determinant 16, what are the eigenvalues?",
        options: [
          "2 and 8 (mean 5, product 16; 5 ± √(25−16) = 5 ± 3)",
          "4 and 6",
          "1 and 16",
          "5 and 5",
        ],
        answer: 0,
        explanation:
          "Mean = trace/2 = 5. Product = det = 16. So λ = 5 ± √(25 − 16) = 5 ± 3 = 2 and 8. Check: 2+8 = 10 = trace ✓, 2·8 = 16 = det ✓.",
      },
      {
        id: "et4",
        prompt:
          "Why is the mean-product formula more meaningful than the quadratic formula for eigenvalues?",
        options: [
          "It's shorter to write",
          "Each term carries geometric meaning — trace and determinant are readable straight off the matrix, no intermediate polynomial",
          "It works for matrices of any size",
          "It's more accurate",
        ],
        answer: 1,
        explanation:
          "The real advantage: you read the mean (trace/2) and product (det) directly off the matrix without setting up the characteristic polynomial. Each term has geometric meaning, so the computation reinforces understanding rather than being rote symbol-pushing. It's the quadratic formula reframed around meaningful quantities.",
      },
    ],
    whatsNext: {
      title: "Abstract Vector Spaces",
      blurb:
        "Vectors aren't just arrows or lists of numbers — functions are vectors too. The derivative is a linear transformation. The 8 axioms define what 'vector-like' means, and the whole theory generalizes far beyond geometry.",
    },
  },
  {
    slug: "abstract-vector-spaces",
    number: 16,
    title: "Abstract vector spaces",
    tagline: "Functions are vectors too",
    description:
      "What is a vector, really? Not just an arrow or a list of numbers — anything you can add and scale (following the rules) is a vector. Functions qualify: the derivative is a linear transformation, complete with its own matrix. The 8 axioms define the abstract notion of a vector space.",
    durationMin: 22,
    difficulty: "Advanced",
    componentKey: "abstract-vector-spaces",
    objectives: [
      {
        title: "See functions as vectors",
        detail:
          "You can add two functions (f+g)(x) = f(x)+g(x) and scale one (c·f)(x) = c·f(x). That's the same structure as adding and scaling arrows — just with infinitely many 'coordinates'.",
      },
      {
        title: "Recognize the derivative as linear",
        detail:
          "The derivative turns one function into another, and it's linear: (f+g)' = f' + g' and (c·f)' = c·f'. It's a linear transformation — on the vector space of functions.",
      },
      {
        title: "Represent the derivative as a matrix",
        detail:
          "Using the basis {1, x, x², x³, …} for polynomials, the derivative becomes an infinite matrix with 1, 2, 3, … counting down an offset diagonal. Matrix-vector multiplication IS differentiation.",
      },
      {
        title: "Understand the 8 axioms",
        detail:
          "A vector space is any set with sensible notions of addition and scaling satisfying 8 axioms. Arrows, lists of numbers, functions, and more all qualify — so the whole theory of linear algebra applies to all of them.",
      },
    ],
    quiz: [
      {
        id: "av1",
        prompt:
          "How do you add two functions f and g?",
        options: [
          "f(g(x))",
          "(f+g)(x) = f(x) + g(x) — add their outputs at each input",
          "f(x) · g(x)",
          "You can't add functions",
        ],
        answer: 1,
        explanation:
          "The sum function f+g is defined pointwise: at each input x, its value is f(x) + g(x). This mirrors adding vectors coordinate-by-coordinate — just with infinitely many 'coordinates' (one per input).",
      },
      {
        id: "av2",
        prompt:
          "Why is the derivative a linear transformation?",
        options: [
          "Because it produces straight lines",
          "Because (f+g)' = f' + g' and (c·f)' = c·f' — it preserves addition and scaling",
          "Because it's a matrix",
          "Because derivatives are always 1",
        ],
        answer: 1,
        explanation:
          "Linearity means additivity and scaling: the derivative of a sum is the sum of derivatives, and the derivative of a scaled function is the scaled derivative. These two properties — the same ones that define linear transformations on arrows — make the derivative linear on the space of functions.",
      },
      {
        id: "av3",
        prompt:
          "Using the basis {1, x, x², x³, …} for polynomials, the derivative acts as a matrix that…",
        options: [
          "Has 1s on the main diagonal",
          "Has 1, 2, 3, … counting down an offset diagonal (the derivative of xⁿ is n·xⁿ⁻¹)",
          "Is all zeros",
          "Is 2×2",
        ],
        answer: 1,
        explanation:
          "The derivative of xⁿ is n·xⁿ⁻¹, so the n-th basis function maps to n times the (n−1)-th. That puts 1, 2, 3, … on the sub-diagonal (one below the main). Matrix-vector multiplication with a polynomial's coordinates literally performs differentiation.",
      },
      {
        id: "av4",
        prompt:
          "What is a 'vector space' in the abstract, axiomatic sense?",
        options: [
          "Only the set of arrows in 2D or 3D",
          "Only lists of real numbers",
          "Any set with notions of addition and scaling that satisfy the 8 axioms — arrows, lists, functions, and more all qualify",
          "A space that contains vectors of length 1",
        ],
        answer: 2,
        explanation:
          "A vector space is defined by 8 axioms that addition and scaling must satisfy. Arrows, lists of numbers, functions, and many other objects all qualify. By proving results in terms of the axioms, the entire theory of linear algebra applies to all vector spaces at once — that's the power of abstraction.",
      },
    ],
    whatsNext: {
      title: "Course Complete",
      blurb:
        "You've built intuition for the entire essence of linear algebra — from vectors through transformations, determinants, eigenvalues, and abstract spaces. The foundation is yours; the applications are endless.",
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
