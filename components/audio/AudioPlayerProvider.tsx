"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { surpriseConfig } from "@/content/surprise";

export type AudioStatus = "idle" | "loading" | "ready" | "playing" | "paused" | "error";

interface AudioContextType {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  toggleMute: () => void;
  reset: () => void;
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  hasAudio: boolean;
  status: AudioStatus;
  audioInfo: typeof surpriseConfig.audio;
}

const AudioPlayerContext = createContext<AudioContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastProgressRef = useRef(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<AudioStatus>(() => surpriseConfig.audio ? "loading" : "idle");

  const audioInfo = surpriseConfig.audio;
  const hasAudio = status === "ready" || status === "playing" || status === "paused";

  useEffect(() => {
    if (!audioInfo || typeof window === "undefined") return;

    let cancelled = false;
    let audio: HTMLAudioElement | null = null;

    const prepareAudio = async () => {
      setStatus("loading");

      try {
        // Probe first so a not-yet-provided local file does not create native-media console noise.
        const response = await fetch(audioInfo.src, { method: "HEAD", cache: "no-store" });
        if (!response.ok || cancelled) {
          if (!cancelled) setStatus("error");
          return;
        }
      } catch {
        if (!cancelled) setStatus("error");
        return;
      }

      audio = new Audio(audioInfo.src);
      audioRef.current = audio;
      audio.loop = true;
      audio.preload = "metadata";
      audio.volume = audioInfo.volume ?? 0.45;

      const updateProgress = () => {
        if (!audio?.duration) return;
        const nextProgress = Math.round((audio.currentTime / audio.duration) * 100);
        if (Math.abs(nextProgress - lastProgressRef.current) >= 1) {
          lastProgressRef.current = nextProgress;
          setProgress(nextProgress);
        }
      };
      const handleReady = () => setStatus((current) => current === "playing" ? current : "ready");
      const handlePlay = () => {
        setIsPlaying(true);
        setStatus("playing");
      };
      const handlePause = () => {
        setIsPlaying(false);
        setStatus((current) => current === "error" ? current : "paused");
      };
      const handleError = () => {
        setIsPlaying(false);
        setProgress(0);
        lastProgressRef.current = 0;
        setStatus("error");
      };

      audio.addEventListener("canplay", handleReady, { once: true });
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("error", handleError, { once: true });
      audio.load();

      return () => {
        audio?.removeEventListener("canplay", handleReady);
        audio?.removeEventListener("play", handlePlay);
        audio?.removeEventListener("pause", handlePause);
        audio?.removeEventListener("timeupdate", updateProgress);
        audio?.removeEventListener("error", handleError);
      };
    };

    let detachListeners: (() => void) | undefined;
    void prepareAudio().then((cleanup) => {
      detachListeners = cleanup;
    });

    return () => {
      cancelled = true;
      detachListeners?.();
      audio?.pause();
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [audioInfo]);

  const play = useCallback(() => {
    if (!audioRef.current || !hasAudio) return;
    void audioRef.current.play().catch(() => {
      setIsPlaying(false);
      setStatus("error");
    });
  }, [hasAudio]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current || !hasAudio) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  }, [hasAudio]);

  const reset = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    lastProgressRef.current = 0;
    setProgress(0);
    setIsPlaying(false);
    setStatus(hasAudio ? "ready" : status);
  }, [hasAudio, status]);

  const value = useMemo(() => ({
    play,
    pause,
    toggle,
    toggleMute,
    reset,
    isPlaying,
    isMuted,
    progress,
    hasAudio,
    status,
    audioInfo,
  }), [audioInfo, hasAudio, isMuted, isPlaying, pause, play, progress, reset, status, toggle, toggleMute]);

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  return context;
}
