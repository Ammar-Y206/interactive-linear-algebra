"use client";

/**
 * lesson-registry.ts
 * ----------------------------------------------------------------
 * Maps a lesson's `componentKey` (declared in course-config.ts) to
 * the React component that renders it.
 *
 * When adding a new lesson:
 *   1. Create the lesson component in src/components/lessons/.
 *   2. Add it to this registry with the same key used in course-config.
 * That's it — navigation, search, and progress pick it up automatically.
 * ----------------------------------------------------------------
 */

import { VectorsLesson } from "@/components/lessons/vectors-lesson";
import { IntroductionPage } from "@/components/lessons/introduction";
import { CourseCompletionPage } from "@/components/lessons/course-completion";

export interface LessonComponentProps {
  onNavigate: (slug: string) => void;
}

/** Registry of lesson-page renderers keyed by componentKey. */
export const LESSON_REGISTRY: Record<
  string,
  React.ComponentType<LessonComponentProps>
> = {
  vectors: VectorsLesson,
};

/** Special (non-lesson) page renderers. */
export const SPECIAL_REGISTRY: Record<
  string,
  React.ComponentType<LessonComponentProps>
> = {
  introduction: IntroductionPage,
  completion: CourseCompletionPage,
};

/**
 * Resolve which component to render for a given page slug.
 * Falls back to the introduction page for unknown slugs.
 */
export function resolvePage(
  slug: string
): React.ComponentType<LessonComponentProps> {
  if (slug in SPECIAL_REGISTRY) return SPECIAL_REGISTRY[slug];
  return LESSON_REGISTRY[slug] ?? SPECIAL_REGISTRY.introduction;
}
