"use client";

/**
 * CrossProductSim
 * ----------------------------------------------------------------
 * Two modes:
 *   - 2D: drag v and w, see the parallelogram + its signed area
 *     (= the determinant). Sign flips when v crosses past w.
 *   - 3D: drag v and w in 3D, see the perpendicular cross-product
 *     vector with length = area, direction by the right-hand rule.
 *
 * Reuses the isometric projection from Transform3DSim.
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Box, Square, Crosshair, Hand } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "2d" | "3d";
interface V2 { x: number; y: number }
interface V3 { x: number; y: number; z: number }

const COLORS = {
  v: "#fbbf24", w: "#22d3ee", cp: "#fb7185",
  grid: "oklch(1 0 0 / 7%)", gridAxis: "oklch(1 0 0 / 26%)",
};

const COS30 = Math.cos(Math.PI / 6), SIN30 = Math.sin(Math.PI / 6), UNIT = 32;

export function CrossProductSim() {
  const [mode, setMode] = useState<Mode>("2d");
  // 2D vectors
  const [v2, setV2] = useState<V2>({ x: 2, y: 1 });
  const [w2, setW2] = useState<V2>({ x: -1, y: 2 });
  // 3D vectors
  const [v3, setV3] = useState<V3>({ x: 2, y: 0, z: 0 });
  const [w3, setW3] = useState<V3>({ x: 0, y: 2, z: 0 });

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<string | null>(null);

  // 2D cross product (determinant)
  const cp2 = v2.x * w2.y - v2.y * w2.x;
  // 3D cross product
  const cp3: V3 = {
    x: v3.y * w3.z - v3.z * w3.y,
    y: v3.z * w3.x - v3.x * w3.z,
    z: v3.x * w3.y - v3.y * w3.x,
  };
  const area3 = Math.hypot(cp3.x, cp3.y, cp3.z);

  // 2D geometry
  const size = 380, range = 5, pad = 28;
  const unit = (size - pad * 2) / (range * 2);
  const origin = pad + range * unit;
  const toPx2 = (mx: number, my: number) => ({ px: origin + mx * unit, py: origin - my * unit });
  const toMath2 = (px: number, py: number) => ({
    x: (px - pad - range * unit) / unit, y: (range * unit - (py - pad)) / unit,
  });

  // 3D geometry
  const cx = size / 2, cy = size / 2 + 20;
  const proj3 = (p: V3) => ({ px: cx + (p.x - p.y) * UNIT * COS30, py: cy + (p.x + p.y) * UNIT * SIN30 - p.z * UNIT });

  function pointerToMath2(e: React.PointerEvent): V2 {
    const svg = svgRef.current; if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const ctm = svg.getScreenCTM(); if (!ctm) return { x: 0, y: 0 };
    const local = pt.matrixTransform(ctm.inverse());
    let { x, y } = toMath2(local.x, local.y);
    x = Math.max(-range, Math.min(range, x)); y = Math.max(-range, Math.min(range, y));
    return { x, y };
  }
  function onPointerDown(which: string, e: React.PointerEvent) {
    e.preventDefault(); e.stopPropagation(); setDrag(which);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    const m = pointerToMath2(e);
    if (mode === "2d") {
      if (drag === "v") setV2(m);
      else if (drag === "w") setW2(m);
    } else {
      // 3D: drag on the ground plane (z stays), snap to 0.5
      const snapped = { x: Math.round(m.x * 2) / 2, y: Math.round(m.y * 2) / 2 };
      if (drag === "v") setV3((p) => ({ ...p, x: snapped.x, y: snapped.y }));
      else if (drag === "w") setW3((p) => ({ ...p, x: snapped.x, y: snapped.y }));
    }
  }
  function onPointerUp(e: React.PointerEvent) { setDrag(null); (e.target as Element).releasePointerCapture?.(e.pointerId); }

  // 2D grid
  const grid2 = [];
  for (let k = -range; k <= range; k++) {
    const p = toPx2(k, 0); const ax = k === 0;
    grid2.push(<line key={`v${k}`} x1={p.px} y1={pad} x2={p.px} y2={size - pad} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
    grid2.push(<line key={`h${k}`} x1={pad} y1={p.py} x2={size - pad} y2={p.py} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
  }
  // 3D ground grid
  const grid3 = [];
  for (let g = -3; g <= 3; g++) {
    const a = proj3({ x: g, y: -3, z: 0 }), b = proj3({ x: g, y: 3, z: 0 });
    const c = proj3({ x: -3, y: g, z: 0 }), d = proj3({ x: 3, y: g, z: 0 });
    const ax = g === 0;
    grid3.push(<line key={`gv${g}`} x1={a.px} y1={a.py} x2={b.px} y2={b.py} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
    grid3.push(<line key={`gh${g}`} x1={c.px} y1={c.py} x2={d.px} y2={d.py} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
  }

  const o2 = toPx2(0, 0), o3 = proj3({ x: 0, y: 0, z: 0 });
  const v2p = toPx2(v2.x, v2.y), w2p = toPx2(w2.x, w2.y);
  const v2w2 = toPx2(v2.x + w2.x, v2.y + w2.y);
  const v3p = proj3(v3), w3p = proj3(w3), cp3p = proj3(cp3);

  const cp2Color = cp2 > 0.05 ? "text-emerald-300" : cp2 < -0.05 ? "text-rose-300" : "text-muted-foreground";
  const cp2Bg = cp2 > 0.05 ? "bg-emerald-500/10 border-emerald-500/30" : cp2 < -0.05 ? "bg-rose-500/10 border-rose-500/30" : "bg-muted/30 border-muted-foreground/30";

  return (
    <SimulationContainer
      title={mode === "2d" ? "2D cross product = signed parallelogram area" : "3D cross product = the perpendicular vector"}
      description={mode === "2d"
        ? "Drag v (amber) and w (cyan). The parallelogram's signed area is v × w = the determinant. Sign flips when v crosses past w."
        : "Drag v and w on the ground plane. The rose vector is v × w — perpendicular to both, length = parallelogram area, by the right-hand rule."}
      badge={mode === "2d" ? "v × w" : "3D"}
      accent="rose"
      controls={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant={mode === "2d" ? "default" : "outline"} onClick={() => setMode("2d")}><Square className="mr-1.5 size-3.5" />2D</Button>
            <Button size="sm" variant={mode === "3d" ? "default" : "outline"} onClick={() => setMode("3d")}><Box className="mr-1.5 size-3.5" />3D</Button>
          </div>

          {mode === "2d" ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className={cn("flex items-center gap-3 rounded-xl border px-4 py-2.5", cp2Bg)}>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">v × w</span>
                <span className={cn("font-mono text-2xl font-bold", cp2Color)}>{cp2.toFixed(2)}</span>
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                det[v | w] = {v2.x.toFixed(1)}·{w2.y.toFixed(1)} − {v2.y.toFixed(1)}·{w2.x.toFixed(1)} = {cp2.toFixed(2)}
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">|v × w| = area</div>
                <div className="font-mono text-lg font-bold text-rose-300">{area3.toFixed(2)}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">v × w vector</div>
                <div className="font-mono text-sm font-bold text-rose-300">({cp3.x.toFixed(1)}, {cp3.y.toFixed(1)}, {cp3.z.toFixed(1)})</div>
              </div>
            </div>
          )}

          {mode === "3d" && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-2 text-xs text-amber-200">
              <Hand className="size-3.5" />Right-hand rule: forefinger along v, middle finger along w, thumb = v × w
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
              {[{c:COLORS.v,id:"cp-ar-v"},{c:COLORS.w,id:"cp-ar-w"},{c:COLORS.cp,id:"cp-ar-c"}].map(m=>(
                <marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} /></marker>
              ))}
            </defs>

            {mode === "2d" ? (
              <>
                {grid2}
                {/* parallelogram */}
                <polygon points={`${o2.px},${o2.py} ${v2p.px},${v2p.py} ${v2w2.px},${v2w2.py} ${w2p.px},${w2p.py}`}
                  fill={cp2 >= 0 ? COLORS.cp : COLORS.v} fillOpacity={0.18} stroke={COLORS.cp} strokeWidth={2} strokeOpacity={0.7} />
                {/* v, w */}
                <line x1={o2.px} y1={o2.py} x2={v2p.px} y2={v2p.py} stroke={COLORS.v} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#cp-ar-v)" />
                <line x1={o2.px} y1={o2.py} x2={w2p.px} y2={w2p.py} stroke={COLORS.w} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#cp-ar-w)" />
                {/* draggable tips */}
                <circle cx={v2p.px} cy={v2p.py} r={10} fill={COLORS.v} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("v",e)} />
                <text x={v2p.px+10} y={v2p.py-8} className="fill-amber-300 font-mono" style={{fontSize:13,fontWeight:700}}>v</text>
                <circle cx={w2p.px} cy={w2p.py} r={10} fill={COLORS.w} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("w",e)} />
                <text x={w2p.px+10} y={w2p.py-8} className="fill-cyan-300 font-mono" style={{fontSize:13,fontWeight:700}}>w</text>
                <circle cx={o2.px} cy={o2.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
              </>
            ) : (
              <>
                {grid3}
                {/* v, w */}
                <line x1={o3.px} y1={o3.py} x2={v3p.px} y2={v3p.py} stroke={COLORS.v} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#cp-ar-v)" />
                <line x1={o3.px} y1={o3.py} x2={w3p.px} y2={w3p.py} stroke={COLORS.w} strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#cp-ar-w)" />
                {/* cross product vector (perpendicular) */}
                <line x1={o3.px} y1={o3.py} x2={cp3p.px} y2={cp3p.py} stroke={COLORS.cp} strokeWidth={3} strokeLinecap="round" markerEnd="url(#cp-ar-c)" />
                {/* draggable tips */}
                <circle cx={v3p.px} cy={v3p.py} r={10} fill={COLORS.v} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("v",e)} />
                <text x={v3p.px+10} y={v3p.py-8} className="fill-amber-300 font-mono" style={{fontSize:13,fontWeight:700}}>v</text>
                <circle cx={w3p.px} cy={w3p.py} r={10} fill={COLORS.w} stroke="oklch(0.16 0.012 250)" strokeWidth={2.5} className="cursor-grab" onPointerDown={(e)=>onPointerDown("w",e)} />
                <text x={w3p.px+10} y={w3p.py-8} className="fill-cyan-300 font-mono" style={{fontSize:13,fontWeight:700}}>w</text>
                <text x={cp3p.px+10} y={cp3p.py-8} className="fill-rose-300 font-mono" style={{fontSize:11,fontWeight:700}}>v×w</text>
                <circle cx={o3.px} cy={o3.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
              </>
            )}
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Crosshair className="size-3" />
        {mode === "2d"
          ? "The rose/amber parallelogram is spanned by v and w. Its signed area = v × w = the determinant. Drag v past w and watch the sign flip."
          : "Drag v and w on the ground. The rose vector is perpendicular to both — that's v × w. Its length is the parallelogram's area."}
      </p>
    </SimulationContainer>
  );
}
