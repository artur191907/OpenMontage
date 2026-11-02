// Animation helpers for «Без лифта». Pure functions of time — deterministic per frame.
import { Easing, interpolate, spring } from "remotion";

export const FPS = 30;
export const INK = "#1E1A1A";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

/** Eased 0→1 ramp between two times (seconds). */
export const ramp = (t: number, t0: number, t1: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(t, [t0, t1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/** Spring 0→1 that starts at time t0 (seconds). Overshoot gives "перебор". */
export const springAt = (frame: number, t0: number, damping = 10, stiffness = 140, mass = 0.8) =>
  spring({ frame: frame - Math.round(t0 * FPS), fps: FPS, config: { damping, stiffness, mass } });

/** Damped oscillation kicked at t0: secondary motion for tufts, brows, tails. */
export const wobble = (t: number, t0: number, amp: number, freq = 3.2, decay = 4.5) => {
  if (t < t0) return 0;
  const d = t - t0;
  return amp * Math.exp(-decay * d) * Math.sin(2 * Math.PI * freq * d);
};

/** Squash-and-stretch landing: returns [scaleX, scaleY] around the feet. */
export const landing = (t: number, t0: number, amount = 0.14) => {
  const w = wobble(t, t0, amount, 2.6, 6);
  return [1 + w * 0.6, 1 - w] as const;
};

/** Eye openness 0..1 with blinks at given times (4-frame blink). */
export const blink = (t: number, times: number[]) => {
  for (const b of times) {
    const d = t - b;
    if (d >= 0 && d < 0.14) return d < 0.07 ? 1 - d / 0.07 : (d - 0.07) / 0.07;
  }
  return 1;
};

// ---------------------------------------------------------------- lip sync
export type Viseme = "rest" | "A" | "E" | "I" | "O" | "U" | "MBP" | "FV" | "LAUGH";
export type Char = { c: string; t0: number; t1: number };
export type Word = { w: string; t0: number; t1: number };
export type Line = { id: string; speaker: string; src: string; start: number; words: Word[]; chars: Char[] };

const V: Record<string, Viseme> = {
  а: "A", я: "A", о: "O", ё: "O", у: "U", ю: "U", ы: "I", и: "I", е: "E", э: "E",
  м: "MBP", б: "MBP", п: "MBP", ф: "FV", в: "FV",
};

/** Mouth shape for a speaker at time t, derived from ElevenLabs character timings. */
export const visemeAt = (lines: Line[], speaker: string, t: number): Viseme => {
  for (const ln of lines) {
    if (ln.speaker !== speaker) continue;
    const last = ln.chars[ln.chars.length - 1];
    if (!last || t < ln.chars[0].t0 || t > last.t1 + 0.05) continue;
    let inTag = false;
    let tagStart = 0;
    let tagName = "";
    for (const ch of ln.chars) {
      if (ch.c === "[") { inTag = true; tagStart = ch.t0; tagName = ""; continue; }
      if (inTag) {
        if (ch.c === "]") {
          inTag = false;
          if (tagName.startsWith("laugh") && t >= tagStart && t <= ch.t1) return "LAUGH";
        } else tagName += ch.c;
        continue;
      }
      if (t >= ch.t0 && t <= ch.t1) {
        const k = ch.c.toLowerCase();
        if (V[k]) return V[k];
        if (/[а-яё]/.test(k)) return "E"; // other consonants: half-open
        return "rest";
      }
    }
  }
  return "rest";
};

/** True while a speaker is mid-line (used for head bob while talking). */
export const isTalking = (lines: Line[], speaker: string, t: number) =>
  lines.some((l) => l.speaker === speaker && l.words.length > 0 && t >= l.words[0].t0 && t <= l.words[l.words.length - 1].t1);

/** Quadratic "rubber hose" limb path from a to b, bulging sideways by `bulge`. */
export const hose = (ax: number, ay: number, bx: number, by: number, bulge: number) => {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return `M${ax},${ay} Q${mx + nx * bulge},${my + ny * bulge} ${bx},${by}`;
};

export type P = { x: number; y: number; bulge: number };
export const mixP = (a: P, b: P, k: number): P => ({ x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), bulge: mix(a.bulge, b.bulge, k) });
