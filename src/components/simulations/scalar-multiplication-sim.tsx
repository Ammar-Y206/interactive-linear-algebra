"use client";

/**
 * ScalarMultiplicationSim
 * ----------------------------------------------------------------
 * Interactive scalar multiplication. A slider picks a scalar `s`,
 * and the vector is scaled to s · v. The original is shown as a
 * ghost so the learner sees the stretch / squish / flip.
 *
 * Demonstrates that scaling = multiplying each component by s.
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { FlipVertical2, Maximize2, Minimize2 } from "lucide-react";
import {
  CoordinatePlane,
  type PlaneVector,
  PLANE_COLORS,
} from "@/components/simulations/coordinate-plane";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const BASE = { x: 2, y: 1 };

export function ScalarMultiplicationSim() {
  const [scalar, setScalar] = useState(2);

  const scaled = { x: BASE.x * scalar, y: BASE.y * scalar };
  const isNegative = scalar < 0;
  const isStretched = Math.abs(scalar) > 1;
  const isSquished = Math.abs(scalar) > 0 && Math.abs(scalar) < 1;

  const vectors: PlaneVector[] = [
    {
      id: "base",
      x: BASE.x,
      y: BASE.y,
      color: PLANE_COLORS.secondary,
      ghost: true,
      label: "v",
    },
    {
      id: "scaled",
      x: scaled.x,
      y: scaled.y,
      color: PLANE_COLORS.primary,
      draggable: false,
      label: `${scalar.toFixed(1)}·v`,
    },
  ];

  return (
    <SimulationContainer
      title="Scalar Multiplication"
      description="Slide the scalar. Watch v stretch, squish, and flip. Each component is multiplied by the same number."
      badge="Scale"
      accent="emerald"
      controls={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5 text-sm">
              <FlipVertical2 className="size-3.5 text-emerald-400" />
              Scalar s
            </Label>
            <div className="rounded-lg border border-border/50 bg-background/60 px-3 py-1 font-mono text-lg font-bold text-emerald-300">
              {scalar.toFixed(2)}
            </div>
          </div>
          <Slider
            value={[scalar]}
            onValueChange={(v) => setScalar(v[0])}
            min={-3}
            max={3}
            step={0.1}
          />
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>−3.0</span>
            <span>−1.0</span>
            <span>0</span>
            <span>+1.0</span>
            <span>+3.0</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="text-xs text-muted-foreground">Original v</div>
              <div className="mt-0.5 font-mono text-sm text-amber-300">
                ({BASE.x}, {BASE.y})
              </div>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="text-xs text-emerald-300/80">Scaled s·v</div>
              <div className="mt-0.5 font-mono text-sm text-foreground">
                ({scaled.x.toFixed(2)}, {scaled.y.toFixed(2)})
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-[400px]">
        <CoordinatePlane vectors={vectors} range={7} size={380} snap={false} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {isNegative && (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-rose-300">
            <FlipVertical2 className="size-3" /> Direction flipped
          </span>
        )}
        {isStretched && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">
            <Maximize2 className="size-3" /> Stretched {Math.abs(scalar).toFixed(1)}×
          </span>
        )}
        {isSquished && (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-300">
            <Minimize2 className="size-3" /> Squished to {Math.abs(scalar).toFixed(2)}×
          </span>
        )}
        {scalar === 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/40 px-2.5 py-1 text-muted-foreground">
            Collapsed to the origin
          </span>
        )}
      </div>
    </SimulationContainer>
  );
}

