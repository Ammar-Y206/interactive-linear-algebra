"use client";

/**
 * CramersRuleSim
 * ----------------------------------------------------------------
 * Solves A·x = v geometrically via Cramer's rule. Drag the matrix
 * columns (î', ĵ') and the target v. The sim shows:
 *   - The unit square → parallelogram (area = det A)
 *   - The y-encoding parallelogram (î' + v) → scaled by det
 *   - The recovered coordinates x = det(Aᵢ)/det(A)
 *
 * Reuses the CoordinatePlane visual language.
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { Crosshair, Sigma, RotateCcw } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Vec { x: number; y: number }

const COLORS = {
  i: "#fbbf24", j: "#22d3ee", v: "#34d399", x: "#fb7185",
  unit: "#64748b", grid: "oklch(1 0 0 / 7%)", gridAxis: "oklch(1 0 0 / 26%)",
};

export function CramersRuleSim() {
  const [iHat, setIHat] = useState<Vec>({ x: 2, y: 1 });
  const [jHat, setJHat] = useState<Vec>({ x: -1, y: 2 });
  const [v, setV] = useState<Vec>({ x: 3, y: 2 });

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"i" | "j" | "v" | null>(null);

  const size = 380, range = 6, pad = 28;
  const unit = (size - pad * 2) / (range * 2);
  const origin = pad + range * unit;
  const toPx = (mx: number, my: number) => ({ px: origin + mx * unit, py: origin - my * unit });
  const toMath = (px: number, py: number) => ({
    x: (px - pad - range * unit) / unit, y: (range * unit - (py - pad)) / unit,
  });

  // det(A) where A = [iHat | jHat]
  const detA = iHat.x * jHat.y - iHat.y * jHat.x;
  const hasSolution = Math.abs(detA) > 0.02;

  // Cramer's rule: x = det([v | jHat]) / detA,  y = det([iHat | v]) / detA
  const detX = v.x * jHat.y - v.y * jHat.x;
  const detY = iHat.x * v.y - iHat.y * v.x;
  const xCoord = hasSolution ? detX / detA : 0;
  const yCoord = hasSolution ? detY / detA : 0;

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
    if (drag === "i") setIHat(m); else if (drag === "j") setJHat(m); else if (drag === "v") setV(m);
  }
  function onPointerUp(e: React.PointerEvent) { setDrag(null); (e.target as Element).releasePointerCapture?.(e.pointerId); }

  function reset() { setIHat({ x: 2, y: 1 }); setJHat({ x: -1, y: 2 }); setV({ x: 3, y: 2 }); }

  const gridLines = [];
  for (let k = -range; k <= range; k++) {
    const p = toPx(k, 0); const ax = k === 0;
    gridLines.push(<line key={`v${k}`} x1={p.px} y1={pad} x2={p.px} y2={size - pad} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
    gridLines.push(<line key={`h${k}`} x1={pad} y1={p.py} x2={size - pad} y2={p.py} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
  }

  const o = toPx(0, 0);
  const iP = toPx(iHat.x, iHat.y), jP = toPx(jHat.x, jHat.y);
  const vP = toPx(v.x, v.y), xP = toPx(xCoord, yCoord);
  // unit square (ghost)
  const g1 = toPx(1, 0), g2 = toPx(1, 1), g3 = toPx(0, 1);
  // transformed unit square (parallelogram = column space unit)
  const ijP = toPx(iHat.x + jHat.x, iHat.y + jHat.y);
  // y-encoding parallelogram: spanned by iHat and v (the swapped matrix for y)
  const ivP = toPx(iHat.x + v.x, iHat.y + v.y);

  return (
    <SimulationContainer
      title="Cramer's rule: coordinates as scaled areas"
      description="Drag the matrix columns (î', ĵ') and the target v. Each coordinate of the input x is a signed area that scales by det(A). The rose vector x is the solution: A·x = v."
      badge="Cramer"
      accent="emerald"
      controls={
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">det(A)</div>
              <div className={cn("font-mono text-lg font-bold", hasSolution ? "text-emerald-300" : "text-rose-300")}>{detA.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">det([v|ĵ])</div>
              <div className="font-mono text-lg font-bold text-amber-300">{detX.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">det([î|v])</div>
              <div className="font-mono text-lg font-bold text-cyan-300">{detY.toFixed(2)}</div>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-background/40 p-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-amber-300">x</span>
              <span className="text-muted-foreground">= det([v|ĵ]) / det(A) =</span>
              <span className="text-amber-300">{detX.toFixed(2)}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-emerald-300">{detA.toFixed(2)}</span>
              <span className="text-muted-foreground">=</span>
              <span className="rounded bg-rose-500/15 px-1.5 py-0.5 font-bold text-rose-300">{xCoord.toFixed(2)}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-cyan-300">y</span>
              <span className="text-muted-foreground">= det([î|v]) / det(A) =</span>
              <span className="text-cyan-300">{detY.toFixed(2)}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-emerald-300">{detA.toFixed(2)}</span>
              <span className="text-muted-foreground">=</span>
              <span className="rounded bg-rose-500/15 px-1.5 py-0.5 font-bold text-rose-300">{yCoord.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button size="sm" variant="ghost" onClick={reset}><RotateCcw className="mr-1.5 size-3.5" />Reset</Button>
          </div>

          {!hasSolution && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs text-rose-200">
              det(A) = 0 — can&apos;t divide by zero. The transformation squished space; no unique solution.
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
              {[{c:COLORS.i,id:"cr-ar-i"},{c:COLORS.j,id:"cr-ar-j"},{c:COLORS.v,id:"cr-ar-v"},{c:COLORS.x,id:"cr-ar-x"}].map(m=>(
                <marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} /></marker>
              ))}
            </defs>
            {gridLines}

            {/* ghost original unit square */}
            <polygon points={`${o.px},${o.py} ${g1.px},${g1.py} ${g2.px},${g2.py} ${g3.px},${g3.py}`} fill={COLORS.unit} fillOpacity={0.06} stroke={COLORS.unit} strokeWidth={1} strokeDasharray="4 3" strokeOpacity={0.4} />

            {/* transformed unit square = det(A) area */}
            <polygon points={`${o.px},${o.py} ${iP.px},${iP.py} ${ijP.px},${ijP.py} ${jP.px},${jP.py}`} fill={COLORS.v} fillOpacity={0.08} stroke={COLORS.v} strokeWidth={1.5} strokeDasharray="3 3" strokeOpacity={0.5} />

            {/* y-encoding parallelogram (iHat + v) — area = det([î|v]) = y·det(A) */}
            <polygon points={`${o.px},${o.py} ${iP.px},${iP.py} ${ivP.px},${ivP.py} ${vP.px},${vP.py}`} fill={COLORS.j} fillOpacity={0.15} stroke={COLORS.j} strokeWidth={1.5} strokeOpacity={0.6} />

            {/* matrix columns î', ĵ' */}
            <line x1={o.px} y1={o.py} x2={iP.px} y2={iP.py} stroke={COLORS.i} strokeWidth={2.5} markerEnd="url(#cr-ar-i)" />
            <line x1={o.px} y1={o.py} x2={jP.px} y2={jP.py} stroke={COLORS.j} strokeWidth={2.5} markerEnd="url(#cr-ar-j)" />
            {/* target v */}
            <line x1={o.px} y1={o.py} x2={vP.px} y2={vP.py} stroke={COLORS.v} strokeWidth={2.5} markerEnd="url(#cr-ar-v)" />
            {/* recovered input x */}
            {hasSolution && (
              <line x1={o.px} y1={o.py} x2={xP.px} y2={xP.py} stroke={COLORS.x} strokeWidth={3} markerEnd="url(#cr-ar-x)" />
            )}

            {/* draggable tips */}
            <circle cx={iP.px} cy={iP.py} r={9} fill={COLORS.i} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("i",e)} />
            <text x={iP.px+8} y={iP.py-6} className="fill-amber-300 font-mono" style={{fontSize:11,fontWeight:700}}>î'</text>
            <circle cx={jP.px} cy={jP.py} r={9} fill={COLORS.j} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("j",e)} />
            <text x={jP.px+8} y={jP.py-6} className="fill-cyan-300 font-mono" style={{fontSize:11,fontWeight:700}}>ĵ'</text>
            <circle cx={vP.px} cy={vP.py} r={9} fill={COLORS.v} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("v",e)} />
            <text x={vP.px+8} y={vP.py-6} className="fill-emerald-300 font-mono" style={{fontSize:11,fontWeight:700}}>v</text>
            {hasSolution && <text x={xP.px+8} y={xP.py+14} className="fill-rose-300 font-mono" style={{fontSize:11,fontWeight:700}}>x</text>}

            <circle cx={o.px} cy={o.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Crosshair className="size-3" />
        Emerald dashed = the unit square transformed (area = det A). Cyan = the y-encoding parallelogram (î' + v, area = y·det A). Divide and you get y. Same idea gives x. The rose vector x is the solution.
      </p>
    </SimulationContainer>
  );
}
