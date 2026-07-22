"use client";

/**
 * Transform3DSim
 * ----------------------------------------------------------------
 * The 3D counterpart to TransformationSim. An isometric projection
 * of 3D space with three draggable basis vectors î (amber, x),
 * ĵ (cyan, y), k̂ (violet, z). The 3×3 matrix columns are their
 * landing spots. A tracked input vector (emerald) transforms to its
 * rose image as a linear combination of the three columns.
 *
 * Presets: identity, 90° y-axis rotation, and a "flatten" (collapses
 * one dimension) to preview where determinants are heading.
 *
 * Isometric projection: screen_x = (x - y) * cos30, screen_y = (x + y)
 * * sin30 - z. This keeps the three axes visually distinct.
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { RotateCcw, Layers3, Scissors, Box, Crosshair } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Vec3 { x: number; y: number; z: number }
interface Mat3 { i: Vec3; j: Vec3; k: Vec3 } // columns = where î,ĵ,k̂ land

const COLORS = {
  i: "#fbbf24", // amber — î (x-axis)
  j: "#22d3ee", // cyan — ĵ (y-axis)
  k: "#a78bfa", // violet — k̂ (z-axis)
  v: "#34d399", // emerald — input
  out: "#fb7185", // rose — output
  grid: "oklch(1 0 0 / 7%)",
  gridAxis: "oklch(1 0 0 / 26%)",
  ground: "oklch(1 0 0 / 4%)",
};

const PRESETS: Record<string, { m: Mat3; label: string }> = {
  identity: { m: { i: { x: 1, y: 0, z: 0 }, j: { x: 0, y: 1, z: 0 }, k: { x: 0, y: 0, z: 1 } }, label: "Identity" },
  rotY90: {
    // 90° rotation about the y-axis: î → (0,0,-1), ĵ → (0,1,0), k̂ → (1,0,0)
    m: { i: { x: 0, y: 0, z: -1 }, j: { x: 0, y: 1, z: 0 }, k: { x: 1, y: 0, z: 0 } },
    label: "90° y-rotation",
  },
  flatten: {
    // collapses z: k̂ → 0, so space flattens to the xy-plane
    m: { i: { x: 1, y: 0, z: 0 }, j: { x: 0, y: 1, z: 0 }, k: { x: 0, y: 0, z: 0 } },
    label: "Flatten (lose z)",
  },
};

const COS30 = Math.cos(Math.PI / 6); // ~0.866
const SIN30 = Math.sin(Math.PI / 6); // 0.5
const UNIT = 34; // pixels per unit

export function Transform3DSim() {
  const [mat, setMat] = useState<Mat3>(PRESETS.identity.m);
  const [v, setV] = useState<Vec3>({ x: 1.5, y: 1, z: 1 });

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"i" | "j" | "k" | null>(null);
  const [hover, setHover] = useState<"i" | "j" | "k" | null>(null);

  const size = 400;
  const cx = size / 2;
  const cy = size / 2 + 30;

  // project a 3D point to 2D screen coords (isometric)
  const proj = (p: Vec3) => ({
    px: cx + (p.x - p.y) * UNIT * COS30,
    py: cy + (p.x + p.y) * UNIT * SIN30 - p.z * UNIT,
  });

  // apply matrix to vector: x·î + y·ĵ + z·k̂
  const apply = (m: Mat3, p: Vec3): Vec3 => ({
    x: p.x * m.i.x + p.y * m.j.x + p.z * m.k.x,
    y: p.x * m.i.y + p.y * m.j.y + p.z * m.k.y,
    z: p.x * m.i.z + p.y * m.j.z + p.z * m.k.z,
  });

  const out = apply(mat, v);

  // detect a flattened (singular) matrix: the three column vectors are coplanar/dependent
  // scalar triple product î · (ĵ × k̂)
  const cross = {
    x: mat.j.y * mat.k.z - mat.j.z * mat.k.y,
    y: mat.j.z * mat.k.x - mat.j.x * mat.k.z,
    z: mat.j.x * mat.k.y - mat.j.y * mat.k.x,
  };
  const triple = mat.i.x * cross.x + mat.i.y * cross.y + mat.i.z * cross.z;
  const flattened = Math.abs(triple) < 0.05;

  function pointerToVec3(e: React.PointerEvent): Vec3 {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0, z: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0, z: 0 };
    const local = pt.matrixTransform(ctm.inverse());
    // invert the projection for z=0 plane first (the ground), then snap based on drag
    // screen: px = cx + (x-y)*U*C30 ; py = cy + (x+y)*U*S30 - z*U
    // solve for x,y given an assumed z. We pick z from the current vector's z for the basis,
    // or 0 for simplicity — and round to 0.5 grid.
    const dx = (local.x - cx) / (UNIT * COS30);
    const dy = local.y - cy;
    // assume we're dragging on the plane at the current z of that basis vector's target
    const zAssumed = drag === "i" ? mat.i.z : drag === "j" ? mat.j.z : mat.k.z;
    const xPlusY = (dy + zAssumed * UNIT) / (UNIT * SIN30);
    let x = (dx + xPlusY) / 2;
    let y = (xPlusY - dx) / 2;
    x = Math.max(-3, Math.min(3, x));
    y = Math.max(-3, Math.min(3, y));
    return { x: Math.round(x * 2) / 2, y: Math.round(y * 2) / 2, z: zAssumed };
  }

  function onPointerDown(which: "i" | "j" | "k", e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDrag(which);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    const p = pointerToVec3(e);
    setMat((m) => ({ ...m, [drag]: p }));
  }
  function onPointerUp(e: React.PointerEvent) {
    setDrag(null);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }

  // z-adjustment for a dragged basis vector (lift/lower)
  function adjustZ(which: "i" | "j" | "k", delta: number) {
    setMat((m) => {
      const cur = m[which];
      return { ...m, [which]: { ...cur, z: Math.max(-3, Math.min(3, Math.round((cur.z + delta) * 2) / 2)) } };
    });
  }

  function applyPreset(p: keyof typeof PRESETS) {
    setMat(PRESETS[p].m);
  }

  // build a faint ground grid (the xy-plane, z=0) and the transformed basis grid
  const groundGrid = [];
  for (let g = -3; g <= 3; g++) {
    const a = proj({ x: g, y: -3, z: 0 });
    const b = proj({ x: g, y: 3, z: 0 });
    const c = proj({ x: -3, y: g, z: 0 });
    const d = proj({ x: 3, y: g, z: 0 });
    const isAxis = g === 0;
    groundGrid.push(<line key={`gv-${g}`} x1={a.px} y1={a.py} x2={b.px} y2={b.py} stroke={isAxis ? COLORS.gridAxis : COLORS.ground} strokeWidth={isAxis ? 1.5 : 1} />);
    groundGrid.push(<line key={`gh-${g}`} x1={c.px} y1={c.py} x2={d.px} y2={d.py} stroke={isAxis ? COLORS.gridAxis : COLORS.ground} strokeWidth={isAxis ? 1.5 : 1} />);
  }

  // transformed grid: a parallelogram patch on the plane spanned by î', ĵ' at z steps of k̂
  // We draw a 2x2x2 set of grid lines in the transformed space (keeps it readable).
  const tGrid = [];
  const R = 2;
  for (let g = -R; g <= R; g++) {
    // line along î' direction: from g·ĵ' + (-R)·î' to g·ĵ' + R·î'  (at z=0 slice)
    for (const zSlice of [-1, 0, 1]) {
      const start = { x: -R * mat.i.x + g * mat.j.x + zSlice * mat.k.x, y: -R * mat.i.y + g * mat.j.y + zSlice * mat.k.y, z: -R * mat.i.z + g * mat.j.z + zSlice * mat.k.z };
      const end = { x: R * mat.i.x + g * mat.j.x + zSlice * mat.k.x, y: R * mat.i.y + g * mat.j.y + zSlice * mat.k.y, z: R * mat.i.z + g * mat.j.z + zSlice * mat.k.z };
      const s = proj(start); const en = proj(end);
      const isAxis = g === 0 && zSlice === 0;
      tGrid.push(<line key={`ti-${g}-${zSlice}`} x1={s.px} y1={s.py} x2={en.px} y2={en.py} stroke={isAxis ? COLORS.gridAxis : COLORS.grid} strokeWidth={isAxis ? 1.5 : 1} />);
      // line along ĵ' direction
      const sH = { x: g * mat.i.x + -R * mat.j.x + zSlice * mat.k.x, y: g * mat.i.y + -R * mat.j.y + zSlice * mat.k.y, z: g * mat.i.z + -R * mat.j.z + zSlice * mat.k.z };
      const eH = { x: g * mat.i.x + R * mat.j.x + zSlice * mat.k.x, y: g * mat.i.y + R * mat.j.y + zSlice * mat.k.y, z: g * mat.i.z + R * mat.j.z + zSlice * mat.k.z };
      const sP = proj(sH); const eP = proj(eH);
      tGrid.push(<line key={`tj-${g}-${zSlice}`} x1={sP.px} y1={sP.py} x2={eP.px} y2={eP.py} stroke={isAxis ? COLORS.gridAxis : COLORS.grid} strokeWidth={isAxis ? 1.5 : 1} />);
    }
  }

  const o = proj({ x: 0, y: 0, z: 0 });
  const iPx = proj(mat.i);
  const jPx = proj(mat.j);
  const kPx = proj(mat.k);
  const vPx = proj(v);
  const outPx = proj(out);

  // arrow markers
  const markers = [
    { c: COLORS.i, id: "3d-ar-i" },
    { c: COLORS.j, id: "3d-ar-j" },
    { c: COLORS.k, id: "3d-ar-k" },
    { c: COLORS.v, id: "3d-ar-v" },
    { c: COLORS.out, id: "3d-ar-out" },
  ];

  return (
    <SimulationContainer
      title="A 3×3 matrix = where î, ĵ, k̂ land"
      description="Three basis vectors, nine numbers. Drag î (amber), ĵ (cyan), k̂ (violet) on the ground plane — use the ±z buttons to lift them. The emerald vector travels to its rose image: x·î' + y·ĵ' + z·k̂'."
      badge="3D"
      accent="cyan"
      controls={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => applyPreset("identity")}><Box className="mr-1.5 size-3.5" />Identity</Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("rotY90")}><RotateCcw className="mr-1.5 size-3.5" />90° y-rotation</Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("flatten")}><Scissors className="mr-1.5 size-3.5" />Flatten</Button>
            {flattened && (
              <span className="ml-auto rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-300">
                Vectors dependent → space flattened
              </span>
            )}
          </div>

          {/* 3×3 matrix display */}
          <div className="flex items-center justify-center gap-3 rounded-xl border border-border/50 bg-background/40 p-3">
            <span className="text-xs text-muted-foreground">Matrix</span>
            <div className="flex items-center gap-1 font-mono text-sm">
              <span className="text-3xl text-muted-foreground/60">[</span>
              <div className="flex flex-col gap-1">
                <div className="flex gap-4">
                  <span className="w-12 text-right text-amber-300">{mat.i.x.toFixed(1)}</span>
                  <span className="w-12 text-right text-cyan-300">{mat.j.x.toFixed(1)}</span>
                  <span className="w-12 text-right text-violet-300">{mat.k.x.toFixed(1)}</span>
                </div>
                <div className="flex gap-4">
                  <span className="w-12 text-right text-amber-300">{mat.i.y.toFixed(1)}</span>
                  <span className="w-12 text-right text-cyan-300">{mat.j.y.toFixed(1)}</span>
                  <span className="w-12 text-right text-violet-300">{mat.k.y.toFixed(1)}</span>
                </div>
                <div className="flex gap-4">
                  <span className="w-12 text-right text-amber-300">{mat.i.z.toFixed(1)}</span>
                  <span className="w-12 text-right text-cyan-300">{mat.j.z.toFixed(1)}</span>
                  <span className="w-12 text-right text-violet-300">{mat.k.z.toFixed(1)}</span>
                </div>
              </div>
              <span className="text-3xl text-muted-foreground/60">]</span>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:inline">columns = î, ĵ, k̂ destinations</span>
          </div>

          {/* z-adjust + input vector sliders */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="mb-2 text-xs text-muted-foreground">Lift basis vectors (z)</div>
              <div className="flex items-center gap-2">
                {(["i", "j", "k"] as const).map((w) => (
                  <div key={w} className="flex items-center gap-1">
                    <span className={cn("font-mono text-xs font-bold", w === "i" ? "text-amber-300" : w === "j" ? "text-cyan-300" : "text-violet-300")}>
                      {w === "i" ? "î" : w === "j" ? "ĵ" : "k̂"}
                    </span>
                    <Button size="sm" variant="ghost" className="size-6 p-0" onClick={() => adjustZ(w, -0.5)}>−</Button>
                    <span className="w-8 text-center font-mono text-xs">{mat[w].z.toFixed(1)}</span>
                    <Button size="sm" variant="ghost" className="size-6 p-0" onClick={() => adjustZ(w, 0.5)}>+</Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2 rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-xs"><span className="size-2 rounded-full bg-emerald-400" />vₓ</Label>
                <span className="font-mono text-sm font-bold text-emerald-300">{v.x.toFixed(1)}</span>
              </div>
              <Slider value={[v.x]} onValueChange={(val) => setV((p) => ({ ...p, x: val[0] }))} min={-2} max={2} step={0.5} />
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-xs"><span className="size-2 rounded-full bg-emerald-400" />vᵧ</Label>
                <span className="font-mono text-sm font-bold text-emerald-300">{v.y.toFixed(1)}</span>
              </div>
              <Slider value={[v.y]} onValueChange={(val) => setV((p) => ({ ...p, y: val[0] }))} min={-2} max={2} step={0.5} />
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-xs"><span className="size-2 rounded-full bg-emerald-400" />v_z</Label>
                <span className="font-mono text-sm font-bold text-emerald-300">{v.z.toFixed(1)}</span>
              </div>
              <Slider value={[v.z]} onValueChange={(val) => setV((p) => ({ ...p, z: val[0] }))} min={-2} max={2} step={0.5} />
            </div>
          </div>

          {/* computation */}
          <div className="rounded-xl border border-border/50 bg-background/40 p-3 font-mono text-xs leading-relaxed">
            <span className="text-emerald-300">{v.x.toFixed(1)}</span>·<span className="text-amber-300">({mat.i.x.toFixed(1)},{mat.i.y.toFixed(1)},{mat.i.z.toFixed(1)})</span>
            <span className="text-muted-foreground"> + </span>
            <span className="text-emerald-300">{v.y.toFixed(1)}</span>·<span className="text-cyan-300">({mat.j.x.toFixed(1)},{mat.j.y.toFixed(1)},{mat.j.z.toFixed(1)})</span>
            <span className="text-muted-foreground"> + </span>
            <span className="text-emerald-300">{v.z.toFixed(1)}</span>·<span className="text-violet-300">({mat.k.x.toFixed(1)},{mat.k.y.toFixed(1)},{mat.k.z.toFixed(1)})</span>
            <span className="text-muted-foreground"> = </span>
            <span className="rounded-md bg-rose-500/15 px-1.5 py-0.5 font-bold text-rose-300">
              ({out.x.toFixed(2)}, {out.y.toFixed(2)}, {out.z.toFixed(2)})
            </span>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-[400px]">
        <div className="relative rounded-xl border border-border/60 bg-card/40 p-1">
          <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} className={cn("w-full h-auto touch-none select-none", drag && "cursor-grabbing")}
            onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
            <defs>
              {markers.map((m) => (
                <marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} />
                </marker>
              ))}
            </defs>

            {/* ground grid (xy-plane) */}
            {groundGrid}
            {/* transformed grid */}
            {tGrid}

            {/* basis vectors î, ĵ, k̂ */}
            <line x1={o.px} y1={o.py} x2={iPx.px} y2={iPx.py} stroke={COLORS.i} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#3d-ar-i)" />
            <line x1={o.px} y1={o.py} x2={jPx.px} y2={jPx.py} stroke={COLORS.j} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#3d-ar-j)" />
            <line x1={o.px} y1={o.py} x2={kPx.px} y2={kPx.py} stroke={COLORS.k} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#3d-ar-k)" />

            {/* draggable tips */}
            {(["i", "j", "k"] as const).map((w) => {
              const p = w === "i" ? iPx : w === "j" ? jPx : kPx;
              const col = w === "i" ? COLORS.i : w === "j" ? COLORS.j : COLORS.k;
              const active = drag === w || hover === w;
              return (
                <circle key={w} cx={p.px} cy={p.py} r={active ? 11 : 9} fill={col} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5}
                  className="cursor-grab transition-[r]" onPointerDown={(e) => onPointerDown(w, e)} onPointerEnter={() => setHover(w)} onPointerLeave={() => setHover(null)} />
              );
            })}

            {/* labels */}
            <text x={iPx.px + 10} y={iPx.py - 6} className="fill-amber-300 font-mono" style={{ fontSize: 13, fontWeight: 700 }}>î</text>
            <text x={jPx.px + 10} y={jPx.py - 6} className="fill-cyan-300 font-mono" style={{ fontSize: 13, fontWeight: 700 }}>ĵ</text>
            <text x={kPx.px + 10} y={kPx.py - 6} className="fill-violet-300 font-mono" style={{ fontSize: 13, fontWeight: 700 }}>k̂</text>

            {/* input v + output */}
            <line x1={o.px} y1={o.py} x2={vPx.px} y2={vPx.py} stroke={COLORS.v} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#3d-ar-v)" />
            <line x1={o.px} y1={o.py} x2={outPx.px} y2={outPx.py} stroke={COLORS.out} strokeWidth={3} strokeLinecap="round" markerEnd="url(#3d-ar-out)" />
            <text x={outPx.px + 10} y={outPx.py + 4} className="fill-rose-300 font-mono" style={{ fontSize: 11, fontWeight: 700 }}>
              ({out.x.toFixed(1)}, {out.y.toFixed(1)}, {out.z.toFixed(1)})
            </text>

            {/* origin */}
            <circle cx={o.px} cy={o.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Crosshair className="size-3" />
        {flattened
          ? "The three basis vectors landed in a single plane — a dimension was lost. (This is exactly what a zero determinant will mean.)"
          : "The faint ground grid is the original xy-plane; the morphing grid is the transformed space. Drag î, ĵ, k̂ tips on the ground; use ±z to lift them off the plane."}
      </p>
    </SimulationContainer>
  );
}
