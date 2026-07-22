"use client";

/**
 * Sidebar
 * ----------------------------------------------------------------
 * The persistent left navigation. Lists the Introduction, all lessons
 * (with completion state + current-page highlight), and Course
 * Completion. Includes the ProgressTracker at the bottom.
 *
 * Navigation is fully client-side: clicking a page calls
 * `onNavigate(slug)` which the shell translates into a URL update.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Lock,
  PlayCircle,
  Trophy,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LESSONS, SPECIAL_PAGES } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";
import { ProgressTracker } from "./progress-tracker";

export interface SidebarProps {
  currentPage: string;
  onNavigate: (slug: string) => void;
  onClose?: () => void;
}

export function Sidebar({ currentPage, onNavigate, onClose }: SidebarProps) {
  const completed = useProgressStore((s) => s.completed);
  const isComplete = useProgressStore((s) => s.isComplete);

  function handleNav(slug: string) {
    onNavigate(slug);
    onClose?.();
  }

  return (
    <div className="flex h-full flex-col bg-sidebar/80 backdrop-blur-xl">
      {/* brand */}
      <div className="flex items-center gap-2.5 border-b border-sidebar-border/60 px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_20px_oklch(0.7_0.16_165/40%)]">
          <GraduationCap className="size-5 text-emerald-950" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-sidebar-foreground">
            Vectorflow
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Linear Algebra
          </div>
        </div>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        {/* Introduction */}
        <NavItem
          icon={<Sparkles className="size-4" />}
          title={SPECIAL_PAGES.introduction.title}
          subtitle={SPECIAL_PAGES.introduction.tagline}
          active={currentPage === "introduction"}
          onClick={() => handleNav("introduction")}
        />

        <div className="my-3 flex items-center gap-2 px-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Lessons
          </div>
          <div className="h-px flex-1 bg-sidebar-border/60" />
        </div>

        <div className="space-y-1">
          {LESSONS.map((lesson) => {
            const done = isComplete(lesson.slug);
            const active = currentPage === lesson.slug;
            return (
              <button
                key={lesson.slug}
                onClick={() => handleNav(lesson.slug)}
                className={cn(
                  "group relative flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                  active
                    ? "bg-sidebar-accent/80"
                    : "hover:bg-sidebar-accent/40"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                  />
                )}
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/60 bg-background/40 font-mono text-xs font-bold text-muted-foreground transition-colors group-hover:text-foreground">
                  {lesson.number}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        active ? "text-sidebar-foreground" : "text-sidebar-foreground/80"
                      )}
                    >
                      {lesson.title}
                    </span>
                    {done ? (
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <Circle className="size-3 shrink-0 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {lesson.durationMin} min · {lesson.difficulty}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="my-3 flex items-center gap-2 px-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Finish line
          </div>
          <div className="h-px flex-1 bg-sidebar-border/60" />
        </div>

        <NavItem
          icon={<Trophy className="size-4" />}
          title={SPECIAL_PAGES.completion.title}
          subtitle={SPECIAL_PAGES.completion.tagline}
          active={currentPage === "completion"}
          onClick={() => handleNav("completion")}
          disabled={completed.length === 0}
        />
      </nav>

      <div className="border-t border-sidebar-border/60 p-3">
        <ProgressTracker />
      </div>
    </div>
  );
}

function NavItem({
  icon,
  title,
  subtitle,
  active,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
        active ? "bg-sidebar-accent/80" : "hover:bg-sidebar-accent/40",
        disabled && "cursor-not-allowed opacity-40 hover:bg-transparent"
      )}
    >
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg border transition-colors",
          active
            ? "border-primary/40 bg-primary/15 text-primary"
            : "border-sidebar-border/60 bg-background/40 text-muted-foreground group-hover:text-foreground"
        )}
      >
        {disabled ? <Lock className="size-3.5" /> : icon}
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "truncate text-sm font-medium",
            active ? "text-sidebar-foreground" : "text-sidebar-foreground/80"
          )}
        >
          {title}
        </div>
        <div className="truncate text-[11px] text-muted-foreground">{subtitle}</div>
      </div>
    </button>
  );
}
