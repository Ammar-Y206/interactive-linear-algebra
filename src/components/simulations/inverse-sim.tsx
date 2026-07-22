"use client";

/**
 * InverseSim
 * ----------------------------------------------------------------
 * Visualizes solving A·x = v by "playing the transformation in
 * reverse". The learner sets a target output v (emerald); the sim
 * computes the unique input x = A⁻¹·v (rose) that lands on it, and
 * animates x → v forward and v → x in reverse.
 *
 * Det = 0 disables the inverse (can't un-squish). A toggle lets you
 * collapse the matrix to demonstrate.
 *
 * Reuses the CoordinatePlane visual language.
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Rewind, Play, Pause, Scissors, Crosshair } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Vec { x: number; y: number }
interface Mat { i: Vec; j: Vec } // 2x2, columns

const COLORS = {
  v: "#34d399", // emerald — target output
  x: "#fb7185", // rose — recovered input
  i: "#fbbf24", j: "#22d3ee",
  grid: "oklch(1 0 0 / 7%)", gridAxis: "oklch(1 0 0 / 26%)",
};

const PRESETS = {
  rotate: { m: { i: { x: 0, y: 1 }, j: { x: -1, y: 0 } }, label: "90° rotation" },
  shear: { m: { i: { x: 1, y: 0 }, j: { x: 1, y: 1 } }, label: "Shear" },
  scale: { m: { i: { x: 2, y: 0 }, j: { x: 0, y: 2 } }, label: "Scale ×2" },
  collapse: { m: { i: { x: 1, y: 1 }, j: { x: 2, y: 2 } }, label: "Collapse (det=0)" },
};

export function InverseSim() {
  const [mat, setMat] = useState<Mat>(PRESETS.rotate.m);
  const [v, setV] = useState<Vec>({ x: 2, y: 1 });
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(1); // 0 = input x, 1 = output v

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"i" | "j" | "v" | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const size = 380, range = 5, pad = 28;
  const unit = (size - pad * 2) / (range * 2);
  const origin = pad + range * unit;
  const toPx = (mx: number, my: number) => ({ px: origin + mx * unit, py: origin - my * unit });
  const toMath = (px: number, py: number) => ({
    x: (px - pad - range * unit) / unit, y: (range * unit - (py - pad)) / unit,
  });

  const det = mat.i.x * mat.j.y - mat.i.y * mat.j.x;
  const hasInverse = Math.abs(det) > 0.02;

  // inverse of a 2x2: (1/det) * [ d, -b | -c, a ]
  const inv: Mat = hasInverse
    ? { i: { x: mat.j.y / det, y: -mat.i.y / det }, j: { x: -mat.j.x / det, y: mat.i.x / det } }
    : { i: { x: 0, y: 0 }, j: { x: 0, y: 0 } };

  // x = A⁻¹·v (the input that lands on v)
  const x: Vec = hasInverse
    ? { x: v.x * inv.i.x + v.y * inv.j.x, y: v.x * inv.i.y + v.y * inv.j.y }
    : { x: 0, y: 0 };
  // current animated position: lerp between x (t=0) and v (t=1) along the transform
  const cur: Vec = { x: x.x + (v.x - x.x) * t, y: x.y + (v.y - x.y) * t };

  function pointerToMath(e: React.PointerEvent): Vec {
    const svg = svgRef.current; if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const ctm = svg.getScreenCTM(); if (!ctm) return { x: 0, y: 0 };
    const local = pt.matrixTransform(ctm.inverse());
    let { x, y } = toMath(local.x, local.y);
    x = Math.max(-range, Math.min(range, x)); y = Math.max(-range, Math.min(range, y));
    return { x, y };
  }
  function onPointerDown(which: typeof drag, e: React.PointerEvent) {
    e.preventDefault(); e.stopPropagation(); setDrag(which);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return; const m = pointerToMath(e);
    if (drag === "i") setMat((p) => ({ ...p, i: m }));
    else if (drag === "j") setMat((p) => ({ ...p, j: m }));
    else if (drag === "v") setV(m);
  }
  function onPointerUp(e: React.PointerEvent) { setDrag(null); (e.target as Element).releasePointerCapture?.(e.pointerId); }

  function togglePlay() {
    if (!hasInverse) return;
    if (playing) { setPlaying(false); return; }
    setT(1); setPlaying(true);
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const elapsed = now - start;
      // forward 0→1, pause, reverse 1→0, loop
      const cycle = (elapsed % (dur * 2)) / dur;
      const val = cycle <= 1 ? cycle : 2 - cycle;
      setT(val);
      if (playing) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function applyPreset(p: keyof typeof PRESETS) { setMat(PRESETS[p].m); setPlaying(false); setT(1); }

  // grid (original)
  const gridLines = [];
  for (let k = -range; k <= range; k++) {
    const p = toPx(k, 0); const isAxis = k === 0;
    gridLines.push(<line key={`v-${k}`} x1={p.px} y1={pad} x2={p.px} y2={size - pad} stroke={isAxis ? COLORS.gridAxis : COLORS.grid} strokeWidth={isAxis ? 1.5 : 1} />);
    gridLines.push(<line key={`h-${k}`} x1={pad} y1={p.py} x2={size - pad} y2={p.py} stroke={isAxis ? COLORS.gridAxis : COLORS.grid} strokeWidth={isAxis ? 1.5 : 1} />);
  }

  const o = toPx(0, 0);
  const iPx = toPx(mat.i.x, mat.i.y), jPx = toPx(mat.j.x, mat.j.y);
  const vPx = toPx(v.x, v.y), xPx = toPx(x.x, x.y), curPx = toPx(cur.x, cur.y);

  return (
    <SimulationContainer
      title="Solve A·x = v: play the transformation in reverse"
      description="Set a target output v (emerald). When det ≠ 0, the unique input x that lands on v is A⁻¹·v (rose). Hit play to watch x flow forward to v — and rewind back."
      badge="A⁻¹"
      accent="emerald"
      controls={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => applyPreset("rotate")}>90° rotation</Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("shear")}>Shear</Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("scale")}>Scale ×2</Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset("collapse")}><Scissors className="mr-1.5 size-3.5" />Collapse</Button>
            <Button size="sm" variant={playing ? "default" : "outline"} onClick={togglePlay} disabled={!hasInverse}>
              {playing ? <><Pause className="mr-1.5 size-3.5" />Pause</> : <><Play className="mr-1.5 size-3.5" />Play forward & reverse</>}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">det(A)</div>
              <div className={cn("font-mono text-lg font-bold", hasInverse ? "text-emerald-300" : "text-rose-300")}>{det.toFixed(2)}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {hasInverse ? "≠ 0 → inverse exists" : "= 0 → no inverse (space squished)"}
              </div>
            </div>
            <div className="space-y-2 rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-xs"><span className="size-2 rounded-full bg-emerald-400" />target vₓ</Label>
                <span className="font-mono text-sm font-bold text-emerald-300">{v.x.toFixed(2)}</span>
              </div>
              <Slider value={[v.x]} onValueChange={(val) => setV((p) => ({ ...p, x: val[0] }))} min={-4} max={4} step={0.1} />
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-xs"><span className="size-2 rounded-full bg-emerald-400" />target vᵧ</Label>
                <span className="font-mono text-sm font-bold text-emerald-300">{v.y.toFixed(2)}</span>
              </div>
              <Slider value={[v.y]} onValueChange={(val) => setV((p) => ({ ...p, y: val[0] }))} min={-4} max={4} step={0.1} />
            </div>
          </div>

          {hasInverse ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 font-mono text-xs">
              x = A⁻¹·v = <span className="text-rose-300">({x.x.toFixed(2)}, {x.y.toFixed(2)})</span>
              <span className="text-muted-foreground">  →  A·x = </span>
              <span className="text-emerald-300">({v.x.toFixed(2)}, {v.y.toFixed(2)})</span>
            </div>
          ) : (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
              det = 0 — the transformation squished space, so multiple inputs map to the same output. A function can&apos;t undo that. If v happens to lie on the squished line, infinitely many solutions exist; otherwise, none.
            </div>
          )}
        </div>
      }
    >
      <div className="mx-auto max-w-[400px]">
        <div className="relative rounded-xl border border-border/60 bg-card/40 p-1">
          <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} className={cn("w-full h-auto touch-none select-none", drag && "cursor-grabbing")}
            onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
            <defs>
              {[{c:COLORS.v,id:"iv-ar-v"},{c:COLORS.x,id:"iv-ar-x"},{c:COLORS.i,id:"iv-ar-i"},{c:COLORS.j,id:"iv-ar-j"}].map(m=>(
                <marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} /></marker>
              ))}
            </defs>
            {gridLines}

            {/* basis vectors (the matrix) */}
            <line x1={o.px} y1={o.py} x2={iPx.px} y2={iPx.py} stroke={COLORS.i} strokeWidth={2} strokeLinecap="round" markerEnd="url(#iv-ar-i)" opacity={0.6} />
            <line x1={o.px} y1={o.py} x2={jPx.px} y2={jPx.py} stroke={COLORS.j} strokeWidth={2} strokeLinecap="round" markerEnd="url(#iv-ar-j)" opacity={0.6} />
            <circle cx={iPx.px} cy={iPx.py} r={7} fill={COLORS.i} stroke="oklch(0.16 0.012 250)" strokeWidth={2} className="cursor-grab" onPointerDown={(e)=>onPointerDown("i",e)} onPointerEnter={()=>setHover("i")} onPointerLeave={()=>setHover(null)} opacity={0.7} />
            <circle cx={jPx.px} cy={jPx.py} r={7} fill={COLORS.j} stroke="oklch(0.16 0.012 250)" strokeWidth={2} className="cursor-grab" onPointerDown={(e)=>onPointerDown("j",e)} onPointerEnter={()=>setHover("j")} onPointerLeave={()=>setHover(null)} opacity={0.7} />

            {hasInverse && (
              <>
                {/* recovered input x (rose, ghost when animating) */}
                <line x1={o.px} y1={o.py} x2={xPx.px} y2={xPx.py} stroke={COLORS.x} strokeWidth={2} strokeLinecap="round" strokeDasharray="4 3" opacity={t < 1 ? 0.4 : 0.9} markerEnd="url(#iv-ar-x)" />
                <text x={xPx.px + 8} y={xPx.py - 6} className="fill-rose-300 font-mono" style={{ fontSize: 11, fontWeight: 700 }}>x</text>
                {/* target v (emerald) */}
                <line x1={o.px} y1={o.py} x2={vPx.px} y2={vPx.py} stroke={COLORS.v} strokeWidth={2} strokeLinecap="round" strokeDasharray="4 3" opacity={0.4} markerEnd="url(#iv-ar-v)" />
                <text x={vPx.px + 8} y={vPx.py - 6} className="fill-emerald-300 font-mono" style={{ fontSize: 11, fontWeight: 700 }}>v</text>
                {/* current animated vector */}
                <motion.line x1={o.px} y1={o.py} x2={curPx.px} y2={curPx.py} stroke={playing ? "#fbbf24" : COLORS.x} strokeWidth={3} strokeLinecap="round" markerEnd="url(#iv-ar-x)" />
                {/* v draggable */}
                <circle cx={vPx.px} cy={vPx.py} r={9} fill={COLORS.v} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("v",e)} onPointerEnter={()=>setHover("v")} onPointerLeave={()=>setHover(null)} />
              </>
            )}

            <circle cx={o.px} cy={o.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        {hasInverse ? <><Rewind className="size-3" />Drag the amber/cyan tips to edit A; drag the emerald tip to set v. The rose arrow x is A⁻¹·v — the unique input that lands on v.</>
          : <><Crosshair className="size-3" />det = 0: the inverse doesn&apos;t exist. The transformation crushed a dimension, so you can&apos;t rewind it.</>}
      </p>
    </SimulationContainer>
  );
}
