"use client";

import { useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DateChoice as DateChoiceType, DateChoiceSectionContent, MemeInteraction } from "@/content/surprise";
import { ANIMATION } from "@/lib/animations/gsap-setup";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { PixelHeartSmall } from "@/components/ui/PixelAssets";
import { MemeOverlay } from "@/components/ui/MemeOverlay";
import { useAudioPlayer } from "@/components/audio/AudioPlayerProvider";
import { useSoundEffect } from "@/lib/hooks/useSoundEffect";

interface DateChoiceProps {
  choices: DateChoiceType[];
  content: DateChoiceSectionContent;
}

export function DateChoice({ choices, content }: DateChoiceProps) {
  const containerRef = useRef<HTMLElement>(null);
  const choicesRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [memeInteraction, setMemeInteraction] = useState<MemeInteraction | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const memeIsOpenRef = useRef(false);
  const { isMuted } = useAudioPlayer();
  const memeSound = choices.find((choice) => choice.specialInteraction?.type === "meme")?.specialInteraction?.audio;
  const { play: playMemeSound, stop: stopMemeSound } = useSoundEffect(memeSound, isMuted);

  useGSAP(() => {
    if (isReducedMotion || !choicesRef.current) return;

    gsap.fromTo(choicesRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION.duration.base,
        stagger: 0.15,
        scrollTrigger: {
          trigger: choicesRef.current,
          start: "top 80%",
        }
      }
    );
  }, { scope: containerRef, dependencies: [isReducedMotion] });

  const handleSelect = (choice: DateChoiceType, option: string, event: MouseEvent<HTMLButtonElement>) => {
    if (choice.specialInteraction?.type === "meme") {
      if (memeIsOpenRef.current) return;
      memeIsOpenRef.current = true;
      triggerRef.current = event.currentTarget;
      setMemeInteraction(choice.specialInteraction);
      playMemeSound();
      return;
    }

    setSelections((previous) => ({ ...previous, [choice.id]: option }));
  };

  const handleMemeClosed = () => {
    memeIsOpenRef.current = false;
    setMemeInteraction(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const allSelected = choices
    .filter((choice) => !choice.specialInteraction)
    .every((choice) => selections[choice.id]);

  return (
    <section ref={containerRef} className="w-full py-24 md:py-40 px-5 md:px-8 flex flex-col items-center bg-mustard-soft overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col items-center">
        
        <div className="w-full max-w-2xl mb-16 md:mb-20 text-center md:text-left md:self-start md:ml-12">
          <span className="pixel-label mb-3 text-plum">{content.eyebrow}</span>
          <h2 className="text-heading-1 text-text-primary [text-wrap:balance]">{content.heading}</h2>
          {content.lead && <p className="text-body text-text-muted mt-4">{content.lead}</p>}
        </div>
        
        <div ref={choicesRef} className="flex flex-col gap-12 w-full max-w-2xl">
          {choices.map((choice, idx) => {
            // Alternate left/right offset for an asymmetrical stack
            const offsetClass = idx % 2 === 0 ? "md:pr-12 md:mr-auto" : "md:pl-12 md:ml-auto";
            const rotationClass = idx % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]";
            const ticketColors = idx % 2 === 0 ? ["bg-coral-soft", "bg-sky-soft"] : ["bg-lavender-soft", "bg-sage-light"];

            return (
              <div key={choice.id} className={`flex flex-col md:flex-row items-center w-full gap-6 md:gap-8 justify-center ${offsetClass} ${rotationClass}`}>
                
                {/* Option A Ticket */}
                <button
                  onClick={(event) => handleSelect(choice, choice.optionA, event)}
                  aria-pressed={selections[choice.id] === choice.optionA}
                  className={`
                    w-full max-w-[340px] md:flex-1 md:max-w-[250px] min-h-[128px] md:aspect-[4/3] flex flex-col items-center justify-center p-6 md:p-5
                    transition-all duration-300 ease-out active:scale-95 relative
                    ${ticketColors[0]} shadow-paper rounded-sm border border-border-subtle
                    before:absolute before:inset-x-3 before:top-3 before:border-t before:border-dashed before:border-border-strong/60
                    after:absolute after:inset-x-3 after:bottom-3 after:border-b after:border-dashed after:border-border-strong/60
                    ${selections[choice.id] === choice.optionA 
                      ? 'scale-[1.02] shadow-paper z-10 border-accent/70 bg-surface' 
                      : 'hover:-translate-y-1 z-0'
                    }
                  `}
                >
                  {selections[choice.id] === choice.optionA && <PixelHeartSmall className="absolute right-4 top-4 z-10 text-love" />}
                  <span className="text-caption text-text-faint tracking-[0.16em] uppercase mb-3 relative z-10">DATE OPTION {idx * 2 + 1}</span>
                  <span className={`text-heading-1 text-text-primary relative z-10 [text-wrap:balance] ${selections[choice.id] === choice.optionA ? 'text-accent' : ''}`}>{choice.optionA}</span>
                </button>
                
                {/* Option B Ticket */}
                <button
                  onClick={(event) => handleSelect(choice, choice.optionB, event)}
                  aria-pressed={selections[choice.id] === choice.optionB}
                  className={`
                    w-full max-w-[340px] md:flex-1 md:max-w-[250px] min-h-[128px] md:aspect-[4/3] flex flex-col items-center justify-center p-6 md:p-5
                    transition-all duration-300 ease-out active:scale-95 relative
                    ${ticketColors[1]} shadow-paper rounded-sm border border-border-subtle
                    before:absolute before:inset-x-3 before:top-3 before:border-t before:border-dashed before:border-border-strong/60
                    after:absolute after:inset-x-3 after:bottom-3 after:border-b after:border-dashed after:border-border-strong/60
                    ${selections[choice.id] === choice.optionB 
                      ? 'scale-[1.02] shadow-paper z-10 border-accent/70 bg-surface' 
                      : 'hover:-translate-y-1 z-0'
                    }
                  `}
                >
                  {selections[choice.id] === choice.optionB && <PixelHeartSmall className="absolute right-4 top-4 z-10 text-love" />}
                  <span className="text-caption text-text-faint tracking-[0.16em] uppercase mb-3 relative z-10">DATE OPTION {idx * 2 + 2}</span>
                  <span className={`text-heading-1 text-text-primary relative z-10 [text-wrap:balance] ${selections[choice.id] === choice.optionB ? 'text-accent' : ''}`}>{choice.optionB}</span>
                </button>
                
              </div>
            );
          })}
        </div>

        {/* Reaction Text */}
        <div className={`mt-24 transition-all duration-1000 flex flex-col items-center ${allSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="text-annotation text-text-muted mb-2">{content.completeEyebrow}</span>
          <p className="text-body-lg text-text-primary font-serif">{content.completeMessage}</p>
        </div>
        
      </div>
      {memeInteraction && (
        <MemeOverlay
          interaction={memeInteraction}
          onDismissStart={stopMemeSound}
          onClose={handleMemeClosed}
        />
      )}
    </section>
  );
}
