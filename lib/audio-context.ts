let ctx: AudioContext | null = null;

/** One shared AudioContext for the whole app instead of one per useSound() caller. */
export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  ctx ??= new AudioContext();
  return ctx;
}
