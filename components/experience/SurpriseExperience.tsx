"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { surpriseConfig } from "@/content/surprise";
import { AudioPlayerProvider } from "@/components/audio/AudioPlayerProvider";
import { ExperienceHeader } from "@/components/ui/ExperienceHeader";
import { Footer } from "@/components/ui/Footer";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { OpeningScene } from "./OpeningScene";
import { EnvelopeScene } from "./EnvelopeScene";
import { QuestionScene } from "./QuestionScene";
import { TransitionScene } from "./TransitionScene";
import { QuizNameScene } from "./QuizNameScene";
import { QuizFavoriteScene } from "./QuizFavoriteScene";

const ScrollExperience = dynamic(
  () => import("./ScrollExperience").then((module) => module.ScrollExperience),
  {
    ssr: false,
    loading: () => <div className="min-h-[100dvh] bg-bg" aria-busy="true" />,
  }
);

export type ExperiencePhase = "opening" | "envelope" | "question" | "quiz-name" | "quiz-favorite" | "accepted" | "story";

export function SurpriseExperience() {
  const [phase, setPhase] = useState<ExperiencePhase>("opening");
  const isReducedMotion = useReducedMotion();

  const startQuiz = () => {
    setPhase("quiz-name");
  };

  const completeQuiz = () => {
    setPhase(isReducedMotion ? "story" : "accepted");
  };

  const restart = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setPhase("opening");
  };

  const showPlayer = phase === "quiz-name" || phase === "quiz-favorite" || phase === "accepted" || phase === "story";

  return (
    <AudioPlayerProvider>
      {/* Gated scenes intentionally render without global chrome or normal-flow footer. */}
      {phase === "opening" && (
        <OpeningScene onComplete={() => setPhase("envelope")} config={surpriseConfig.opening} />
      )}

      {phase === "envelope" && (
        <EnvelopeScene config={surpriseConfig.envelope} onComplete={() => setPhase("question")} />
      )}

      {phase === "question" && (
        <QuestionScene
          config={surpriseConfig.question}
          onYes={startQuiz}
        />
      )}

      {showPlayer && <ExperienceHeader compact={phase !== "story"} />}

      {phase === "quiz-name" && (
        <QuizNameScene config={surpriseConfig.quiz.name} onComplete={() => setPhase("quiz-favorite")} />
      )}

      {phase === "quiz-favorite" && (
        <QuizFavoriteScene config={surpriseConfig.quiz.favorite} onComplete={completeQuiz} />
      )}

      {phase === "accepted" && (
        <TransitionScene
          config={surpriseConfig.transition}
          mode="yes"
          onComplete={() => setPhase("story")}
        />
      )}

      {phase === "story" && (
        <>
          <ScrollExperience />
          <Footer onRestart={restart} />
        </>
      )}
    </AudioPlayerProvider>
  );
}
