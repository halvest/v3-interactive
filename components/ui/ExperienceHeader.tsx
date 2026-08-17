"use client";

import { useEffect, useState } from "react";
import { useAudioPlayer } from "@/components/audio/AudioPlayerProvider";
import { surpriseConfig } from "@/content/surprise";
import { PixelHeartSmall, PixelSpark } from "./PixelAssets";

interface ExperienceHeaderProps {
  compact?: boolean;
}

export function ExperienceHeader({ compact = false }: ExperienceHeaderProps) {
  const { isPlaying, isMuted, toggle, toggleMute, hasAudio, audioInfo, progress, status } = useAudioPlayer();
  const [isCollapsed, setIsCollapsed] = useState(compact);
  const [isScrolled, setIsScrolled] = useState(false);
  const resolvedCollapsed = compact || isCollapsed;

  useEffect(() => {
    if (compact) return;
    const savedState = sessionStorage.getItem("agy-header-collapsed");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedState === "true") setIsCollapsed(true);
  }, [compact]);

  useEffect(() => {
    if (!compact) sessionStorage.setItem("agy-header-collapsed", isCollapsed.toString());
  }, [compact, isCollapsed]);

  useEffect(() => {
    const handleScroll = () => {
      const nextIsScrolled = window.scrollY > 50;
      setIsScrolled((current) => current === nextIsScrolled ? current : nextIsScrolled);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!audioInfo) return null;

  const unavailable = status === "error" || status === "idle";
  const loading = status === "loading";
  const artistLabel = unavailable ? (audioInfo.unavailableLabel || surpriseConfig.audio?.unavailableLabel || "music belum tersedia") : loading ? "menyiapkan musik..." : audioInfo.artist;

  return (
    <header
      className={`fixed top-[max(1rem,env(safe-area-inset-top))] right-4 md:right-6 z-[90] transition-transform duration-300 ease-out ${isScrolled && !resolvedCollapsed ? "scale-95" : "scale-100"}`}
    >
      <div className={`relative overflow-hidden border border-plum/25 bg-surface shadow-floating transition-all duration-300 ease-out ${resolvedCollapsed ? "w-[154px]" : "w-[min(88vw,352px)]"}`}>
        {!resolvedCollapsed && (
          <div className="absolute inset-x-0 top-0 h-1.5 bg-sky-soft [background-image:repeating-linear-gradient(90deg,transparent_0_7px,rgba(30,30,36,0.16)_7px_8px)]">
            <div className="h-full bg-love transition-[width] duration-300" style={{ width: `${hasAudio ? progress : 0}%` }} />
          </div>
        )}

        <div className="flex items-center gap-2.5 p-2.5">
          {!resolvedCollapsed && (
            <div className="flex min-w-0 flex-1 items-center gap-3 pl-0.5">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-sky/50 bg-sky-soft text-sky">
                {audioInfo.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={audioInfo.cover} alt={audioInfo.coverAlt || "Album artwork"} className="h-full w-full object-cover" />
                ) : (
                  <PixelSpark className="h-4 w-4" />
                )}
                {isPlaying && (
                  <span className="absolute inset-0 flex items-center justify-center gap-[2px] bg-text-primary/45" aria-hidden="true">
                    <i className="h-3 w-[2px] bg-white animate-eq-1" />
                    <i className="h-4 w-[2px] bg-white animate-eq-2" />
                    <i className="h-2 w-[2px] bg-white animate-eq-3" />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-caption truncate font-medium text-text-primary">{audioInfo.title}</p>
                <p className="text-[11px] truncate font-mono tracking-wide text-text-muted">{artistLabel}</p>
              </div>
            </div>
          )}

          {resolvedCollapsed && (
            <button
              type="button"
              onClick={() => !compact && setIsCollapsed(false)}
              className="flex min-h-9 min-w-0 flex-1 items-center gap-2 px-1 text-left text-caption text-text-primary disabled:cursor-default"
              aria-label={compact ? "Music player preparing" : "Expand music player"}
              disabled={compact}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center ${hasAudio ? "bg-sky-soft text-sky" : "bg-mustard-soft text-mustard"}`} aria-hidden="true"><PixelHeartSmall /></span>
              <span className="truncate font-mono text-[11px] tracking-wide">{hasAudio ? "MUSIC / PLAY" : "MUSIC / SOON"}</span>
            </button>
          )}

          <div className="flex shrink-0 items-center gap-0.5">
            {(!resolvedCollapsed || hasAudio) && (
              <button
                type="button"
                onClick={toggle}
                disabled={!hasAudio}
                className="flex h-9 w-9 items-center justify-center bg-plum text-bg transition-colors hover:bg-love disabled:cursor-not-allowed disabled:bg-surface-warm disabled:text-text-faint"
                aria-label={hasAudio ? (isPlaying ? "Pause" : "Play") : "Music is not available yet"}
              >
                {loading ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-text-faint border-t-accent" aria-hidden="true" />
                ) : isPlaying ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
            )}

            {!resolvedCollapsed && (
              <button type="button" onClick={toggleMute} disabled={!hasAudio} className="flex h-9 w-9 items-center justify-center text-text-muted transition-colors hover:bg-sky-soft hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50" aria-label={isMuted ? "Unmute" : "Mute"}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
                  {isMuted ? <path strokeLinecap="round" d="m16 9 4 4m0-4-4 4" /> : <path strokeLinecap="round" d="M15 9a4 4 0 0 1 0 6" />}
                </svg>
              </button>
            )}

            {!resolvedCollapsed && (
              <button type="button" onClick={() => setIsCollapsed(true)} className="flex h-9 w-9 items-center justify-center text-text-muted transition-colors hover:bg-coral-soft hover:text-text-primary" aria-label="Collapse music player">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m5 15 7-7 7 7" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
