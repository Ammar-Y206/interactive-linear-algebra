"use client";

/**
 * CoordinatePlane
 * ----------------------------------------------------------------
 * A reusable, interactive SVG coordinate system. This is the
 * backbone of every vector visualization in the course.
 *
 * Responsibilities:
 *  - Draw a responsive grid + axes with tick labels
 *  - Render an arbitrary list of vectors as arrows rooted at origin
 *  - Optionally render the vector sum (tip-to-tail visualization handled
 *    by the caller via the `vectors` prop ordering)
 *  - Support dragging vector tips (pointer events) for interactive sims
 *
 * It is a CONTROLLED component: vectors come in as props, and tip
 * drags call `onVectorChange`. Parents own the math.
 * ----------------------------------------------------------------
 */

import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface PlaneVector {
  id: string;
  x: number;
  y: number;
  /** CSS color string. Defaults to the emerald accent. */
  color?: string;
  /** optional label drawn near the tip */
  label?: string;
  /** allow the tip to be dragged */
  draggable?: boolean;
  /** draw dashed projection lines to the axes */
  showProjection?: boolean;
  /** render as a faint "ghost" (e.g. the original before a transform) */
  ghost?: boolean;
}

export interface CoordinatePlaneProps {
  vectors?: PlaneVector[];
  size?: number;
  /** axes span -range .. +range on both x and y */
  range?: number;
  showGrid?: boolean;
  showAxisLabels?: boolean;
  /** optional extra overlay drawn in SVG user space (origin-centered) */
  children?: React.ReactNode;
  className?: string;
  onVectorChange?: (id: string, x: number, y: number) => void;
  /** snap dragged tips to integer grid */
  snap?: boolean;
}

const DEFAULT_COLORS = {
  primary: "#34d399", // emerald-400
  secondary: "#fbbf24", // amber-400
  tertiary: "#fb7185", // rose-400
  quaternary: "#22d3ee", // cyan-400
};

export function CoordinatePlane({
  vectors = [],
  size = 360,
  range = 5,
  showGrid = true,
  showAxisLabels = true,
  children,
  className,
  onVectorChange,
  snap = false,
}: CoordinatePlaneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  // padding around the plotting area for axis labels
  const pad = 28;
  const plotSize = size - pad * 2;
  const unit = plotSize / (range * 2);

  // convert math coords -> svg pixel coords (origin at center)
  const toPx = useCallback(
    (mx: number, my: number) => ({
      px: pad + range * unit + mx * unit,
      py: pad + range * unit - my * unit,
    }),
    [pad, range, unit]
  );

  // convert svg pixel coords -> math coords
  const toMath = useCallback(
    (px: number, py: number) => ({
      x: (px - pad - range * unit) / unit,
      y: (range * unit - (py - pad)) / unit,
    }),
    [pad, range, unit]
  );

  const origin = toPx(0, 0);

  const pointerToMath = useCallback(
    (e: React.PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const local = pt.matrixTransform(ctm.inverse());
      let { x, y } = toMath(local.x, local.y);
      // clamp to range
      x = Math.max(-range, Math.min(range, x));
      y = Math.max(-range, Math.min(range, y));
      if (snap) {
        x = Math.round(x);
        y = Math.round(y);
      }
      return { x, y };
    },
    [range, snap, toMath]
  );

  const handlePointerDown = useCallback(
    (id: string, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDraggingId(id);
      (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingId || !onVectorChange) return;
      const { x, y } = pointerToMath(e);
      onVectorChange(draggingId, x, y);
    },
    [draggingId, onVectorChange, pointerToMath]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setDraggingId(null);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }, []);

  // grid line arrays
  const gridLines = useMemo(() => {
    const lines: number[] = [];
    for (let i = -range; i <= range; i++) lines.push(i);
    return lines;
  }, [range]);

  // build arrowhead marker ids per color
  const markers = useMemo(() => {
    const set = new Map<string, string>();
    vectors.forEach((v, i) => {
      const c = v.color ?? DEFAULT_COLORS.primary;
      if (!set.has(c)) set.set(c, `arrow-${i}-${c.replace(/[^a-z0-9]/gi, "")}`);
    });
    return set;
  }, [vectors]);

  return (
    <div
      className={cn(
        "relative rounded-xl border border-border/60 bg-card/40 p-1",
        className
      )}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        className={cn("w-full h-auto touch-none select-none", draggingId && "cursor-grabbing")}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <defs>
          {Array.from(markers.entries()).map(([color, id]) => (
            <marker
              key={id}
              id={id}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
            </marker>
          ))}
        </defs>

        {/* grid */}
        {showGrid &&
          gridLines.map((i) => {
            const isAxis = i === 0;
            const px = toPx(i, 0);
            return (
              <g key={`v-${i}`}>
                {/* vertical */}
                <line
                  x1={px.px}
                  y1={pad}
                  x2={px.px}
                  y2={size - pad}
                  stroke={isAxis ? "oklch(1 0 0 / 35%)" : "oklch(1 0 0 / 7%)"}
                  strokeWidth={isAxis ? 1.5 : 1}
                />
                {/* horizontal */}
                <line
                  x1={pad}
                  y1={px.py}
                  x2={size - pad}
                  y2={px.py}
                  stroke={isAxis ? "oklch(1 0 0 / 35%)" : "oklch(1 0 0 / 7%)"}
                  strokeWidth={isAxis ? 1.5 : 1}
                />
              </g>
            );
          })}

        {/* axis tick labels */}
        {showAxisLabels &&
          gridLines
            .filter((i) => i !== 0)
            .map((i) => {
              const xp = toPx(i, 0);
              return (
                <g key={`tick-${i}`} className="fill-muted-foreground" style={{ fontSize: 10 }}>
                  <text x={xp.px} y={origin.py + 16} textAnchor="middle">
                    {i}
                  </text>
                  <text x={origin.px - 12} y={xp.py + 3} textAnchor="middle">
                    {i}
                  </text>
                </g>
              );
            })}

        {/* origin label */}
        <text
          x={origin.px - 10}
          y={origin.py + 16}
          className="fill-muted-foreground"
          style={{ fontSize: 10 }}
        >
          0
        </text>

        {/* extra caller-provided overlay (drawn under vectors) */}
        {children}

        {/* vectors */}
        {vectors.map((v) => {
          const color = v.color ?? DEFAULT_COLORS.primary;
          const tip = toPx(v.x, v.y);
          const markerId = markers.get(color);
          const isDragging = draggingId === v.id;
          const isHover = hoverId === v.id;
          const opacity = v.ghost ? 0.35 : 1;
          const strokeWidth = isDragging || isHover ? 3.5 : 2.5;

          return (
            <g key={v.id} style={{ opacity }} className="transition-opacity">
              {/* projection dashed lines */}
              {v.showProjection && (
                <>
                  <line
                    x1={tip.px}
                    y1={tip.py}
                    x2={tip.px}
                    y2={origin.py}
                    stroke={color}
                    strokeWidth={1.25}
                    strokeDasharray="3 4"
                    opacity={0.55}
                  />
                  <line
                    x1={tip.px}
                    y1={tip.py}
                    x2={origin.px}
                    y2={tip.py}
                    stroke={color}
                    strokeWidth={1.25}
                    strokeDasharray="3 4"
                    opacity={0.55}
                  />
                  {/* coordinate dots on axes */}
                  <circle cx={tip.px} cy={origin.py} r={3} fill={color} opacity={0.7} />
                  <circle cx={origin.px} cy={tip.py} r={3} fill={color} opacity={0.7} />
                </>
              )}

              {/* main arrow */}
              <line
                x1={origin.px}
                y1={origin.py}
                x2={tip.px}
                y2={tip.py}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                markerEnd={markerId ? `url(#${markerId})` : undefined}
              />

              {/* draggable tip handle */}
              {v.draggable && (
                <circle
                  cx={tip.px}
                  cy={tip.py}
                  r={isDragging || isHover ? 11 : 9}
                  fill={color}
                  stroke="oklch(0.16 0.012 250)"
                  strokeWidth={2.5}
                  className="cursor-grab transition-[r]"
                  onPointerDown={(e) => handlePointerDown(v.id, e)}
                  onPointerEnter={() => setHoverId(v.id)}
                  onPointerLeave={() => setHoverId(null)}
                />
              )}

              {/* label near tip */}
              {v.label && (
                <text
                  x={tip.px + (v.x >= 0 ? 12 : -12)}
                  y={tip.py - (v.y >= 0 ? 10 : -10)}
                  textAnchor={v.x >= 0 ? "start" : "end"}
                  className="fill-foreground font-mono"
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  {v.label}
                </text>
              )}
            </g>
          );
        })}

        {/* origin dot on top */}
        <circle cx={origin.px} cy={origin.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
      </svg>
    </div>
  );
}

export { DEFAULT_COLORS as PLANE_COLORS };
