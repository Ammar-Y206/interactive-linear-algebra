"use client";

/**
 * TransformationSim
 * ----------------------------------------------------------------
 * The signature visualization for all matrix / transformation lessons.
 *
 * The learner drags where î and ĵ land (the matrix columns). The
 * simulation morphs a grid of points accordingly and transforms a
 * chosen input vector v = (vx, vy) live, showing it as the linear
 * combination x·(new î) + y·(new ĵ).
 *
 * Presets: identity, 90° rotation, shear, scale, and a "squish"
 * (linearly dependent columns → collapses to a line).
 *
 * Built standalone (not on CoordinatePlane, because we need to draw a
 * morphing point grid + a morphed copy of the basis grid, which the
 * plane's static grid can't express). Reuses the same visual language.
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Scissors, Expand, MoveHorizontal, Grid2x2, Crosshair } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Vec { x: number; y: number }

const COLORS = {
  i: "#fbbf24", // amber — î
  j: "#22d3ee", // cyan — ĵ
  v: "#34d399", // emerald — input vector
  out: "#fb7185", // rose — output
  grid: "oklch(1 0 0 / 8%)",
  gridAxis: "oklch(1 0 0 / 22%)",
  gridOrig: "oklch(1 0 0 / 4%)",
};

const PRESETS: Record<string, { i: Vec; j: Vec; label: string }> = {
  identity: { i: { x: 1, y: 0 }, j: { x: 0, y: 1 }, label: "Identity" },
  rotate90: { i: { x: 0, y: 1 }, j: { x: -1, y: 0 }, label: "90° rotation" },
  shear: { i: { x: 1, y: 0 }, j: { x: 1, y: 1 }, label: "Shear" },
  scale: { i: { x: 2, y: 0 }, j: { x: 0, y: 2 }, label: "Scale ×2" },
  squish: { i: { x: 1, y: 1 }, j: { x: 2, y: 2 }, label: "Squish (dependent)" },
};

export function TransformationSim() {
  const [iHat, setIHat] = useState<Vec>(PRESETS.identity.i);
  const [jHat, setJHat] = useState<Vec>(PRESETS.identity.j);
  const [v, setV] = useState<Vec>({ x: 2, y: 1 });

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"i" | "j" | "v" | null>(null);
  const [hover, setHover] = useState<"i" | "j" | "v" | null>(null);

  const size = 380;
  const range = 5;
  const pad = 28;
  const plotSize = size - pad * 2;
  const unit = plotSize / (range * 2);
  const origin = pad + range * unit;

  const toPx = (mx: number, my: number) => ({
    px: origin + mx * unit,
    py: origin - my * unit,
  });
  const toMath = (px: number, py: number) => ({
    x: (px - pad - range * unit) / unit,
    y: (range * unit - (py - pad)) / unit,
  });

  // transformed vector: v = vx·î_new + vy·ĵ_new
  const out: Vec = {
    x: v.x * iHat.x + v.y * jHat.x,
    y: v.x * iHat.y + v.y * jHat.y,
  };

  // linear dependence check
  const cross = iHat.x * jHat.y - iHat.y * jHat.x;
  const dependent = Math.abs(cross) < 0.05 && !(iHat.x === 0 && iHat.y === 0 && jHat.x === 0 && jHat.y === 0);

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

  function onPointerDown(which: "i" | "j" | "v", e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDrag(which);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    const m = pointerToMath(e);
    if (drag === "i") setIHat(m);
    else if (drag === "j") setJHat(m);
    else setV(m);
  }
  function onPointerUp(e: React.PointerEvent) {
    setDrag(null);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }

  // build grid lines for the transformed space
  const gridLines = [];
  for (let k = -range; k <= range; k++) {
    // vertical line of original grid: points (k, y) for y in [-range, range]
    // transforms to k·î + y·ĵ  => as y varies, this is a line through k·î in direction ĵ
    const startV = { x: k * iHat.x + -range * jHat.x, y: k * iHat.y + -range * jHat.y };
    const endV = { x: k * iHat.x + range * jHat.x, y: k * iHat.y + range * jHat.y };
    const sV = toPx(startV.x, startV.y);
    const eV = toPx(endV.x, endV.y);
    const isAxisV = k === 0;
    gridLines.push(
      <line key={`v-${k}`} x1={sV.px} y1={sV.py} x2={eV.px} y2={eV.py}
        stroke={isAxisV ? COLORS.gridAxis : COLORS.grid} strokeWidth={isAxisV ? 1.5 : 1} />
    );
    // horizontal line: points (x, k) for x in [-range, range]
    // transforms to x·î + k·ĵ  => line through k·ĵ in direction î
    const startH = { x: -range * iHat.x + k * jHat.x, y: -range * iHat.y + k * jHat.y };
    const endH = { x: range * iHat.x + k * jHat.x, y: range * iHat.y + k * jHat.y };
    const sH = toPx(startH.x, startH.y);
    const eH = toPx(endH.x, endH.y);
    const isAxisH = k === 0;
    gridLines.push(
      <line key={`h-${k}`} x1={sH.px} y1={sH.py} x2={eH.px} y2={eH.py}
        stroke={isAxisH ? COLORS.gridAxis : COLORS.grid} strokeWidth={isAxisH ? 1.5 : 1} />
    );
  }

  // faint original grid for reference
  const origGrid = [];
  for (let k = -range; k <= range; k++) {
    const p = toPx(k, 0);
    origGrid.push(<line key={`ov-${k}`} x1={p.px} y1={pad} x2={p.px} y2={size - pad} stroke={COLORS.gridOrig} strokeWidth={1} />);
    origGrid.push(<line key={`oh-${k}`} x1={pad} y1={p.py} x2={size - pad} y2={p.py} stroke={COLORS.gridOrig} strokeWidth={1} />);
  }

  const iPx = toPx(iHat.x, iHat.y);
  const jPx = toPx(jHat.x, jHat.y);
  const vPx = toPx(v.x, v.y);
  const outPx = toPx(out.x, out.y);
  const o = toPx(0, 0);

  function applyPreset(p: keyof typeof PRESETS) {
    setIHat(PRESETS[p].i);
    setJHat(PRESETS[p].j);
  }

  return (
    <SimulationContainer
      title="Matrix = where î and ĵ land"
      description="Drag the amber (î) and cyan (ĵ) tips to define a transformation. The grid morphs with them. The emerald vector v travels to its rose image — a linear combination of the new î and ĵ."
      badge="Transform"
      accent="cyan"
      controls={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => applyPreset("identity")}>
              <Grid2x2 className="mr-1.5 size-3.5" />Identity
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("rotate90")}>
              <RotateCcw className="mr-1.5 size-3.5" />90° rotation
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("shear")}>
              <MoveHorizontal className="mr-1.5 size-3.5" />Shear
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("scale")}>
              <Expand className="mr-1.5 size-3.5" />Scale ×2
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("squish")}>
              <Scissors className="mr-1.5 size-3.5" />Squish
            </Button>
            {dependent && (
              <span className="ml-auto rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-300">
                Columns dependent → space squished to a line
              </span>
            )}
          </div>

          {/* matrix display */}
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-border/50 bg-background/40 p-3">
            <span className="text-xs text-muted-foreground">Matrix</span>
            <div className="flex items-center gap-1 font-mono text-sm">
              <span className="text-3xl text-muted-foreground/60">[</span>
              <div className="flex flex-col gap-1">
                <div className="flex gap-3">
                  <span className="w-12 text-right text-amber-300">{iHat.x.toFixed(1)}</span>
                  <span className="w-12 text-right text-cyan-300">{jHat.x.toFixed(1)}</span>
                </div>
                <div className="flex gap-3">
                  <span className="w-12 text-right text-amber-300">{iHat.y.toFixed(1)}</span>
                  <span className="w-12 text-right text-cyan-300">{jHat.y.toFixed(1)}</span>
                </div>
              </div>
              <span className="text-3xl text-muted-foreground/60">]</span>
            </div>
            <span className="text-xs text-muted-foreground">columns = where î, ĵ land</span>
          </div>

          {/* input vector sliders */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-sm">
                  <span className="size-2.5 rounded-full bg-emerald-400" />vₓ
                </Label>
                <span className="font-mono text-sm font-bold text-emerald-300">{v.x.toFixed(2)}</span>
              </div>
              <Slider value={[v.x]} onValueChange={(val) => setV((p) => ({ ...p, x: val[0] }))} min={-4} max={4} step={0.1} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-sm">
                  <span className="size-2.5 rounded-full bg-emerald-400" />vᵧ
                </Label>
                <span className="font-mono text-sm font-bold text-emerald-300">{v.y.toFixed(2)}</span>
              </div>
              <Slider value={[v.y]} onValueChange={(val) => setV((p) => ({ ...p, y: val[0] }))} min={-4} max={4} step={0.1} />
            </div>
          </div>

          {/* computation */}
          <div className="rounded-xl border border-border/50 bg-background/40 p-3 font-mono text-xs leading-relaxed">
            <span className="text-emerald-300">{v.x.toFixed(2)}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-amber-300">({iHat.x.toFixed(1)}, {iHat.y.toFixed(1)})</span>
            <span className="text-muted-foreground"> + </span>
            <span className="text-emerald-300">{v.y.toFixed(2)}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-cyan-300">({jHat.x.toFixed(1)}, {jHat.y.toFixed(1)})</span>
            <span className="text-muted-foreground"> = </span>
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
                { c: COLORS.i, id: "ar-i" },
                { c: COLORS.j, id: "ar-j" },
                { c: COLORS.v, id: "ar-v" },
                { c: COLORS.out, id: "ar-out" },
              ].map((m) => (
                <marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} />
                </marker>
              ))}
            </defs>

            {/* faint original grid */}
            {origGrid}
            {/* transformed grid */}
            {gridLines}

            {/* input vector v (emerald) */}
            <line x1={o.px} y1={o.py} x2={vPx.px} y2={vPx.py} stroke={COLORS.v} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#ar-v)" />
            {/* output vector (rose) — drawn from origin */}
            <line x1={o.px} y1={o.py} x2={outPx.px} y2={outPx.py} stroke={COLORS.out} strokeWidth={3} strokeLinecap="round" markerEnd="url(#ar-out)" opacity={0.95} />

            {/* î (amber) */}
            <line x1={o.px} y1={o.py} x2={iPx.px} y2={iPx.py} stroke={COLORS.i} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#ar-i)" />
            <circle cx={iPx.px} cy={iPx.py} r={drag === "i" || hover === "i" ? 11 : 9} fill={COLORS.i} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5}
              className="cursor-grab transition-[r]" onPointerDown={(e) => onPointerDown("i", e)} onPointerEnter={() => setHover("i")} onPointerLeave={() => setHover(null)} />
            <text x={iPx.px + 10} y={iPx.py - 8} className="fill-amber-300 font-mono" style={{ fontSize: 12, fontWeight: 700 }}>î</text>

            {/* ĵ (cyan) */}
            <line x1={o.px} y1={o.py} x2={jPx.px} y2={jPx.py} stroke={COLORS.j} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#ar-j)" />
            <circle cx={jPx.px} cy={jPx.py} r={drag === "j" || hover === "j" ? 11 : 9} fill={COLORS.j} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5}
              className="cursor-grab transition-[r]" onPointerDown={(e) => onPointerDown("j", e)} onPointerEnter={() => setHover("j")} onPointerLeave={() => setHover(null)} />
            <text x={jPx.px + 10} y={jPx.py - 8} className="fill-cyan-300 font-mono" style={{ fontSize: 12, fontWeight: 700 }}>ĵ</text>

            {/* v tip handle */}
            <circle cx={vPx.px} cy={vPx.py} r={drag === "v" || hover === "v" ? 9 : 7} fill={COLORS.v} stroke="oklch(0.16 0.012 250)" strokeWidth={2}
              className="cursor-grab transition-[r]" onPointerDown={(e) => onPointerDown("v", e)} onPointerEnter={() => setHover("v")} onPointerLeave={() => setHover(null)} />

            {/* output label */}
            <text x={outPx.px + 10} y={outPx.py + 4} className="fill-rose-300 font-mono" style={{ fontSize: 12, fontWeight: 700 }}>
              ({out.x.toFixed(1)}, {out.y.toFixed(1)})
            </text>

            {/* origin */}
            <circle cx={o.px} cy={o.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Crosshair className="size-3" />
        {dependent
          ? "î and ĵ landed on the same line, so the whole plane got squished onto it. A dimension was lost."
          : "Drag î (amber) and ĵ (cyan) to set the matrix columns. The emerald vector is the input v; the rose vector is where v lands."}
      </p>
    </SimulationContainer>
  );
}
