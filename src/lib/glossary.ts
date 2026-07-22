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
