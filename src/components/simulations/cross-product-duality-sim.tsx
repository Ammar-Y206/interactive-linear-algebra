"use client";

/**
 * CrossProductDualitySim
 * ----------------------------------------------------------------
 * Visualizes WHY the cross product's determinant trick works, via
 * duality. Shows the volume transformation: input (x,y,z) maps to
 * the signed volume of the parallelepiped formed with fixed v, w.
 * The dual vector of that transformation IS v × w — perpendicular
 * to v and w, length = parallelogram area.
 *
 * Interactive: drag the input vector (x,y,z); see the parallelepiped
 * form and its volume. Toggle to reveal the dual vector = v × w.
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Eye, EyeOff, Crosshair, Sigma } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface V3 { x: number; y: number; z: number }

const COLORS = {
  v: "#fbbf24", w: "#22d3ee", u: "#34d399", cp: "#fb7185",
  grid: "oklch(1 0 0 / 7%)", gridAxis: "oklch(1 0 0 / 26%)",
  pped: "#a78bfa",
};

const COS30 = Math.cos(Math.PI / 6), SIN30 = Math.sin(Math.PI / 6), UNIT = 30;

export function CrossProductDualitySim() {
  const [v] = useState<V3>({ x: 2, y: 0, z: 0 });
  const [w] = useState<V3>({ x: 0, y: 2, z: 0 });
  const [u, setU] = useState<V3>({ x: 1, y: 1, z: 1.5 });
  const [showDual, setShowDual] = useState(false);

  // cross product v × w (the dual)
  const cp: V3 = {
    x: v.y * w.z - v.z * w.y,
    y: v.z * w.x - v.x * w.z,
    z: v.x * w.y - v.y * w.x,
  };
  const area = Math.hypot(cp.x, cp.y, cp.z);

  // signed volume = det([u, v, w]) = u · (v × w) = u · cp
  const volume = u.x * cp.x + u.y * cp.y + u.z * cp.z;

  const size = 380, cx = size / 2, cy = size / 2 + 20;
  const proj = (p: V3) => ({ px: cx + (p.x - p.y) * UNIT * COS30, py: cy + (p.x + p.y) * UNIT * SIN30 - p.z * UNIT });

  // ground grid
  const grid = [];
  for (let g = -3; g <= 3; g++) {
    const a = proj({ x: g, y: -3, z: 0 }), b = proj({ x: g, y: 3, z: 0 });
    const c = proj({ x: -3, y: g, z: 0 }), d = proj({ x: 3, y: g, z: 0 });
    const ax = g === 0;
    grid.push(<line key={`gv${g}`} x1={a.px} y1={a.py} x2={b.px} y2={b.py} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
    grid.push(<line key={`gh${g}`} x1={c.px} y1={c.py} x2={d.px} y2={d.py} stroke={ax ? COLORS.gridAxis : COLORS.grid} strokeWidth={ax ? 1.5 : 1} />);
  }

  const o = proj({ x: 0, y: 0, z: 0 });
  const vp = proj(v), wp = proj(w), up = proj(u), cpp = proj(cp);
  // parallelepiped vertices: 0, u, v, w, u+v, u+w, v+w, u+v+w
  const sum = (a: V3, b: V3): V3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
  const verts = {
    o: o, u: up, v: vp, w: wp,
    uv: proj(sum(u, v)), uw: proj(sum(u, w)), vw: proj(sum(v, w)),
    uvw: proj(sum(sum(u, v), w)),
  };

  return (
    <SimulationContainer
      title="Duality: the volume transformation's dual vector is v × w"
      description="The input (x,y,z) maps to the signed volume of the parallelepiped it forms with v and w. By duality, that transformation has a dual vector — and it's exactly v × w: perpendicular to v, w with length = area."
      badge="dual"
      accent="violet"
      controls={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant={showDual ? "default" : "outline"} onClick={() => setShowDual(s => !s)}>
              {showDual ? <><EyeOff className="mr-1.5 size-3.5" />Hide dual vector</> : <><Eye className="mr-1.5 size-3.5" />Reveal v × w</>}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">input (x,y,z)</div>
              <div className="flex items-center justify-between"><Label className="text-xs">x</Label><span className="font-mono text-sm font-bold text-emerald-300">{u.x.toFixed(1)}</span></div>
              <Slider value={[u.x]} onValueChange={(val) => setU(p => ({ ...p, x: val[0] }))} min={-2} max={2} step={0.5} />
              <div className="flex items-center justify-between"><Label className="text-xs">y</Label><span className="font-mono text-sm font-bold text-emerald-300">{u.y.toFixed(1)}</span></div>
              <Slider value={[u.y]} onValueChange={(val) => setU(p => ({ ...p, y: val[0] }))} min={-2} max={2} step={0.5} />
              <div className="flex items-center justify-between"><Label className="text-xs">z</Label><span className="font-mono text-sm font-bold text-emerald-300">{u.z.toFixed(1)}</span></div>
              <Slider value={[u.z]} onValueChange={(val) => setU(p => ({ ...p, z: val[0] }))} min={-2} max={2} step={0.5} />
            </div>
            <div className="space-y-2">
              <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">signed volume</div>
                <div className="font-mono text-lg font-bold text-violet-300">{volume.toFixed(2)}</div>
                <div className="text-[10px] text-muted-foreground">= det([u, v, w]) = u · (v × w)</div>
              </div>
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">v × w (the dual)</div>
                <div className="font-mono text-sm font-bold text-rose-300">({cp.x.toFixed(1)}, {cp.y.toFixed(1)}, {cp.z.toFixed(1)})</div>
                <div className="text-[10px] text-muted-foreground">length = area = {area.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-background/40 p-3 font-mono text-xs">
            <span className="text-muted-foreground">transformation(u) = u · </span>
            <span className="text-rose-300">(v × w)</span>
            <span className="text-muted-foreground"> = </span>
            <span className="text-violet-300">{volume.toFixed(2)}</span>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-[400px]">
        <div className="relative rounded-xl border border-border/60 bg-card/40 p-1">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
            <defs>
              {[{c:COLORS.v,id:"d-ar-v"},{c:COLORS.w,id:"d-ar-w"},{c:COLORS.u,id:"d-ar-u"},{c:COLORS.cp,id:"d-ar-c"}].map(m=>(
                <marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} /></marker>
              ))}
            </defs>
            {grid}

            {/* parallelepiped (the volume) */}
            <polygon points={`${verts.o.px},${verts.o.py} ${verts.v.px},${verts.v.py} ${verts.vw.px},${verts.vw.py} ${verts.w.px},${verts.w.py}`}
              fill={COLORS.pped} fillOpacity={0.08} stroke={COLORS.pped} strokeWidth={1} strokeOpacity={0.5} />
            <polygon points={`${verts.u.px},${verts.u.py} ${verts.uv.px},${verts.uv.py} ${verts.uvw.px},${verts.uvw.py} ${verts.uw.px},${verts.uw.py}`}
              fill={COLORS.pped} fillOpacity={0.12} stroke={COLORS.pped} strokeWidth={1} strokeOpacity={0.6} />
            <line x1={verts.o.px} y1={verts.o.py} x2={verts.u.px} y2={verts.u.py} stroke={COLORS.pped} strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3 3" />
            <line x1={verts.v.px} y1={verts.v.py} x2={verts.uv.px} y2={verts.uv.py} stroke={COLORS.pped} strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3 3" />
            <line x1={verts.w.px} y1={verts.w.py} x2={verts.uw.px} y2={verts.uw.py} stroke={COLORS.pped} strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3 3" />
            <line x1={verts.vw.px} y1={verts.vw.py} x2={verts.uvw.px} y2={verts.uvw.py} stroke={COLORS.pped} strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3 3" />

            {/* v, w, u */}
            <line x1={o.px} y1={o.py} x2={vp.px} y2={vp.py} stroke={COLORS.v} strokeWidth={2.5} markerEnd="url(#d-ar-v)" />
            <line x1={o.px} y1={o.py} x2={wp.px} y2={wp.py} stroke={COLORS.w} strokeWidth={2.5} markerEnd="url(#d-ar-w)" />
            <line x1={o.px} y1={o.py} x2={up.px} y2={up.py} stroke={COLORS.u} strokeWidth={2.5} markerEnd="url(#d-ar-u)" />

            {/* dual vector v × w */}
            <AnimatePresence>
              {showDual && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <line x1={o.px} y1={o.py} x2={cpp.px} y2={cpp.py} stroke={COLORS.cp} strokeWidth={3.5} markerEnd="url(#d-ar-c)" />
                  <text x={cpp.px + 10} y={cpp.py - 6} className="fill-rose-300 font-mono" style={{ fontSize: 11, fontWeight: 700 }}>v×w</text>
                </motion.g>
              )}
            </AnimatePresence>

            <text x={vp.px + 8} y={vp.py - 6} className="fill-amber-300 font-mono" style={{ fontSize: 11, fontWeight: 700 }}>v</text>
            <text x={wp.px + 8} y={wp.py - 6} className="fill-cyan-300 font-mono" style={{ fontSize: 11, fontWeight: 700 }}>w</text>
            <text x={up.px + 8} y={up.py - 6} className="fill-emerald-300 font-mono" style={{ fontSize: 11, fontWeight: 700 }}>u</text>
            <circle cx={o.px} cy={o.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Crosshair className="size-3" />
        The violet box is the parallelepiped formed by u, v, w. Its signed volume = u · (v × w). That means the volume transformation is literally dotting u with v × w — so v × w is its dual vector. Reveal it to see: perpendicular to v and w, length = area.
      </p>
    </SimulationContainer>
  );
}
