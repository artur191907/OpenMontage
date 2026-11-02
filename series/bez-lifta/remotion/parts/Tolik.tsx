import React from "react";
import { INK, P, Viseme, hose } from "./anim";
import { Eye, Mood, Mouth } from "./Face";

const HOODIE = "#FF7A1A";
const HOODIE_D = "#E86A10";
const JEANS = "#2E5AAC";
const SKIN = "#F2C29B";
const TUFT = "#C8501E";

export type TolikPose = {
  x: number; y: number; s: number;
  sx?: number; sy?: number;      // squash & stretch around the feet
  lean?: number;                  // torso rotation (deg) around the hips; negative = lean back
  headTilt?: number;              // deg around the neck
  tuft?: number;                  // deg, secondary motion
  armL: P; armR: P;               // hand targets in torso space
  lookX?: number; lookY?: number; open?: number; lid?: number;
  brow?: "smug" | "up" | "neutral" | "worried";
  mood?: Mood; v?: Viseme; jitter?: number;
  flip?: boolean;
};

export const HIPS_L: P = { x: -62, y: -318, bulge: 70 };
export const HIPS_R: P = { x: 62, y: -318, bulge: -70 };
export const RUB_L: P = { x: -18, y: -420, bulge: 40 };
export const RUB_R: P = { x: 18, y: -420, bulge: -40 };
export const THROW_R: P = { x: 120, y: -660, bulge: -40 };
export const POINT_UP_R: P = { x: 120, y: -700, bulge: 30 };

const Arm: React.FC<{ sx: number; sy: number; p: P }> = ({ sx, sy, p }) => {
  const d = hose(sx, sy, p.x, p.y, p.bulge);
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={36} strokeLinecap="round" />
      <path d={d} fill="none" stroke={HOODIE} strokeWidth={24} strokeLinecap="round" />
      <circle cx={p.x} cy={p.y} r={17} fill={SKIN} stroke={INK} strokeWidth={6} />
    </g>
  );
};

export const Tolik: React.FC<TolikPose> = (p) => {
  const { sx = 1, sy = 1, lean = 0, headTilt = 0, tuft = 0, lookX = 0, lookY = 0, open = 1, lid = 0, brow = "smug", mood = "smug", v = "rest", jitter = 0 } = p;
  const browL = brow === "smug" ? "M-40,-682 L-8,-674" : brow === "up" ? "M-40,-700 L-8,-704" : brow === "worried" ? "M-40,-690 L-8,-700" : "M-40,-684 L-8,-684";
  const browR = brow === "smug" ? "M10,-676 L42,-690" : brow === "up" ? "M10,-704 L42,-700" : brow === "worried" ? "M10,-700 L42,-690" : "M10,-684 L42,-684";
  return (
    <g transform={`translate(${p.x},${p.y}) scale(${p.flip ? -p.s : p.s},${p.s}) scale(${sx},${sy})`}>
      <ellipse cx={0} cy={0} rx={120} ry={14} fill={INK} opacity={0.15} />
      {/* legs */}
      {[-1, 1].map((k) => {
        const d = `M${k * 22},-40 C${k * 26},-120 ${k * 30},-200 ${k * 27},-282`;
        return (
          <g key={k}>
            <path d={d} fill="none" stroke={INK} strokeWidth={46} strokeLinecap="round" />
            <path d={d} fill="none" stroke={JEANS} strokeWidth={34} strokeLinecap="round" />
          </g>
        );
      })}
      <path d="M-95,-6 C-95,-40 -60,-50 -20,-46 C-5,-44 -2,-20 -6,-4 Z" fill="#F7F7F2" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M8,-4 C4,-24 8,-44 26,-46 C70,-50 100,-38 100,-6 Z" fill="#F7F7F2" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {/* torso pivots at the hips */}
      <g transform={`rotate(${lean} 0 -280)`}>
        <Arm sx={58} sy={-470} p={p.armR} />
        <path d="M-62,-500 C-70,-420 -66,-330 -58,-280 L58,-280 C66,-330 70,-420 62,-500 C30,-516 -30,-516 -62,-500 Z" fill={HOODIE} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M-34,-350 L34,-350 L28,-300 L-28,-300 Z" fill={HOODIE_D} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M-14,-500 L-12,-440 M14,-500 L12,-440" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
        <Arm sx={-58} sy={-470} p={p.armL} />
        <rect x={-14} y={-560} width={28} height={64} fill={SKIN} stroke={INK} strokeWidth={6} />
        <g transform={`rotate(${headTilt} 0 -540)`}>
          <g transform={`rotate(${tuft} 0 -728)`}>
            <path d="M-14,-728 C-30,-770 -6,-800 4,-840 C14,-800 34,-772 16,-728 Z" fill={TUFT} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          </g>
          <path d="M0,-735 C40,-720 62,-670 64,-610 L68,-560 C68,-540 56,-530 40,-530 L-40,-530 C-56,-530 -68,-540 -68,-560 L-64,-610 C-62,-670 -40,-720 0,-735 Z" fill={SKIN} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <Eye x={-22} y={-650} rx={15} ry={19} lookX={lookX} lookY={lookY} open={open} lid={lid} pupil={6.5} />
          <Eye x={24} y={-650} rx={15} ry={19} lookX={lookX} lookY={lookY} open={open} lid={lid} pupil={6.5} />
          <path d={`${browL} ${browR}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
          <g transform="translate(6,-578)">
            <Mouth v={v} mood={mood} w={64} jitter={jitter} />
          </g>
        </g>
      </g>
    </g>
  );
};
