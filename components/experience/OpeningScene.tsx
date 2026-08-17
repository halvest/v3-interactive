"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { OpeningContent } from "@/content/surprise";
import { Button } from "@/components/ui/Button";
import { LoveBurst } from "@/components/ui/LoveBurst";
import { PixelCursor, PixelHeartMedium, PixelHeartSmall, PixelSpark } from "@/components/ui/PixelAssets";
import { ANIMATION, gsap } from "@/lib/animations/gsap-setup";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface OpeningSceneProps { config: OpeningContent; onComplete: () => void; }

export function OpeningScene({ config, onComplete }: OpeningSceneProps) {
  const containerRef = useRef<HTMLElement>(null);
  const bootRef = useRef<HTMLElement>(null);
  const bootCursorRef = useRef<SVGSVGElement>(null);
  const bootCopyRef = useRef<HTMLParagraphElement>(null);
  const bootHeartRef = useRef<HTMLDivElement>(null);
  const bootOnlineRef = useRef<HTMLParagraphElement>(null);
  const bootBlocksRef = useRef<HTMLElement[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const deco1Ref = useRef<HTMLDivElement>(null);
  const deco2Ref = useRef<HTMLDivElement>(null);
  const exitTweenRef = useRef<gsap.core.Tween | null>(null);
  const bootTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [startBurst, setStartBurst] = useState(false);
  const isReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (isReducedMotion || !isBooting) {
      setIsBooting(false);
      return;
    }
    const tl = gsap.timeline({ onComplete: () => setIsBooting(false) });
    bootTimelineRef.current = tl;
    if (bootCursorRef.current) tl.fromTo(bootCursorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.12 });
    if (bootCopyRef.current) tl.fromTo(bootCopyRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, "<");
    if (bootBlocksRef.current.length) tl.to(bootBlocksRef.current, { backgroundColor: "var(--color-love)", duration: 0.12, stagger: 0.08 }, "+=0.14");
    if (bootHeartRef.current) tl.fromTo(bootHeartRef.current, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.28, ease: "back.out(1.3)" }, "+=0.08");
    if (bootOnlineRef.current) tl.fromTo(bootOnlineRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, "-=0.04");
    tl
      .to(bootRef.current, { opacity: 0, duration: 0.24, ease: "power1.in" }, "+=0.28");
  }, { scope: containerRef, dependencies: [isBooting, isReducedMotion] });

  useGSAP(() => {
    if (isBooting) return;
    if (isReducedMotion) {
      gsap.set(containerRef.current, { opacity: 1 });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: ANIMATION.ease.out } });
    const children = textRef.current?.children;
    if (children) tl.fromTo(children, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: ANIMATION.duration.relaxed, stagger: 0.12 });
    tl.fromTo(photoRef.current, { opacity: 0, x: 20, rotate: 2 }, { opacity: 1, x: 0, rotate: 0, duration: ANIMATION.duration.cinematic, ease: ANIMATION.ease.smooth }, "-=0.7")
      .fromTo([deco1Ref.current, deco2Ref.current], { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: ANIMATION.duration.relaxed, stagger: 0.16 }, "-=0.45");

    const handlePointerMove = (event: PointerEvent) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const xPos = (event.clientX / window.innerWidth - 0.5) * 2;
      const yPos = (event.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(deco1Ref.current, { x: xPos * 10, y: yPos * 10, duration: 0.8, ease: "power2.out", overwrite: "auto" });
      gsap.to(deco2Ref.current, { x: xPos * -14, y: yPos * -14, duration: 1, ease: "power2.out", overwrite: "auto" });
      gsap.to(photoRef.current, { x: xPos * -8, y: yPos * -8, rotation: yPos * -1.5, duration: 1.4, ease: "power2.out", overwrite: "auto" });
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, { scope: containerRef, dependencies: [isBooting, isReducedMotion] });

  useEffect(() => () => { exitTweenRef.current?.kill(); bootTimelineRef.current?.kill(); }, []);

  const skipBoot = () => {
    bootTimelineRef.current?.kill();
    setIsBooting(false);
  };
  const finishOpening = () => {
    if (isReducedMotion) { onComplete(); return; }
    exitTweenRef.current = gsap.to(containerRef.current, { opacity: 0, y: -16, duration: ANIMATION.duration.snappy, ease: ANIMATION.ease.out, onComplete });
  };
  const handleComplete = () => { setStartBurst(true); };

  return <main ref={containerRef} className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col justify-center overflow-hidden bg-bg px-6 md:px-12 lg:px-24">
    <div ref={photoRef} className="absolute right-[-10%] top-[10%] -z-10 aspect-[3/4] w-[60vw] rotate-[2deg] border border-sky/40 bg-sky-soft opacity-45 md:right-10 md:top-[15%] md:w-[400px]">
      <Image src={config.previewImage} alt={config.previewImageAlt} fill className="object-cover" priority />
    </div>
    <div ref={textRef} className="relative z-10 mt-20 flex w-full max-w-2xl flex-col items-start text-left">
      {config.systemLabel && <p className="pixel-label mb-5 text-plum">{config.systemLabel}</p>}
      {config.eyebrow && <p className="text-body mb-4 text-text-muted md:mb-6">{config.eyebrow}</p>}
      <h1 className="text-display mb-6 text-text-primary md:mb-8">{config.title}</h1>
      {config.subtitle && <p className="text-body-lg mb-12 max-w-md text-text-muted">{config.subtitle}</p>}
      <div className="mt-1 flex w-full justify-center self-center">
        <Button onClick={handleComplete} className="inline-flex h-14 w-[180px] items-center justify-center gap-2.5 px-5 py-0 text-base leading-none md:w-[200px]"><PixelHeartSmall className="shrink-0 text-white" />{config.cta}</Button>
      </div>
    </div>
    <div ref={deco1Ref} className="pointer-events-none absolute right-[26%] top-[25%] -z-10 text-sky"><PixelSpark className="h-10 w-10" /></div>
    <div ref={deco2Ref} className="pointer-events-none absolute bottom-[15%] left-[20%] -z-10 text-love"><PixelHeartMedium /></div>
    {startBurst && <LoveBurst count={5} onComplete={finishOpening} />}
    {!isReducedMotion && isBooting && <aside ref={bootRef} onPointerDown={skipBoot} className="absolute inset-0 z-[60] flex cursor-pointer items-center justify-center overflow-hidden bg-plum px-6 text-bg" aria-label="Skip opening animation">
      <div className="w-full max-w-sm border border-bg/25 bg-plum p-6 shadow-[4px_4px_0_var(--color-love)]">
        <div className="pixel-label text-bg/70"><PixelCursor ref={bootCursorRef} className="h-3 w-2" /> LOVE OS</div>
        <p ref={bootCopyRef} className="mt-5 font-mono text-sm tracking-wide">{config.bootInitializing}</p>
        <div className="mt-4 flex gap-1.5" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} ref={(element) => { if (element) bootBlocksRef.current[index] = element; }} className="h-3 flex-1 border border-bg/40 bg-plum" />)}</div>
        <div ref={bootHeartRef} className="mt-8 flex items-center gap-3 text-love"><PixelHeartMedium /><p ref={bootOnlineRef} className="font-mono text-xs font-semibold tracking-[0.12em] text-bg">{config.bootOnline}</p></div>
      </div>
    </aside>}
  </main>;
}
