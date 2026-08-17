"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
// Ensure plugins are registered
import "@/lib/animations/gsap-setup";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null);
  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    // If reduced motion is preferred, we don't sync GSAP to lenis ticker to let native scroll take over
    if (isReducedMotion) return;

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
