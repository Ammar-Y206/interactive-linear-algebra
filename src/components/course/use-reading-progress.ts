"use client";

/**
 * useReadingProgress
 * ----------------------------------------------------------------
 * Tracks how far the user has scrolled through the main content area
 * (0..1). Used by the top bar's reading-progress indicator so learners
 * always know where they are inside a long lesson.
 * ----------------------------------------------------------------
 */

import { useEffect, useState } from "react";

export function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, scrollTop / scrollHeight)));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return progress;
}
