"use client";

/**
 * SearchDialog
 * ----------------------------------------------------------------
 * A cmdk-powered search over all lessons and special pages.
 * Opened with ⌘K / Ctrl+K or the search button in the top bar.
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { Search, ArrowRight, Sparkles, Trophy, BookOpen } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LESSONS, SPECIAL_PAGES } from "@/lib/course-config";
import { useProgressStore } from "@/lib/progress-store";

export interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (slug: string) => void;
}

export function SearchDialog({ open, onOpenChange, onNavigate }: SearchDialogProps) {
  const isComplete = useProgressStore((s) => s.isComplete);
  const [_, setQuery] = useState(""); // keep input controlled

  function go(slug: string) {
    onNavigate(slug);
    onOpenChange(false);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search lessons"
      description="Jump to any lesson or page in the course."
    >
      <CommandInput
        placeholder="Search lessons, concepts, pages…"
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => go("introduction")}>
            <Sparkles className="text-emerald-400" />
            <span>{SPECIAL_PAGES.introduction.title}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {SPECIAL_PAGES.introduction.tagline}
            </span>
          </CommandItem>
          <CommandItem onSelect={() => go("completion")}>
            <Trophy className="text-amber-400" />
            <span>{SPECIAL_PAGES.completion.title}</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Lessons">
          {LESSONS.map((lesson) => {
            const done = isComplete(lesson.slug);
            return (
              <CommandItem
                key={lesson.slug}
                value={`${lesson.title} ${lesson.tagline} ${lesson.description} ${lesson.objectives.map((o) => o.title).join(" ")}`}
                onSelect={() => go(lesson.slug)}
              >
                <BookOpen className={done ? "text-emerald-400" : "text-muted-foreground"} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">
                    <span className="text-muted-foreground">L{lesson.number}.</span>{" "}
                    {lesson.title}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {lesson.tagline}
                  </span>
                </div>
                {done && (
                  <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
                    done
                  </span>
                )}
                <ArrowRight className="text-muted-foreground" />
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
