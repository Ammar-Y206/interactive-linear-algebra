"use client";

/**
 * NonsquareSim
 * ----------------------------------------------------------------
 * Shows transformations between dimensions. Three modes:
 *   - 2D → 3D (3×2 matrix): lifts the plane into a 2D slice of 3D
 *   - 3D → 2D (2×3 matrix): projects space onto the plane
 *   - 2D → 1D (1×2 matrix): squishes the plane onto the number line
 *
 * Each mode shows the matrix shape and an input vector traveling to
 * its output. Reuses the isometric projection from Transform3DSim.
 * ----------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { ArrowUp, ArrowDown, ArrowRight, Box, Crosshair } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "2to3" | "3to2" | "2to1";

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);
const UNIT = 32;

export function NonsquareSim() {
  const [mode, setMode] = useState<Mode>("2to3");
  // 2D → 3D: matrix is 3x2, columns = where î,ĵ land in 3D
  const [m23] = useState({ i: { x: 1, y: 0, z: 0 }, j: { x: 0, y: 1, z: 1.2 } });
  // 3D → 2D: matrix is 2x3, columns = where î,ĵ,k̂ land in 2D
  const [m32] = useState({ i: { x: 1, y: 0 }, j: { x: 0, y: 1 }, k: { x: 0.6, y: 0.4 } });
  // 2D → 1D: matrix is 1x2, where î,ĵ land on the number line
  const [m21, setM21] = useState({ i: 1, j: -2 });
  const [v2, setV2] = useState({ x: 1.5, y: 1 });
  const [v3, setV3] = useState({ x: 1, y: 1, z: 1 });

  const size = 380, cx = size / 2, cy = size / 2 + 20;
  const proj3 = (p: { x: number; y: number; z: number }) => ({
    px: cx + (p.x - p.y) * UNIT * COS30, py: cy + (p.x + p.y) * UNIT * SIN30 - p.z * UNIT,
  });
  const proj2 = (x: number, y: number, ox = cx, oy = cy, u = UNIT) => ({ px: ox + x * u, py: oy - y * u });

  // computations
  const out23 = { x: v2.x * m23.i.x + v2.y * m23.j.x, y: v2.x * m23.i.y + v2.y * m23.j.y, z: v2.x * m23.i.z + v2.y * m23.j.z };
  const out32 = { x: v3.x * m32.i.x + v3.y * m32.j.x + v3.z * m32.k.x, y: v3.x * m32.i.y + v3.y * m32.j.y + v3.z * m32.k.y };
  const out21 = v2.x * m21.i + v2.y * m21.j;

  const modeInfo: Record<Mode, { label: string; shape: string; desc: string }> = {
    "2to3": { label: "2D → 3D", shape: "3×2", desc: "Lifts the plane into a 2D slice of 3D space" },
    "3to2": { label: "3D → 2D", shape: "2×3", desc: "Projects space onto the plane (a dimension lost)" },
    "2to1": { label: "2D → 1D", shape: "1×2", desc: "Squishes the plane onto the number line" },
  };

  // ground grid for 3D
  const ground3 = [];
  for (let g = -3; g <= 3; g++) {
    const a = proj3({ x: g, y: -3, z: 0 }), b = proj3({ x: g, y: 3, z: 0 });
    const c = proj3({ x: -3, y: g, z: 0 }), d = proj3({ x: 3, y: g, z: 0 });
    const ax = g === 0;
    ground3.push(<line key={`gv${g}`} x1={a.px} y1={a.py} x2={b.px} y2={b.py} stroke={ax ? "oklch(1 0 0 / 26%)" : "oklch(1 0 0 / 6%)"} strokeWidth={ax ? 1.5 : 1} />);
    ground3.push(<line key={`gh${g}`} x1={c.px} y1={c.py} x2={d.px} y2={d.py} stroke={ax ? "oklch(1 0 0 / 26%)" : "oklch(1 0 0 / 6%)"} strokeWidth={ax ? 1.5 : 1} />);
  }
  // 2D grid
  const grid2 = [];
  for (let g = -4; g <= 4; g++) {
    const p = proj2(g, 0, cx, cy, UNIT); const ax = g === 0;
    grid2.push(<line key={`2v${g}`} x1={p.px} y1={cy - 4 * UNIT} x2={p.px} y2={cy + 4 * UNIT} stroke={ax ? "oklch(1 0 0 / 26%)" : "oklch(1 0 0 / 7%)"} strokeWidth={ax ? 1.5 : 1} />);
    grid2.push(<line key={`2h${g}`} x1={cx - 4 * UNIT} y1={p.py} x2={cx + 4 * UNIT} y2={p.py} stroke={ax ? "oklch(1 0 0 / 26%)" : "oklch(1 0 0 / 7%)"} strokeWidth={ax ? 1.5 : 1} />);
  }

  const o3 = proj3({ x: 0, y: 0, z: 0 });
  const o2 = proj2(0, 0, cx, cy, UNIT);
  const C = { v: "#34d399", out: "#fb7185", i: "#fbbf24", j: "#22d3ee", k: "#a78bfa" };

  return (
    <SimulationContainer
      title="Nonsquare matrices: travel between dimensions"
      description="Switch modes to see how the matrix shape encodes the dimension map: 3×2 lifts 2D→3D, 2×3 projects 3D→2D, 1×2 squishes 2D onto the number line."
      badge={modeInfo[mode].shape}
      accent="cyan"
      controls={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {(["2to3", "3to2", "2to1"] as Mode[]).map((m) => (
              <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} onClick={() => setMode(m)}>
                {m === "2to3" ? <ArrowUp className="mr-1.5 size-3.5" /> : m === "3to2" ? <ArrowDown className="mr-1.5 size-3.5" /> : <ArrowRight className="mr-1.5 size-3.5" />}
                {modeInfo[m].label}
              </Button>
            ))}
            <span className="ml-auto rounded-full border border-border/50 bg-background/40 px-3 py-1 text-[10px] text-muted-foreground">
              {modeInfo[mode].shape} matrix · {modeInfo[mode].desc}
            </span>
          </div>

          {mode === "2to1" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between"><Label className="text-xs">î → number</Label><span className="font-mono text-sm font-bold text-amber-300">{m21.i.toFixed(1)}</span></div>
                <Slider value={[m21.i]} onValueChange={(v) => setM21((p) => ({ ...p, i: v[0] }))} min={-3} max={3} step={0.1} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between"><Label className="text-xs">ĵ → number</Label><span className="font-mono text-sm font-bold text-cyan-300">{m21.j.toFixed(1)}</span></div>
                <Slider value={[m21.j]} onValueChange={(v) => setM21((p) => ({ ...p, j: v[0] }))} min={-3} max={3} step={0.1} />
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border/50 bg-background/40 p-3 font-mono text-xs">
            {mode === "2to3" && <>[{v2.x.toFixed(1)}, {v2.y.toFixed(1)}] → ({out23.x.toFixed(2)}, {out23.y.toFixed(2)}, {out23.z.toFixed(2)})</>}
            {mode === "3to2" && <>[{v3.x.toFixed(1)}, {v3.y.toFixed(1)}, {v3.z.toFixed(1)}] → ({out32.x.toFixed(2)}, {out32.y.toFixed(2)})</>}
            {mode === "2to1" && <>[{v2.x.toFixed(1)}, {v2.y.toFixed(1)}] → {out21.toFixed(2)}</>}
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-[400px]">
        <div className="relative rounded-xl border border-border/60 bg-card/40 p-1">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
            <defs>
              {[{c:C.v,id:"ns-ar-v"},{c:C.out,id:"ns-ar-o"}].map(m=>(<marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={m.c} /></marker>))}
            </defs>

            {mode === "2to3" && (
              <>
                {ground3}
                {/* the embedded plane (column space) */}
                {(() => {
                  const a = proj3({ x: 0, y: 0, z: 0 }), b = proj3(m23.i), c = proj3({ x: m23.i.x + m23.j.x, y: m23.i.y + m23.j.y, z: m23.i.z + m23.j.z }), d = proj3(m23.j);
                  return <polygon points={`${a.px},${a.py} ${b.px},${b.py} ${c.px},${c.py} ${d.px},${d.py}`} fill={C.v} fillOpacity={0.1} stroke={C.v} strokeWidth={1.5} strokeDasharray="4 3" />;
                })()}
                <line x1={o3.px} y1={o3.py} x2={proj3(m23.i).px} y2={proj3(m23.i).py} stroke={C.i} strokeWidth={2.5} markerEnd="url(#ns-ar-v)" />
                <line x1={o3.px} y1={o3.py} x2={proj3(m23.j).px} y2={proj3(m23.j).py} stroke={C.j} strokeWidth={2.5} markerEnd="url(#ns-ar-v)" />
                {/* input v (in the 2D plane, shown at z=0) */}
                <circle cx={proj3({ x: v2.x, y: v2.y, z: 0 }).px} cy={proj3({ x: v2.x, y: v2.y, z: 0 }).py} r={7} fill={C.v} stroke="oklch(0.16 0.012 250)" strokeWidth={2} />
                {/* output (lifted into 3D) */}
                <line x1={o3.px} y1={o3.py} x2={proj3(out23).px} y2={proj3(out23).py} stroke={C.out} strokeWidth={3} markerEnd="url(#ns-ar-o)" />
                <circle cx={o3.px} cy={o3.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
              </>
            )}

            {mode === "3to2" && (
              <>
                {/* faint 3D input grid behind */}
                {ground3}
                <line x1={o2.px} y1={o2.py} x2={proj2(m32.i.x, m32.i.y).px} y2={proj2(m32.i.x, m32.i.y).py} stroke={C.i} strokeWidth={2} markerEnd="url(#ns-ar-v)" opacity={0.6} />
                <line x1={o2.px} y1={o2.py} x2={proj2(m32.j.x, m32.j.y).px} y2={proj2(m32.j.x, m32.j.y).py} stroke={C.j} strokeWidth={2} markerEnd="url(#ns-ar-v)" opacity={0.6} />
                <line x1={o2.px} y1={o2.py} x2={proj2(m32.k.x, m32.k.y).px} y2={proj2(m32.k.x, m32.k.y).py} stroke={C.k} strokeWidth={2} markerEnd="url(#ns-ar-v)" opacity={0.6} />
                <line x1={o2.px} y1={o2.py} x2={proj2(out32.x, out32.y).px} y2={proj2(out32.x, out32.y).py} stroke={C.out} strokeWidth={3} markerEnd="url(#ns-ar-o)" />
                <circle cx={o2.px} cy={o2.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
              </>
            )}

            {mode === "2to1" && (
              <>
                {grid2}
                {/* input v */}
                <line x1={o2.px} y1={o2.py} x2={proj2(v2.x, v2.y).px} y2={proj2(v2.x, v2.y).py} stroke={C.v} strokeWidth={2.5} markerEnd="url(#ns-ar-v)" />
                <circle cx={proj2(v2.x, v2.y).px} cy={proj2(v2.x, v2.y).py} r={7} fill={C.v} stroke="oklch(0.16 0.012 250)" strokeWidth={2} className="cursor-grab" />
                {/* number line at bottom */}
                <line x1={20} y1={size - 20} x2={size - 20} y2={size - 20} stroke="oklch(1 0 0 / 40%)" strokeWidth={1.5} />
                {[-3,-2,-1,0,1,2,3].map(n => {
                  const p = proj2(n, 0, cx, size - 20, UNIT * 0.7);
                  return <g key={n}><line x1={p.px} y1={size-24} x2={p.px} y2={size-16} stroke="oklch(1 0 0 / 40%)" strokeWidth={1} /><text x={p.px} y={size-6} textAnchor="middle" className="fill-muted-foreground" style={{fontSize:9}}>{n}</text></g>;
                })}
                {/* output dot on number line */}
                <circle cx={proj2(out21, 0, cx, size - 20, UNIT * 0.7).px} cy={size - 20} r={7} fill={C.out} stroke="oklch(0.16 0.012 250)" strokeWidth={2} />
                <text x={proj2(out21, 0, cx, size - 20, UNIT * 0.7).px} y={size - 28} textAnchor="middle" className="fill-rose-300 font-mono" style={{fontSize:11, fontWeight:700}}>{out21.toFixed(2)}</text>
                <circle cx={o2.px} cy={o2.py} r={3.5} fill="oklch(1 0 0 / 60%)" />
              </>
            )}
          </svg>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Crosshair className="size-3" />
        {mode === "2to3" && "The emerald parallelogram is the 2D column space embedded in 3D. The rose vector is v lifted into space — still on that plane."}
        {mode === "3to2" && "3D input (faint grid) collapses to the 2D plane. A whole line of 3D vectors maps to each 2D point — the null space."}
        {mode === "2to1" && "The whole plane gets squished onto the number line. Each basis vector lands on a single number; the output is a weighted sum."}
      </p>
    </SimulationContainer>
  );
}
