"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { EndingContent } from "@/content/surprise";
import { PaperTape } from "@/components/ui/Decorations";
import { LoveBurst } from "@/components/ui/LoveBurst";
import { PixelHeartMedium, PixelHeartSmall } from "@/components/ui/PixelAssets";
import { ANIMATION } from "@/lib/animations/gsap-setup";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface EndingSectionProps {
  content: EndingContent;
}

export function EndingSection({ content }: EndingSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);
  const [burstKey, setBurstKey] = useState(0);
  const isReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (isReducedMotion || !elementsRef.current) return;

    // Layered entrance
    const entrance = gsap.fromTo(elementsRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION.duration.cinematic,
        stagger: 0.15,
        ease: ANIMATION.ease.out,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          once: true,
        }
      });
    entrance.eventCallback("onComplete", () => setBurstKey(1));
  }, { scope: containerRef, dependencies: [isReducedMotion] });

  return (
    <section ref={containerRef} className="w-full min-h-[100dvh] py-32 md:py-48 px-5 flex flex-col items-center justify-center bg-lavender-soft relative overflow-hidden">
      <div ref={elementsRef} className="w-full max-w-4xl flex flex-col items-center justify-center relative">
        {content.systemLabel && <p className="pixel-label mb-5 text-plum">{content.systemLabel}</p>}
        {content.completionLabel && <p className="mb-8 font-mono text-xs font-semibold tracking-[0.18em] text-love">{content.completionLabel}</p>}
        
        {/* Large offset photo placeholder */}
        <figure className="relative w-[75vw] max-w-sm aspect-[4/5] bg-surface p-3 pb-11 shadow-polaroid border border-border-subtle rotate-[1deg] md:mr-32 z-10">
          <div className="relative w-full h-full bg-surface-warm/30 overflow-hidden">
            <Image
              src={content.image}
              alt={content.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 75vw, 400px"
            />
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rotate-[-4deg] z-30">
            <PaperTape className="w-full h-full" />
          </div>
        </figure>

        {/* Folded Note */}
        <div className="relative w-[85vw] max-w-md bg-surface shadow-paper p-7 md:p-10 border border-border-subtle -mt-16 md:-mt-32 md:ml-48 rotate-[-0.5deg] z-20">
           <h2 className="text-heading-1 text-text-primary mb-4 [text-wrap:balance]">
             {content.title}
           </h2>
           {content.subtitle && (
             <p className="text-body-lg text-text-muted font-serif italic">
               {content.subtitle}
             </p>
           )}
           <PixelHeartMedium className="absolute -right-3 -top-4 text-love" />
        </div>

        {/* Minimal CTA */}
        <div className="pt-20 md:pt-24 relative z-30 opacity-70">
          {content.cta && <span className="inline-flex items-center gap-2 text-caption text-text-primary uppercase tracking-widest"><PixelHeartSmall className="text-love" />{content.cta}</span>}
        </div>
        
      </div>
      {burstKey > 0 && !isReducedMotion && <LoveBurst key={burstKey} count={9} className="top-[42%]" />}
    </section>
  );
}
