"use client";

/**
 * AchievementBadge
 * ----------------------------------------------------------------
 * Displays an achievement (earned or locked). Uses a dynamic lucide
 * icon lookup so the progress store can store icon names as strings.
 * ----------------------------------------------------------------
 */

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/lib/progress-store";

export interface AchievementBadgeProps {
  achievement: Achievement;
  earned: boolean;
  size?: "sm" | "md" | "lg";
  index?: number;
}

export function AchievementBadge({
  achievement,
  earned,
  size = "md",
  index = 0,
}: AchievementBadgeProps) {
  const IconComp = (Icons as unknown as Record<string, Icons.LucideIcon>)[
    achievement.icon
  ] ?? Icons.Award;

  const sizes = {
    sm: { box: "size-9", icon: "size-4", title: "text-xs" },
    md: { box: "size-12", icon: "size-5", title: "text-sm" },
    lg: { box: "size-16", icon: "size-7", title: "text-base" },
  }[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "flex flex-col items-center gap-2 text-center",
        !earned && "opacity-60"
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl border transition-all",
          sizes.box,
          earned
            ? "border-amber-500/40 bg-gradient-to-br from-amber-500/20 to-amber-500/5 shadow-[0_0_24px_oklch(0.75_0.16_80/25%)]"
            : "border-border/60 bg-muted/40 grayscale"
        )}
      >
        {earned ? (
          <IconComp className={cn("text-amber-300", sizes.icon)} />
        ) : (
          <Lock className={cn("text-muted-foreground", sizes.icon)} />
        )}
        {earned && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05, type: "spring" }}
            className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-amber-950"
          >
            ★
          </motion.span>
        )}
      </div>
      <div className="space-y-0.5">
        <div className={cn("font-medium text-foreground", sizes.title)}>
          {achievement.title}
        </div>
        <div className="max-w-[120px] text-[10px] leading-tight text-muted-foreground">
          {achievement.description}
        </div>
      </div>
    </motion.div>
  );
}
