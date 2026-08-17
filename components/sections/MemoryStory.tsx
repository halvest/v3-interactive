"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/animations/gsap-setup";
import { useGSAP } from "@gsap/react";
import { Memory } from "@/content/surprise";
import { PaperTape } from "@/components/ui/Decorations";
import { PixelCorner, PixelHeartSmall } from "@/components/ui/PixelAssets";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface MemoryStoryProps {
  memories: Memory[];
}

function getParallaxDistance() {
  if (window.matchMedia("(max-width: 767px)").matches) return 20;
  if (window.matchMedia("(max-width: 1023px)").matches) return 32;
  return 48;
}

export function MemoryStory({ memories }: MemoryStoryProps) {
  const containerRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (isReducedMotion) return;

    itemsRef.current.forEach((item) => {
      if (!item) return;
      
      const photoAssembly = item.querySelector('.memory-photo-assembly');
      const textContent = item.querySelector('.memory-text');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          end: "bottom 10%",
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      if (photoAssembly) {
        // All physically attached paper, tape, corners, and labels share this transform.
        tl.fromTo(photoAssembly, { y: () => getParallaxDistance() }, { y: () => -getParallaxDistance(), ease: "none" }, 0);
      }
      if (textContent) {
        tl.fromTo(
          textContent,
          { y: () => Math.round(getParallaxDistance() * 0.55), opacity: 0.5 },
          { y: () => -Math.round(getParallaxDistance() * 0.55), opacity: 1, ease: "none" },
          0
        );
      }
    });
  }, { scope: containerRef, dependencies: [isReducedMotion] });

  const renderLayoutArchetype = (memory: Memory, idx: number) => {
    const archetype = idx % 3;

    // Archetype 0: Large Photo, Heavy Overlap
    if (archetype === 0) {
      return (
        <div className="flex flex-col items-center w-full relative pt-10 pb-20">
          <div className="memory-photo-assembly relative z-10 w-[85vw] max-w-lg">
            <figure className="memory-image aspect-[3/4] relative overflow-hidden rounded-sm border-4 border-white bg-white shadow-polaroid">
              <Image
                src={memory.image}
                alt={memory.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 85vw, 600px"
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
              />
              <div className="absolute -top-2 -right-4 z-30 h-8 w-20 rotate-12">
                <PaperTape className="h-full w-full" />
              </div>
              {memory.caption && (
                <div className="absolute bottom-4 left-4 z-20 max-w-[80%] -rotate-1 rounded-sm border border-border-subtle bg-surface px-4 py-3 shadow-paper">
                  <p className="text-annotation text-lg text-text-primary">{memory.caption}</p>
                </div>
              )}
            </figure>
            <span className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 bg-plum px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-bg"><PixelHeartSmall className="text-love" />MEMORY {String(idx + 1).padStart(3, "0")}</span>
          </div>
          {(memory.date || memory.title) && (
          <div className="memory-text w-full max-w-2xl text-center md:text-left z-20 -mt-16 md:-mt-24 px-6 md:px-0">
            <div className="bg-surface p-6 shadow-paper rounded-sm inline-block rotate-[0.5deg] border border-border-subtle">
              {memory.date && <span className="text-caption text-text-faint uppercase tracking-widest block mb-2">{memory.date}</span>}
              {memory.title && (
                <h3 className="text-heading-1 text-text-primary [text-wrap:balance]">{memory.title}</h3>
              )}
            </div>
          </div>
          )}
        </div>
      );
    }

    // Archetype 1: Small Offset Polaroid with Oversized Title
    if (archetype === 1) {
      return (
        <div className="flex flex-col md:flex-row items-center justify-between w-full relative py-20 gap-8">
          <div className="memory-text flex-1 order-2 md:order-1 px-6 md:px-12 z-10 w-full text-left">
            {memory.date && <span className="text-annotation text-text-muted rotate-[-5deg] block mb-4">{memory.date}</span>}
            {memory.title && (
              <h3 className="text-heading-1 text-text-primary relative inline-block [text-wrap:balance]">
                {memory.title}
                <span className="absolute -bottom-2 left-0 h-[2px] w-12 bg-love/50" aria-hidden="true" />
              </h3>
            )}
          </div>
          <div className="memory-photo-assembly relative z-20 order-1 w-[65vw] max-w-xs md:order-4">
            <figure className="memory-image relative aspect-square rotate-[1.5deg] border border-border-subtle bg-white p-3 pb-12 shadow-polaroid">
              <div className="relative h-full w-full overflow-hidden bg-surface-warm/20">
                <Image
                  src={memory.image}
                  alt={memory.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 65vw, 300px"
                />
                <PixelCorner className="absolute left-2 top-2 h-5 w-5 text-love/80" />
                <PixelCorner className="absolute bottom-2 right-2 h-5 w-5 rotate-180 text-sky/80" />
              </div>
              <div className="absolute -top-4 left-1/2 z-30 h-6 w-16 -translate-x-1/2 -rotate-2">
                <PaperTape className="h-full w-full" />
              </div>
              {memory.caption && (
                <div className="absolute bottom-3 left-0 w-full text-center">
                  <p className="text-annotation text-text-muted">{memory.caption}</p>
                </div>
              )}
            </figure>
          </div>
        </div>
      );
    }

    // Archetype 2: Wide overlap with preceding/following space
    return (
      <div className="flex flex-col w-full relative py-24 md:py-32 items-end">
        <div className="memory-photo-assembly relative z-10 w-[90vw] max-w-2xl md:mr-[-3rem] md:w-[70vw]">
          <figure className="memory-image relative aspect-[4/3] -rotate-[0.5deg] border border-border-subtle bg-white p-2 shadow-paper">
            <div className="relative h-full w-full overflow-hidden bg-surface-warm/50">
              <Image
                src={memory.image}
                alt={memory.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 800px"
              />
            </div>
            <div className="absolute -bottom-3 -left-3 z-30 h-6 w-16 rotate-45 opacity-80">
              <PaperTape className="h-full w-full" />
            </div>
            <div className="absolute -top-3 -right-3 z-30 h-6 w-16 -rotate-45 opacity-80">
              <PaperTape className="h-full w-full" />
            </div>
          </figure>
        </div>
        
        <div className="memory-text w-[85vw] max-w-lg bg-surface shadow-paper p-7 md:p-8 z-20 -mt-20 md:-mt-32 mr-auto md:ml-12 border border-border-subtle rotate-[0.5deg]">
          {memory.date && <span className="text-caption text-text-muted uppercase tracking-wider block mb-4">{memory.date}</span>}
          {memory.title && (
            <h3 className="text-heading-2 text-text-primary mb-2 [text-wrap:balance]">{memory.title}</h3>
          )}
          {memory.caption && (
             <p className="text-annotation text-text-muted mt-6">{memory.caption}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section ref={containerRef} className="w-full py-24 md:py-40 px-5 md:px-12 bg-bg-deep flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col gap-12 md:gap-24 relative">
        {memories.map((memory, idx) => (
          <div key={memory.id} ref={el => { itemsRef.current[idx] = el }}>
            {renderLayoutArchetype(memory, idx)}
          </div>
        ))}
      </div>
    </section>
  );
}
