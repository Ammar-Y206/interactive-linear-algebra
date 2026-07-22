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
