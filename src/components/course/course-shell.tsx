"use client";

/**
 * CourseShell
 * ----------------------------------------------------------------
 * The top-level layout for the whole app. Renders:
 *   - Fixed sidebar (desktop) / drawer (mobile)
 *   - Top bar with menu toggle, search, and page context
 *   - The active page content
 *
 * The shell is presentational: it receives `currentPage`, the rendered
 * `children`, and an `onNavigate` callback. Routing lives in page.tsx.
 * ----------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { Menu, Search, Command, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { SearchDialog } from "./search-dialog";
import { useReadingProgress } from "./use-reading-progress";
import { getNextPage, getPrevPage, hasPrevPage, hasNextPage } from "./page-order";
import { getLessonBySlug, SPECIAL_PAGES } from "@/lib/course-config";
import { TOTAL_LESSONS, TOTAL_DURATION_MIN } from "@/lib/course-config";

export interface CourseShellProps {
  currentPage: string;
  onNavigate: (slug: string) => void;
  children: React.ReactNode;
}

export function CourseShell({ currentPage, onNavigate, children }: CourseShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const readingProgress = useReadingProgress();

  // ⌘K / Ctrl+K to open search
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // keyboard arrow navigation: ← / → for prev/next page
  // (ignored while typing in an input/textarea or while a dialog is open)
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (typing || searchOpen || mobileOpen) return;
      if (e.key === "ArrowLeft" && hasPrevPage(currentPage)) {
        const p = getPrevPage(currentPage);
        if (p) onNavigate(p);
      } else if (e.key === "ArrowRight" && hasNextPage(currentPage)) {
        const n = getNextPage(currentPage);
        if (n) onNavigate(n);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentPage, onNavigate, searchOpen, mobileOpen]);

  const prev = hasPrevPage(currentPage) ? getPrevPage(currentPage) : undefined;
  const next = hasNextPage(currentPage) ? getNextPage(currentPage) : undefined;

  // derive the current page title for the top bar
  const lesson = getLessonBySlug(currentPage);
  const pageTitle =
    currentPage === "introduction"
      ? SPECIAL_PAGES.introduction.title
      : currentPage === "completion"
        ? SPECIAL_PAGES.completion.title
        : lesson
          ? `Lesson ${lesson.number} · ${lesson.title}`
          : "Course";

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border/60 lg:block">
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      </aside>

      {/* mobile sidebar drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-3 top-3 z-40 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar
            currentPage={currentPage}
            onNavigate={onNavigate}
            onClose={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* main column */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        {/* top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border/60 bg-background/70 px-4 pl-16 backdrop-blur-xl lg:pl-6">
          {/* prev/next arrows */}
          <div className="hidden items-center gap-1 sm:flex">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 disabled:opacity-30"
              disabled={!prev}
              onClick={() => prev && onNavigate(prev)}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 disabled:opacity-30"
              disabled={!next}
              onClick={() => next && onNavigate(next)}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Vectorflow</span>
            <span className="hidden text-muted-foreground/40 sm:inline">/</span>
            <span className="truncate font-medium text-foreground">{pageTitle}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* reading progress chip — only on lesson pages with scroll */}
            {readingProgress > 0.02 && lesson && (
              <div className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-2.5 py-1 text-[10px] text-muted-foreground md:flex">
                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-150"
                    style={{ width: `${Math.round(readingProgress * 100)}%` }}
                  />
                </div>
                <span className="font-mono">{Math.round(readingProgress * 100)}%</span>
              </div>
            )}
            <div className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-2.5 py-1 text-[10px] text-muted-foreground lg:flex">
              <span className="font-mono">{TOTAL_LESSONS}</span> lessons
              <span className="text-muted-foreground/40">·</span>
              <span className="font-mono">{TOTAL_DURATION_MIN}</span> min
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="gap-2"
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden items-center gap-0.5 rounded border border-border/60 bg-background/60 px-1 text-[10px] font-mono sm:flex">
                <Command className="size-2.5" />K
              </kbd>
            </Button>
          </div>
        </header>

        {/* thin reading-progress bar under the top bar (lesson pages only) */}
        {lesson && readingProgress > 0.005 && (
          <div className="sticky top-14 z-10 h-0.5 w-full bg-transparent">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300 transition-[width] duration-150"
              style={{ width: `${readingProgress * 100}%` }}
            />
          </div>
        )}

        {/* page content */}
        <main className="flex-1">{children}</main>

        {/* sticky footer */}
        <footer className="mt-auto border-t border-border/60 bg-background/60 px-5 py-5 backdrop-blur-sm sm:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600">
                <GraduationCap className="size-3 text-emerald-950" />
              </span>
              <span>
                <span className="font-medium text-foreground">Vectorflow</span> — an
                interactive linear algebra course.
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <kbd className="rounded border border-border/60 bg-background/60 px-1.5 py-0.5 font-mono text-[10px]">←</kbd>
                <kbd className="rounded border border-border/60 bg-background/60 px-1.5 py-0.5 font-mono text-[10px]">→</kbd>
                navigate
              </span>
              <span className="hidden items-center gap-1.5 md:inline-flex">
                <kbd className="rounded border border-border/60 bg-background/60 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
                search
              </span>
              <span className="font-mono">{TOTAL_LESSONS} lessons</span>
            </div>
          </div>
        </footer>
      </div>

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onNavigate={onNavigate}
      />
    </div>
  );
}
