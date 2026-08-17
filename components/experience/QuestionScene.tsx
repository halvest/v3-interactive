"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import { QuestionContent, surpriseConfig } from "@/content/surprise";
import { Button } from "@/components/ui/Button";
import { LoveBurst } from "@/components/ui/LoveBurst";
import { PixelHeartMedium, PixelHeartOutline, PixelHeartSmall, PixelSpark } from "@/components/ui/PixelAssets";
import { useAudioPlayer } from "@/components/audio/AudioPlayerProvider";
import { ANIMATION, gsap } from "@/lib/animations/gsap-setup";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useSoundEffect } from "@/lib/hooks/useSoundEffect";

interface QuestionSceneProps {
  config: QuestionContent;
  onYes: () => void;
}

interface EscapePosition { x: number; y: number; }

const SAFE_EDGE = 12;

export function QuestionScene({ config, onYes }: QuestionSceneProps) {
  const containerRef = useRef<HTMLElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const yesBtnWrapperRef = useRef<HTMLDivElement>(null);
  const noBtnWrapperRef = useRef<HTMLDivElement>(null);
  const escapeTweenRef = useRef<gsap.core.Tween | null>(null);
  const exitTweenRef = useRef<gsap.core.Tween | null>(null);
  const pointerWasConsumedRef = useRef(false);
  const pendingEscapeRef = useRef<{ origin: EscapePosition; target: EscapePosition } | null>(null);
  const [escapeCount, setEscapeCount] = useState(0);
  const [hasEscaped, setHasEscaped] = useState(false);
  const [yesBurst, setYesBurst] = useState(false);
  const { isMuted } = useAudioPlayer();
  const isReducedMotion = useReducedMotion();
  const { play: playNoSound, stop: stopNoSound } = useSoundEffect(surpriseConfig.soundEffects?.noButton, isMuted);

  const words = config.text.split(" ");
  const midPoint = Math.ceil(words.length / 2);
  const line1 = words.slice(0, midPoint).join(" ");
  const line2 = words.slice(midPoint).join(" ");

  useGSAP(() => {
    if (isReducedMotion) {
      gsap.set(containerRef.current, { opacity: 1 });
      return;
    }
    const timeline = gsap.timeline({ defaults: { ease: ANIMATION.ease.out } });
    timeline
      .fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: ANIMATION.duration.base })
      .fromTo([title1Ref.current, title2Ref.current], { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: ANIMATION.duration.relaxed, stagger: 0.1 }, "-=0.2")
      .fromTo([yesBtnWrapperRef.current, noBtnWrapperRef.current], { opacity: 0 }, { opacity: 1, duration: ANIMATION.duration.base, stagger: 0.08 }, "-=0.25");
  }, { scope: containerRef, dependencies: [isReducedMotion] });

  useEffect(() => {
    const clampToBounds = () => {
      if (!hasEscaped) return;
      const boundary = buttonsContainerRef.current?.getBoundingClientRect();
      const node = noBtnWrapperRef.current;
      const button = node?.getBoundingClientRect();
      if (!boundary || !button || !node) return;
      const x = Math.min(Math.max(SAFE_EDGE, button.left - boundary.left), boundary.width - button.width - SAFE_EDGE);
      const y = Math.min(Math.max(Math.max(72, boundary.height * 0.46), button.top - boundary.top), boundary.height - button.height - SAFE_EDGE);
      gsap.set(node, { x, y });
    };
    window.addEventListener("resize", clampToBounds, { passive: true });
    window.addEventListener("orientationchange", clampToBounds, { passive: true });
    return () => {
      window.removeEventListener("resize", clampToBounds);
      window.removeEventListener("orientationchange", clampToBounds);
    };
  }, [hasEscaped]);

  useLayoutEffect(() => {
    const pending = pendingEscapeRef.current;
    const node = noBtnWrapperRef.current;
    if (!hasEscaped || !pending || !node) return;
    pendingEscapeRef.current = null;
    gsap.set(node, pending.origin);
    escapeTweenRef.current?.kill();
    escapeTweenRef.current = gsap.to(node, { ...pending.target, duration: 0.22, ease: "power2.out", overwrite: "auto" });
  }, [hasEscaped]);

  useEffect(() => () => {
    escapeTweenRef.current?.kill();
    exitTweenRef.current?.kill();
    stopNoSound();
  }, [stopNoSound]);

  const targetPosition = (boundary: DOMRect, button: DOMRect, attempt: number): EscapePosition => {
    const positions = [[0.12, 0.56], [0.58, 0.66], [0.25, 0.82], [0.62, 0.48], [0.04, 0.74]] as const;
    const [ratioX, ratioY] = positions[attempt % positions.length];
    const maxX = Math.max(SAFE_EDGE, boundary.width - button.width - SAFE_EDGE);
    const minY = Math.max(72, boundary.height * 0.46);
    const maxY = Math.max(minY, boundary.height - button.height - SAFE_EDGE);
    return {
      x: Math.min(maxX, Math.max(SAFE_EDGE, ratioX * maxX)),
      y: Math.min(maxY, Math.max(minY, ratioY * maxY)),
    };
  };

  const evade = () => {
    if (isReducedMotion || !buttonsContainerRef.current || !noBtnWrapperRef.current) return;
    const boundary = buttonsContainerRef.current.getBoundingClientRect();
    const button = noBtnWrapperRef.current.getBoundingClientRect();
    const target = targetPosition(boundary, button, escapeCount);
    playNoSound();
    setEscapeCount((count) => count + 1);

    if (!hasEscaped) {
      pendingEscapeRef.current = {
        origin: { x: button.left - boundary.left, y: button.top - boundary.top },
        target,
      };
      setHasEscaped(true);
      return;
    }

    escapeTweenRef.current?.kill();
    escapeTweenRef.current = gsap.to(noBtnWrapperRef.current, { ...target, duration: 0.22, ease: "power2.out", overwrite: "auto" });
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    pointerWasConsumedRef.current = true;
    evade();
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    pointerWasConsumedRef.current = true;
    evade();
  };

  const handleNoClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) return;
    if (pointerWasConsumedRef.current) {
      pointerWasConsumedRef.current = false;
      return;
    }
    evade();
  };

  const leaveQuestion = (next: () => void) => {
    if (isReducedMotion) { next(); return; }
    exitTweenRef.current?.kill();
    exitTweenRef.current = gsap.to(containerRef.current, { opacity: 0, y: -16, duration: ANIMATION.duration.snappy, ease: ANIMATION.ease.out, onComplete: next });
  };

  const noLabel = escapeCount === 0 ? config.noLabel : config.noEscapeLabels[(escapeCount - 1) % config.noEscapeLabels.length];
  const handleYes = () => {
    if (isReducedMotion) { leaveQuestion(onYes); return; }
    setYesBurst(true);
  };
  const noButton = <Button variant="ghost" onClick={handleNoClick} className="flex h-14 w-full min-w-0 items-center justify-center gap-2.5 whitespace-nowrap border-plum/50 bg-surface px-3 py-0 text-base leading-none text-text-primary hover:bg-sky-soft"><PixelHeartOutline className="h-4 w-4 shrink-0 text-plum" />{noLabel}</Button>;

  return (
    <main ref={containerRef} className="fixed inset-0 z-50 flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-lavender-soft p-6 md:p-12">
      <div className="pointer-events-none absolute left-[8%] top-[16%] h-16 w-16 border border-sky/50 bg-sky-soft" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-[14%] right-[12%] text-love" aria-hidden="true"><PixelHeartMedium /></div>
      <div className="pointer-events-none absolute right-[17%] top-[20%] text-plum/35" aria-hidden="true"><PixelSpark className="h-5 w-5" /></div>
      <div className="relative z-10 flex w-full max-w-2xl flex-col">
        <div className="mb-8 space-y-2 md:mb-10 md:space-y-4">
          {config.systemLabel && <p className="pixel-label mb-5 text-plum">{config.systemLabel}</p>}
          <h1 ref={title1Ref} className="text-display text-left text-text-primary">{line1}</h1>
          <h1 ref={title2Ref} className="text-display text-right italic text-lavender">{line2}</h1>
        </div>
        <div ref={buttonsContainerRef} className="relative mx-auto min-h-[174px] w-full max-w-[320px] md:max-w-[360px]">
          <div className="grid grid-cols-2 gap-3">
            <div ref={yesBtnWrapperRef}>
              <Button onClick={handleYes} className="flex h-14 w-full items-center justify-center gap-2.5 bg-love px-3 py-0 text-base leading-none shadow-none hover:bg-love-deep"><PixelHeartSmall className="h-4 w-4 shrink-0 text-white" />{config.yesLabel}</Button>
            </div>
            {hasEscaped ? <div aria-hidden="true" /> : <div ref={noBtnWrapperRef} onPointerEnter={handlePointerEnter} onPointerDown={handlePointerDown}>{noButton}</div>}
          </div>
          {hasEscaped && <div ref={noBtnWrapperRef} className="absolute left-0 top-0 w-[calc((100%_-_0.75rem)_/_2)]" onPointerEnter={handlePointerEnter} onPointerDown={handlePointerDown}>{noButton}</div>}
        </div>
      </div>
      {yesBurst && <LoveBurst count={8} onComplete={() => leaveQuestion(onYes)} />}
    </main>
  );
}
