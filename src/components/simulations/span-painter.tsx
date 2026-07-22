"use client";

/**
 * SpanPainter
 * ----------------------------------------------------------------
 * Visualizes the SPAN of two vectors: the set of all a·v + b·w.
 *
 * Approach: sample a grid of scalar pairs (a, b) and plot a dot at
 * each resulting tip. When v and w are not collinear, the dots fill
 * the plane; when they line up, the dots collapse onto a single line
 * through the origin — the visual heart of the lesson.
 *
 * Includes presets to instantly show the three cases:
 *   - "Span the plane" (default, independent)
 *   - "Line up" (collinear → span is a line)
 *   - "Both zero" (span is just the origin)
 *
 * Reuses <CoordinatePlane /> for the axes + draggable vectors.
 * ----------------------------------------------------------------
 */

import { useMemo, useState } from "react";
import { Layers3, Minus, CircleDot } from "lucide-react";
import {
  CoordinatePlane,
  type PlaneVector,
  PLANE_COLORS,
} from "@/components/simulations/coordinate-plane";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Vec { x: number; y: number }

const PRESETS = {
  plane: { v: { x: 2, y: 1 }, w: { x: -1, y: 2 } },
  line: { v: { x: 2, y: 1 }, w: { x: -1.5, y: -0.75 } }, // w = -0.75·v → collinear
  zero: { v: { x: 0, y: 0 }, w: { x: 0, y: 0 } },
};

export function SpanPainter() {
  const [v, setV] = useState<Vec>(PRESETS.plane.v);
  const [w, setW] = useState<Vec>(PRESETS.plane.w);

  // Are v and w collinear? (cross product ~ 0)
  const cross = v.x * w.y - v.y * w.x;
  const bothZero = v.x === 0 && v.y === 0 && w.x === 0 && w.y === 0;
  const collinear = !bothZero && Math.abs(cross) < 0.05;

  // sample a grid of (a, b) and compute a·v + b·w
  const dots = useMemo(() => {
    if (bothZero) return [] as Vec[];
    const out: Vec[] = [];
    const STEP = 0.4;
    for (let a = -3; a <= 3.001; a += STEP) {
      for (let b = -3; b <= 3.001; b += STEP) {
        out.push({ x: a * v.x + b * w.x, y: a * v.y + b * w.y });
      }
    }
    return out;
  }, [v, w, bothZero]);

  const vectors: PlaneVector[] = [
    { id: "v", x: v.x, y: v.y, color: PLANE_COLORS.primary, draggable: !bothZero, label: "v" },
    { id: "w", x: w.x, y: w.y, color: PLANE_COLORS.secondary, draggable: !bothZero, label: "w" },
  ];

  function handleChange(id: string, x: number, y: number) {
    // zero-preset vectors aren't draggable; ignore tiny moves from origin
    if (id === "v") setV({ x, y });
    if (id === "w") setW({ x, y });
  }

  function applyPreset(p: keyof typeof PRESETS) {
    setV(PRESETS[p].v);
    setW(PRESETS[p].w);
  }

  // compute pixel positions for dots overlay
  const pad = 28, size = 360, range = 6;
  const unit = (size - pad * 2) / (range * 2);
  const originPx = pad + range * unit;
  const toPx = (mx: number, my: number) => ({ px: originPx + mx * unit, py: originPx - my * unit });

  const spanLabel = bothZero
    ? "Span = { origin }"
    : collinear
      ? "Span = a single line"
      : "Span = all of 2D space";

  return (
    <SimulationContainer
      title="The span: everything a·v + b·w can reach"
      description="Each dot is one linear combination. Drag v and w — watch the dots fill the plane, or collapse to a line when the vectors line up."
      badge="Span"
      accent="rose"
      controls={
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => applyPreset("plane")}>
            <Layers3 className="mr-1.5 size-3.5" />Span the plane
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset("line")}>
            <Minus className="mr-1.5 size-3.5" />Line them up
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset("zero")}>
            <CircleDot className="mr-1.5 size-3.5" />Both zero
          </Button>
          <div className={cn(
            "ml-auto rounded-full border px-3 py-1 text-xs font-medium",
            bothZero
              ? "border-muted-foreground/30 bg-muted/30 text-muted-foreground"
              : collinear
                ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          )}>
            {spanLabel}
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-[400px]">
        <CoordinatePlane vectors={vectors} range={range} size={size} onVectorChange={handleChange}>
          {/* dot grid of the span */}
          {dots.map((d, i) => {
            const p = toPx(d.x, d.y);
            // keep dots inside the plot area
            if (p.px < pad || p.px > size - pad || p.py < pad || p.py > size - pad) return null;
            return (
              <circle
                key={i}
                cx={p.px}
                cy={p.py}
                r={1.6}
                fill={collinear ? PLANE_COLORS.secondary : PLANE_COLORS.primary}
                opacity={collinear ? 0.7 : 0.32}
              />
            );
          })}
          {/* highlight the origin dot for the zero case */}
          {bothZero && (
            <circle cx={originPx} cy={originPx} r={4} fill={PLANE_COLORS.tertiary} />
          )}
        </CoordinatePlane>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {bothZero
          ? "Both vectors are zero, so every linear combination is just 0 + 0 = 0. The span is a single point: the origin."
          : collinear
            ? "v and w point along the same line, so a·v + b·w can never leave it. The span is that one line through the origin — the vectors are linearly dependent."
            : "v and w point in different directions, so by tuning a and b you can reach any point in the plane. The span is all of 2D space — they're linearly independent."}
      </p>
    </SimulationContainer>
  );
}
