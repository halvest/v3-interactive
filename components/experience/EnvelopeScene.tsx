"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ANIMATION } from "@/lib/animations/gsap-setup";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { EnvelopeContent } from "@/content/surprise";
import { PaperTape } from "@/components/ui/Decorations";
import { PixelHeartMedium, PixelHeartSmall } from "@/components/ui/PixelAssets";

interface EnvelopeSceneProps {
  config: EnvelopeContent;
  onComplete: () => void;
}

export function EnvelopeScene({ config, onComplete }: EnvelopeSceneProps) {
  const containerRef = useRef<HTMLElement>(null);
  const envelopeRef = useRef<HTMLButtonElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const tapeRef = useRef<HTMLDivElement>(null);
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const isReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (isReducedMotion) {
      gsap.set(envelopeRef.current, { opacity: 1, y: 0, rotate: -2 });
      return;
    }

    // Entrance
    gsap.fromTo(envelopeRef.current,
      { y: 50, opacity: 0, rotate: -4 },
      { y: 0, opacity: 1, rotate: -2, duration: ANIMATION.duration.cinematic, ease: ANIMATION.ease.out }
    );
  }, { scope: containerRef, dependencies: [isReducedMotion] });

  useEffect(() => () => {
    openTimelineRef.current?.kill();
  }, []);

  const handleTap = () => {
    if (isOpen || !envelopeRef.current || !flapRef.current || !letterRef.current || !tapeRef.current) return;
    setIsOpen(true);

    if (isReducedMotion) {
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete,
    });
    openTimelineRef.current = tl;

    // Tape peels off
    tl.to(tapeRef.current, {
      opacity: 0,
      scale: 1.1,
      y: -10,
      duration: 0.3,
      ease: "power2.in"
    })
    // Flap folds open
    .to(flapRef.current, {
      rotateX: 180,
      duration: ANIMATION.duration.relaxed,
      ease: "back.inOut(1.2)"
    }, "+=0.1")
    // Letter pulls out
    .to(letterRef.current, {
      y: "-75%",
      duration: ANIMATION.duration.base,
      ease: ANIMATION.ease.out,
    }, "-=0.2")
    // Wait a beat
    .to({}, { duration: 0.5 })
    // Scene fades and pulls up
    .to(containerRef.current, {
      opacity: 0,
      y: -40,
      duration: ANIMATION.duration.base,
      ease: ANIMATION.ease.out
    });
  };

  return (
    <main ref={containerRef} className="fixed inset-0 w-full h-[100dvh] bg-mustard-soft flex flex-col items-center justify-center p-5 z-50 overflow-hidden perspective-[1000px]">
      
      <div className="absolute top-[10%] w-full text-center pointer-events-none">
        {config.systemLabel && <p className="pixel-label justify-center text-plum">{config.systemLabel}</p>}
        <p className="mt-3 font-serif text-2xl text-text-muted italic">{config.label}</p>
      </div>

      <button
        type="button"
        aria-label={config.instruction}
        className="relative w-[90vw] md:max-w-lg aspect-[4/3] cursor-pointer group text-left"
        onClick={handleTap}
        ref={envelopeRef}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Soft Physical Shadow */}
        <div className="absolute inset-x-4 bottom-0 h-10 bg-black/5 shadow-[0_16px_28px_rgba(26,26,26,0.09)] translate-y-6 rounded-full scale-95" />

        {/* Envelope Back Base */}
        <div className="absolute inset-0 bg-surface-warm rounded shadow-paper-lg border border-border-subtle" style={{ zIndex: 1 }}>
            <div className="absolute top-0 left-0 w-full h-full bg-mustard-soft border-t border-r border-border-subtle" style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)" }} />
            <div className="absolute top-0 right-0 w-full h-full bg-mustard-soft border-t border-l border-border-subtle" style={{ clipPath: "polygon(100% 0, 100% 100%, 50% 50%)" }} />
            <div className="absolute bottom-0 left-0 w-full h-full bg-bg border-t border-border-subtle" style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }} />
        </div>
        
        {/* Letter Inside */}
        <div 
          ref={letterRef}
          className="absolute top-2 left-3 right-3 bottom-2 z-10"
        >
            <div className="w-full h-full bg-surface flex flex-col items-center justify-center border border-border-subtle shadow-inner rounded-sm">
              <span className="text-body-lg text-text-primary text-center px-4 font-serif">
                {config.message}
              </span>
            </div>
        </div>

        {/* Envelope Front Cutout */}
        <div 
          className="absolute inset-0 bg-bg rounded overflow-hidden shadow-sm border border-border-subtle" 
          style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 40%, 50% 70%, 0 40%)', zIndex: 20 }} 
        />
        
        {/* Top Flap */}
        <div 
            ref={flapRef}
            className="absolute top-0 left-0 w-full h-full origin-top z-40 bg-mustard-soft border-b border-border-subtle" 
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 55%)', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }} 
        />

        {/* Tape Seal */}
        <div ref={tapeRef} className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rotate-[-4deg]">
          <PaperTape className="w-16 h-6 bg-white/60 shadow-sm" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-love"><PixelHeartMedium /></span>
        </div>
        
        {/* Instructional Text */}
        <div className={`absolute -bottom-20 left-0 right-0 text-center transition-opacity duration-500 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
          <p className="inline-flex items-center gap-2 text-caption text-text-muted">
            <PixelHeartSmall className="text-love" />
            {config.instruction}
          </p>
        </div>
      </button>
    </main>
  );
}
