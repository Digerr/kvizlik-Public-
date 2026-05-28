let audioCtx: AudioContext | null = null;
let muted = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isMuted(): boolean {
  return muted;
}

export function toggleMute(): boolean {
  muted = !muted;
  return muted;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.15,
  startDelay: number = 0
) {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + startDelay);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime + startDelay);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime + startDelay);
    oscillator.stop(ctx.currentTime + startDelay + duration);
  } catch {
    // Silently fail if audio is not available
  }
}

function playSlide(
  startFreq: number,
  endFreq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.15,
  startDelay: number = 0
) {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime + startDelay);
    oscillator.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + startDelay + duration);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime + startDelay);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime + startDelay);
    oscillator.stop(ctx.currentTime + startDelay + duration);
  } catch {
    // Silently fail if audio is not available
  }
}

/** Happy ascending tone (C5 → E5) */
export function playCorrect() {
  playSlide(523.25, 659.25, 0.2, 'sine', 0.12);
}

/** Low descending tone (C4 → A3) */
export function playWrong() {
  playSlide(261.63, 220.0, 0.35, 'sawtooth', 0.08);
}

/** Short click sound */
export function playTick() {
  playTone(800, 0.06, 'square', 0.08);
}

/** Triumphant ascending arpeggio */
export function playStreak() {
  playTone(523.25, 0.15, 'sine', 0.1, 0);
  playTone(659.25, 0.15, 'sine', 0.1, 0.1);
  playTone(783.99, 0.15, 'sine', 0.1, 0.2);
  playTone(1046.50, 0.25, 'sine', 0.12, 0.3);
}

/** Fanfare sequence */
export function playWin() {
  playTone(523.25, 0.2, 'sine', 0.1, 0);
  playTone(659.25, 0.2, 'sine', 0.1, 0.15);
  playTone(783.99, 0.2, 'sine', 0.1, 0.3);
  playTone(1046.50, 0.15, 'sine', 0.1, 0.45);
  playTone(783.99, 0.15, 'sine', 0.1, 0.55);
  playTone(1046.50, 0.4, 'sine', 0.12, 0.65);
}

/** "Ding" coin sound */
export function playCoin() {
  playTone(1200, 0.15, 'sine', 0.1);
  playTone(1600, 0.2, 'sine', 0.08, 0.08);
}
