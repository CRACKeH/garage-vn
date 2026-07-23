import { assetUrl } from "../assetUrl";
import type { Mood } from "../data/types";

export type { Mood };

/** Narrative ambience beds — CC0 field/synth loops from OpenGameArt. */

type MoodTrack = {
  src: string;
  volume: number;
};

const TRACKS: Record<Mood, MoodTrack> = {
  alley: { src: "/ambience/alley.mp3", volume: 0.38 },
  cozy: { src: "/ambience/cozy.mp3", volume: 0.42 },
  hangover: { src: "/ambience/hangover.mp3", volume: 0.36 },
  unease: { src: "/ambience/unease.mp3", volume: 0.4 },
  horror: { src: "/ambience/horror.mp3", volume: 0.48 },
  panic: { src: "/ambience/panic.mp3", volume: 0.44 },
  haze: { src: "/ambience/haze.mp3", volume: 0.4 },
};

const FADE_MS = 1400;
const TICK_MS = 50;

let unlocked = false;
let currentMood: Mood | null = null;
let active: HTMLAudioElement | null = null;
let fading: HTMLAudioElement | null = null;
let fadeTimer: ReturnType<typeof setInterval> | null = null;

function clearFade() {
  if (fadeTimer !== null) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }
  if (fading) {
    fading.pause();
    fading.src = "";
    fading = null;
  }
}

function makeLoop(src: string, volume: number): HTMLAudioElement {
  const el = new Audio(assetUrl(src));
  el.loop = true;
  el.preload = "auto";
  el.volume = volume;
  return el;
}

function crossfadeTo(next: HTMLAudioElement, targetVol: number) {
  clearFade();
  const prev = active;
  active = next;
  next.volume = 0;
  void next.play().catch(() => {
    unlocked = false;
  });

  if (!prev) {
    next.volume = targetVol;
    return;
  }

  fading = prev;
  const startVol = prev.volume;
  const steps = Math.max(1, Math.round(FADE_MS / TICK_MS));
  let step = 0;

  fadeTimer = setInterval(() => {
    step += 1;
    const t = step / steps;
    next.volume = targetVol * t;
    prev.volume = startVol * (1 - t);
    if (step >= steps) {
      clearInterval(fadeTimer!);
      fadeTimer = null;
      prev.pause();
      prev.src = "";
      if (fading === prev) fading = null;
      next.volume = targetVol;
    }
  }, TICK_MS);
}

/** Call once from a user gesture (autoplay policy). */
export function unlockAmbience() {
  unlocked = true;
  if (currentMood) {
    const mood = currentMood;
    currentMood = null;
    setAmbience(mood);
  }
}

export function setAmbience(mood: Mood | null) {
  if (mood === currentMood) return;
  currentMood = mood;

  if (!mood) {
    clearFade();
    if (active) {
      const prev = active;
      active = null;
      const startVol = prev.volume;
      const steps = Math.max(1, Math.round(FADE_MS / TICK_MS));
      let step = 0;
      fadeTimer = setInterval(() => {
        step += 1;
        prev.volume = startVol * (1 - step / steps);
        if (step >= steps) {
          clearInterval(fadeTimer!);
          fadeTimer = null;
          prev.pause();
          prev.src = "";
        }
      }, TICK_MS);
    }
    return;
  }

  if (!unlocked) return;

  const track = TRACKS[mood];
  const next = makeLoop(track.src, track.volume);
  crossfadeTo(next, track.volume);
}
