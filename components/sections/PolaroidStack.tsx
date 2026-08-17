"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Polaroid } from "@/components/ui/Polaroid";
import { Memory } from "@/content/surprise";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { PixelHeartSmall } from "@/components/ui/PixelAssets";

interface PolaroidStackProps {
  polaroids: Memory[];
}

export function PolaroidStack({ polaroids }: PolaroidStackProps) {
  const isReducedMotion = useReducedMotion();

  if (isReducedMotion) {
    return <StaticPolaroidStack polaroids={polaroids} />;
  }

  return <EmblaPolaroidStack polaroids={polaroids} />;
}

function SectionHeading({ staticMode = false }: { staticMode?: boolean }) {
  return (
    <div className="w-full max-w-6xl px-5 md:px-12 mb-16 text-center md:text-left flex flex-col items-center md:items-start">
      <span className="pixel-label mb-2 text-plum">MEMORY FILE {staticMode ? "STATIC" : "SWIPE"}</span>
      <h2 className="text-heading-1 text-text-primary [text-wrap:balance]">scattered moments.</h2>
    </div>
  );
}

function StaticPolaroidStack({ polaroids }: PolaroidStackProps) {
  return (
    <section className="w-full py-24 md:py-40 px-5 md:px-12 flex flex-col items-center bg-bg relative z-10">
      <SectionHeading staticMode />
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 justify-items-center">
        {polaroids.map((photo) => (
          <Polaroid
            key={photo.id}
            imageSrc={photo.image}
            alt={photo.alt}
            caption={photo.caption}
            rotation={0}
            className="w-full max-w-[320px]"
          />
        ))}
      </div>
    </section>
  );
}

function EmblaPolaroidStack({ polaroids }: PolaroidStackProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    dragFree: false, 
    loop: false,
    watchDrag: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Deterministic rotations for a scattered physical table feel
  const rotations = [-1.5, 1.5, -1, 1, -0.5, 1.5];

  return (
    <section className="w-full py-24 md:py-40 overflow-hidden flex flex-col items-center bg-bg relative z-10">
      
      <SectionHeading />
      
      {/* Embla Viewport */}
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y pt-12 pb-24 px-4">
          {polaroids.map((photo, index) => {
            const isActive = index === selectedIndex;
            const baseRotation = rotations[index % rotations.length];
            const finalRotation = isActive ? 0 : baseRotation;
            const finalScale = isActive ? 1.05 : 1;
            
            return (
              <div
                key={photo.id} 
                className="flex-[0_0_82%] max-w-[360px] sm:flex-[0_0_48%] md:flex-[0_0_32%] min-w-0 flex justify-center px-2 md:px-4 transition-all duration-[400ms] ease-out"
                style={{
                  transform: `scale(${finalScale}) rotate(${finalRotation}deg) translateY(${isActive ? '-20px' : '0px'})`,
                  opacity: isActive ? 1 : 0.88,
                  zIndex: isActive ? 20 : 1,
                }}
              >
                <div className={`relative w-full max-w-[320px] transition-all duration-[400ms] ${isActive ? 'shadow-paper' : 'shadow-sm'}`}>
                  {/* Paperclip Date Annotation (Only fully visible on active) */}
                  {photo.date && (
                    <div className={`absolute -top-6 left-6 z-30 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="inline-flex items-center gap-1.5 border border-plum/25 bg-surface px-3 py-1 shadow-paper rotate-[1deg]">
                        <PixelHeartSmall className="text-love" /><span className="font-mono text-[10px] tracking-[0.12em] text-text-primary">{String(index + 1).padStart(2, "0")} / {String(polaroids.length).padStart(2, "0")}</span>
                        <span className="text-annotation text-text-primary">{photo.date}</span>
                      </div>
                    </div>
                  )}

                  <Polaroid
                    imageSrc={photo.image}
                    alt={photo.alt}
                    caption={photo.caption}
                    rotation={0} 
                    className="w-full max-w-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </section>
  );
}
