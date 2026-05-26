/**
 * Minimal audio utility — just mute toggle for ambient system.
 */
let muted = false;

export const sfx = {
  toggleMute: () => { muted = !muted; return muted; },
  isMuted: () => muted,
};
