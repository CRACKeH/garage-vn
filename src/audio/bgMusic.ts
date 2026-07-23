import { assetUrl } from "../assetUrl";

const TRACKS = ["/music/tihiy-les-1.mp3", "/music/tihiy-les-2.mp3"] as const;

const GAP_MIN_MS = 1000;
const GAP_MAX_MS = 3000;
const VOLUME = 0.45;

let audio: HTMLAudioElement | null = null;
let trackIndex = 0;
let started = false;
let gapTimer: ReturnType<typeof setTimeout> | null = null;

function randomGapMs(): number {
  return GAP_MIN_MS + Math.floor(Math.random() * (GAP_MAX_MS - GAP_MIN_MS + 1));
}

function clearGapTimer() {
  if (gapTimer !== null) {
    clearTimeout(gapTimer);
    gapTimer = null;
  }
}

function playCurrent() {
  if (!audio) return;
  audio.src = assetUrl(TRACKS[trackIndex]);
  audio.volume = VOLUME;
  void audio.play().catch(() => {
    // Autoplay blocked until a later user gesture.
    started = false;
  });
}

function onEnded() {
  clearGapTimer();
  gapTimer = setTimeout(() => {
    gapTimer = null;
    trackIndex = (trackIndex + 1) % TRACKS.length;
    playCurrent();
  }, randomGapMs());
}

/** Starts ambient playlist after a user gesture (autoplay policy). Idempotent. */
export function startBgMusic() {
  if (started) return;
  started = true;

  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    audio.addEventListener("ended", onEnded);
  }

  playCurrent();
}
