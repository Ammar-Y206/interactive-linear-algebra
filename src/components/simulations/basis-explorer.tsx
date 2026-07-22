"use client";

/**
 * BasisExplorer
 * ----------------------------------------------------------------
 * Shows that a vector's coordinates are really scalars for the basis
 * vectors î = (1,0) and ĵ = (0,1). Sliders for x and y scale î and ĵ,
 * and their tip-to-tail sum reconstructs the target vector.
 *
 * Reuses <CoordinatePlane />.
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { Crosshair } from "lucide-react";
import {
  CoordinatePlane,
  type PlaneVector,
  PLANE_COLORS,
} from "@/components/simulations/coordinate-plane";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function BasisExplorer() {
  const [x, setX] = useState(3);
  const [y, setY] = useState(-2);

  // scaled basis vectors
  const scaledI = { x: x, y: 0 }; // x · î
  const scaledJ = { x: 0, y: y }; // y · ĵ
  const sum = { x: scaledI.x + scaledJ.x, y: scaledI.y + scaledJ.y };

  const vectors: PlaneVector[] = [
    // ghost î and ĵ (the unscaled unit vectors)
    { id: "i-ghost", x: 1, y: 0, color: PLANE_COLORS.secondary, ghost: true, label: "î" },
    { id: "j-ghost", x: 0, y: 1, color: PLANE_COLORS.quaternary, ghost: true, label: "ĵ" },
    // scaled î (drawn from origin)
    { id: "i-scaled", x: scaledI.x, y: scaledI.y, color: PLANE_COLORS.secondary, label: `${x}·î` },
    // scaled ĵ drawn tip-to-tail from î's tip — handled via overlay
    // the sum
    { id: "sum", x: sum.x, y: sum.y, color: PLANE_COLORS.tertiary, label: `(${x}, ${y})` },
  ];

  // overlay: scaled ĵ translated to the tip of scaled î
  const pad = 28;
  const size = 360;
  const range = 5;
  const unit = (size - pad * 2) / (range * 2);
  const originPx = pad + range * unit;
  const toPx = (mx: number, my: number) => ({
    px: originPx + mx * unit,
    py: originPx - my * unit,
  });
  const iTip = toPx(scaledI.x, scaledI.y);
  const sumTip = toPx(sum.x, sum.y);

  return (
    <SimulationContainer
      title="Coordinates are scalars"
      description="Drag the sliders. Each coordinate scales a basis vector — î for x, ĵ for y — and their sum rebuilds the vector (x, y)."
      badge="î + ĵ"
      accent="cyan"
      controls={
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-sm">
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  x · î
                </Label>
                <span className="font-mono text-lg font-bold text-amber-300">{x.toFixed(1)}</span>
              </div>
              <Slider value={[x]} onValueChange={(v) => setX(v[0])} min={-4} max={4} step={0.1} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-sm">
                  <span className="size-2.5 rounded-full bg-cyan-400" />
                  y · ĵ
                </Label>
                <span className="font-mono text-lg font-bold text-cyan-300">{y.toFixed(1)}</span>
              </div>
              <Slider value={[y]} onValueChange={(v) => setY(v[0])} min={-4} max={4} step={0.1} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/40 p-3 text-center font-mono text-sm">
            <span className="text-amber-300">{x.toFixed(1)}</span>
            <span className="text-muted-foreground">· î +</span>
            <span className="text-cyan-300">{y.toFixed(1)}</span>
            <span className="text-muted-foreground">· ĵ =</span>
            <span className="rounded-md bg-rose-500/15 px-2 py-0.5 font-bold text-rose-300">
              ({sum.x.toFixed(1)}, {sum.y.toFixed(1)})
            </span>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-[400px]">
        <CoordinatePlane vectors={vectors} range={range} size={size}>
          {/* tip-to-tail: scaled ĵ from î's tip to the sum's tip */}
          <line
            x1={iTip.px}
            y1={iTip.py}
            x2={sumTip.px}
            y2={sumTip.py}
            stroke={PLANE_COLORS.quaternary}
            strokeWidth={2.5}
            strokeLinecap="round"
            markerEnd={`url(#arrow-3-${PLANE_COLORS.quaternary.replace(/[^a-z0-9]/gi, "")})`}
          />
        </CoordinatePlane>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Crosshair className="size-3" />
        The amber arrow is x·î, the cyan arrow (translated tip-to-tail) is y·ĵ, and the rose arrow
        is their sum — your original vector. î and ĵ are the basis; the coordinates are the scalars.
      </p>
    </SimulationContainer>
  );
}
