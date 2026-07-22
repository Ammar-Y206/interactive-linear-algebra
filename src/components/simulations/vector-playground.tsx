"use client";

/**
 * VectorPlayground
 * ----------------------------------------------------------------
 * Reusable, interactive single-vector explorer.
 * The learner drags the arrow's tip and sees its (x, y) coordinates
 * update live, with optional projection lines to the axes.
 *
 * Built on top of <CoordinatePlane />.
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import {
  CoordinatePlane,
  type PlaneVector,
  PLANE_COLORS,
} from "@/components/simulations/coordinate-plane";
import { SimulationContainer } from "@/components/course/simulation-container";

export interface VectorPlaygroundProps {
  initialX?: number;
  initialY?: number;
  range?: number;
  title?: string;
  description?: string;
  /** show the numeric coordinate readout panel */
  showReadout?: boolean;
  accent?: "emerald" | "amber" | "rose" | "cyan";
}

export function VectorPlayground({
  initialX = 3,
  initialY = 2,
  range = 5,
  title = "Vector Playground",
  description = "Drag the tip of the vector. Watch how the arrow and its coordinates describe the same thing.",
  showReadout = true,
  accent = "emerald",
}: VectorPlaygroundProps) {
  const [vec, setVec] = useState({ x: initialX, y: initialY });

  const vector: PlaneVector = {
    id: "playground",
    x: vec.x,
    y: vec.y,
    color: PLANE_COLORS.primary,
    draggable: true,
    showProjection: true,
    label: `(${vec.x.toFixed(1)}, ${vec.y.toFixed(1)})`,
  };

  const length = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
  const angleDeg = (Math.atan2(vec.y, vec.x) * 180) / Math.PI;

  return (
    <SimulationContainer
      title={title}
      description={description}
      badge="Drag me"
      accent={accent}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="mx-auto w-full max-w-[400px]">
          <CoordinatePlane
            vectors={[vector]}
            range={range}
            size={380}
            snap={false}
            onVectorChange={(_id, x, y) => setVec({ x, y })}
          />
        </div>

        {showReadout && (
          <div className="flex-1 space-y-3">
            <div className="rounded-lg border border-border/50 bg-background/60 p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Coordinates
              </div>
              <div className="mt-1 flex items-baseline gap-2 font-mono text-2xl font-semibold">
                <span className="text-emerald-400">{vec.x.toFixed(2)}</span>
                <span className="text-muted-foreground">,</span>
                <span className="text-emerald-400">{vec.y.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border/50 bg-background/60 p-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Length
                </div>
                <div className="mt-1 font-mono text-lg font-semibold text-amber-400">
                  {length.toFixed(2)}
                </div>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/60 p-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Angle
                </div>
                <div className="mt-1 font-mono text-lg font-semibold text-amber-400">
                  {angleDeg.toFixed(1)}°
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              The first number is how far you walk along{" "}
              <span className="font-mono text-emerald-400">x</span> (right = +, left = −). The
              second is how far you then walk along{" "}
              <span className="font-mono text-emerald-400">y</span> (up = +, down = −).
            </p>
          </div>
        )}
      </div>
    </SimulationContainer>
  );
}
