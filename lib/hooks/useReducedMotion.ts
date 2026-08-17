"use client";

import { useSyncExternalStore } from "react";

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true // SSR fallback: default to true to prevent animation flashes before hydration
  );
}
