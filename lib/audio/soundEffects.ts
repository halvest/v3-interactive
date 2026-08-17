const activeSoundEffects = new Set<HTMLAudioElement>();

export function registerSoundEffect(sound: HTMLAudioElement) {
  activeSoundEffects.add(sound);
  return () => activeSoundEffects.delete(sound);
}

export function stopActiveSoundEffects() {
  activeSoundEffects.forEach((sound) => {
    sound.pause();
    try {
      sound.currentTime = 0;
    } catch {
      // The browser may already have released an optional media resource.
    }
  });
}
