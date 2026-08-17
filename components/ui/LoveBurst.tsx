"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations/gsap-setup";
import { PixelHeartSmall } from "./PixelAssets";

interface LoveBurstProps { count?: number; className?: string; onComplete?: () => void; }

const trajectories = [[-44, -78, -14], [20, -102, 12], [72, -70, 20], [-88, -48, -22], [6, -132, 6], [48, -114, -10], [-22, -120, 16], [96, -82, 28], [-112, -92, -30], [34, -58, 10]] as const;

export function LoveBurst({ count = 8, className = "", onComplete }: LoveBurstProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const particleCount = Math.min(count, 10);
  useGSAP(() => {
    const particles = scopeRef.current?.querySelectorAll("[data-heart]");
    if (!particles?.length) return;
    gsap.fromTo(particles, { opacity: 0, scale: 0.45 }, { opacity: 1, scale: 1, duration: 0.16, stagger: 0.025, ease: "power2.out" });
    gsap.to(particles, {
      x: (index) => trajectories[index][0], y: (index) => trajectories[index][1], rotation: (index) => trajectories[index][2], opacity: 0, scale: 0.8,
      duration: 0.7, delay: 0.1, stagger: 0.012, ease: "power2.out",
      onComplete: () => { setIsVisible(false); onComplete?.(); },
    });
  }, { scope: scopeRef });
  if (!isVisible) return null;
  return <div ref={scopeRef} className={`pointer-events-none absolute left-1/2 top-1/2 z-[80] h-0 w-0 ${className}`} aria-hidden="true">{Array.from({ length: particleCount }, (_, index) => <PixelHeartSmall key={index} data-heart className={index % 3 === 0 ? "absolute -left-1 -top-1 text-love" : "absolute -left-1 -top-1 text-lavender"} />)}</div>;
}
