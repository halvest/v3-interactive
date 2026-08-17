"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { QuizContent } from "@/content/surprise";
import { Button } from "@/components/ui/Button";
import { LoveBurst } from "@/components/ui/LoveBurst";
import { PixelCursor, PixelHeartMedium, PixelSpark } from "@/components/ui/PixelAssets";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface QuizNameSceneProps {
  config: QuizContent;
  onComplete: () => void;
}

export function QuizNameScene({ config, onComplete }: QuizNameSceneProps) {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const successTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const feedbackTweenRef = useRef<gsap.core.Tween | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const isReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (isReducedMotion) {
      gsap.set([cardRef.current, backRef.current, frontRef.current], { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(backRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
    gsap.fromTo(cardRef.current, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", delay: 0.08 });
    gsap.fromTo(frontRef.current, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.16 });
  }, { scope: containerRef, dependencies: [isReducedMotion] });

  useEffect(() => () => {
    successTimelineRef.current?.kill();
    feedbackTweenRef.current?.kill();
  }, []);

  const showWrongFeedback = () => {
    const next = config.wrongFeedback[Math.floor(Math.random() * config.wrongFeedback.length)];
    setFeedback(next);
    if (isReducedMotion || !cardRef.current) return;
    feedbackTweenRef.current?.kill();
    feedbackTweenRef.current = gsap.fromTo(cardRef.current, { x: -5 }, { x: 0, duration: 0.28, ease: "power2.out", keyframes: [{ x: 5, duration: 0.08 }, { x: -4, duration: 0.08 }, { x: 0, duration: 0.1 }] });
  };

  const revealSuccess = () => {
    setIsLocked(true);
    setFeedback(config.successLabel);
    setBurstKey((key) => key + 1);
    inputRef.current?.blur();
    if (isReducedMotion) {
      onComplete();
      return;
    }
    const timeline = gsap.timeline({ onComplete });
    successTimelineRef.current = timeline;
    timeline
      .to(cardRef.current, { scale: 0.97, y: -50, duration: 0.34, ease: "power2.inOut" }, 0)
      .to(backRef.current, { y: -25, duration: 0.48, ease: "power2.inOut" }, 0)
      .to(frontRef.current, { y: -80, rotate: -4, duration: 0.52, ease: "power2.inOut" }, 0)
      .to(containerRef.current, { opacity: 0, duration: 0.28, ease: "power2.in" }, 0.72);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLocked) return;
    if (answer.trim().toLocaleLowerCase() === config.answer.trim().toLocaleLowerCase()) revealSuccess();
    else showWrongFeedback();
  };

  return (
    <main ref={containerRef} className="fixed inset-0 z-50 flex min-h-[100dvh] w-full items-center justify-center overflow-y-auto bg-sky-soft px-5 py-28 md:px-10">
      <div ref={backRef} className="pointer-events-none absolute left-[8%] top-[16%] h-32 w-32 border border-sky/45 bg-bg/75" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-[12%] right-[10%] h-20 w-20 bg-coral-soft" aria-hidden="true" />
      <div ref={frontRef} className="pointer-events-none absolute left-[13%] top-[28%] text-love" aria-hidden="true"><PixelSpark className="h-10 w-10" /></div>

      <div ref={cardRef} className="relative z-10 w-full max-w-xl border border-sky/45 bg-surface p-7 shadow-paper-lg md:p-12">
        <div className="flex items-center justify-between gap-5"><span className="pixel-label text-sky">{config.eyebrow}</span><PixelHeartMedium className="text-love" /></div>
        <h1 className="mt-5 max-w-md text-heading-1 text-text-primary [text-wrap:balance]">{config.question}</h1>
        <p className="mt-4 max-w-sm text-body text-text-muted">{config.helper}</p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
          <label htmlFor="quiz-name-answer" className="inline-flex items-center gap-2 text-annotation text-sky"><PixelCursor className="h-4 w-3" />{config.inputLabel}</label>
          <input
            ref={inputRef}
            id="quiz-name-answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            disabled={isLocked}
            placeholder={config.placeholder}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="min-h-14 w-full border border-sky/60 bg-bg px-5 text-body text-text-primary outline-none placeholder:text-text-faint focus-visible:ring-2 focus-visible:ring-love focus-visible:ring-offset-4 focus-visible:ring-offset-sky-soft disabled:cursor-default disabled:opacity-70"
          />
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="min-h-6 text-annotation text-accent" aria-live="polite">{feedback}</p>
            <Button type="submit" disabled={isLocked} className="bg-accent px-7 py-3 hover:bg-accent-hover">{config.submitLabel}</Button>
          </div>
        </form>
      </div>
      {isLocked && !isReducedMotion && <LoveBurst key={burstKey} count={6} />}
      {isLocked && <p className="pointer-events-none absolute bottom-20 z-20 font-mono text-xs font-semibold tracking-[0.14em] text-plum" aria-live="polite">{config.successStatus}</p>}
    </main>
  );
}
