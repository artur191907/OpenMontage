import React from "react";
import { INK, Viseme, hose, mix } from "./anim";
import { Eye, Mood, Mouth } from "./Face";

const SHIRT = "#C8323C";
const SHIRT_D = "#8E1E27";
const VEST = "#D9C8A9";
const CAP = "#6B6B6B";
const BROW = "#EDEDED";
const SKIN = "#EFC3A4";
const CANE = "#8A5A2B";

export type GenaPose = {
  x: number; y: number; s: number;
  sx?: number; sy?: number; hop?: number;
  thumb?: number;       // 0 = arm hanging, 1 = thumbs-up raised
  caneUp?: number;      // 0 = cane on floor, 1 = raised as a selfie stick with the phone
  browY?: number;       // brow lift (px), secondary motion
  lookX?: number; lookY?: number; open?: number;
  mood?: Mood; v?: Viseme; jitter?: number; shake?: number;
  flip?: boolean;
};

const ThumbHand: React.FC<{ x: number; y: number; rot: number; up: number }> = ({ x, y, rot, up }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    {up > 0.5 ? (
      <g>
        <path d="M-6,-20 C-14,-52 -6,-76 8,-76 C20,-76 22,-60 18,-22 Z" fill={SKIN} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <rect x={-26} y={-24} width={58} height={48} rx={14} fill={SKIN} stroke={INK} strokeWidth={6} />
        <path d="M-26,-8 L4,-8 M-26,8 L4,8" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      </g>
    ) : (
      <circle r={20} fill={SKIN} stroke={INK} strokeWidth={6} />
    )}
  </g>
);

export const Gena: React.FC<GenaPose> = (p) => {
  const { sx = 1, sy = 1, hop = 0, thumb = 0, caneUp = 0, browY = 0, lookX = 0, lookY = 0, open = 1, mood = "grin", v = "rest", jitter = 0, shake = 0 } = p;
  // left arm: hanging → thumbs-up
  const hand = { x: mix(-120, -150, thumb), y: mix(-120, -335, thumb) };
  const armD = hose(-90, -200, hand.x, hand.y, mix(-30, 40, thumb));
  // right arm + cane: on the floor → raised selfie stick
  const caneRot = mix(0, -28, caneUp);
  const rHand = { x: mix(112, 150, caneUp), y: mix(-196, -330, caneUp) };
  const rArmD = hose(90, -200, rHand.x, rHand.y, mix(20, -40, caneUp));
  const mouthOpen = v !== "rest" && v !== "MBP";
  return (
    <g transform={`translate(${p.x + shake},${p.y - hop}) scale(${p.flip ? -p.s : p.s},${p.s}) scale(${sx},${sy})`}>
      <ellipse cx={0} cy={hop / p.s} rx={130} ry={14} fill={INK} opacity={0.15} />
      {/* legs + slippers */}
      <path d="M-30,-70 L-30,-24 M30,-70 L30,-24" stroke={INK} strokeWidth={16} strokeLinecap="round" />
      <path d="M-30,-70 L-30,-24 M30,-70 L30,-24" stroke={VEST} strokeWidth={6} strokeLinecap="round" />
      <path d="M-72,-4 C-72,-30 -6,-34 -6,-4 Z M6,-4 C6,-34 72,-30 72,-4 Z" fill={SHIRT_D} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {/* cane (pivot at the hand) */}
      <g transform={`translate(${rHand.x},${rHand.y}) rotate(${caneRot})`}>
        {caneUp > 0.3 ? (
          <g>
            <path d="M0,10 L0,-230" stroke={INK} strokeWidth={16} strokeLinecap="round" />
            <path d="M0,10 L0,-230" stroke={CANE} strokeWidth={8} strokeLinecap="round" />
            <rect x={-34} y={-310} width={68} height={110} rx={12} fill="#2B2B33" stroke={INK} strokeWidth={6} />
            <rect x={-24} y={-298} width={48} height={80} rx={6} fill="#7FC8E8" />
            <circle cx={0} cy={-212} r={5} fill="#E54848" opacity={Math.round(jitter * 2) % 2 ? 1 : 0.3} />
          </g>
        ) : (
          <g>
            <path d="M8,194 L-8,-14 C-10,-44 28,-48 28,-20" fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" />
            <path d="M8,194 L-8,-14 C-10,-44 28,-48 28,-20" fill="none" stroke={CANE} strokeWidth={8} strokeLinecap="round" />
          </g>
        )}
      </g>
      {/* brick body */}
      <rect x={-96} y={-250} width={192} height={186} rx={26} fill={SHIRT} stroke={INK} strokeWidth={6} />
      <path d="M-94,-200 L94,-200 M-94,-140 L94,-140" stroke={SHIRT_D} strokeWidth={8} />
      <path d="M-96,-224 C-96,-246 -80,-250 -60,-250 L-20,-250 L-20,-64 L-70,-64 C-90,-64 -96,-80 -96,-96 Z" fill={VEST} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M96,-224 C96,-246 80,-250 60,-250 L20,-250 L20,-64 L70,-64 C90,-64 96,-80 96,-96 Z" fill={VEST} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {/* arms */}
      <path d={rArmD} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
      <path d={rArmD} fill="none" stroke={SHIRT} strokeWidth={22} strokeLinecap="round" />
      <circle cx={rHand.x} cy={rHand.y} r={18} fill={SKIN} stroke={INK} strokeWidth={6} />
      <path d={armD} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
      <path d={armD} fill="none" stroke={SHIRT} strokeWidth={22} strokeLinecap="round" />
      <ThumbHand x={hand.x} y={hand.y} rot={mix(0, -8, thumb)} up={thumb} />
      {/* head */}
      <rect x={-78} y={-370} width={156} height={128} rx={40} fill={SKIN} stroke={INK} strokeWidth={6} />
      <path d="M-86,-352 C-86,-408 86,-414 90,-354 C60,-366 -60,-366 -86,-352 Z" fill={CAP} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M40,-360 C80,-368 120,-360 124,-346 C100,-346 70,-350 40,-352 Z" fill="#555" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <Eye x={-30} y={-300} rx={11} ry={12} lookX={lookX} lookY={lookY} open={open} pupil={7} />
      <Eye x={30} y={-300} rx={11} ry={12} lookX={lookX} lookY={lookY} open={open} pupil={7} />
      <circle cx={-56} cy={-262} r={15} fill="#E9958A" opacity={0.7} />
      <circle cx={56} cy={-262} r={15} fill="#E9958A" opacity={0.7} />
      <g transform={`translate(0,${-browY - 6})`}>
        {/* «радостные» брови: внутренние концы приподняты */}
        <path transform="rotate(-16 -104 -318)" d="M-104,-318 C-90,-346 -40,-350 -10,-326 C-30,-318 -70,-310 -104,-318 Z" fill={BROW} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path transform="rotate(16 104 -318)" d="M104,-318 C90,-346 40,-350 10,-326 C30,-318 70,-310 104,-318 Z" fill={BROW} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g>
      <g transform="translate(0,-212)">
        <Mouth v={v} mood={mood} w={60} jitter={jitter} />
      </g>
      <ellipse cx={0} cy={-284} rx={20} ry={16} fill="#E39C86" stroke={INK} strokeWidth={6} />
      <g transform={`translate(0,${mouthOpen ? -7 : 0})`}>
        <path d="M-6,-270 C-40,-276 -62,-262 -56,-226 C-46,-246 -30,-254 0,-254 C30,-254 46,-246 56,-226 C62,-262 40,-276 6,-270 Z" fill={BROW} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g>
    </g>
  );
};
