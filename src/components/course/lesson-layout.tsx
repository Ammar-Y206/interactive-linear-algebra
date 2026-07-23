"use client";

/**
 * LessonLayout
 * ----------------------------------------------------------------
 * The structural wrapper shared by every lesson page. Provides:
 *  - A scroll-to-top on mount
 *  - A sticky in-lesson table of contents (desktop)
 *  - Consistent max-width content container
 *  - A "back to overview" affordance
 *
 * The actual section content is passed as children by each lesson.
 * ----------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LessonTocItem {
  id: string;
  label: string;
}

export interface LessonLayoutProps {
  toc: LessonTocItem[];
  children: React.ReactNode;
}

export function LessonLayout({ toc, children }: LessonLayoutProps) {
  const [activeId, setActiveId] = useState<string>("");

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // track the active section for the TOC highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="relative">
      {/* desktop TOC rail — only on very wide screens so it never crowds content */}
      <aside className="pointer-events-none fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 2xl:block">
        <div className="pointer-events-auto rounded-2xl border border-border/40 bg-card/60 p-3 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <BookOpen className="size-3" />
            On this page
          </div>
          <nav className="space-y-0.5">
            {toc.map((t) => (
              <button
                key={t.id}
                onClick={() => scrollTo(t.id)}
                className={cn(
                  "block w-full rounded-md px-2 py-1 text-left text-xs transition-colors",
                  activeId === t.id
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="2xl:pr-56"
      >
        {children}
      </motion.article>
    </div>
  );
}
