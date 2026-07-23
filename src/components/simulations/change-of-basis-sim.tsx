"use client";

/**
 * ChangeOfBasisSim
 * ----------------------------------------------------------------
 * Two coordinate systems: yours (î, ĵ) and Jennifer's (b₁, b₂).
 * Drag Jennifer's basis vectors; the sim shows the same vector in
 * both languages, plus the change-of-basis matrix and its inverse.
 *
 * Reuses the CoordinatePlane visual language.
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { Crosshair, Languages } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Vec { x: number; y: number }

const COLORS = {
  b1: "#fbbf24", b2: "#22d3ee", vec: "#34d399", jvec: "#fb7185",
  grid: "oklch(1 0 0 / 7%)", gridAxis: "oklch(1 0 0 / 26%)",
  jgrid: "oklch(1 0 0 / 5%)",
};

export function ChangeOfBasisSim() {
  // Jennifer's basis in YOUR coordinates
  const [b1, setB1] = useState<Vec>({ x: 2, y: 1 });
  const [b2, setB2] = useState<Vec>({ x: -1, y: 1 });
  // Jennifer's coordinates for the vector
  const [jx, setJx] = useState(-1);
  const [jy, setJy] = useState(2);

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"b1" | "b2" | null>(null);

  // your coordinates of the same vector = jx·b1 + jy·b2
  const yourVec: Vec = { x: jx * b1.x + jy * b2.x, y: jx * b1.y + jy * b2.y };

  // change-of-basis matrix = [b1 | b2], inverse via 2x2 formula
  const det = b1.x * b2.y - b1.y * b2.x;
  const hasInverse = Math.abs(det) > 0.02;
  // inverse columns: (b2.y, -b1.y)/det and (-b2.x, b1.x)/det
  const invCol1 = hasInverse ? { x: b2.y / det, y: -b1.y / det } : { x: 0, y: 0 };
  const invCol2 = hasInverse ? { x: -b2.x / det, y: b1.x / det } : { x: 0, y: 0 };

  const size = 380, range = 6, pad = 28;
  const unit = (size - pad * 2) / (range * 2);
  const origin = pad + range * unit;
  const toPx = (mx: number, my: number) => ({ px: origin + mx * unit, py: origin - my * unit });
  const toMath = (px: number, py: number) => ({
    x: (px - pad - range * unit) / unit, y: (range * unit - (py - pad)) / unit,
  });

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
    if (drag === "b1") setB1(m); else if (drag === "b2") setB2(m);
  }
  function onPointerUp(e: React.PointerEvent) { setDrag(null); (e.target as Element).releasePointerCapture?.(e.pointerId); }

  // your grid
  const grid = [];
  for (let k = -range; k <= range; k++) {
    const p = toPx(k, 0); const ax = k === 0;
    grid.push(<line key={`v${k}`} x1={p.px} y1={pad} x2={p.px} y2={size - pad} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
    grid.push(<line key={`h${k}`} x1={pad} y1={p.py} x2={size - pad} y2={p.py} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
  }
  // Jennifer's grid lines (faint, slanted)
  const jgrid = [];
  for (let k = -4; k <= 4; k++) {
    // line along b2 direction through k·b1
    const s = toPx(k * b1.x - 4 * b2.x, k * b1.y - 4 * b2.y);
    const e = toPx(k * b1.x + 4 * b2.x, k * b1.y + 4 * b2.y);
    jgrid.push(<line key={`jv${k}`} x1={s.px} y1={s.py} x2={e.px} y2={e.py} stroke={COLORS.jgrid} strokeWidth={1} />);
    const sH = toPx(-4 * b1.x + k * b2.x, -4 * b1.y + k * b2.y);
    const eH = toPx(4 * b1.x + k * b2.x, 4 * b1.y + k * b2.y);
    jgrid.push(<line key={`jh${k}`} x1={sH.px} y1={sH.py} x2={eH.px} y2={eH.py} stroke={COLORS.jgrid} strokeWidth={1} />);
  }

  const o = toPx(0, 0);
  const b1p = toPx(b1.x, b1.y), b2p = toPx(b2.x, b2.y);
  const vp = toPx(yourVec.x, yourVec.y);

  return (
    <SimulationContainer
      title="Two languages, one vector"
      description="Drag Jennifer's basis vectors b₁ (amber) and b₂ (cyan). Her coordinates (jx, jy) describe the same vector your coordinates describe differently. The change-of-basis matrix [b₁|b₂] translates hers to yours."
      badge="A⁻¹MA"
      accent="violet"
      controls={
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
              <div className="text-[10px] uppercase tracking-widest text-rose-300">Jennifer's coordinates</div>
              <div className="flex items-center justify-between"><Label className="text-xs">jx</Label><span className="font-mono text-sm font-bold text-rose-300">{jx.toFixed(1)}</span></div>
              <Slider value={[jx]} onValueChange={(v) => setJx(v[0])} min={-4} max={4} step={0.5} />
              <div className="flex items-center justify-between"><Label className="text-xs">jy</Label><span className="font-mono text-sm font-bold text-rose-300">{jy.toFixed(1)}</span></div>
              <Slider value={[jy]} onValueChange={(v) => setJy(v[0])} min={-4} max={4} step={0.5} />
            </div>
            <div className="space-y-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300">Your coordinates</div>
              <div className="font-mono text-lg font-bold text-emerald-300">({yourVec.x.toFixed(2)}, {yourVec.y.toFixed(2)})</div>
              <div className="text-[10px] text-muted-foreground">= jx·b₁ + jy·b₂</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
            <div className="rounded-lg border border-border/50 bg-background/40 p-2">
              <div className="text-[9px] uppercase text-muted-foreground">[b₁|b₂] (hers→yours)</div>
              <div className="mt-1 flex items-center gap-0.5">
                <span className="text-muted-foreground/60">[</span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-3"><span className="w-8 text-right text-amber-300">{b1.x.toFixed(1)}</span><span className="w-8 text-right text-cyan-300">{b2.x.toFixed(1)}</span></div>
                  <div className="flex gap-3"><span className="w-8 text-right text-amber-300">{b1.y.toFixed(1)}</span><span className="w-8 text-right text-cyan-300">{b2.y.toFixed(1)}</span></div>
                </div>
                <span className="text-muted-foreground/60">]</span>
              </div>
            </div>
            {hasInverse && (
              <div className="rounded-lg border border-border/50 bg-background/40 p-2">
                <div className="text-[9px] uppercase text-muted-foreground">inverse (yours→hers)</div>
                <div className="mt-1 flex items-center gap-0.5">
                  <span className="text-muted-foreground/60">[</span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex gap-3"><span className="w-8 text-right text-emerald-300">{invCol1.x.toFixed(2)}</span><span className="w-8 text-right text-emerald-300">{invCol2.x.toFixed(2)}</span></div>
                    <div className="flex gap-3"><span className="w-8 text-right text-emerald-300">{invCol1.y.toFixed(2)}</span><span className="w-8 text-right text-emerald-300">{invCol2.y.toFixed(2)}</span></div>
                  </div>
                  <span className="text-muted-foreground/60">]</span>
                </div>
              </div>
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
              {[{c:COLORS.b1,id:"cb-ar-1"},{c:COLORS.b2,id:"cb-ar-2"},{c:COLORS.vec,id:"cb-ar-v"}].map(m=>(
                <marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} /></marker>
              ))}
            </defs>
            {jgrid}
            {grid}

            {/* Jennifer's basis vectors */}
            <line x1={o.px} y1={o.py} x2={b1p.px} y2={b1p.py} stroke={COLORS.b1} strokeWidth={2.5} markerEnd="url(#cb-ar-1)" />
            <line x1={o.px} y1={o.py} x2={b2p.px} y2={b2p.py} stroke={COLORS.b2} strokeWidth={2.5} markerEnd="url(#cb-ar-2)" />
            {/* the vector (same in both languages) */}
            <line x1={o.px} y1={o.py} x2={vp.px} y2={vp.py} stroke={COLORS.vec} strokeWidth={3} markerEnd="url(#cb-ar-v)" />

            {/* draggable basis tips */}
            <circle cx={b1p.px} cy={b1p.py} r={10} fill={COLORS.b1} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("b1",e)} />
            <text x={b1p.px+10} y={b1p.py-8} className="fill-amber-300 font-mono" style={{fontSize:13,fontWeight:700}}>b₁</text>
            <circle cx={b2p.px} cy={b2p.py} r={10} fill={COLORS.b2} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("b2",e)} />
            <text x={b2p.px+10} y={b2p.py-8} className="fill-cyan-300 font-mono" style={{fontSize:13,fontWeight:700}}>b₂</text>
            <text x={vp.px+10} y={vp.py+14} className="fill-emerald-300 font-mono" style={{fontSize:11,fontWeight:700}}>v</text>

            <circle cx={o.px} cy={o.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Languages className="size-3" />
        Faint slanted grid = Jennifer's coordinate system. The emerald vector is the same physical vector; her numbers (jx, jy) and your numbers describe it in two languages. [b₁|b₂] translates hers → yours.
      </p>
    </SimulationContainer>
  );
}
