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
import { SpanLesson } from "@/components/lessons/span-lesson";
import { TransformationsLesson } from "@/components/lessons/transformations-lesson";
import { CompositionLesson } from "@/components/lessons/composition-lesson";
import { Transform3DLesson } from "@/components/lessons/transform-3d-lesson";
import { DeterminantLesson } from "@/components/lessons/determinant-lesson";
import { InverseLesson } from "@/components/lessons/inverse-lesson";
import { NonsquareLesson } from "@/components/lessons/nonsquare-lesson";
import { DotProductLesson } from "@/components/lessons/dot-product-lesson";
import { CrossProductLesson } from "@/components/lessons/cross-product-lesson";
import { CrossProductDualityLesson } from "@/components/lessons/cross-product-duality-lesson";
import { CramersRuleLesson } from "@/components/lessons/cramers-rule-lesson";
import { ChangeOfBasisLesson } from "@/components/lessons/change-of-basis-lesson";
import { EigenvectorsLesson } from "@/components/lessons/eigenvectors-lesson";
import { EigenvalueTrickLesson } from "@/components/lessons/eigenvalue-trick-lesson";
import { AbstractVectorSpacesLesson } from "@/components/lessons/abstract-vector-spaces-lesson";
import { WelcomeLesson } from "@/components/lessons/welcome-lesson";
import { WhyLinearAlgebraLesson } from "@/components/lessons/why-linear-algebra-lesson";
import { RealLifeLesson } from "@/components/lessons/real-life-lesson";
import { AiMathLesson } from "@/components/lessons/ai-math-lesson";
import { MathLanguageLesson } from "@/components/lessons/math-language-lesson";
import { RoadmapLesson } from "@/components/lessons/roadmap-lesson";
import { IntroductionPage } from "@/components/lessons/introduction";
import { CourseCompletionPage } from "@/components/lessons/course-completion";
import { getLessonBySlug } from "@/lib/course-config";

export interface LessonComponentProps {
  onNavigate: (slug: string) => void;
}

/** Registry of lesson-page renderers keyed by componentKey. */
export const LESSON_REGISTRY: Record<
  string,
  React.ComponentType<LessonComponentProps>
> = {
  vectors: VectorsLesson,
  span: SpanLesson,
  transformations: TransformationsLesson,
  composition: CompositionLesson,
  "transform-3d": Transform3DLesson,
  determinant: DeterminantLesson,
  inverse: InverseLesson,
  nonsquare: NonsquareLesson,
  "dot-product": DotProductLesson,
  "cross-product": CrossProductLesson,
  "cross-product-duality": CrossProductDualityLesson,
  "cramers-rule": CramersRuleLesson,
  "change-of-basis": ChangeOfBasisLesson,
  eigenvectors: EigenvectorsLesson,
  "eigenvalue-trick": EigenvalueTrickLesson,
  "abstract-vector-spaces": AbstractVectorSpacesLesson,
  welcome: WelcomeLesson,
  "why-linear-algebra": WhyLinearAlgebraLesson,
  "real-life": RealLifeLesson,
  "ai-math": AiMathLesson,
  "math-language": MathLanguageLesson,
  roadmap: RoadmapLesson,
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
 *
 * Special pages (introduction, completion) are keyed directly by slug.
 * Lessons are keyed in LESSON_REGISTRY by their `componentKey`, so we
 * first look the slug up in course-config to get the componentKey, then
 * resolve the component. Falls back to the introduction page.
 */
export function resolvePage(
  slug: string
): React.ComponentType<LessonComponentProps> {
  if (slug in SPECIAL_REGISTRY) return SPECIAL_REGISTRY[slug];
  const lesson = getLessonBySlug(slug);
  if (lesson && lesson.componentKey in LESSON_REGISTRY) {
    return LESSON_REGISTRY[lesson.componentKey];
  }
  return SPECIAL_REGISTRY.introduction;
}
