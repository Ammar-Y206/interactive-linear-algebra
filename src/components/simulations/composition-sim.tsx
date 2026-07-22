"use client";

/**
 * CompositionSim
 * ----------------------------------------------------------------
 * Visualize matrix multiplication as composition.
 *
 * Two matrices M1 (right, applies first) and M2 (left, applies
 * second). Each is editable via draggable î/ĵ. The simulation
 * shows three grids: the original (faint), after M1, and after the
 * full composition M2·M1 — plus the computed product matrix and a
 * tracked input vector traveling through both stages.
 *
 * Presets include a swap-order pair (shear-then-rotate vs rotate-
 * then-shear) to demonstrate non-commutativity.
 *
 * Reuses the TransformationSim visual language (standalone SVG).
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { RotateCcw, MoveHorizontal, ArrowRightLeft, Grid2x2, Crosshair } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Vec { x: number; y: number }
interface Mat { i: Vec; j: Vec }

const COLORS = {
  i: "#fbbf24", // amber — î
  j: "#22d3ee", // cyan — ĵ
  v: "#34d399", // emerald — input vector
  mid: "#a78bfa", // violet — intermediate (after M1)
  out: "#fb7185", // rose — final (after M2·M1)
  gridOrig: "oklch(1 0 0 / 4%)",
  gridM1: "oklch(1 0 0 / 7%)",
  gridComp: "oklch(1 0 0 / 14%)",
  gridAxis: "oklch(1 0 0 / 26%)",
};

// apply matrix m to vector v
function apply(m: Mat, v: Vec): Vec {
  return { x: v.x * m.i.x + v.y * m.j.x, y: v.x * m.i.y + v.y * m.j.y };
}
// compose: result = M2 ∘ M1 (M1 first). Column 1 = M2·M1.î, column 2 = M2·M1.ĵ
function compose(m2: Mat, m1: Mat): Mat {
  return { i: apply(m2, m1.i), j: apply(m2, m1.j) };
}

const PRESETS = {
  rotateThenShear: {
    // M1 = rotation (applies first), M2 = shear (applies second)
    m1: { i: { x: 0, y: 1 }, j: { x: -1, y: 0 } },
    m2: { i: { x: 1, y: 0 }, j: { x: 1, y: 1 } },
    label: "Rotate, then shear",
  },
  shearThenRotate: {
    m1: { i: { x: 1, y: 0 }, j: { x: 1, y: 1 } },
    m2: { i: { x: 0, y: 1 }, j: { x: -1, y: 0 } },
    label: "Shear, then rotate",
  },
  identity: {
    m1: { i: { x: 1, y: 0 }, j: { x: 0, y: 1 } },
    m2: { i: { x: 1, y: 0 }, j: { x: 0, y: 1 } },
    label: "Identity",
  },
};

export function CompositionSim() {
  const [m1, setM1] = useState<Mat>(PRESETS.rotateThenShear.m1);
  const [m2, setM2] = useState<Mat>(PRESETS.rotateThenShear.m2);
  const [v, setV] = useState<Vec>({ x: 2, y: 1 });

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"m1i" | "m1j" | "m2i" | "m2j" | "v" | null>(null);
  const [hover, setHover] = useState<string | null>(null);

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

  const comp = compose(m2, m1); // M2·M1
  const mid = apply(m1, v); // after M1
  const out = apply(m2, mid); // after M2 = apply(comp, v)

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
  function onPointerDown(which: typeof drag, e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDrag(which);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    const m = pointerToMath(e);
    if (drag === "m1i") setM1((p) => ({ ...p, i: m }));
    else if (drag === "m1j") setM1((p) => ({ ...p, j: m }));
    else if (drag === "m2i") setM2((p) => ({ ...p, i: m }));
    else if (drag === "m2j") setM2((p) => ({ ...p, j: m }));
    else if (drag === "v") setV(m);
  }
  function onPointerUp(e: React.PointerEvent) {
    setDrag(null);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }

  // build a transformed grid for a given matrix
  function gridLines(mat: Mat, color: string, axisColor: string, sw: number, axisSw: number) {
    const lines = [];
    for (let k = -range; k <= range; k++) {
      const startV = { x: k * mat.i.x + -range * mat.j.x, y: k * mat.i.y + -range * mat.j.y };
      const endV = { x: k * mat.i.x + range * mat.j.x, y: k * mat.i.y + range * mat.j.y };
      const s = toPx(startV.x, startV.y);
      const e = toPx(endV.x, endV.y);
      const isAxis = k === 0;
      lines.push(
        <line key={`v-${k}`} x1={s.px} y1={s.py} x2={e.px} y2={e.py}
          stroke={isAxis ? axisColor : color} strokeWidth={isAxis ? axisSw : sw} />
      );
      const startH = { x: -range * mat.i.x + k * mat.j.x, y: -range * mat.i.y + k * mat.j.y };
      const endH = { x: range * mat.i.x + k * mat.j.x, y: range * mat.i.y + k * mat.j.y };
      const sH = toPx(startH.x, startH.y);
      const eH = toPx(endH.x, endH.y);
      lines.push(
        <line key={`h-${k}`} x1={sH.px} y1={sH.py} x2={eH.px} y2={eH.py}
          stroke={isAxis ? axisColor : color} strokeWidth={isAxis ? axisSw : sw} />
      );
    }
    return lines;
  }

  // faint original grid
  const origGrid = [];
  for (let k = -range; k <= range; k++) {
    const p = toPx(k, 0);
    origGrid.push(<line key={`ov-${k}`} x1={p.px} y1={pad} x2={p.px} y2={size - pad} stroke={COLORS.gridOrig} strokeWidth={1} />);
    origGrid.push(<line key={`oh-${k}`} x1={pad} y1={p.py} x2={size - pad} y2={p.py} stroke={COLORS.gridOrig} strokeWidth={1} />);
  }

  const o = toPx(0, 0);
  const vPx = toPx(v.x, v.y);
  const midPx = toPx(mid.x, mid.y);
  const outPx = toPx(out.x, out.y);

  // M1's î/ĵ tips (drawn faintly — they define the intermediate grid)
  const m1iPx = toPx(m1.i.x, m1.i.y);
  const m1jPx = toPx(m1.j.x, m1.j.y);
  // Composed î/ĵ tips (the product matrix columns)
  const ciPx = toPx(comp.i.x, comp.i.y);
  const cjPx = toPx(comp.j.x, comp.j.y);

  function applyPreset(p: keyof typeof PRESETS) {
    setM1(PRESETS[p].m1);
    setM2(PRESETS[p].m2);
  }
  function swap() {
    setM1(m2);
    setM2(m1);
  }

  return (
    <SimulationContainer
      title="M2 · M1 = one transform doing both"
      description="M1 applies first (right), then M2 (left). The composed grid shows the overall effect; the product matrix captures it in four numbers. Track the emerald vector through both stages to its rose destination."
      badge="Compose"
      accent="cyan"
      controls={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => applyPreset("rotateThenShear")}>
              <RotateCcw className="mr-1.5 size-3.5" />Rotate → Shear
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("shearThenRotate")}>
              <MoveHorizontal className="mr-1.5 size-3.5" />Shear → Rotate
            </Button>
            <Button size="sm" variant="outline" onClick={swap}>
              <ArrowRightLeft className="mr-1.5 size-3.5" />Swap order
            </Button>
            <Button size="sm" variant="ghost" onClick={() => applyPreset("identity")}>
              <Grid2x2 className="mr-1.5 size-3.5" />Identity
            </Button>
          </div>

          {/* three matrices side by side */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <MatrixDisplay label="M2 (left)" mat={m2} accentI="emerald" accentJ="cyan" />
            <span className="text-lg text-muted-foreground">·</span>
            <MatrixDisplay label="M1 (right)" mat={m1} accentI="amber" accentJ="cyan" />
            <span className="text-lg text-muted-foreground">=</span>
            <MatrixDisplay label="Product" mat={comp} accentI="rose" accentJ="rose" highlight />
          </div>

          {/* v path */}
          <div className="rounded-xl border border-border/50 bg-background/40 p-3 font-mono text-xs leading-relaxed">
            <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Tracking v = ({v.x.toFixed(1)}, {v.y.toFixed(1)})</div>
            <span className="text-emerald-300">v</span>
            <span className="text-muted-foreground"> —M1→ </span>
            <span className="text-violet-300">({mid.x.toFixed(2)}, {mid.y.toFixed(2)})</span>
            <span className="text-muted-foreground"> —M2→ </span>
            <span className="rounded-md bg-rose-500/15 px-1.5 py-0.5 font-bold text-rose-300">
              ({out.x.toFixed(2)}, {out.y.toFixed(2)})
            </span>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-[400px]">
        <div className="relative rounded-xl border border-border/60 bg-card/40 p-1">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${size} ${size}`}
            className={cn("w-full h-auto touch-none select-none", drag && "cursor-grabbing")}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <defs>
              {[
                { c: COLORS.v, id: "c-ar-v" },
                { c: COLORS.mid, id: "c-ar-mid" },
                { c: COLORS.out, id: "c-ar-out" },
              ].map((m) => (
                <marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} />
                </marker>
              ))}
            </defs>

            {/* original (faint), after M1 (medium), composed (boldest) */}
            {origGrid}
            {gridLines(m1, COLORS.gridM1, COLORS.gridM1, 1, 1.25)}
            {gridLines(comp, COLORS.gridComp, COLORS.gridAxis, 1.25, 1.75)}

            {/* input v (emerald) */}
            <line x1={o.px} y1={o.py} x2={vPx.px} y2={vPx.py} stroke={COLORS.v} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#c-ar-v)" />
            {/* intermediate (violet) — from origin */}
            <line x1={o.px} y1={o.py} x2={midPx.px} y2={midPx.py} stroke={COLORS.mid} strokeWidth={2} strokeLinecap="round" markerEnd="url(#c-ar-mid)" opacity={0.7} strokeDasharray="4 3" />
            {/* output (rose) */}
            <line x1={o.px} y1={o.py} x2={outPx.px} y2={outPx.py} stroke={COLORS.out} strokeWidth={3} strokeLinecap="round" markerEnd="url(#c-ar-out)" />

            {/* composed î/ĵ (the product columns) drawn faintly */}
            <line x1={o.px} y1={o.py} x2={ciPx.px} y2={ciPx.py} stroke={COLORS.i} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
            <line x1={o.px} y1={o.py} x2={cjPx.px} y2={cjPx.py} stroke={COLORS.j} strokeWidth={2} strokeLinecap="round" opacity={0.5} />

            {/* M1 î/ĵ draggable handles */}
            <circle cx={m1iPx.px} cy={m1iPx.py} r={drag === "m1i" || hover === "m1i" ? 10 : 8} fill={COLORS.i} stroke="oklch(0.16 0.012 250)" strokeWidth={2}
              className="cursor-grab transition-[r]" onPointerDown={(e) => onPointerDown("m1i", e)} onPointerEnter={() => setHover("m1i")} onPointerLeave={() => setHover(null)} opacity={0.8} />
            <circle cx={m1jPx.px} cy={m1jPx.py} r={drag === "m1j" || hover === "m1j" ? 10 : 8} fill={COLORS.j} stroke="oklch(0.16 0.012 250)" strokeWidth={2}
              className="cursor-grab transition-[r]" onPointerDown={(e) => onPointerDown("m1j", e)} onPointerEnter={() => setHover("m1j")} onPointerLeave={() => setHover(null)} opacity={0.8} />

            {/* v draggable */}
            <circle cx={vPx.px} cy={vPx.py} r={drag === "v" || hover === "v" ? 9 : 7} fill={COLORS.v} stroke="oklch(0.16 0.012 250)" strokeWidth={2}
              className="cursor-grab transition-[r]" onPointerDown={(e) => onPointerDown("v", e)} onPointerEnter={() => setHover("v")} onPointerLeave={() => setHover(null)} />

            {/* output label */}
            <text x={outPx.px + 10} y={outPx.py + 4} className="fill-rose-300 font-mono" style={{ fontSize: 12, fontWeight: 700 }}>
              ({out.x.toFixed(1)}, {out.y.toFixed(1)})
            </text>

            <circle cx={o.px} cy={o.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Crosshair className="size-3" />
        Faintest = original. Medium = after M1. Boldest = after the full composition. Drag the amber/cyan tips to edit M1; use the presets or swap to feel how order changes the result.
      </p>
    </SimulationContainer>
  );
}

/* ---------------- local helper ---------------- */
function MatrixDisplay({
  label,
  mat,
  accentI,
  accentJ,
  highlight,
}: {
  label: string;
  mat: Mat;
  accentI: string;
  accentJ: string;
  highlight?: boolean;
}) {
  const colorMap: Record<string, string> = {
    amber: "text-amber-300",
    cyan: "text-cyan-300",
    emerald: "text-emerald-300",
    rose: "text-rose-300",
  };
  return (
    <div className={cn("rounded-lg border px-2.5 py-1.5", highlight ? "border-rose-500/30 bg-rose-500/5" : "border-border/50 bg-background/40")}>
      <div className="mb-0.5 text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="flex items-center gap-0.5 font-mono text-xs">
        <span className="text-lg text-muted-foreground/50">[</span>
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-2.5">
            <span className={cn("w-7 text-right", colorMap[accentI])}>{mat.i.x.toFixed(1)}</span>
            <span className={cn("w-7 text-right", colorMap[accentJ])}>{mat.j.x.toFixed(1)}</span>
          </div>
          <div className="flex gap-2.5">
            <span className={cn("w-7 text-right", colorMap[accentI])}>{mat.i.y.toFixed(1)}</span>
            <span className={cn("w-7 text-right", colorMap[accentJ])}>{mat.j.y.toFixed(1)}</span>
          </div>
        </div>
        <span className="text-lg text-muted-foreground/50">]</span>
      </div>
    </div>
  );
}
