"use client";

/**
 * page-order
 * ----------------------------------------------------------------
 * Linear ordering of all navigable pages for prev/next navigation
 * (keyboard arrows, edge buttons). Order is:
 *   introduction → lesson 1 → lesson 2 → … → completion
 *
 * Keeping this in one place means keyboard nav, the completion page's
 * "continue" button, and the shell's arrow handling all agree.
 * ----------------------------------------------------------------
 */

import { LESSONS } from "@/lib/course-config";

/** Ordered list of every page slug, introduction-first, completion-last. */
export const PAGE_ORDER: string[] = [
  "introduction",
  ...LESSONS.map((l) => l.slug),
  "completion",
];

export function getNextPage(slug: string): string | undefined {
  const i = PAGE_ORDER.indexOf(slug);
  if (i < 0 || i >= PAGE_ORDER.length - 1) return undefined;
  return PAGE_ORDER[i + 1];
}

export function getPrevPage(slug: string): string | undefined {
  const i = PAGE_ORDER.indexOf(slug);
  if (i <= 0) return undefined;
  return PAGE_ORDER[i - 1];
}

export function hasPrevPage(slug: string): boolean {
  return PAGE_ORDER.indexOf(slug) > 0;
}

export function hasNextPage(slug: string): boolean {
  const i = PAGE_ORDER.indexOf(slug);
  return i >= 0 && i < PAGE_ORDER.length - 1;
}
