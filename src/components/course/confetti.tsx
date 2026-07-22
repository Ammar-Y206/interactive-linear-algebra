"use client";

/**
 * Confetti
 * ----------------------------------------------------------------
 * A lightweight, dependency-free confetti burst. Renders a fixed
 * overlay of animated particles for ~2.5s then cleans up.
 *
 * Trigger it by mounting the component (key by a counter so it can
 * re-fire). Used to celebrate quiz perfection and lesson completion.
 * ----------------------------------------------------------------
 */

import { useMemo } from "react";
import { motion } from "framer-motion";

export interface ConfettiProps {
  /** number of particles */
  count?: number;
  /** ms before the overlay unmounts */
  durationMs?: number;
}

const COLORS = [
  "#34d399", // emerald
  "#fbbf24", // amber
  "#fb7185", // rose
  "#22d3ee", // cyan
  "#a78bfa", // violet
  "#f472b6", // pink
];

export function Confetti({ count = 80, durationMs = 2500 }: ConfettiProps) {
  // generate particle configs once per mount
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // start x % across viewport (top)
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 30, // horizontal drift in vw
        delay: Math.random() * 0.3,
        size: 6 + Math.random() * 8,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      })),
    [count]
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            top: "-10%",
            left: `${p.x}%`,
            opacity: 1,
            rotate: p.rotate,
            scale: 1,
          }}
          animate={{
            top: "110%",
            left: `calc(${p.x}% + ${p.drift}vw)`,
            opacity: [1, 1, 0.9, 0],
            rotate: p.rotate + 720,
            scale: [1, 1, 0.8, 0.6],
          }}
          transition={{
            duration: durationMs / 1000,
            delay: p.delay,
            ease: "easeIn",
            opacity: { duration: durationMs / 1000, times: [0, 0.6, 0.85, 1] },
          }}
          style={{
            position: "absolute",
            width: p.shape === "rect" ? p.size : p.size,
            height: p.shape === "rect" ? p.size * 0.5 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "9999px" : "2px",
          }}
        />
      ))}
    </div>
  );
}
