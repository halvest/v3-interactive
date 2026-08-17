"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LetterContent } from "@/content/surprise";
import { ANIMATION } from "@/lib/animations/gsap-setup";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { PixelHeartSmall } from "@/components/ui/PixelAssets";

interface SecretLetterProps {
  content: LetterContent;
}

export function SecretLetter({ content }: SecretLetterProps) {
  const containerRef = useRef<HTMLElement>(null);
  const letterWrapperRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (isReducedMotion || !letterWrapperRef.current || !textContainerRef.current) return;

    // Fast, readability-focused stagger entrance
    gsap.fromTo(letterWrapperRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION.duration.relaxed,
        ease: ANIMATION.ease.out,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      }
    );
  }, { scope: containerRef, dependencies: [isReducedMotion] });

  return (
    <section ref={containerRef} className="w-full py-40 md:py-64 px-5 md:px-12 flex flex-col items-center bg-bg relative overflow-hidden">
      
      <div 
        ref={letterWrapperRef} 
        className="w-full max-w-2xl bg-surface shadow-paper p-7 md:p-12 lg:p-16 border border-border-subtle rotate-[-0.5deg] relative"
      >
        {content.systemLabel && <p className="pixel-label text-plum">{content.systemLabel}</p>}
        {/* Tiny Date Annotation */}
        {content.date && (
          <div className="absolute top-7 right-7 md:top-10 md:right-10 text-right">
            <span className="text-annotation text-text-muted/60">{content.date}</span>
          </div>
        )}

        <div ref={textContainerRef} className="w-full max-w-xl flex flex-col gap-8 md:gap-10 pt-8 md:pt-4">
          
          {content.heading && (
            <h2 className="text-heading-1 text-text-primary mb-4 md:mb-6 [text-wrap:balance]">
              {content.heading}
            </h2>
          )}
          
          <div className="space-y-7 md:space-y-9">
            {content.body.map((paragraph, index) => (
              <p 
                key={index} 
                className="text-body-lg text-text-primary/90 leading-relaxed font-normal [text-wrap:pretty]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {content.signOff && (
            <div className="mt-6 md:mt-8 text-right">
              <span className="inline-flex items-center gap-2 text-annotation text-text-muted opacity-60"><PixelHeartSmall className="text-love" />{content.signOff}</span>
            </div>
          )}
          
        </div>
      </div>

    </section>
  );
}
