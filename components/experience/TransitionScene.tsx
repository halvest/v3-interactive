"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TransitionContent } from "@/content/surprise";
import { ANIMATION } from "@/lib/animations/gsap-setup";

interface TransitionSceneProps {
  config: TransitionContent;
  mode: "yes" | "thinking";
  onComplete: () => void;
}

export function TransitionScene({ config, mode, onComplete }: TransitionSceneProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);

  const line1Text = mode === "yes" ? config.acceptedLine1 : (config.thinkingLine1 || config.acceptedLine1);
  const line2Text = mode === "yes" ? config.acceptedLine2 : (config.thinkingLine2 || config.acceptedLine2);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    tl.fromTo(line1Ref.current,
          { opacity: 0, filter: "blur(4px)" }, 
          { opacity: 1, filter: "blur(0px)", duration: ANIMATION.duration.relaxed, ease: ANIMATION.ease.out }
        )
        .to(line1Ref.current, 
          { opacity: 0, filter: "blur(4px)", duration: ANIMATION.duration.relaxed, ease: ANIMATION.ease.inOut, delay: 1.2 }
        )
        .fromTo(line2Ref.current, 
          { opacity: 0, filter: "blur(4px)" }, 
          { opacity: 1, filter: "blur(0px)", duration: ANIMATION.duration.relaxed, ease: ANIMATION.ease.out, delay: 0.5 }
        )
        .to(line2Ref.current, 
          { opacity: 0, filter: "blur(4px)", duration: ANIMATION.duration.relaxed, ease: ANIMATION.ease.inOut, delay: 1.8 }
        )
        .to(overlayRef.current, 
          { opacity: 0, duration: ANIMATION.duration.relaxed, ease: "power2.inOut" }, 
          "-=0.5"
        );
  }, { scope: overlayRef, dependencies: [onComplete] });

  return (
    <div ref={overlayRef} className="fixed inset-0 w-full h-[100dvh] bg-bg flex flex-col items-center justify-center p-5 z-50 pointer-events-none">
      <div className="text-center max-w-md relative w-full h-24 flex items-center justify-center">
        <h2 ref={line1Ref} className="text-heading-1 text-text-primary absolute opacity-0">
          {line1Text}
        </h2>
        <h2 ref={line2Ref} className="text-heading-1 text-text-primary absolute opacity-0">
          {line2Text}
        </h2>
      </div>
    </div>
  );
}
