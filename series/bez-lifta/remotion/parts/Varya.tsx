import React from "react";
import { INK, Viseme, hose, mix } from "./anim";
import { Eye, Mood, Mouth } from "./Face";

const SWEATER = "#E3B23C";
const PANTS = "#1F5E4A";
const HAIR = "#5A3825";
const SKIN = "#E9B48E";

export type VaryaPose = {
  x: number; y: number; s: number;
  sx?: number; sy?: number;
  sip?: number;        // 0 … 1 mug raised to the mouth
  glasses?: number;    // 0 … 1 hand pushing glasses up the nose
  paper?: number;      // 0 … 1 instruction sheet raised to camera
  lookX?: number; lookY?: number; open?: number; lid?: number;
  bun?: number;        // secondary wobble of the bun (deg)
  mood?: Mood; v?: Viseme; reflect?: boolean;
};

/** The instruction sheet with the drawing of a nightstand. */
const Sheet: React.FC<{ w: number }> = ({ w }) => (
  <g transform="rotate(-4)">
    <rect x={-w / 2} y={-w * 0.62} width={w} height={w * 1.24} rx={4} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
    <text x={0} y={-w * 0.4} textAnchor="middle" fontSize={w * 0.14} fontWeight={900} fontFamily="RubikLocal" fill={INK}>ТУМБОЧКА</text>
    <rect x={-w * 0.28} y={-w * 0.25} width={w * 0.56} height={w * 0.56} rx={4} fill="#C79363" stroke={INK} strokeWidth={5} />
    <path d={`M${-w * 0.28},${w * 0.03} H${w * 0.28}`} stroke={INK} strokeWidth={5} />
    <circle cx={0} cy={-w * 0.11} r={w * 0.025} fill={INK} />
    <circle cx={0} cy={w * 0.17} r={w * 0.025} fill={INK} />
    <path d={`M${-w * 0.36},${w * 0.45} H${w * 0.36} M${-w * 0.36},${w * 0.52} H${w * 0.2}`} stroke={INK} strokeWidth={3} opacity={0.4} />
  </g>
);

export const Varya: React.FC<VaryaPose> = (p) => {
  const { sx = 1, sy = 1, sip = 0, glasses = 0, paper = 0, lookX = 0, lookY = 0, open = 1, lid = 0.45, bun = 0, mood = "neutral", v = "rest", reflect = false } = p;
  const rh = { x: mix(66, 26, sip), y: mix(-96, -186, sip) };
  const lhRest = { x: -66, y: -96 };
  const lh = glasses > 0
    ? { x: mix(lhRest.x, -6, glasses), y: mix(lhRest.y, -214, glasses) }
    : { x: mix(lhRest.x, -120, paper), y: mix(lhRest.y, -250, paper) };
  const glassLift = glasses * 5;
  return (
    <g transform={`translate(${p.x},${p.y}) scale(${p.s}) scale(${sx},${sy})`}>
      <ellipse cx={0} cy={0} rx={95} ry={12} fill={INK} opacity={0.15} />
      <path d="M-34,-40 L-34,-8 L-6,-8 M34,-40 L34,-8 L6,-8" fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-34,-40 L-34,-8 L-6,-8 M34,-40 L34,-8 L6,-8" fill="none" stroke={PANTS} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={0} cy={-105} r={78} fill={SWEATER} stroke={INK} strokeWidth={6} />
      <path d="M-62,-58 C-30,-36 30,-36 62,-58 C56,-40 30,-26 0,-26 C-30,-26 -56,-40 -62,-58 Z" fill={PANTS} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <g transform={`rotate(${bun} 0 -300)`}>
        <circle cx={0} cy={-322} r={44} fill={HAIR} stroke={INK} strokeWidth={6} />
      </g>
      <circle cx={0} cy={-232} r={58} fill={SKIN} stroke={INK} strokeWidth={6} />
      <path d="M-58,-240 C-56,-292 56,-296 58,-240 C40,-270 -40,-270 -58,-240 Z" fill={HAIR} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <g transform="translate(0,-188)"><Mouth v={v} mood={mood} w={34} /></g>
      <g transform={`translate(0,${-glassLift})`}>
        {[-24, 24].map((gx) => (
          <g key={gx}>
            <circle cx={gx} cy={-226} r={22} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
            <Eye x={gx} y={-224} rx={10} ry={11} lookX={lookX} lookY={lookY} open={open} lid={lid} pupil={5} />
            {reflect && <rect x={gx + 1} y={-244} width={10} height={16} fill="#8A5A2B" opacity={0.45} transform={`skewX(-8)`} />}
            <path d={`M${gx - 12},-240 q6,-6 12,-4`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.9} />
          </g>
        ))}
        <path d="M-2,-228 L2,-228" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      </g>
      <path d={hose(-62, -140, lh.x, lh.y, 24)} fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" />
      <path d={hose(-62, -140, lh.x, lh.y, 24)} fill="none" stroke={SWEATER} strokeWidth={15} strokeLinecap="round" />
      {glasses === 0 && (
        <g transform={`translate(${lh.x - mix(10, 18, paper)},${lh.y - mix(0, 95, paper)}) scale(${mix(0.25, 1, paper)})`}>
          <Sheet w={150} />
        </g>
      )}
      <circle cx={lh.x} cy={lh.y} r={14} fill={SKIN} stroke={INK} strokeWidth={5} />
      <path d={hose(62, -140, rh.x, rh.y, -24)} fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" />
      <path d={hose(62, -140, rh.x, rh.y, -24)} fill="none" stroke={SWEATER} strokeWidth={15} strokeLinecap="round" />
      <g transform={`translate(${rh.x},${rh.y}) rotate(${mix(0, -28, sip)})`}>
        <path d="M-8,-28 L40,-28 L36,26 L-4,26 Z" fill="#FFFFFF" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M-6,-10 L38,-10" stroke="#C8323C" strokeWidth={8} />
        <path d="M40,-18 C60,-18 60,12 38,12" fill="none" stroke={INK} strokeWidth={6} />
      </g>
      <circle cx={rh.x} cy={rh.y} r={14} fill={SKIN} stroke={INK} strokeWidth={5} />
    </g>
  );
};
