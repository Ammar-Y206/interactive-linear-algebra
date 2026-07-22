"use client";

/**
 * DeterminantSim
 * ----------------------------------------------------------------
 * Visualizes the determinant as the area-scaling factor.
 *
 * Drag î (amber) and ĵ (cyan). The unit square (defined by î, ĵ)
 * morphs into a parallelogram; its signed area = det = ad − bc is
 * shown live, color-coded by sign. A faint ghost of the original
 * unit square (area 1) stays for reference, so the ratio is visible.
 *
 * Presets demonstrate: scaling (det=6), shear (det=1), collapse
 * (det=0), and flip (det<0).
 *
 * Reuses the TransformationSim visual language (standalone SVG).
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { Expand, MoveHorizontal, Scissors, FlipHorizontal, Grid2x2, Crosshair } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Vec { x: number; y: number }

const COLORS = {
  i: "#fbbf24", // amber
  j: "#22d3ee", // cyan
  square: "#34d399", // emerald — transformed unit square
  ghost: "#64748b", // slate — original unit square
  grid: "oklch(1 0 0 / 7%)",
  gridAxis: "oklch(1 0 0 / 26%)",
};

const PRESETS = {
  scale: { i: { x: 3, y: 0 }, j: { x: 0, y: 2 }, label: "Scale (det=6)" },
  shear: { i: { x: 1, y: 0 }, j: { x: 1, y: 1 }, label: "Shear (det=1)" },
  collapse: { i: { x: 2, y: 1 }, j: { x: -2, y: -1 }, label: "Collapse (det=0)" },
  flip: { i: { x: 1, y: 1 }, j: { x: 2, y: -1 }, label: "Flip (det<0)" },
  identity: { i: { x: 1, y: 0 }, j: { x: 0, y: 1 }, label: "Identity" },
};

export function DeterminantSim() {
  const [iHat, setIHat] = useState<Vec>(PRESETS.identity.i);
  const [jHat, setJHat] = useState<Vec>(PRESETS.identity.j);

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"i" | "j" | null>(null);
  const [hover, setHover] = useState<"i" | "j" | null>(null);

  const size = 380;
  const range = 5;
  const pad = 28;
  const unit = (size - pad * 2) / (range * 2);
  const origin = pad + range * unit;
  const toPx = (mx: number, my: number) => ({ px: origin + mx * unit, py: origin - my * unit });
  const toMath = (px: number, py: number) => ({
    x: (px - pad - range * unit) / unit,
    y: (range * unit - (py - pad)) / unit,
  });

  // determinant = ad − bc, where columns are (a,c) and (b,d)
  const det = iHat.x * jHat.y - iHat.y * jHat.x;
  const isZero = Math.abs(det) < 0.02;
  const isNegative = det < 0 && !isZero;
  const isPositive = det > 0 && !isZero;

  function pointerToMath(e: React.PointerEvent): Vec {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const local = pt.matrixTransform(ctm.inverse());
    let { x, y } = toMath(local.x, local.y);
    x = Math.max(-range, Math.min(range, x));
    y = Math.max(-range, Math.min(range, y));
    return { x, y };
  }
  function onPointerDown(which: "i" | "j", e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDrag(which);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    const m = pointerToMath(e);
    if (drag === "i") setIHat(m);
    else setJHat(m);
  }
  function onPointerUp(e: React.PointerEvent) {
    setDrag(null);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }

  // grid
  const gridLines = [];
  for (let k = -range; k <= range; k++) {
    const p = toPx(k, 0);
    const isAxis = k === 0;
    gridLines.push(<line key={`v-${k}`} x1={p.px} y1={pad} x2={p.px} y2={size - pad} stroke={isAxis ? COLORS.gridAxis : COLORS.grid} strokeWidth={isAxis ? 1.5 : 1} />);
    gridLines.push(<line key={`h-${k}`} x1={pad} y1={p.py} x2={size - pad} y2={p.py} stroke={isAxis ? COLORS.gridAxis : COLORS.grid} strokeWidth={isAxis ? 1.5 : 1} />);
  }

  const o = toPx(0, 0);
  const iP = toPx(iHat.x, iHat.y);
  const jP = toPx(jHat.x, jHat.y);
  // the transformed unit square = parallelogram with vertices 0, î, î+ĵ, ĵ
  const ijP = toPx(iHat.x + jHat.x, iHat.y + jHat.y);
  // original unit square (ghost): 0, (1,0), (1,1), (0,1)
  const g1 = toPx(1, 0);
  const g2 = toPx(1, 1);
  const g3 = toPx(0, 1);

  function applyPreset(p: keyof typeof PRESETS) {
    setIHat(PRESETS[p].i);
    setJHat(PRESETS[p].j);
  }

  const detColor = isZero ? "text-muted-foreground" : isNegative ? "text-rose-300" : "text-emerald-300";
  const detBg = isZero ? "bg-muted/30 border-muted-foreground/30" : isNegative ? "bg-rose-500/10 border-rose-500/30" : "bg-emerald-500/10 border-emerald-500/30";

  return (
    <SimulationContainer
      title="The determinant = scaled area of the unit square"
      description="Drag î (amber) and ĵ (cyan). The emerald parallelogram is where the unit square lands. Its signed area is the determinant — the factor by which the transformation scales every region."
      badge="det"
      accent="emerald"
      controls={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => applyPreset("scale")}><Expand className="mr-1.5 size-3.5" />Scale (det=6)</Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("shear")}><MoveHorizontal className="mr-1.5 size-3.5" />Shear (det=1)</Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("collapse")}><Scissors className="mr-1.5 size-3.5" />Collapse (det=0)</Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("flip")}><FlipHorizontal className="mr-1.5 size-3.5" />Flip (det &lt; 0)</Button>
            <Button size="sm" variant="ghost" onClick={() => applyPreset("identity")}><Grid2x2 className="mr-1.5 size-3.5" />Identity</Button>
          </div>

          {/* det readout */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className={cn("flex items-center gap-3 rounded-xl border px-4 py-2.5", detBg)}>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">det</span>
              <span className={cn("font-mono text-2xl font-bold", detColor)}>{det.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-amber-300">a={iHat.x.toFixed(1)}</span>
              <span className="text-amber-300">c={iHat.y.toFixed(1)}</span>
              <span className="text-cyan-300">b={jHat.x.toFixed(1)}</span>
              <span className="text-cyan-300">d={jHat.y.toFixed(1)}</span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded bg-background/60 px-1.5 py-0.5 text-foreground">ad−bc = {det.toFixed(2)}</span>
            </div>
          </div>

          {/* status badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {isZero && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                det = 0 → space squished to a line; columns are linearly dependent
              </span>
            )}
            {isPositive && (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Areas ×{det.toFixed(2)} · orientation preserved
              </span>
            )}
            {isNegative && (
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300">
                Areas ×{Math.abs(det).toFixed(2)} · orientation FLIPPED
              </span>
            )}
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-[400px]">
        <div className="relative rounded-xl border border-border/60 bg-card/40 p-1">
          <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} className={cn("w-full h-auto touch-none select-none", drag && "cursor-grabbing")}
            onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
            <defs>
              <marker id="d-ar-i" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.i} /></marker>
              <marker id="d-ar-j" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.j} /></marker>
            </defs>

            {gridLines}

            {/* ghost original unit square */}
            <polygon points={`${o.px},${o.py} ${g1.px},${g1.py} ${g2.px},${g2.py} ${g3.px},${g3.py}`}
              fill={COLORS.ghost} fillOpacity={0.08} stroke={COLORS.ghost} strokeOpacity={0.4} strokeWidth={1.5} strokeDasharray="4 3" />

            {/* transformed unit square (parallelogram) */}
            {!isZero && (
              <polygon points={`${o.px},${o.py} ${iP.px},${iP.py} ${ijP.px},${ijP.py} ${jP.px},${jP.py}`}
                fill={isNegative ? COLORS.i : COLORS.square} fillOpacity={isNegative ? 0.12 : 0.18}
                stroke={isNegative ? "#fb7185" : COLORS.square} strokeWidth={2} />
            )}
            {/* when det=0, draw the line î and ĵ both lie on */}
            {isZero && (
              <line x1={pad} y1={pad + (size - 2 * pad) / 2 - iHat.y / iHat.x * unit * (iHat.x >= 0 ? 1 : 1)} x2={size - pad} y2={pad + (size - 2 * pad) / 2 - iHat.y / iHat.x * unit * (iHat.x >= 0 ? 1 : 1) * -1}
                stroke="#fb7185" strokeWidth={2.5} strokeDasharray="6 4" opacity={0.7} />
            )}

            {/* basis vectors */}
            <line x1={o.px} y1={o.py} x2={iP.px} y2={iP.py} stroke={COLORS.i} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#d-ar-i)" />
            <line x1={o.px} y1={o.py} x2={jP.px} y2={jP.py} stroke={COLORS.j} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#d-ar-j)" />

            {/* draggable tips */}
            <circle cx={iP.px} cy={iP.py} r={drag === "i" || hover === "i" ? 11 : 9} fill={COLORS.i} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5}
              className="cursor-grab transition-[r]" onPointerDown={(e) => onPointerDown("i", e)} onPointerEnter={() => setHover("i")} onPointerLeave={() => setHover(null)} />
            <text x={iP.px + 10} y={iP.py - 8} className="fill-amber-300 font-mono" style={{ fontSize: 13, fontWeight: 700 }}>î</text>
            <circle cx={jP.px} cy={jP.py} r={drag === "j" || hover === "j" ? 11 : 9} fill={COLORS.j} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5}
              className="cursor-grab transition-[r]" onPointerDown={(e) => onPointerDown("j", e)} onPointerEnter={() => setHover("j")} onPointerLeave={() => setHover(null)} />
            <text x={jP.px + 10} y={jP.py - 8} className="fill-cyan-300 font-mono" style={{ fontSize: 13, fontWeight: 700 }}>ĵ</text>

            <circle cx={o.px} cy={o.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Crosshair className="size-3" />
        {isZero
          ? "î and ĵ landed on the same line — the unit square has zero area, so the whole plane got squished onto that line. det = 0."
          : isNegative
            ? "ĵ crossed past î, flipping space over. The parallelogram's area is |det|; the negative sign records the flip."
            : "The emerald parallelogram is the transformed unit square (area 1 → area det). Every other region scales by the same factor."}
      </p>
    </SimulationContainer>
  );
}
