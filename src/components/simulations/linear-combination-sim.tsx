"use client";

/**
 * LinearCombinationSim
 * ----------------------------------------------------------------
 * General linear-combination builder. Two draggable vectors v and w,
 * two sliders for scalars a and b. Shows a·v + b·w with a live
 * tip-to-tail decomposition and numeric readout.
 *
 * The "why linear" intuition: fix one scalar and sweep the other —
 * the tip traces a straight line. A "sweep" button animates this.
 *
 * Reuses <CoordinatePlane />.
 * ----------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import {
  CoordinatePlane,
  type PlaneVector,
  PLANE_COLORS,
} from "@/components/simulations/coordinate-plane";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Vec { x: number; y: number }

export function LinearCombinationSim() {
  const [v, setV] = useState<Vec>({ x: 2, y: 1 });
  const [w, setW] = useState<Vec>({ x: -1, y: 2 });
  const [a, setA] = useState(1.5);
  const [b, setB] = useState(1);
  const [sweeping, setSweeping] = useState(false);
  const rafRef = useRef<number | null>(null);

  // sweep b back and forth to show the tip traces a line
  useEffect(() => {
    if (!sweeping) return;
    let dir = 1;
    let cur = b;
    const tick = () => {
      cur += dir * 0.04;
      if (cur > 3) { cur = 3; dir = -1; }
      if (cur < -3) { cur = -3; dir = 1; }
      setB(cur);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [sweeping]);

  const av = { x: a * v.x, y: a * v.y };
  const bw = { x: b * w.x, y: b * w.y };
  const sum = { x: av.x + bw.x, y: av.y + bw.y };

  const vectors: PlaneVector[] = [
    { id: "v", x: v.x, y: v.y, color: PLANE_COLORS.primary, draggable: true, label: "v" },
    { id: "w", x: w.x, y: w.y, color: PLANE_COLORS.secondary, draggable: true, label: "w" },
    // a·v from origin (ghost)
    { id: "av", x: av.x, y: av.y, color: PLANE_COLORS.primary, ghost: true, label: `${a.toFixed(1)}·v` },
    // the sum
    { id: "sum", x: sum.x, y: sum.y, color: PLANE_COLORS.tertiary, label: "a·v+b·w" },
  ];

  function handleChange(id: string, x: number, y: number) {
    if (id === "v") setV({ x, y });
    if (id === "w") setW({ x, y });
  }

  // overlay for translated b·w (tip-to-tail from a·v's tip)
  const pad = 28, size = 360, range = 7;
  const unit = (size - pad * 2) / (range * 2);
  const originPx = pad + range * unit;
  const toPx = (mx: number, my: number) => ({ px: originPx + mx * unit, py: originPx - my * unit });
  const avTip = toPx(av.x, av.y);
  const sumTip = toPx(sum.x, sum.y);

  return (
    <SimulationContainer
      title="Linear combination: a·v + b·w"
      description="Drag v and w. Tune the scalars a and b. The rose vector is their linear combination — the one operation everything in linear algebra builds on."
      badge="Build"
      accent="emerald"
      controls={
        <div className="space-y-4">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-sm">
                  <span className="size-2.5 rounded-full bg-emerald-400" />scalar a
                </Label>
                <span className="font-mono text-base font-bold text-emerald-300">{a.toFixed(2)}</span>
              </div>
              <Slider value={[a]} onValueChange={(v) => setA(v[0])} min={-3} max={3} step={0.05} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-sm">
                  <span className="size-2.5 rounded-full bg-amber-400" />scalar b
                </Label>
                <span className="font-mono text-base font-bold text-amber-300">{b.toFixed(2)}</span>
              </div>
              <Slider value={[b]} onValueChange={(v) => setB(v[0])} min={-3} max={3} step={0.05} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={sweeping ? "default" : "outline"}
              onClick={() => setSweeping((s) => !s)}
            >
              {sweeping ? <Pause className="mr-1.5 size-3.5" /> : <Play className="mr-1.5 size-3.5" />}
              {sweeping ? "Pause sweep" : "Sweep b → see the line"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setSweeping(false); setA(1.5); setB(1); }}>
              <RotateCcw className="mr-1.5 size-3.5" />Reset scalars
            </Button>
          </div>

          <div className="rounded-xl border border-border/50 bg-background/40 p-3 font-mono text-sm">
            <span className="text-emerald-300">{a.toFixed(2)}</span>
            <span className="text-muted-foreground">·({v.x.toFixed(1)},{v.y.toFixed(1)}) + </span>
            <span className="text-amber-300">{b.toFixed(2)}</span>
            <span className="text-muted-foreground">·({w.x.toFixed(1)},{w.y.toFixed(1)}) = </span>
            <span className="rounded-md bg-rose-500/15 px-2 py-0.5 font-bold text-rose-300">
              ({sum.x.toFixed(2)}, {sum.y.toFixed(2)})
            </span>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-[400px]">
        <CoordinatePlane vectors={vectors} range={range} size={size} onVectorChange={handleChange}>
          {/* b·w translated to the tip of a·v */}
          <line
            x1={avTip.px}
            y1={avTip.py}
            x2={sumTip.px}
            y2={sumTip.py}
            stroke={PLANE_COLORS.secondary}
            strokeWidth={2.5}
            strokeLinecap="round"
            markerEnd={`url(#arrow-1-${PLANE_COLORS.secondary.replace(/[^a-z0-9]/gi, "")})`}
          />
          {/* a·v solid (from origin to avTip) — drawn over the ghost */}
          <line
            x1={originPx}
            y1={originPx}
            x2={avTip.px}
            y2={avTip.py}
            stroke={PLANE_COLORS.primary}
            strokeWidth={2.5}
            strokeLinecap="round"
            markerEnd={`url(#arrow-0-${PLANE_COLORS.primary.replace(/[^a-z0-9]/gi, "")})`}
          />
        </CoordinatePlane>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {sweeping
          ? "With a fixed, the tip of a·v + b·w traces a straight line as b changes — that's the 'linear' in linear combination."
          : "Drag v and w by their tips. The emerald arrow is a·v, the amber arrow (tip-to-tail) is b·w, and the rose arrow is their sum."}
      </p>
    </SimulationContainer>
  );
}
