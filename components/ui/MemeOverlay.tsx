"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import type { MemeInteraction } from "@/content/surprise";
import { gsap } from "@/lib/animations/gsap-setup";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { PixelCursor, PixelHeartSmall } from "@/components/ui/PixelAssets";

interface MemeOverlayProps {
  interaction: MemeInteraction;
  onDismissStart: () => void;
  onClose: () => void;
}

export function MemeOverlay({ interaction, onDismissStart, onClose }: MemeOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const isReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (isReducedMotion) {
      gsap.set([panelRef.current, imageRef.current, messageRef.current], { opacity: 1, scale: 1, x: 0 });
      return;
    }

    gsap.timeline()
      .fromTo(dialogRef.current, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: "power1.out" })
      .fromTo(panelRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.24, ease: "power2.out" })
      .to(panelRef.current, { x: 2, duration: 0.04 })
      .to(panelRef.current, { x: -2, duration: 0.05 })
      .to(panelRef.current, { x: 0, duration: 0.05 })
      .fromTo(imageRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, "-=0.1")
      .fromTo(messageRef.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, "-=0.08");
  }, { scope: dialogRef, dependencies: [isReducedMotion] });

  const requestClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    onDismissStart();

    if (isReducedMotion) {
      onClose();
      return;
    }

    closeTimelineRef.current?.kill();
    closeTimelineRef.current = gsap.timeline({ onComplete: onClose })
      .to(panelRef.current, { opacity: 0, scale: 0.96, duration: 0.16, ease: "power2.in" })
      .to(dialogRef.current, { opacity: 0, duration: 0.12, ease: "power1.in" }, "-=0.04");
  }, [isClosing, isReducedMotion, onClose, onDismissStart]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [requestClose]);

  useEffect(() => () => {
    closeTimelineRef.current?.kill();
  }, []);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-plum/75 px-5 py-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meme-overlay-title"
      aria-describedby="meme-overlay-message"
    >
      <div ref={panelRef} className="relative w-full max-w-[360px] border-2 border-love bg-surface p-5 shadow-[5px_5px_0_var(--color-love)] sm:max-w-[400px] sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-plum/20 pb-3">
          <p id="meme-overlay-title" className="pixel-label text-plum">{interaction.statusLabel}</p>
          <PixelHeartSmall className="shrink-0 text-love" />
        </div>
        <Image
          ref={imageRef}
          src={interaction.image}
          alt={interaction.imageAlt}
          width={320}
          height={240}
          unoptimized
          loading="eager"
          className="mx-auto aspect-[4/3] w-full max-w-[280px] object-contain sm:max-w-[320px]"
        />
        <p id="meme-overlay-message" ref={messageRef} className="mt-5 text-center font-serif text-[clamp(1.7rem,7vw,2.35rem)] leading-[0.95] text-text-primary [text-wrap:balance]">
          {interaction.text}
        </p>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={requestClose}
          disabled={isClosing}
          className="pixel-button mx-auto mt-6 flex min-h-11 items-center gap-2 border border-plum bg-coral-soft px-5 text-sm font-medium text-text-primary transition-[transform,background-color] hover:-translate-y-[2px] hover:bg-love active:translate-y-[2px] disabled:cursor-not-allowed"
        >
          <PixelCursor className="h-3 w-3" />
          {interaction.dismissLabel}
        </button>
      </div>
    </div>
  );
}
