import React from "react";
import { continueRender, delayRender, spring, staticFile } from "remotion";
import { FPS, INK, Line } from "./anim";

// Rubik 900 shipped locally in public/fonts (headless Chrome can't reach Google Fonts from this sandbox).
const fontFamily = "RubikLocal";
const fontHandle = delayRender("Loading Rubik 900", { timeoutInMilliseconds: 180000 });
Promise.all(
  [
    ["fonts/rubik-900-cyrillic.woff2", "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"],
    ["fonts/rubik-900-latin.woff2", "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"],
  ].map(([src, range]) =>
    new FontFace(fontFamily, `url(${staticFile(src)}) format("woff2")`, { weight: "900", unicodeRange: range })
      .load()
      .then((f) => document.fonts.add(f)),
  ),
).then(() => continueRender(fontHandle)).catch((e) => { console.error(e); continueRender(fontHandle); });
export const CAPTION_FONT = fontFamily;

export const SPEAKER_COLOR: Record<string, string> = { tolik: "#FF7A1A", varya: "#E3B23C", gena: "#E0414B" };

type W = { w: string; t0: number; t1: number };
type Chunk = { words: W[]; t0: number; t1: number; speaker: string };

const isTag = (w: string) => /^\[.*\]$/.test(w);

/** Split a line into 1–3 word chunks, breaking after punctuation. Dashes stick to the previous word. */
const chunksOf = (ln: Line): Chunk[] => {
  const words: W[] = [];
  for (const w of ln.words) {
    if (isTag(w.w)) continue;
    if (/^[—–-]$/.test(w.w) && words.length) { words[words.length - 1] = { ...words[words.length - 1], w: words[words.length - 1].w + " —" }; continue; }
    words.push(w);
  }
  const out: Chunk[] = [];
  let cur: W[] = [];
  const flush = () => { if (cur.length) out.push({ words: cur, t0: cur[0].t0, t1: cur[cur.length - 1].t1, speaker: ln.speaker }); cur = []; };
  for (const w of words) {
    const len = [...cur, w].map((x) => x.w).join(" ").length;
    if (cur.length && len > 14) flush();
    cur.push(w);
    if (/[.!?,]$/.test(w.w) || cur.length >= 3) flush();
  }
  flush();
  return out;
};

export const Captions: React.FC<{ lines: Line[]; t: number; frame: number; top?: number }> = ({ lines, t, frame, top = 280 }) => {
  const all = lines.flatMap(chunksOf);
  let idx = -1;
  for (let i = 0; i < all.length; i++) {
    const next = all[i + 1];
    const end = next && next.speaker === all[i].speaker ? Math.min(next.t0, all[i].t1 + 0.4) : all[i].t1 + 0.4;
    if (t >= all[i].t0 - 0.04 && t < end) idx = i;
  }
  if (idx < 0) return null;
  const c = all[idx];
  const pop = spring({ frame: frame - Math.round((c.t0 - 0.04) * FPS), fps: FPS, config: { damping: 9, stiffness: 220, mass: 0.6 } });
  const text = c.words.map((w) => w.w.toUpperCase()).join(" ");
  const fs = Math.min(112, 820 / (text.length * 0.8));
  const color = SPEAKER_COLOR[c.speaker] ?? "#FFFFFF";
  return (
    <div style={{ position: "absolute", left: 80, top, width: 840, height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${0.6 + 0.4 * pop}) rotate(${(1 - pop) * -4}deg)`, textAlign: "center", lineHeight: 1.05, whiteSpace: "nowrap" }}>
        {c.words.map((w, i) => {
          const active = t >= w.t0 - 0.03;
          return (
            <span key={i} style={{
              fontFamily, fontWeight: 900, fontSize: fs, color: active ? color : "#FFFFFF",
              WebkitTextStroke: `${Math.round(fs * 0.2)}px ${INK}`, paintOrder: "stroke fill", marginRight: i < c.words.length - 1 ? fs * 0.28 : 0,
              display: "inline-block", transform: active && t < w.t1 ? "translateY(-6px) scale(1.06)" : "none",
            }}>{w.w.toUpperCase()}</span>
          );
        })}
      </div>
    </div>
  );
};
