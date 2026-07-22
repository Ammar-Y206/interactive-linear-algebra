"use client";

/**
 * page.tsx — the single user-facing route.
 * ----------------------------------------------------------------
 * Reads the active page from the URL query (`?page=...`) so the
 * browser back/forward buttons and deep-linking both work, while
 * still only ever serving the `/` route.
 *
 * Responsibilities:
 *  - Hydrate the persisted progress store
 *  - Keep `lastPage` in sync with the active page
 *  - Render the CourseShell + the resolved page component (via the
 *    lesson registry so new lessons plug in automatically)
 * ----------------------------------------------------------------
 */

import { Suspense, createElement, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CourseShell } from "@/components/course/course-shell";
import { resolvePage, type LessonComponentProps } from "@/components/lessons/registry";
import { useProgressStore } from "@/lib/progress-store";
import { LESSONS } from "@/lib/course-config";

function HomePage() {
  const router = useRouter();
  const params = useSearchParams();
  const markStarted = useProgressStore((s) => s.markStarted);
  const setLastPage = useProgressStore((s) => s.setLastPage);

  // determine the active page from the URL, defaulting to introduction
  const rawPage = params.get("page") ?? "introduction";
  const validPages = new Set<string>([
    "introduction",
    "completion",
    ...LESSONS.map((l) => l.slug),
  ]);
  const currentPage = validPages.has(rawPage) ? rawPage : "introduction";

  // Rehydrate the persisted progress store AFTER mount, so the client's
  // first render matches the server's empty state (no hydration mismatch
  // on sidebar checkmarks / progress ring / streak). Then record the visit.
  useEffect(() => {
    useProgressStore.persist.rehydrate();
    markStarted();
    setLastPage(currentPage);
  }, [currentPage, markStarted, setLastPage]);

  function navigate(slug: string) {
    router.push(`/?page=${slug}`, { scroll: false });
  }

  const ActivePage = resolvePage(currentPage);

  return (
    <CourseShell currentPage={currentPage} onNavigate={navigate}>
      {createElement<LessonComponentProps>(ActivePage, {
        key: currentPage,
        onNavigate: navigate,
      })}
    </CourseShell>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="size-10 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="text-sm text-muted-foreground">Loading Vectorflow…</p>
          </div>
        </div>
      }
    >
      <HomePage />
    </Suspense>
  );
}
