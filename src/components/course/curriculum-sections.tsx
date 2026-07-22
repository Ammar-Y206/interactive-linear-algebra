"use client";

/**
 * curriculum-sections.tsx
 * ----------------------------------------------------------------
 * Reusable section components for the curriculum-design layer:
 *   - WhyThisMatters: real-world applications, industries, products
 *   - BuildSomething: what you can build with this knowledge
 *   - Connections: previous/future lessons + knowledge graph
 *   - Motivation: the "after this, you can understand X" closer
 *
 * Used by the introductory lessons and adoptable by any lesson.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import {
  Sparkles,
  Hammer,
  Network,
  Rocket,
  ArrowRight,
  Briefcase,
  Cpu,
  Gamepad2,
  Bot,
  Camera,
  Brain,
  Atom,
  LineChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

/* ---------------- Why This Matters ---------------- */

export interface ApplicationItem {
  icon?: React.ReactNode;
  label: string;
  detail?: string;
}

export interface WhyThisMattersProps {
  applications: ApplicationItem[];
  industries?: string[];
  products?: string[];
  accent?: "emerald" | "amber" | "rose" | "cyan" | "violet";
}

export function WhyThisMatters({
  applications,
  industries,
  products,
  accent = "emerald",
}: WhyThisMattersProps) {
  return (
    <section className="px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Why this matters"
          title="Where this lives in the real world"
          description="Math isn't abstract — it's the hidden machinery of the technology you use every day. Here's where you'll find it."
          accent={accent}
          icon={<Sparkles className="size-3.5" />}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app, i) => (
            <motion.div
              key={app.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="card-lift rounded-xl border border-border/50 bg-card/40 p-4 hover:border-primary/40"
            >
              {app.icon && (
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  {app.icon}
                </div>
              )}
              <h4 className="font-medium text-foreground">{app.label}</h4>
              {app.detail && (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{app.detail}</p>
              )}
            </motion.div>
          ))}
        </div>

        {(industries || products) && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {industries && industries.length > 0 && (
              <div className="rounded-xl border border-border/50 bg-background/40 p-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <Briefcase className="size-3" /> Industries
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {industries.map((ind) => (
                    <span key={ind} className="rounded-full border border-border/50 bg-card/40 px-2.5 py-0.5 text-xs text-muted-foreground">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {products && products.length > 0 && (
              <div className="rounded-xl border border-border/50 bg-background/40 p-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <Sparkles className="size-3" /> Famous products
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {products.map((p) => (
                    <span key={p} className="rounded-full border border-border/50 bg-card/40 px-2.5 py-0.5 text-xs text-muted-foreground">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Build Something ---------------- */

export interface BuildItem {
  icon?: React.ReactNode;
  title: string;
  body: string;
}

export interface BuildSomethingProps {
  items: BuildItem[];
  accent?: "emerald" | "amber" | "rose" | "cyan" | "violet";
}

export function BuildSomething({ items, accent = "amber" }: BuildSomethingProps) {
  const iconFor: Record<string, React.ReactNode> = {
    ai: <Brain className="size-5" />,
    graphics: <Gamepad2 className="size-5" />,
    robotics: <Bot className="size-5" />,
    vision: <Camera className="size-5" />,
    data: <LineChart className="size-5" />,
    compute: <Cpu className="size-5" />,
    science: <Atom className="size-5" />,
  };
  return (
    <section className="px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Build something"
          title="What you can make with this"
          description="Knowledge becomes real when you build with it. Here's where this lesson's ideas show up in things people create."
          accent={accent}
          icon={<Hammer className="size-3.5" />}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-lift rounded-2xl border border-border/50 bg-card/40 p-5 hover:border-primary/40"
            >
              <div className="flex items-start gap-3">
                {item.icon && (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    {item.icon}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Connections ---------------- */

export interface ConnectionLink {
  number: number;
  title: string;
  slug: string;
  relation: "prerequisite" | "next" | "related";
}

export interface ConnectionsProps {
  prev?: ConnectionLink[];
  next?: ConnectionLink[];
  onNavigate?: (slug: string) => void;
  accent?: "emerald" | "amber" | "rose" | "cyan" | "violet";
}

export function Connections({ prev, next, onNavigate, accent = "cyan" }: ConnectionsProps) {
  return (
    <section className="px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Connections"
          title="How this fits in the journey"
          description="No lesson stands alone. Here's how this one connects to what you've learned and where you're going."
          accent={accent}
          icon={<Network className="size-3.5" />}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {prev && prev.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
              <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300">
                <ArrowRight className="size-3 rotate-180" /> Builds on
              </div>
              <div className="space-y-2">
                {prev.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => onNavigate?.(c.slug)}
                    className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 font-mono text-xs font-bold text-emerald-300">
                      {c.number}
                    </span>
                    <span className="text-sm text-foreground">{c.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {next && next.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
              <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
                <ArrowRight className="size-3" /> Leads to
              </div>
              <div className="space-y-2">
                {next.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => onNavigate?.(c.slug)}
                    className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition-colors hover:border-amber-500/30 hover:bg-amber-500/5"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/15 font-mono text-xs font-bold text-amber-300">
                      {c.number}
                    </span>
                    <span className="text-sm text-foreground">{c.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Motivation ---------------- */

export interface MotivationProps {
  /** "After learning this, you are now able to understand X." */
  canUnderstand: string;
  accent?: "emerald" | "amber" | "rose" | "cyan" | "violet";
}

export function Motivation({ canUnderstand, accent = "violet" }: MotivationProps) {
  const accentBg = {
    emerald: "from-emerald-500/15 to-transparent border-emerald-500/20",
    amber: "from-amber-500/15 to-transparent border-amber-500/20",
    rose: "from-rose-500/15 to-transparent border-rose-500/20",
    cyan: "from-cyan-500/15 to-transparent border-cyan-500/20",
    violet: "from-violet-500/15 to-transparent border-violet-500/20",
  }[accent];
  return (
    <section className="px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className={cn("relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 sm:p-8", accentBg)}
        >
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Rocket className="size-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                After this lesson
              </div>
              <p className="mt-1 text-balance text-lg font-medium leading-relaxed text-foreground">
                After learning this, you are now able to understand{" "}
                <span className="text-primary">{canUnderstand}</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
