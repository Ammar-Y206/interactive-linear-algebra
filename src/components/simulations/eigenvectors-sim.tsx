"use client";

/**
 * EigenvectorsSim
 * ----------------------------------------------------------------
 * Drag the matrix columns (where î, ĵ land). The sim finds the
 * eigenvectors (lines that stay fixed as directions) and their
 * eigenvalues, and animates a vector on each eigenline showing
 * the stretch/squish. Shows det(A − λI) = 0 reasoning.
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Crosshair, Sigma, Network } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Vec { x: number; y: number }

const COLORS = {
  i: "#fbbf24", j: "#22d3ee", ev1: "#34d399", ev2: "#fb7185",
  grid: "oklch(1 0 0 / 7%)", gridAxis: "oklch(1 0 0 / 26%)",
};

const PRESETS = {
  shear: { i: { x: 1, y: 0 }, j: { x: 1, y: 1 }, label: "Shear" },
  scale: { i: { x: 3, y: 0 }, j: { x: 1, y: 2 }, label: "Scale+shear" },
  rotate: { i: { x: 0, y: 1 }, j: { x: -1, y: 0 }, label: "90° rotation (no real eigenvecs)" },
  uniform: { i: { x: 2, y: 0 }, j: { x: 0, y: 2 }, label: "Uniform scale (everything eigen)" },
};

export function EigenvectorsSim() {
  const [iHat, setIHat] = useState<Vec>(PRESETS.scale.i);
  const [jHat, setJHat] = useState<Vec>(PRESETS.scale.j);

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"i" | "j" | null>(null);

  // eigenvalues: λ² − (trace)λ + det = 0  →  λ = (tr ± √(tr²−4det))/2
  const trace = iHat.x + jHat.y;
  const det = iHat.x * jHat.y - iHat.y * jHat.x;
  const disc = trace * trace - 4 * det;
  const hasReal = disc >= -0.001;
  const sq = Math.sqrt(Math.max(0, disc));
  const lam1 = (trace + sq) / 2;
  const lam2 = (trace - sq) / 2;

  // eigenvectors: for eigenvalue λ, (A − λI)v = 0
  // For 2x2: eigenvector is (lam - d, c) or (b, lam - a) where A=[[a,b],[c,d]]
  const a = iHat.x, b = jHat.x, c = iHat.y, d = jHat.y;
  function eigenVec(lam: number): Vec | null {
    // (A − λI) = [[a-λ, b], [c, d-λ]]; eigenvector satisfies (a-λ)x + by = 0
    // so (x,y) = (b, λ-a) or (λ-d, c)
    let v: Vec;
    if (Math.abs(b) > 0.01) v = { x: b, y: lam - a };
    else if (Math.abs(c) > 0.01) v = { x: lam - d, y: c };
    else v = { x: 1, y: 0 };
    const len = Math.hypot(v.x, v.y);
    if (len < 0.01) return null;
    return { x: v.x / len, y: v.y / len };
  }
  const ev1 = hasReal ? eigenVec(lam1) : null;
  const ev2 = hasReal && Math.abs(lam1 - lam2) > 0.01 ? eigenVec(lam2) : null;

  const size = 380, range = 5, pad = 28;
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
    if (drag === "i") setIHat(m); else setJHat(m);
  }
  function onPointerUp(e: React.PointerEvent) { setDrag(null); (e.target as Element).releasePointerCapture?.(e.pointerId); }

  function applyPreset(p: keyof typeof PRESETS) { setIHat(PRESETS[p].i); setJHat(PRESETS[p].j); }

  // transformed grid
  const gridLines = [];
  for (let k = -range; k <= range; k++) {
    const sV = { x: k * iHat.x + -range * jHat.x, y: k * iHat.y + -range * jHat.y };
    const eV = { x: k * iHat.x + range * jHat.x, y: k * iHat.y + range * jHat.y };
    const s = toPx(sV.x, sV.y), e = toPx(eV.x, eV.y);
    const ax = k === 0;
    gridLines.push(<line key={`tv${k}`} x1={s.px} y1={s.py} x2={e.px} y2={e.py} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
    const sH = { x: -range * iHat.x + k * jHat.x, y: -range * iHat.y + k * jHat.y };
    const eH = { x: range * iHat.x + k * jHat.x, y: range * iHat.y + k * jHat.y };
    const sP = toPx(sH.x, sH.y), eP = toPx(eH.x, eH.y);
    gridLines.push(<line key={`th${k}`} x1={sP.px} y1={sP.py} x2={eP.px} y2={eP.py} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
  }

  const o = toPx(0, 0);
  const iP = toPx(iHat.x, iHat.y), jP = toPx(jHat.x, jHat.y);

  return (
    <SimulationContainer
      title="Eigenvectors: the lines that survive"
      description="Drag î' (amber) and ĵ' (cyan) to set the matrix. The green and red lines are the eigenvector directions — they stay on their own span, just stretched by their eigenvalues. A 90° rotation has none."
      badge="Av=λv"
      accent="emerald"
      controls={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map(p => (
              <Button key={p} size="sm" variant="outline" onClick={() => applyPreset(p)}>{PRESETS[p].label}</Button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">trace</div>
              <div className="font-mono text-base font-bold text-amber-300">{trace.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">det</div>
              <div className="font-mono text-base font-bold text-cyan-300">{det.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">λ₁</div>
              <div className="font-mono text-base font-bold text-emerald-300">{hasReal ? lam1.toFixed(2) : "complex"}</div>
            </div>
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-center">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">λ₂</div>
              <div className="font-mono text-base font-bold text-rose-300">{hasReal ? lam2.toFixed(2) : "complex"}</div>
            </div>
          </div>

          {!hasReal && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center text-xs text-amber-200">
              Discriminant &lt; 0 → no real eigenvalues. Every vector gets rotated off its span (like the 90° rotation).
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
              {[{c:COLORS.i,id:"eig-ar-i"},{c:COLORS.j,id:"eig-ar-j"}].map(m=>(
                <marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} /></marker>
              ))}
            </defs>
            {gridLines}

            {/* eigenvector lines (the spans that survive) */}
            {ev1 && (() => {
              const ext = 5;
              const a = toPx(-ext * ev1.x, -ext * ev1.y), b = toPx(ext * ev1.x, ext * ev1.y);
              return <line x1={a.px} y1={a.py} x2={b.px} y2={b.py} stroke={COLORS.ev1} strokeWidth={2} strokeDasharray="5 4" opacity={0.6} />;
            })()}
            {ev2 && (() => {
              const ext = 5;
              const a = toPx(-ext * ev2.x, -ext * ev2.y), b = toPx(ext * ev2.x, ext * ev2.y);
              return <line x1={a.px} y1={a.py} x2={b.px} y2={b.py} stroke={COLORS.ev2} strokeWidth={2} strokeDasharray="5 4" opacity={0.6} />;
            })()}

            {/* basis vectors */}
            <line x1={o.px} y1={o.py} x2={iP.px} y2={iP.py} stroke={COLORS.i} strokeWidth={2.5} markerEnd="url(#eig-ar-i)" />
            <line x1={o.px} y1={o.py} x2={jP.px} y2={jP.py} stroke={COLORS.j} strokeWidth={2.5} markerEnd="url(#eig-ar-j)" />

            {/* eigenvector arrows showing the stretch */}
            {ev1 && (
              <>
                <line x1={o.px} y1={o.py} x2={toPx(ev1.x, ev1.y).px} y2={toPx(ev1.x, ev1.y).py} stroke={COLORS.ev1} strokeWidth={2} opacity={0.5} />
                <line x1={o.px} y1={o.py} x2={toPx(lam1 * ev1.x, lam1 * ev1.y).px} y2={toPx(lam1 * ev1.x, lam1 * ev1.y).py} stroke={COLORS.ev1} strokeWidth={3.5} />
                <text x={toPx(lam1 * ev1.x, lam1 * ev1.y).px + 8} y={toPx(lam1 * ev1.x, lam1 * ev1.y).py - 6} className="fill-emerald-300 font-mono" style={{fontSize:10,fontWeight:700}}>λ={lam1.toFixed(1)}</text>
              </>
            )}
            {ev2 && (
              <>
                <line x1={o.px} y1={o.py} x2={toPx(ev2.x, ev2.y).px} y2={toPx(ev2.x, ev2.y).py} stroke={COLORS.ev2} strokeWidth={2} opacity={0.5} />
                <line x1={o.px} y1={o.py} x2={toPx(lam2 * ev2.x, lam2 * ev2.y).px} y2={toPx(lam2 * ev2.x, lam2 * ev2.y).py} stroke={COLORS.ev2} strokeWidth={3.5} />
                <text x={toPx(lam2 * ev2.x, lam2 * ev2.y).px + 8} y={toPx(lam2 * ev2.x, lam2 * ev2.y).py + 14} className="fill-rose-300 font-mono" style={{fontSize:10,fontWeight:700}}>λ={lam2.toFixed(1)}</text>
              </>
            )}

            {/* draggable tips */}
            <circle cx={iP.px} cy={iP.py} r={9} fill={COLORS.i} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("i",e)} />
            <circle cx={jP.px} cy={jP.py} r={9} fill={COLORS.j} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("j",e)} />
            <circle cx={o.px} cy={o.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Crosshair className="size-3" />
        {hasReal
          ? "The dashed green/red lines are eigenvector spans — they survive the transformation, just stretched by λ. The thick arrows show the eigenvalue scaling."
          : "No real eigenvectors: this transformation rotates every vector off its span. (Try the 'Scale+shear' preset to see eigenvectors appear.)"}
      </p>
    </SimulationContainer>
  );
}
