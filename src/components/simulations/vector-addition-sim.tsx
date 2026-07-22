"use client";

/**
 * VectorAdditionSim
 * ----------------------------------------------------------------
 * Interactive tip-to-tail vector addition.
 *
 * The learner drags two vectors v (emerald) and w (amber). The sum
 * v + w (rose) is shown rooted at the origin. A toggle switches
 * between the "both at origin" view and the "tip-to-tail" view where
 * w is translated to sit at the tip of v, making the sum read as the
 * diagonal of the path.
 *
 * Numerically this corresponds to adding components term-by-term.
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { Plus, GitBranch, Crosshair } from "lucide-react";
import {
  CoordinatePlane,
  type PlaneVector,
  PLANE_COLORS,
} from "@/components/simulations/coordinate-plane";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Vec {
  x: number;
  y: number;
}

export function VectorAdditionSim() {
  const [v, setV] = useState<Vec>({ x: 2, y: 3 });
  const [w, setW] = useState<Vec>({ x: 3, y: -1 });
  const [tipToTail, setTipToTail] = useState(true);

  const sum: Vec = { x: v.x + w.x, y: v.y + w.y };

  // In tip-to-tail mode, w is drawn starting from v's tip.
  // The CoordinatePlane roots everything at the origin, so to draw a
  // translated w we pass a custom overlay via children.
  const vectors: PlaneVector[] = [
    {
      id: "v",
      x: v.x,
      y: v.y,
      color: PLANE_COLORS.primary,
      draggable: true,
      label: "v",
    },
    // w at origin (shown faintly in tip-to-tail mode)
    tipToTail
      ? {
          id: "w-ghost",
          x: w.x,
          y: w.y,
          color: PLANE_COLORS.secondary,
          ghost: true,
          label: "w",
        }
      : {
          id: "w",
          x: w.x,
          y: w.y,
          color: PLANE_COLORS.secondary,
          draggable: true,
          label: "w",
        },
    {
      id: "sum",
      x: sum.x,
      y: sum.y,
      color: PLANE_COLORS.tertiary,
      showProjection: false,
      label: "v+w",
    },
  ];

  // handlers: which vector is being dragged
  function handleChange(id: string, x: number, y: number) {
    if (id === "v") setV({ x, y });
    if (id === "w" || id === "w-ghost") setW({ x, y });
  }

  // In tip-to-tail mode we also draw the translated w arrow as an overlay.
  // We compute pixel positions using the same mapping the plane uses.
  // Since the plane is a black box for overlays, we instead toggle: when
  // tip-to-tail is on, we render a *second* plane layer with w translated.
  // Simpler approach: render translated w by temporarily shifting origin
  // via an SVG <g transform>. We do that through the `children` overlay.

  const pad = 28;
  const size = 380;
  const range = 6;
  const unit = (size - pad * 2) / (range * 2);
  const originPx = pad + range * unit;
  const toPx = (mx: number, my: number) => ({
    px: originPx + mx * unit,
    py: originPx - my * unit,
  });
  const vTip = toPx(v.x, v.y);
  const wTipTranslated = toPx(v.x + w.x, v.y + w.y);

  return (
    <SimulationContainer
      title="Vector Addition"
      description="Drag v and w. Toggle the tip-to-tail view to see why adding components works."
      badge="Tip-to-tail"
      accent="rose"
      controls={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Switch
              id="tipToTail"
              checked={tipToTail}
              onCheckedChange={setTipToTail}
            />
            <Label htmlFor="tipToTail" className="flex items-center gap-1.5 text-sm">
              <GitBranch className="size-3.5 text-amber-400" />
              Tip-to-tail view
            </Label>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-sm">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-400" />v = ({v.x.toFixed(1)}, {v.y.toFixed(1)})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-amber-400" />w = ({w.x.toFixed(1)}, {w.y.toFixed(1)})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-400" />
              v+w = ({sum.x.toFixed(1)}, {sum.y.toFixed(1)})
            </span>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-[400px]">
        <CoordinatePlane
          vectors={vectors}
          range={range}
          size={size}
          snap={false}
          onVectorChange={handleChange}
        >
          {/* tip-to-tail translated w overlay */}
          {tipToTail && (
            <g>
              <line
                x1={vTip.px}
                y1={vTip.py}
                x2={wTipTranslated.px}
                y2={wTipTranslated.py}
                stroke={PLANE_COLORS.secondary}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray="0"
                markerEnd={`url(#arrow-1-${PLANE_COLORS.secondary.replace(/[^a-z0-9]/gi, "")})`}
              />
              <circle
                cx={wTipTranslated.px}
                cy={wTipTranslated.py}
                r={8}
                fill={PLANE_COLORS.secondary}
                stroke="oklch(0.16 0.012 250)"
                strokeWidth={2}
              />
            </g>
          )}
        </CoordinatePlane>
      </div>

      {/* numeric breakdown */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-300">
            <Crosshair className="size-3" /> x-component
          </div>
          <div className="mt-1 font-mono text-base text-foreground">
            {v.x.toFixed(1)} + {w.x.toFixed(1)} ={" "}
            <span className="font-bold text-rose-300">{sum.x.toFixed(1)}</span>
          </div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-300">
            <Crosshair className="size-3" /> y-component
          </div>
          <div className="mt-1 font-mono text-base text-foreground">
            {v.y.toFixed(1)} + {w.y.toFixed(1)} ={" "}
            <span className="font-bold text-rose-300">{sum.y.toFixed(1)}</span>
          </div>
        </div>
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
          <div className="flex items-center gap-1.5 text-xs text-rose-300">
            <Plus className="size-3" /> The sum
          </div>
          <div className="mt-1 font-mono text-base text-foreground">
            ({sum.x.toFixed(1)}, {sum.y.toFixed(1)})
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {tipToTail
          ? "Move w so its tail sits at v's tip. The arrow from the origin to the final tip is v + w — the net movement of taking both steps."
          : "Both vectors start at the origin. The rose arrow is their sum. Now toggle tip-to-tail to see the geometric reason."}
      </p>
    </SimulationContainer>
  );
}
