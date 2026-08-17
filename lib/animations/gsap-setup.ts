import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export { gsap, ScrollTrigger };

// Only register if we are in the browser
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  
  // Disable lag smoothing to prevent jank when working with Lenis sync
  gsap.ticker.lagSmoothing(0);
}

// Approved easing/duration vocabulary (MOTION_SYSTEM.md)
export const ANIMATION = {
  duration: {
    snappy: 0.3,
    base: 0.6,
    relaxed: 1.0,
    cinematic: 2.5
  },
  ease: {
    out: "power2.out",
    inOut: "power2.inOut",
    spring: "back.out(1.2)",
    smooth: "expo.out"
  },
  depth: {
    far: 120, // Parallax depth
    back: 60,
    content: 0,
    front: -40
  }
};
