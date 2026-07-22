/**
 * glossary.ts
 * ----------------------------------------------------------------
 * A searchable index of linear-algebra terms used across the course.
 * Each entry links a term to a plain-language definition and the
 * lesson(s) where it first appears.
 *
 * Append new terms as lessons are added. Existing entries are
 * immutable (lessons reference them by `term`).
 * ----------------------------------------------------------------
 */

import { LESSONS } from "./course-config";

export interface GlossaryEntry {
  term: string;
  /** short definition shown in cards / search */
  definition: string;
  /** the slug of the lesson where this term is introduced */
  lessonSlug: string;
  /** optional related terms, by `term` */
  related?: string[];
  /** category for color-coding */
  category: "Vector" | "Operation" | "Coordinate" | "Concept";
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "Vector",
    definition:
      "The fundamental building block of linear algebra. Pictured as an arrow rooted at the origin, described numerically as an ordered list of numbers (its coordinates).",
    lessonSlug: "vectors",
    related: ["Coordinate", "Origin"],
    category: "Vector",
  },
  {
    term: "Scalar",
    definition:
      "A plain number whose job is to scale a vector — stretch it, squish it, or flip it. In linear algebra, 'scalar' and 'number' are used almost interchangeably.",
    lessonSlug: "vectors",
    related: ["Scalar multiplication"],
    category: "Concept",
  },
  {
    term: "Coordinate",
    definition:
      "A pair (x, y) or triplet (x, y, z) of numbers that gives instructions for getting from the origin to a vector's tip: first along x, then along y, then along z.",
    lessonSlug: "vectors",
    related: ["Vector", "Origin"],
    category: "Coordinate",
  },
  {
    term: "Origin",
    definition:
      "The center of the coordinate system where the axes cross. In linear algebra, vectors are almost always rooted here — their tails pinned to (0, 0).",
    lessonSlug: "vectors",
    related: ["Coordinate", "Vector"],
    category: "Coordinate",
  },
  {
    term: "Vector addition",
    definition:
      "Combine two vectors by placing the second's tail at the first's tip; the sum runs from the origin to the final tip. Numerically, add components term-by-term.",
    lessonSlug: "vectors",
    related: ["Vector", "Tip-to-tail"],
    category: "Operation",
  },
  {
    term: "Scalar multiplication",
    definition:
      "Multiply a vector by a number to stretch, squish, or reverse it. Each component is multiplied by that number.",
    lessonSlug: "vectors",
    related: ["Scalar", "Vector"],
    category: "Operation",
  },
  {
    term: "Tip-to-tail",
    definition:
      "The geometric picture of vector addition: move the second vector so its tail sits at the first's tip, then draw the sum from origin to final tip.",
    lessonSlug: "vectors",
    related: ["Vector addition"],
    category: "Concept",
  },
  {
    term: "Dimension",
    definition:
      "The number of components a vector has — equivalently, the number of independent directions needed to describe it. A 2D vector lives in the plane; a 3D vector lives in space.",
    lessonSlug: "vectors",
    related: ["Coordinate"],
    category: "Concept",
  },
  {
    term: "Basis vectors",
    definition:
      "A set of vectors that every other vector is built from via linear combinations. In the xy-plane, î = (1,0) and ĵ = (0,1) are the standard basis — but any two non-collinear vectors form a valid basis.",
    lessonSlug: "span-linear-combinations",
    related: ["î (i-hat)", "ĵ (j-hat)", "Basis", "Linear combination"],
    category: "Concept",
  },
  {
    term: "î (i-hat)",
    definition:
      "The unit vector pointing along the positive x-axis: (1, 0). One of the two standard basis vectors of the xy-plane.",
    lessonSlug: "span-linear-combinations",
    related: ["ĵ (j-hat)", "Basis vectors"],
    category: "Vector",
  },
  {
    term: "ĵ (j-hat)",
    definition:
      "The unit vector pointing along the positive y-axis: (0, 1). One of the two standard basis vectors of the xy-plane.",
    lessonSlug: "span-linear-combinations",
    related: ["î (i-hat)", "Basis vectors"],
    category: "Vector",
  },
  {
    term: "Linear combination",
    definition:
      "Scaling each of several vectors by a number and adding the results: a·v + b·w + … . The single operation that generates every vector reachable from a given set.",
    lessonSlug: "span-linear-combinations",
    related: ["Scalar multiplication", "Vector addition", "Span"],
    category: "Operation",
  },
  {
    term: "Span",
    definition:
      "The set of every vector reachable by linear combinations of a given set of vectors. Two non-collinear 2D vectors span the whole plane; two collinear ones span only a line.",
    lessonSlug: "span-linear-combinations",
    related: ["Linear combination", "Linearly dependent"],
    category: "Concept",
  },
  {
    term: "Linearly dependent",
    definition:
      "Describes a set of vectors where at least one is redundant — it already sits in the span of the others, so removing it doesn't shrink the span. Equivalently, one can be written as a linear combination of the rest.",
    lessonSlug: "span-linear-combinations",
    related: ["Linearly independent", "Span"],
    category: "Concept",
  },
  {
    term: "Linearly independent",
    definition:
      "Describes a set of vectors where each one genuinely adds a new direction — none can be written as a linear combination of the others. Removing any would shrink the span.",
    lessonSlug: "span-linear-combinations",
    related: ["Linearly dependent", "Basis vectors"],
    category: "Concept",
  },
  {
    term: "Basis",
    definition:
      "Technically: a set of linearly independent vectors that span a space. A minimal building set — enough vectors to reach everywhere, with none wasted.",
    lessonSlug: "span-linear-combinations",
    related: ["Basis vectors", "Linearly independent", "Span"],
    category: "Concept",
  },
  {
    term: "Transformation",
    definition:
      "A function that takes vectors as input and returns vectors as output. Visualized as movement: each input vector travels to its output location, and the whole grid morphs along with it.",
    lessonSlug: "linear-transformations",
    related: ["Linear transformation", "Matrix"],
    category: "Concept",
  },
  {
    term: "Linear transformation",
    definition:
      "A transformation where grid lines stay straight, parallel, and evenly spaced, and the origin stays fixed. Completely determined by where î and ĵ land.",
    lessonSlug: "linear-transformations",
    related: ["Transformation", "Matrix", "Basis vectors"],
    category: "Concept",
  },
  {
    term: "Matrix",
    definition:
      "A grid of numbers that describes a linear transformation. In 2D, a 2×2 matrix's first column is where î lands and its second column is where ĵ lands — four numbers, the whole transformation.",
    lessonSlug: "linear-transformations",
    related: ["Linear transformation", "Matrix-vector multiplication"],
    category: "Concept",
  },
  {
    term: "Matrix-vector multiplication",
    definition:
      "Applying a matrix's transformation to a vector (x, y): the result is x·(first column) + y·(second column) — a linear combination of the transformed basis vectors.",
    lessonSlug: "linear-transformations",
    related: ["Matrix", "Linear combination"],
    category: "Operation",
  },
  {
    term: "Shear",
    definition:
      "A linear transformation that pushes space sideways: î stays put (first column (1,0)) while ĵ tilts, e.g. to (1,1). Vertical lines slant but stay parallel and evenly spaced.",
    lessonSlug: "linear-transformations",
    related: ["Linear transformation", "Matrix"],
    category: "Concept",
  },
  {
    term: "Composition",
    definition:
      "Applying one transformation then another. The overall effect is itself a linear transformation, whose matrix is the product of the two — read right-to-left, since the rightmost matrix acts first.",
    lessonSlug: "matrix-multiplication",
    related: ["Matrix multiplication", "Linear transformation"],
    category: "Concept",
  },
  {
    term: "Matrix multiplication",
    definition:
      "The matrix representing a composition. Column 1 of the product = left matrix × column 1 of the right matrix (where î ends up); column 2 = left × column 2 (where ĵ ends up).",
    lessonSlug: "matrix-multiplication",
    related: ["Composition", "Matrix", "Matrix-vector multiplication"],
    category: "Operation",
  },
  {
    term: "Non-commutative",
    definition:
      "Matrix multiplication is NOT commutative: A·B ≠ B·A in general. A shear-then-rotate usually differs from rotate-then-shear — you can see it by tracking î and ĵ.",
    lessonSlug: "matrix-multiplication",
    related: ["Matrix multiplication", "Composition"],
    category: "Concept",
  },
  {
    term: "Associative",
    definition:
      "Matrix multiplication IS associative: (A·B)·C = A·(B·C). Geometrically obvious — both sides mean 'apply C, then B, then A'. The grouping changes the computation, not the sequence.",
    lessonSlug: "matrix-multiplication",
    related: ["Matrix multiplication", "Composition"],
    category: "Concept",
  },
  {
    term: "k̂ (k-hat)",
    definition:
      "The unit vector pointing along the positive z-axis: (0, 0, 1). The third standard basis vector of 3D space, joining î and ĵ.",
    lessonSlug: "3d-transformations",
    related: ["î (i-hat)", "ĵ (j-hat)", "Basis vectors"],
    category: "Vector",
  },
  {
    term: "3D linear transformation",
    definition:
      "A linear transformation of 3D space — grid lines stay parallel and evenly spaced, origin fixed. Described by where î, ĵ, and k̂ each land: nine numbers, packed as a 3×3 matrix.",
    lessonSlug: "3d-transformations",
    related: ["Linear transformation", "3×3 matrix", "k̂ (k-hat)"],
    category: "Concept",
  },
  {
    term: "3×3 matrix",
    definition:
      "A grid of nine numbers describing a 3D linear transformation. Its three columns are where î, ĵ, and k̂ land. Multiplying it by a 3-vector (x,y,z) gives x·(col 1) + y·(col 2) + z·(col 3).",
    lessonSlug: "3d-transformations",
    related: ["Matrix", "3D linear transformation"],
    category: "Concept",
  },
  {
    term: "Determinant",
    definition:
      "The single number measuring how a linear transformation scales area (2D) or volume (3D). det=3 triples areas; det=0 means a dimension collapsed; det<0 means space was flipped.",
    lessonSlug: "determinant",
    related: ["Linear transformation", "Orientation", "Linearly dependent"],
    category: "Concept",
  },
  {
    term: "Orientation",
    definition:
      "The 'handedness' of space. A transformation inverts orientation when it flips space over (e.g. ĵ crosses to the other side of î). A flipped orientation gives a negative determinant.",
    lessonSlug: "determinant",
    related: ["Determinant", "Right-hand rule"],
    category: "Concept",
  },
  {
    term: "Parallelepiped",
    definition:
      "The slanted 3D box a unit cube becomes after a linear transformation. Its volume equals the (absolute value of the) determinant of the transformation.",
    lessonSlug: "determinant",
    related: ["Determinant", "3D linear transformation"],
    category: "Concept",
  },
  {
    term: "Right-hand rule",
    definition:
      "A way to read 3D orientation: point the right hand's fingers along î, ĵ, k̂ in turn. If the thumb still points along k̂ after a transformation, orientation is preserved (det>0); if you'd need your left hand, it's flipped (det<0).",
    lessonSlug: "determinant",
    related: ["Orientation", "Determinant"],
    category: "Concept",
  },
  {
    term: "Linear system of equations",
    definition:
      "A set of equations where each variable is only scaled by a constant and the scaled variables are only added. Packaged as A·x = v: find the input vector x that the transformation A sends to v.",
    lessonSlug: "inverse-matrices",
    related: ["Inverse matrix", "Matrix-vector multiplication"],
    category: "Concept",
  },
  {
    term: "Inverse matrix",
    definition:
      "The transformation A⁻¹ that undoes A: A⁻¹·A = I (the identity). Exists iff det(A) ≠ 0. Solving A·x = v is just x = A⁻¹·v — play the transformation in reverse.",
    lessonSlug: "inverse-matrices",
    related: ["Identity matrix", "Determinant", "Linear system of equations"],
    category: "Concept",
  },
  {
    term: "Identity matrix",
    definition:
      "The matrix that does nothing — leaves every vector unchanged. In 2D it has columns (1,0) and (0,1). A⁻¹·A = I is the algebraic statement of 'A⁻¹ undoes A'.",
    lessonSlug: "inverse-matrices",
    related: ["Inverse matrix"],
    category: "Concept",
  },
  {
    term: "Rank",
    definition:
      "The number of dimensions in a transformation's output (its column space). Full rank means no dimension was lost; rank 1 means everything landed on a line.",
    lessonSlug: "inverse-matrices",
    related: ["Column space", "Determinant"],
    category: "Concept",
  },
  {
    term: "Column space",
    definition:
      "The span of a matrix's columns — the set of all vectors it can possibly output. Tells you which right-hand sides v are even reachable by A·x.",
    lessonSlug: "inverse-matrices",
    related: ["Rank", "Span", "Matrix"],
    category: "Concept",
  },
  {
    term: "Null space",
    definition:
      "The set of input vectors that land on the origin (zero). For full-rank matrices it's just {0}; when a dimension collapses, a whole line or plane of inputs gets crushed to zero.",
    lessonSlug: "inverse-matrices",
    related: ["Column space", "Rank", "Span"],
    category: "Concept",
  },
  {
    term: "Nonsquare matrix",
    definition:
      "An m×n matrix with m ≠ n. It maps between spaces of different dimension: n columns = input dimension, m rows = output dimension. A 3×2 lifts 2D→3D; a 2×3 projects 3D→2D.",
    lessonSlug: "nonsquare-matrices",
    related: ["Matrix", "Column space"],
    category: "Concept",
  },
  {
    term: "Full rank (non-square)",
    definition:
      "A non-square matrix is full rank when its column space's dimension equals its input dimension — no information lost, even though input and output dimensions differ.",
    lessonSlug: "nonsquare-matrices",
    related: ["Rank", "Nonsquare matrix"],
    category: "Concept",
  },
  {
    term: "Dot product",
    definition:
      "Pair the coordinates of two vectors, multiply each pair, sum: (a,b)·(c,d) = ac+bd. Geometrically = |projection of w onto v| × |v|. Zero when perpendicular.",
    lessonSlug: "dot-products",
    related: ["Projection", "Duality"],
    category: "Operation",
  },
  {
    term: "Projection",
    definition:
      "Dropping a vector onto the line through another, keeping only the component along that direction. The dot product computes (projection length) × (the other vector's length).",
    lessonSlug: "dot-products",
    related: ["Dot product"],
    category: "Concept",
  },
  {
    term: "Duality",
    definition:
      "The surprising correspondence between vectors and certain transformations: any linear map from vectors to numbers is encoded by a 1×n matrix, which is just a vector tipped on its side. Applying it = taking a dot product.",
    lessonSlug: "dot-products",
    related: ["Dot product", "Linear transformation"],
    category: "Concept",
  },
  {
    term: "Cross product (2D)",
    definition:
      "The signed area of the parallelogram spanned by two 2D vectors v and w. Computed as the determinant of the matrix with columns v, w. Positive when v is right of w; swaps sign under order change.",
    lessonSlug: "cross-products",
    related: ["Determinant", "Parallelogram", "Cross product (3D)"],
    category: "Operation",
  },
  {
    term: "Cross product (3D)",
    definition:
      "A new 3D vector from two 3D vectors v and w: perpendicular to both, with length = the parallelogram's area, direction by the right-hand rule. Computed via the î/ĵ/k̂ determinant trick.",
    lessonSlug: "cross-products",
    related: ["Cross product (2D)", "Right-hand rule", "Parallelogram"],
    category: "Operation",
  },
  {
    term: "Right-hand rule (cross product)",
    definition:
      "Point the right hand's forefinger along v, middle finger along w; the thumb points along v × w. Picks the perpendicular direction consistent with orientation.",
    lessonSlug: "cross-products",
    related: ["Cross product (3D)", "Orientation"],
    category: "Concept",
  },
  {
    term: "Parallelogram",
    definition:
      "The four-sided shape spanned by two vectors (copy each, translate to the other's tip). Its area is the absolute value of the 2D cross product / determinant of the two vectors.",
    lessonSlug: "cross-products",
    related: ["Cross product (2D)", "Determinant"],
    category: "Concept",
  },
  {
    term: "Parallelepiped",
    definition:
      "The slanted 3D box spanned by three vectors. Its signed volume is the determinant of the 3×3 matrix with those vectors as columns — the geometric heart of the 3D cross product's duality.",
    lessonSlug: "cross-products-duality",
    related: ["Determinant", "Cross product (3D)", "Duality"],
    category: "Concept",
  },
  {
    term: "Dual vector",
    definition:
      "The unique vector p such that a linear transformation to the number line equals dotting with p. For the parallelepiped-volume transformation, the dual vector is v × w.",
    lessonSlug: "cross-products-duality",
    related: ["Duality", "Cross product (3D)"],
    category: "Concept",
  },
  {
    term: "Cramer's rule",
    definition:
      "A method to solve A·x = v: each coordinate xᵢ = det(A with column i replaced by v) / det(A). Reads coordinates as signed areas that scale by det(A). Elegant but slower than Gaussian elimination.",
    lessonSlug: "cramers-rule",
    related: ["Determinant", "Linear system of equations"],
    category: "Concept",
  },
  {
    term: "Orthonormal transformation",
    definition:
      "A transformation that preserves dot products (and thus lengths and angles) — rotations and reflections. Its columns are perpendicular unit vectors. Solving systems with them is trivial: just dot with each column.",
    lessonSlug: "cramers-rule",
    related: ["Linear transformation", "Dot product"],
    category: "Concept",
  },
  {
    term: "Change of basis",
    definition:
      "Switching the coordinate system used to describe vectors. The change-of-basis matrix (columns = new basis in old coordinates) translates new coordinates to old; its inverse does the reverse.",
    lessonSlug: "change-of-basis",
    related: ["Basis vectors", "Coordinate", "Matrix"],
    category: "Concept",
  },
  {
    term: "Change-of-basis matrix",
    definition:
      "The matrix whose columns are the new basis vectors (written in old coordinates). Multiplied by new-basis coordinates, it yields old-basis coordinates. Its inverse translates the other way.",
    lessonSlug: "change-of-basis",
    related: ["Change of basis", "Inverse matrix"],
    category: "Concept",
  },
  {
    term: "Similarity transform",
    definition:
      "The sandwich A⁻¹MA: re-expresses a transformation M in a new basis. Same transformation, different coordinate language. Used to diagonalize matrices via an eigenbasis.",
    lessonSlug: "change-of-basis",
    related: ["Change of basis", "Eigenbasis"],
    category: "Operation",
  },
  {
    term: "Eigenvector",
    definition:
      "A non-zero vector that stays on its own span during a transformation — only stretched or squished (by its eigenvalue λ), never rotated off. Satisfies Av = λv.",
    lessonSlug: "eigenvectors",
    related: ["Eigenvalue", "Linear transformation"],
    category: "Vector",
  },
  {
    term: "Eigenvalue",
    definition:
      "The scalar λ by which an eigenvector v is scaled: Av = λv. Can be positive (stretch), negative (flip), fractional (squish), or zero (collapse to origin).",
    lessonSlug: "eigenvectors",
    related: ["Eigenvector"],
    category: "Concept",
  },
  {
    term: "Characteristic polynomial",
    definition:
      "det(A − λI) as a polynomial in λ. Its roots are the eigenvalues of A. For 2×2 matrices, the mean-product trick computes them faster.",
    lessonSlug: "eigenvectors",
    related: ["Eigenvalue", "Determinant"],
    category: "Concept",
  },
  {
    term: "Eigenbasis",
    definition:
      "A basis made entirely of eigenvectors. In that basis the matrix becomes diagonal (just the eigenvalues) — making operations like matrix powers trivial. Not every transformation has one (e.g. 90° rotations don't).",
    lessonSlug: "eigenvectors",
    related: ["Eigenvector", "Diagonal matrix", "Change of basis"],
    category: "Concept",
  },
  {
    term: "Diagonal matrix",
    definition:
      "A matrix with non-zero entries only on the main diagonal. In an eigenbasis, the transformation matrix is diagonal — with eigenvalues down the diagonal. Powers are trivial: just raise each diagonal entry to the power.",
    lessonSlug: "eigenvectors",
    related: ["Eigenbasis", "Eigenvalue"],
    category: "Concept",
  },
  {
    term: "Trace",
    definition:
      "The sum of a matrix's diagonal entries. Equals the sum of the eigenvalues. Half the trace is the mean of the eigenvalues — key to the quick-computation trick.",
    lessonSlug: "eigenvalue-trick",
    related: ["Eigenvalue", "Determinant"],
    category: "Concept",
  },
  {
    term: "Mean-product formula",
    definition:
      "If two numbers have mean m and product p, they are m ± √(m² − p). Applied to eigenvalues: λ = trace/2 ± √((trace/2)² − det). Reads eigenvalues straight off a 2×2 matrix.",
    lessonSlug: "eigenvalue-trick",
    related: ["Eigenvalue", "Trace", "Determinant"],
    category: "Operation",
  },
  {
    term: "Vector space",
    definition:
      "Any set with sensible notions of addition and scalar multiplication satisfying 8 axioms. Arrows, lists of numbers, functions, and more all qualify — so the entire theory of linear algebra applies to all of them.",
    lessonSlug: "abstract-vector-spaces",
    related: ["Vector", "Linear transformation"],
    category: "Concept",
  },
  {
    term: "Linear operator",
    definition:
      "A linear transformation on a function space. The derivative is the classic example: (f+g)' = f'+g' and (c·f)' = c·f'. Same two properties as linear transformations on arrows.",
    lessonSlug: "abstract-vector-spaces",
    related: ["Linear transformation", "Vector space"],
    category: "Concept",
  },
  {
    term: "Axioms (vector space)",
    definition:
      "The 8 rules addition and scaling must satisfy for a set to be a vector space: associativity, commutativity, identity, inverses, distributivity, compatibility. An interface between the theory and any new 'vector-like' object.",
    lessonSlug: "abstract-vector-spaces",
    related: ["Vector space"],
    category: "Concept",
  },
];

/** Resolve the lesson number for a glossary entry. */
export function lessonNumberFor(slug: string): number | undefined {
  return LESSONS.find((l) => l.slug === slug)?.number;
}

/** Case-insensitive search over the glossary. */
export function searchGlossary(query: string): GlossaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return GLOSSARY;
  return GLOSSARY.filter(
    (e) =>
      e.term.toLowerCase().includes(q) ||
      e.definition.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
  );
}
