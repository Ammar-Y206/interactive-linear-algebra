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
import { Menu, Search, Command, GraduationCap, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
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
  // read the persisted collapse preference once via lazy initializer (client-only)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("vectorflow-sidebar-collapsed") === "true"
  );
  const readingProgress = useReadingProgress();

  // toggle handler that also persists (avoids setState-in-effect)
  function toggleSidebar() {
    setSidebarCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem("vectorflow-sidebar-collapsed", String(next)); } catch {}
      return next;
    });
  }

  // [ key toggles the desktop sidebar (ignored while typing or a dialog is open)
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (typing || searchOpen || mobileOpen) return;
      if (e.key === "[") {
        e.preventDefault();
        toggleSidebar();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen, mobileOpen]);

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
      {/* desktop sidebar — collapses to zero width when hidden */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-border/60 transition-[width] duration-300 ease-in-out lg:block overflow-hidden",
          sidebarCollapsed ? "w-0 border-r-0" : "w-72"
        )}
      >
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      </aside>

      {/* mobile sidebar drawer (opened from the top bar menu button) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar
            currentPage={currentPage}
            onNavigate={onNavigate}
            onClose={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* main column — expands when sidebar is collapsed */}
      <div className={cn("flex min-h-screen min-w-0 flex-1 flex-col transition-[padding] duration-300 ease-in-out", sidebarCollapsed ? "lg:pl-0" : "lg:pl-72")}>
        {/* top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-1 border-b border-border/60 bg-background/80 px-3 backdrop-blur-xl sm:gap-2 sm:px-4 lg:pl-6">
          {/* mobile menu button (fixed on far left for easy thumb reach) */}
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>

          {/* sidebar collapse toggle (desktop only) */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-8 shrink-0 lg:flex"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            title={sidebarCollapsed ? "Show sidebar ([)" : "Hide sidebar ([)"}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>

          {/* prev/next arrows — show on all sizes (icons only on mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 disabled:opacity-30 sm:size-8"
            disabled={!prev}
            onClick={() => prev && onNavigate(prev)}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-5 sm:size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 disabled:opacity-30 sm:size-8"
            disabled={!next}
            onClick={() => next && onNavigate(next)}
            aria-label="Next page"
          >
            <ChevronRight className="size-5 sm:size-4" />
          </Button>

          {/* page title — hidden on very small screens to save space */}
          <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden md:inline">Vectorflow</span>
            <span className="hidden text-muted-foreground/40 md:inline">/</span>
            <span className="truncate font-medium text-foreground">{pageTitle}</span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
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
        <main className="min-w-0 flex-1">{children}</main>

        {/* sticky footer */}
        <footer className="mt-auto border-t border-border/60 bg-background/60 px-4 py-5 backdrop-blur-sm sm:px-8 lg:px-12" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
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
              <span className="hidden items-center gap-1.5 lg:inline-flex">
                <kbd className="rounded border border-border/60 bg-background/60 px-1.5 py-0.5 font-mono text-[10px]">[</kbd>
                toggle sidebar
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
