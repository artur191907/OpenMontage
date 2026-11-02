import React from "react";
import { INK, Viseme } from "./anim";

export type Mood = "smug" | "grin" | "neutral" | "shock" | "frown";

/** Mouth drawn at (0,0); `w` = base width. Rest shape depends on mood. */
export const Mouth: React.FC<{ v: Viseme; mood: Mood; w?: number; jitter?: number }> = ({ v, mood, w = 60, jitter = 0 }) => {
  const h = w / 2;
  const sw = Math.max(4, w / 12);
  const dark = "#5A1E1E";
  const tongue = "#E0707A";
  const open = (rx: number, ry: number) => (
    <g>
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={dark} stroke={INK} strokeWidth={sw} />
      {ry > 10 && <ellipse cx={0} cy={ry * 0.45} rx={rx * 0.55} ry={ry * 0.35} fill={tongue} />}
    </g>
  );
  switch (v) {
    case "A": return open(h * 0.8, h * 0.75);
    case "O": return open(h * 0.55, h * 0.7);
    case "U": return open(h * 0.32, h * 0.4);
    case "E": return open(h * 0.85, h * 0.42);
    case "I": return open(h * 0.9, h * 0.22);
    case "LAUGH": return open(h * 0.95, h * (0.6 + 0.25 * Math.abs(Math.sin(jitter))));
    case "MBP": return <path d={`M${-h * 0.8},0 Q0,${-sw} ${h * 0.8},0`} stroke={INK} strokeWidth={sw * 1.4} fill="none" strokeLinecap="round" />;
    case "FV":
      return (
        <g>
          <path d={`M${-h * 0.75},0 Q0,${h * 0.3} ${h * 0.75},0 Z`} fill={dark} stroke={INK} strokeWidth={sw} />
          <rect x={-h * 0.4} y={-2} width={h * 0.8} height={h * 0.18} fill="#FFFFFF" />
        </g>
      );
    default: {
      if (mood === "shock") return open(h * 0.4, h * 0.55);
      if (mood === "frown") return <path d={`M${-h * 0.7},${h * 0.2} Q0,${-h * 0.3} ${h * 0.7},${h * 0.2}`} stroke={INK} strokeWidth={sw} fill="none" strokeLinecap="round" />;
      if (mood === "grin")
        return <path d={`M${-h},${-h * 0.15} Q0,${h * 1.1} ${h},${-h * 0.15} Z`} fill={dark} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />;
      if (mood === "smug") return <path d={`M${-h * 0.9},0 C${-h * 0.4},${h * 0.5} ${h * 0.5},${h * 0.45} ${h},${-h * 0.45}`} stroke={INK} strokeWidth={sw} fill="none" strokeLinecap="round" />;
      return <path d={`M${-h * 0.6},0 Q0,${h * 0.25} ${h * 0.6},0`} stroke={INK} strokeWidth={sw} fill="none" strokeLinecap="round" />;
    }
  }
};

/** Cartoon eye: white oval, pupil offset by look (-1..1), lids by `open` (0..1) and `lid` (0..1 top lid lowered). */
export const Eye: React.FC<{ x: number; y: number; rx: number; ry: number; lookX?: number; lookY?: number; open?: number; lid?: number; pupil?: number }> = ({
  x, y, rx, ry, lookX = 0, lookY = 0, open = 1, lid = 0, pupil,
}) => {
  const o = Math.max(0, Math.min(1, open)) * (1 - lid * 0.55);
  if (o < 0.12) return <path d={`M${x - rx},${y} Q${x},${y + ry * 0.25} ${x + rx},${y}`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />;
  const pr = pupil ?? rx * 0.42;
  const cy = y + ry * (1 - o) * 0.5;
  const ery = ry * o;
  const id = `eye${Math.round(x * 10)}_${Math.round(y * 10)}`;
  return (
    <g>
      <clipPath id={id}><ellipse cx={x} cy={cy} rx={rx} ry={ery} /></clipPath>
      <ellipse cx={x} cy={cy} rx={rx} ry={ery} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
      <circle clipPath={`url(#${id})`} cx={x + lookX * rx * 0.45} cy={cy + lookY * ery * 0.4} r={pr} fill={INK} />
      {lid > 0.05 && <path d={`M${x - rx - 2},${cy - ery * (1 - lid * 0.9)} L${x + rx + 2},${cy - ery * (1 - lid * 0.9)}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />}
    </g>
  );
};
