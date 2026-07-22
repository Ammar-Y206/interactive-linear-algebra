"use client";

/**
 * AbstractVectorSpacesSim
 * ----------------------------------------------------------------
 * Shows the derivative as a linear operator on the vector space of
 * polynomials. Enter a polynomial (coefficients for 1, x, x², x³, x⁴);
 * the sim displays it, multiplies by the derivative matrix, and shows
 * the resulting polynomial — demonstrating that differentiation IS
 * matrix-vector multiplication.
 * ----------------------------------------------------------------
 */

import { useState } from "react";
import { Crosshair, Sigma, FunctionSquare } from "lucide-react";
import { SimulationContainer } from "@/components/course/simulation-container";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const POWERS = ["1", "x", "x²", "x³", "x⁴"];

// format a polynomial from coefficients [c0, c1, c2, c3, c4]
function formatPoly(coeffs: number[]): string {
  const terms: string[] = [];
  for (let i = coeffs.length - 1; i >= 0; i--) {
    const c = coeffs[i];
    if (Math.abs(c) < 0.01) continue;
    const sign = c < 0 ? "−" : terms.length === 0 ? "" : "+";
    const mag = Math.abs(c).toFixed(c % 1 === 0 ? 0 : 1);
    const pow = i === 0 ? "" : i === 1 ? "x" : `x⁰¹²³⁴⁵⁶⁷⁸⁹`[i] ?? `x^${i}`;
    if (i === 0) terms.push(`${sign}${mag}`);
    else if (mag === "1") terms.push(`${sign}${pow}`);
    else terms.push(`${sign}${mag}${pow}`);
  }
  return terms.length === 0 ? "0" : terms.join(" ").replace(/^\+/, "");
}

export function AbstractVectorSpacesSim() {
  const [coeffs, setCoeffs] = useState<number[]>([5, 4, 5, 1, 0]); // x³+5x²+4x+5

  // derivative: d/dx(c·xⁿ) = n·c·xⁿ⁻¹
  const deriv: number[] = [0, 0, 0, 0, 0];
  for (let i = 1; i < coeffs.length; i++) {
    deriv[i - 1] = i * coeffs[i];
  }

  function setCoeff(i: number, v: number) {
    setCoeffs(prev => prev.map((c, j) => j === i ? v : c));
  }

  return (
    <SimulationContainer
      title="The derivative is a linear transformation"
      description="Polynomials form a vector space (with basis 1, x, x², x³, …). The derivative is linear: it's a matrix with 1, 2, 3, … down an offset diagonal. Enter a polynomial and watch matrix-vector multiplication differentiate it."
      badge="d/dx"
      accent="violet"
      controls={
        <div className="space-y-5">
          <div className="space-y-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
            <div className="text-[10px] uppercase tracking-widest text-emerald-300">Polynomial coefficients (basis: 1, x, x², x³, x⁴)</div>
            {POWERS.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <Label className="w-10 font-mono text-xs text-emerald-300">{p}:</Label>
                <Slider value={[coeffs[i]]} onValueChange={v => setCoeff(i, v[0])} min={-5} max={5} step={0.5} className="flex-1" />
                <span className="w-10 text-right font-mono text-sm font-bold text-emerald-300">{coeffs[i].toFixed(1)}</span>
              </div>
            ))}
          </div>

          {/* the derivative matrix (5×5, offset diagonal) */}
          <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
            <div className="mb-2 text-[10px] uppercase tracking-widest text-violet-300">Derivative matrix (5×5 slice of the infinite matrix)</div>
            <div className="flex items-center justify-center gap-1 font-mono text-sm">
              <span className="text-2xl text-muted-foreground/60">[</span>
              <div className="flex flex-col gap-0.5">
                {[0, 1, 2, 3, 4].map(row => (
                  <div key={row} className="flex gap-2">
                    {[0, 1, 2, 3, 4].map(col => {
                      const val = col === row + 1 ? col : 0;
                      return (
                        <span key={col} className={cn("w-8 text-center", val !== 0 ? "font-bold text-violet-300" : "text-muted-foreground/30")}>
                          {val !== 0 ? val : "0"}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
              <span className="text-2xl text-muted-foreground/60">]</span>
            </div>
          </div>

          {/* result */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-rose-300">derivative</div>
            <div className="mt-1 font-mono text-lg font-bold text-rose-300">{formatPoly(deriv)}</div>
          </div>
        </div>
      }
    >
      <div className="rounded-xl border border-border/50 bg-background/40 p-6">
        <div className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-300">
          <FunctionSquare className="size-3.5" /> The vector-space view
        </div>
        <div className="space-y-4 text-center">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Input (a vector in function space)</div>
            <div className="mt-1 font-mono text-xl font-bold text-emerald-300">{formatPoly(coeffs)}</div>
            <div className="mt-1 text-xs text-muted-foreground">= {coeffs.map((c, i) => c !== 0 ? `${c.toFixed(c%1===0?0:1)}·${POWERS[i]}` : null).filter(Boolean).join(" + ") || "0"}</div>
          </div>
          <div className="text-2xl text-violet-300">↓ d/dx (a linear operator)</div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Output (another vector in function space)</div>
            <div className="mt-1 font-mono text-xl font-bold text-rose-300">{formatPoly(deriv)}</div>
            <div className="mt-1 text-xs text-muted-foreground">= {deriv.map((c, i) => c !== 0 ? `${c.toFixed(c%1===0?0:1)}·${POWERS[i]}` : null).filter(Boolean).join(" + ") || "0"}</div>
          </div>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Crosshair className="size-3" /> Same operation — differentiating a polynomial — as matrix-vector multiplication. The derivative is linear, so it IS a matrix.
        </p>
      </div>
    </SimulationContainer>
  );
}
