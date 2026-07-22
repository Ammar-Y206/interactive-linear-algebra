"use client";

/**
 * GlossaryPanel
 * ----------------------------------------------------------------
 * A searchable, category-filterable glossary of linear-algebra
 * terms. Clicking a term jumps to the lesson that introduces it.
 *
 * Reused across the course — data comes from lib/glossary.ts.
 * ----------------------------------------------------------------
 */

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookText, Search, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  GLOSSARY,
  searchGlossary,
  lessonNumberFor,
  type GlossaryEntry,
} from "@/lib/glossary";

export interface GlossaryPanelProps {
  onNavigate: (slug: string) => void;
}

const CATEGORY_COLORS: Record<GlossaryEntry["category"], string> = {
  Vector: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
  Operation: "text-rose-300 bg-rose-500/15 border-rose-500/30",
  Coordinate: "text-amber-300 bg-amber-500/15 border-amber-500/30",
  Concept: "text-cyan-300 bg-cyan-500/15 border-cyan-500/30",
};

const CATEGORIES = ["All", "Vector", "Operation", "Coordinate", "Concept"] as const;

export function GlossaryPanel({ onNavigate }: GlossaryPanelProps) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] =
    useState<(typeof CATEGORIES)[number]>("All");

  const results = useMemo(() => {
    const filtered = searchGlossary(query);
    if (activeCat === "All") return filtered;
    return filtered.filter((e) => e.category === activeCat);
  }, [query, activeCat]);

  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 overflow-hidden">
      {/* header */}
      <div className="border-b border-border/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <BookText className="size-4" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Glossary</h3>
            <p className="text-xs text-muted-foreground">
              {GLOSSARY.length} terms · click any to jump to its lesson
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="pl-8 h-9 bg-background/40"
          />
        </div>

        {/* category filter */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                activeCat === c
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border/50 bg-background/40 text-muted-foreground hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* results */}
      <div className="scrollbar-thin max-h-[420px] overflow-y-auto p-2">
        <AnimatePresence mode="popLayout">
          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center text-sm text-muted-foreground"
            >
              No terms match “{query}”.
            </motion.div>
          ) : (
            results.map((entry) => (
              <motion.button
                key={entry.term}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => onNavigate(entry.lessonSlug)}
                className="card-lift group mb-1 flex w-full items-start gap-3 rounded-xl border border-transparent p-3 text-left hover:border-border/50 hover:bg-background/40"
              >
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                    CATEGORY_COLORS[entry.category]
                  )}
                >
                  {entry.category}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">
                      {entry.term}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      · L{lessonNumberFor(entry.lessonSlug)}
                    </span>
                    <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {entry.definition}
                  </p>
                  {entry.related && entry.related.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {entry.related.map((r) => (
                        <span
                          key={r}
                          className="rounded border border-border/40 bg-background/40 px-1.5 py-0.5 text-[9px] text-muted-foreground"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
