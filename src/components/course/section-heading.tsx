"use client";

/**
 * SectionHeading
 * ----------------------------------------------------------------
 * A consistent in-page section header used across all lessons.
 * Keeps the visual rhythm identical from lesson to lesson.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  align?: "left" | "center";
  accent?: "emerald" | "amber" | "rose" | "cyan" | "violet";
}

const accentText = {
  emerald: "text-emerald-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
  cyan: "text-cyan-300",
  violet: "text-violet-300",
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
  align = "left",
  accent = "emerald",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className={cn("mb-6 sm:mb-8", align === "center" && "text-center")}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest",
            accentText[accent],
            align === "center" && "justify-center"
          )}
        >
          {icon}
          {eyebrow}
        </div>
      )}
      <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-3 max-w-2xl text-balance leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
