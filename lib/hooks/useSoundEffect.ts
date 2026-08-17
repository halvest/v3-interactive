"use client";

import { useCallback, useEffect, useRef } from "react";
import type { SoundEffectConfig } from "@/content/surprise";
import { registerSoundEffect } from "@/lib/audio/soundEffects";

/** A single optional native-audio channel for short interaction feedback. */
export function useSoundEffect(config?: SoundEffectConfig, muted = false) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!config) return;

    let disposed = false;
    let sound: HTMLAudioElement | null = null;
    let unregister: (() => void) | undefined;

    const prepare = async () => {
      try {
        // Avoid native media errors when an optional local sound has not been supplied.
        const response = await fetch(config.src, { method: "HEAD", cache: "no-store" });
        if (!response.ok || disposed) return;

        sound = new Audio(config.src);
        sound.preload = "auto";
        sound.volume = config.volume;
        sound.load();
        audioRef.current = sound;
        unregister = registerSoundEffect(sound);
        if (disposed) {
          unregister();
          sound.pause();
          sound.currentTime = 0;
          if (audioRef.current === sound) audioRef.current = null;
        }
      } catch {
        // Optional feedback must never make its interaction unavailable.
      }
    };

    void prepare();

    return () => {
      disposed = true;
      sound?.pause();
      if (sound) sound.currentTime = 0;
      unregister?.();
      if (audioRef.current === sound) audioRef.current = null;
    };
  }, [config]);

  const play = useCallback(() => {
    const sound = audioRef.current;
    if (!sound || muted) return;

    try {
      sound.currentTime = 0;
    } catch {
      return;
    }

    void sound.play().catch(() => {
      // A rejected browser play request should remain silent and harmless.
    });
  }, [muted]);

  const stop = useCallback(() => {
    const sound = audioRef.current;
    if (!sound) return;
    sound.pause();
    try {
      sound.currentTime = 0;
    } catch {
      // No work is required if the browser has already released the media.
    }
  }, []);

  return { play, stop };
}
