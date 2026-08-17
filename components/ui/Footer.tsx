"use client";

import { useAudioPlayer } from "@/components/audio/AudioPlayerProvider";
import { surpriseConfig } from "@/content/surprise";
import { PixelHeartSmall } from "./PixelAssets";

interface FooterProps {
  onRestart: () => void;
}

export function Footer({ onRestart }: FooterProps) {
  const { reset } = useAudioPlayer();

  const handleRestart = () => {
    reset();
    onRestart();
  };

  return (
    <footer className="w-full border-t border-plum/15 bg-bg px-6 pb-14 pt-10 flex flex-col items-center justify-center relative z-10">
      <div className="flex flex-col items-center gap-5">
        
        <div className="text-center">
          {surpriseConfig.footer.systemLabel && <p className="pixel-label justify-center text-plum/75">{surpriseConfig.footer.systemLabel}</p>}
          <p className="mt-3 text-annotation text-text-muted/70">{surpriseConfig.footer.annotation}</p>
        </div>

        <button 
          onClick={handleRestart}
          className="pixel-button inline-flex min-h-11 items-center gap-2 border border-plum/35 bg-surface px-4 text-caption text-text-primary transition-colors hover:bg-coral-soft"
        >
          <PixelHeartSmall className="text-love" />
          {surpriseConfig.footer.restartLabel}
        </button>

      </div>
    </footer>
  );
}
