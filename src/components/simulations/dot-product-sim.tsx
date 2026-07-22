"use client";

/**
 * DotProductSim
 * ----------------------------------------------------------------
 * The dot product as projection × length, with the duality insight.
 *
 * Two draggable vectors v (amber) and w (emerald). The sim projects
 * w onto the line through v and shows: dot = |proj| × |v|. Sign
 * tracks direction. A separate panel shows the 1×2 matrix (v tipped
 * over) = the transformation to the number line, making duality
 * visible.
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Crosshair, FlipHorizontal, ArrowRight } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { cn } from "@/lib/utils";

interface Vec { x: number; y: number }

const COLORS = {
  v: "#fbbf24", // amber
  w: "#34d399", // emerald
  proj: "#fb7185", // rose — projection of w
  grid: "oklch(1 0 0 / 7%)", gridAxis: "oklch(1 0 0 / 26%)",
};

export function DotProductSim() {
  const [v, setV] = useState<Vec>({ x: 3, y: 1 });
  const [w, setW] = useState<Vec>({ x: 1, y: 2 });

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"v" | "w" | null>(null);
  const [hover, setHover] = useState<"v" | "w" | null>(null);

  const size = 380, range = 5, pad = 28;
  const unit = (size - pad * 2) / (range * 2);
  const origin = pad + range * unit;
  const toPx = (mx: number, my: number) => ({ px: origin + mx * unit, py: origin - my * unit });
  const toMath = (px: number, py: number) => ({
    x: (px - pad - range * unit) / unit, y: (range * unit - (py - pad)) / unit,
  });

  // dot product v·w
  const dot = v.x * w.x + v.y * w.y;
  const vLen = Math.hypot(v.x, v.y);
  const wLen = Math.hypot(w.x, w.y);
  // projection of w onto v: (v·w / |v|²) · v
  const projScalar = vLen > 0.001 ? dot / (vLen * vLen) : 0;
  const proj: Vec = { x: v.x * projScalar, y: v.y * projScalar };
  const projLen = Math.hypot(proj.x, proj.y) * Math.sign(projScalar);
  const angle = (Math.atan2(w.y, w.x) - Math.atan2(v.y, v.x)) * 180 / Math.PI;
  const isPerp = Math.abs(dot) < 0.05;

  function pointerToMath(e: React.PointerEvent): Vec {
    const svg = svgRef.current; if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const ctm = svg.getScreenCTM(); if (!ctm) return { x: 0, y: 0 };
    const local = pt.matrixTransform(ctm.inverse());
    let { x, y } = toMath(local.x, local.y);
    x = Math.max(-range, Math.min(range, x)); y = Math.max(-range, Math.min(range, y));
    return { x, y };
  }
  function onPointerDown(which: "v" | "w", e: React.PointerEvent) {
    e.preventDefault(); e.stopPropagation(); setDrag(which);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return; const m = pointerToMath(e);
    if (drag === "v") setV(m); else setW(m);
  }
  function onPointerUp(e: React.PointerEvent) { setDrag(null); (e.target as Element).releasePointerCapture?.(e.pointerId); }

  const gridLines = [];
  for (let k = -range; k <= range; k++) {
    const p = toPx(k, 0); const ax = k === 0;
    gridLines.push(<line key={`v${k}`} x1={p.px} y1={pad} x2={p.px} y2={size - pad} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
    gridLines.push(<line key={`h${k}`} x1={pad} y1={p.py} x2={size - pad} y2={p.py} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
  }

  const o = toPx(0, 0);
  const vPx = toPx(v.x, v.y), wPx = toPx(w.x, w.y), projPx = toPx(proj.x, proj.y);

  const dotColor = dot > 0.05 ? "text-emerald-300" : dot < -0.05 ? "text-rose-300" : "text-muted-foreground";
  const dotBg = dot > 0.05 ? "bg-emerald-500/10 border-emerald-500/30" : dot < -0.05 ? "bg-rose-500/10 border-rose-500/30" : "bg-muted/30 border-muted-foreground/30";

  return (
    <SimulationContainer
      title="Dot product = projection × length"
      description="Drag v (amber) and w (emerald). The rose arrow is w's projection onto v. The dot product v·w = |projection| × |v| — and its sign tells you if they point together, apart, or perpendicular."
      badge="v·w"
      accent="emerald"
      controls={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className={cn("flex items-center gap-3 rounded-xl border px-4 py-2.5", dotBg)}>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">v·w</span>
              <span className={cn("font-mono text-2xl font-bold", dotColor)}>{dot.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">|v|</div>
              <div className="font-mono text-base font-bold text-amber-300">{vLen.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">|proj of w|</div>
              <div className="font-mono text-base font-bold text-rose-300">{projLen.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">angle</div>
              <div className="font-mono text-base font-bold text-cyan-300">{angle.toFixed(1)}°</div>
            </div>
          </div>

          {/* numeric computation */}
          <div className="rounded-xl border border-border/50 bg-background/40 p-3 font-mono text-xs leading-relaxed">
            ({v.x.toFixed(1)},{v.y.toFixed(1)})·({w.x.toFixed(1)},{w.y.toFixed(1)}) ={" "}
            <span className="text-amber-300">{v.x.toFixed(1)}·{w.x.toFixed(1)}</span> +{" "}
            <span className="text-emerald-300">{v.y.toFixed(1)}·{w.y.toFixed(1)}</span> ={" "}
            <span className={cn("rounded px-1.5 py-0.5 font-bold", dotBg, dotColor)}>{dot.toFixed(2)}</span>
          </div>

          {/* duality panel */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-cyan-300">
              <FlipHorizontal className="size-3" /> Duality
            </div>
            <div className="flex items-center justify-center gap-2 font-mono text-sm">
              <div className="flex items-center gap-0.5">
                <span className="text-muted-foreground/60">[</span>
                <div className="flex flex-col gap-0.5">
                  <span className="w-8 text-center text-amber-300">{v.x.toFixed(1)}</span>
                  <span className="w-8 text-center text-amber-300">{v.y.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground/60">]</span>
              </div>
              <span className="text-xs text-muted-foreground">1×2 matrix</span>
              <ArrowRight className="size-4 text-cyan-300" />
              <span className="text-xs text-muted-foreground">=</span>
              <span className="rounded bg-amber-500/15 px-2 py-0.5 text-amber-300">v tipped over</span>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">Applying this matrix to any vector = taking its dot product with v.</p>
          </div>

          {isPerp && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-center text-xs text-cyan-200">
              v·w = 0 — the vectors are perpendicular. The projection of one onto the other is zero.
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
              {[{c:COLORS.v,id:"dp-ar-v"},{c:COLORS.w,id:"dp-ar-w"},{c:COLORS.proj,id:"dp-ar-p"}].map(m=>(
                <marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} /></marker>
              ))}
            </defs>
            {gridLines}

            {/* line through v (the projection axis) */}
            {vLen > 0.1 && (() => {
              const ext = 4; const dir = { x: v.x / vLen, y: v.y / vLen };
              const a = toPx(-ext * dir.x, -ext * dir.y), b = toPx(ext * dir.x, ext * dir.y);
              return <line x1={a.px} y1={a.py} x2={b.px} y2={b.py} stroke={COLORS.v} strokeWidth={1} strokeDasharray="3 4" opacity={0.3} />;
            })()}

            {/* v */}
            <line x1={o.px} y1={o.py} x2={vPx.px} y2={vPx.py} stroke={COLORS.v} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#dp-ar-v)" />
            {/* w */}
            <line x1={o.px} y1={o.py} x2={wPx.px} y2={wPx.py} stroke={COLORS.w} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#dp-ar-w)" />
            {/* projection of w onto v (rose) */}
            {!isPerp && (
              <motion.line x1={o.px} y1={o.py} x2={projPx.px} y2={projPx.py} stroke={COLORS.proj} strokeWidth={3.5} strokeLinecap="round" markerEnd="url(#dp-ar-p)" />
            )}
            {/* right-angle marker from w tip to proj tip */}
            {!isPerp && (
              <line x1={wPx.px} y1={wPx.py} x2={projPx.px} y2={projPx.py} stroke={COLORS.proj} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            )}

            {/* draggable tips */}
            <circle cx={vPx.px} cy={vPx.py} r={drag === "v" || hover === "v" ? 11 : 9} fill={COLORS.v} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab transition-[r]" onPointerDown={(e)=>onPointerDown("v",e)} onPointerEnter={()=>setHover("v")} onPointerLeave={()=>setHover(null)} />
            <text x={vPx.px+10} y={vPx.py-8} className="fill-amber-300 font-mono" style={{fontSize:13, fontWeight:700}}>v</text>
            <circle cx={wPx.px} cy={wPx.py} r={drag === "w" || hover === "w" ? 11 : 9} fill={COLORS.w} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab transition-[r]" onPointerDown={(e)=>onPointerDown("w",e)} onPointerEnter={()=>setHover("w")} onPointerLeave={()=>setHover(null)} />
            <text x={wPx.px+10} y={wPx.py-8} className="fill-emerald-300 font-mono" style={{fontSize:13, fontWeight:700}}>w</text>

            <circle cx={o.px} cy={o.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Crosshair className="size-3" />
        The rose arrow is w&apos;s shadow on v. v·w = (its length, signed) × |v|. Drag until they&apos;re perpendicular — the rose arrow vanishes and v·w hits 0.
      </p>
    </SimulationContainer>
  );
}
