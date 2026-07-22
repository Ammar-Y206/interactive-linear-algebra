"use client";

/**
 * EigenvalueTrickSim
 * ----------------------------------------------------------------
 * Enter a 2×2 matrix; the sim reads off the trace (mean of
 * eigenvalues) and determinant (product), then applies the
 * mean-product formula: λ = m ± √(m² − p). Shows the geometry.
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { Crosshair, Sigma, Zap } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PRESETS = [
  { a: 8, b: 2, c: 4, d: 6, label: "8 2 / 4 6" },
  { a: 3, b: 1, c: 4, d: 1, label: "3 1 / 4 1" },
  { a: 2, b: 7, c: 1, d: 8, label: "2 7 / 1 8" },
  { a: 0, b: -1, c: 1, d: 0, label: "0 -1 / 1 0 (rotation)" },
];

export function EigenvalueTrickSim() {
  const [a, setA] = useState(8);
  const [b, setB] = useState(2);
  const [c, setC] = useState(4);
  const [d, setD] = useState(6);

  const trace = a + d;
  const det = a * d - b * c;
  const mean = trace / 2;
  const disc = mean * mean - det;
  const hasReal = disc >= -0.001;
  const sq = Math.sqrt(Math.max(0, disc));
  const lam1 = mean + sq;
  const lam2 = mean - sq;

  function applyPreset(p: typeof PRESETS[0]) { setA(p.a); setB(p.b); setC(p.c); setD(p.d); }

  const numInput = "h-10 w-14 rounded-md border border-border/60 bg-background/40 text-center font-mono text-base";

  return (
    <SimulationContainer
      title="Eigenvalues from trace and determinant"
      description="Edit the matrix. The trace (sum of diagonal) is the sum of eigenvalues; the determinant is their product. The mean-product formula gives you both eigenvalues — no characteristic polynomial needed."
      badge="m ± √(m²−p)"
      accent="amber"
      controls={
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => applyPreset(p)} className="rounded-full border border-border/50 bg-background/40 px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40">
                {p.label}
              </button>
            ))}
          </div>

          {/* matrix input */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl text-muted-foreground/60">[</span>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1.5">
                <Input type="number" value={a} onChange={e => setA(+e.target.value)} className={numInput} />
                <Input type="number" value={b} onChange={e => setB(+e.target.value)} className={numInput} />
              </div>
              <div className="flex gap-1.5">
                <Input type="number" value={c} onChange={e => setC(+e.target.value)} className={numInput} />
                <Input type="number" value={d} onChange={e => setD(+e.target.value)} className={numInput} />
              </div>
            </div>
            <span className="text-3xl text-muted-foreground/60">]</span>
          </div>

          {/* trace + det readout */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="text-[10px] uppercase tracking-widest text-amber-300">trace = a + d = sum of λ's</div>
              <div className="font-mono text-2xl font-bold text-amber-300">{trace}</div>
              <div className="text-[10px] text-muted-foreground">mean of eigenvalues m = {mean.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
              <div className="text-[10px] uppercase tracking-widest text-cyan-300">det = ad − bc = product of λ's</div>
              <div className="font-mono text-2xl font-bold text-cyan-300">{det}</div>
              <div className="text-[10px] text-muted-foreground">product of eigenvalues p = {det.toFixed(2)}</div>
            </div>
          </div>

          {/* the formula */}
          <div className="rounded-xl border border-border/50 bg-background/40 p-4 font-mono text-sm">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Mean-product formula</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground">λ = m ± √(m² − p) =</span>
              <span className="text-amber-300">{mean.toFixed(2)}</span>
              <span className="text-muted-foreground">± √(</span>
              <span className="text-amber-300">{(mean * mean).toFixed(2)}</span>
              <span className="text-muted-foreground">−</span>
              <span className="text-cyan-300">{det.toFixed(2)}</span>
              <span className="text-muted-foreground">) =</span>
              <span className="text-amber-300">{mean.toFixed(2)}</span>
              <span className="text-muted-foreground">±</span>
              <span className="text-emerald-300">{sq.toFixed(2)}</span>
            </div>
          </div>

          {/* result */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300">λ₁</div>
              <div className="font-mono text-3xl font-bold text-emerald-300">{hasReal ? lam1.toFixed(2) : "complex"}</div>
            </div>
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-center">
              <div className="text-[10px] uppercase tracking-widest text-rose-300">λ₂</div>
              <div className="font-mono text-3xl font-bold text-rose-300">{hasReal ? lam2.toFixed(2) : "complex"}</div>
            </div>
          </div>

          {/* verification */}
          {hasReal && (
            <div className="rounded-xl border border-border/50 bg-background/40 p-3 text-center text-xs text-muted-foreground">
              Check: λ₁ + λ₂ = {(lam1 + lam2).toFixed(2)} = trace ✓ &nbsp;·&nbsp; λ₁ · λ₂ = {(lam1 * lam2).toFixed(2)} = det ✓
            </div>
          )}
          {!hasReal && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center text-xs text-amber-200">
              m² − p &lt; 0 → no real eigenvalues (the discriminant is negative). Try the rotation preset.
            </div>
          )}
        </div>
      }
    >
      <div className="rounded-xl border border-border/50 bg-background/40 p-6 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
          <Zap className="size-3.5" /> Three facts, one formula
        </div>
        <div className="grid gap-4 sm:grid-cols-3 text-sm">
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <div className="font-bold text-amber-300">1. Trace = Σλ</div>
            <p className="mt-1 text-xs text-muted-foreground">Sum of diagonal = sum of eigenvalues.</p>
          </div>
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
            <div className="font-bold text-cyan-300">2. Det = Πλ</div>
            <p className="mt-1 text-xs text-muted-foreground">Determinant = product of eigenvalues.</p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
            <div className="font-bold text-emerald-300">3. m ± √(m²−p)</div>
            <p className="mt-1 text-xs text-muted-foreground">Two numbers from their mean and product.</p>
          </div>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Crosshair className="size-3" /> Read trace and det straight off the matrix — no characteristic polynomial. The eigenvalues fall out.
        </p>
      </div>
    </SimulationContainer>
  );
}
