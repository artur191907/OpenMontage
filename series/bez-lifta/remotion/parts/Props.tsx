import React from "react";
import { random } from "remotion";
import { INK } from "./anim";
import { Eye } from "./Face";

const st = { stroke: INK, strokeWidth: 6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Квартира 19: стена, ковёр на стене, стенка с хрусталём, роутер, пол. Приглушённые цвета. */
export const Room: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1080} height={1920} fill="#EFE3CF" />
    <rect y={1440} width={1080} height={480} fill="#D3C1A0" />
    <path d="M0,1440 H1080" stroke={INK} strokeWidth={5} opacity={0.35} />
    {/* ковёр */}
    <g opacity={0.8}>
      <rect x={250} y={560} width={560} height={640} rx={14} fill="#B98272" />
      <rect x={280} y={590} width={500} height={580} rx={10} fill="none" stroke="#9E6A5C" strokeWidth={14} />
      {[0, 1, 2].map((r) => [0, 1].map((c) => (
        <path key={`${r}${c}`} d={`M${400 + c * 260},${700 + r * 180} l60,-60 l60,60 l-60,60 z`} fill="#A8806E" stroke="#9E6A5C" strokeWidth={8} transform={`translate(-60,0)`} />
      )))}
    </g>
    {/* стенка с хрусталём (край кадра справа) */}
    <g opacity={0.85}>
      <rect x={880} y={420} width={260} height={1030} fill="#A7836A" />
      <rect x={905} y={460} width={200} height={360} fill="#CBB8A4" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${930 + i * 55},800 l14,-60 l14,60 z`} fill="#E6EEF2" opacity={0.9} />)}
      <path d="M900,840 H1110" stroke="#8A6A55" strokeWidth={8} />
    </g>
    {/* роутер на стенке, мигает */}
    <g transform="translate(940,880)">
      <rect width={110} height={36} rx={8} fill="#3A3A40" />
      <path d="M20,0 L10,-50 M90,0 L100,-50" stroke="#3A3A40" strokeWidth={6} strokeLinecap="round" />
      {[0, 1, 2].map((i) => <circle key={i} cx={30 + i * 25} cy={18} r={5} fill="#5CE08A" opacity={Math.sin(t * 9 + i * 2) > 0 ? 1 : 0.25} />)}
    </g>
  </g>
);

export const Box: React.FC<{ x: number; y: number; w?: number; h?: number; flap?: number }> = ({ x, y, w = 360, h = 520, flap = 1 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={0} y={-h} width={w} height={h} rx={8} fill="#C99A5B" {...st} />
    <path d={`M0,${-h} l${-60 * flap},${-70 * flap} l${w * 0.45},0 L${w * 0.5},${-h} Z`} fill="#B98848" {...st} />
    <path d={`M${w},${-h} l${60 * flap},${-70 * flap} l${-w * 0.45},0 L${w * 0.5},${-h} Z`} fill="#B98848" {...st} />
    <text x={w / 2} y={-h / 2} textAnchor="middle" fontSize={56} fontWeight={900} fill={INK} opacity={0.35} fontFamily="RubikLocal">↑↑</text>
    <rect x={w * 0.18} y={-h * 0.28} width={w * 0.64} height={44} fill="#E9D6A6" opacity={0.7} />
  </g>
);

/** Скомканная инструкция. */
export const Paper: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
    <path d="M-42,-30 L-10,-44 L34,-36 L46,-4 L36,30 L-6,42 L-40,26 Z" fill="#FFFFFF" {...st} />
    <path d="M-24,-16 L8,-6 L24,-20 M-26,10 L2,4 L22,16" fill="none" stroke={INK} strokeWidth={4} opacity={0.45} />
  </g>
);

export const Pelmen: React.FC<{ x: number; y: number; s: number; lookX?: number; lookY?: number; lid?: number; open?: number; sy?: number; tail?: number }> = ({
  x, y, s, lookX = 0, lookY = 0, lid = 0.5, open = 1, sy = 1, tail = 0,
}) => (
  <g transform={`translate(${x},${y}) scale(${s},${s * sy})`}>
    <ellipse cx={0} cy={0} rx={70} ry={10} fill={INK} opacity={0.15} />
    <g transform={`rotate(${tail} 50 -40)`}>
      <path d="M50,-30 C100,-30 100,-90 74,-96 C90,-70 76,-50 50,-52" fill="#9AA0A6" {...st} />
    </g>
    <path d="M-48,-96 L-40,-150 L-12,-110 Z M48,-96 L40,-150 L12,-110 Z" fill="#9AA0A6" {...st} />
    <circle cx={0} cy={-62} r={62} fill="#9AA0A6" {...st} />
    <Eye x={-22} y={-74} rx={13} ry={11} lookX={lookX} lookY={lookY} lid={lid} open={open} pupil={6} />
    <Eye x={22} y={-74} rx={13} ry={11} lookX={lookX} lookY={lookY} lid={lid} open={open} pupil={6} />
    <path d="M-8,-50 L8,-50 L0,-42 Z" fill="#E39C86" />
    <path d="M-30,-40 L-60,-46 M-30,-34 L-60,-30 M30,-40 L60,-46 M30,-34 L60,-30" stroke={INK} strokeWidth={3} opacity={0.6} />
  </g>
);

/** «Облако турбосборки»: крутящийся пыльный клубок, из которого вылетают руки, ноги и детали. */
export const AssemblyCloud: React.FC<{ x: number; y: number; t: number; k: number }> = ({ x, y, t, k }) => {
  if (k <= 0.01) return null;
  const puffs = Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * Math.PI * 2 + t * 5;
    const rr = 150 + 30 * Math.sin(t * 11 + i);
    return { cx: Math.cos(a) * rr * 0.9, cy: Math.sin(a) * rr * 0.7, r: 95 + 20 * Math.sin(t * 7 + i * 1.7) };
  });
  // things poking out — swap every 6 frames for a frantic feel
  const slot = Math.floor(t * 5);
  const items = Array.from({ length: 4 }, (_, i) => {
    const seed = slot * 10 + i;
    const a = random(`a${seed}`) * Math.PI * 2;
    return { kind: Math.floor(random(`k${seed}`) * 4), a, d: 235 + random(`d${seed}`) * 45 };
  });
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      {puffs.map((p, i) => <circle key={`o${i}`} cx={p.cx} cy={p.cy} r={p.r + 6} fill={INK} />)}
      {puffs.map((p, i) => <circle key={`f${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="#F4EEE4" />)}
      {items.map((it, i) => {
        const ix = Math.cos(it.a) * it.d;
        const iy = Math.sin(it.a) * it.d * 0.8;
        const rot = (it.a * 180) / Math.PI + 90;
        return (
          <g key={`i${i}`} transform={`translate(${ix},${iy}) rotate(${rot}) scale(1.4)`}>
            {it.kind === 0 && <g><path d="M0,40 L0,-40" stroke={INK} strokeWidth={36} strokeLinecap="round" /><path d="M0,40 L0,-40" stroke="#FF7A1A" strokeWidth={24} strokeLinecap="round" /><circle cy={-48} r={18} fill="#F2C29B" {...st} /></g>}
            {it.kind === 1 && <g><rect x={-14} y={-60} width={28} height={70} rx={8} fill="#E54848" {...st} /><path d="M0,10 L0,70" stroke="#9AA0A6" strokeWidth={10} strokeLinecap="round" /></g>}
            {it.kind === 2 && <rect x={-90} y={-18} width={180} height={36} rx={6} fill="#C79363" {...st} />}
            {it.kind === 3 && <path d="M-50,10 C-50,-24 -16,-30 20,-28 C34,-26 40,-6 36,10 Z" fill="#F7F7F2" {...st} />}
          </g>
        );
      })}
      {[0, 1, 2].map((i) => {
        const a = t * 4 + i * 2.1;
        return <path key={`s${i}`} d={`M${Math.cos(a) * 60},${Math.sin(a) * 40} q30,-30 60,0`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.5} />;
      })}
    </g>
  );
};

/** Кривой шкаф. lean — наклон в градусах вокруг правого нижнего угла. */
export const Wardrobe: React.FC<{
  x: number; y: number; lean: number; door: number;
  open?: number;      // 0 closed … 1 both doors swung open (seen edge-on at the hinges)
  lidOff?: number;    // 0 … 1 top board flying away
  hopY?: number; sx?: number; sy?: number;
  inside?: React.ReactNode;  // drawn inside the carcass, behind the doors (things can stick out of the top)
}> = ({ x, y, lean, door, open = 0, lidOff = 0, hopY = 0, sx = 1, sy = 1, inside }) => {
  const wl = 136 * (1 - 0.8 * open);
  return (
    <g transform={`translate(${x},${y - hopY}) rotate(${lean} 320 0) translate(160,0) scale(${sx},${sy}) translate(-160,0)`}>
      <g transform="skewX(-7)">
        <rect x={0} y={-600} width={320} height={600} rx={6} fill="#B07D4F" {...st} />
        <rect x={18} y={-580} width={284} height={560} fill="#4A2F1C" />
      </g>
      {inside}
      <g transform="skewX(-7)">
        <path d="M0,-600 H320 V0 H0 Z M18,-580 V-20 H302 V-580 Z" fill="#B07D4F" fillRule="evenodd" {...st} />
        <rect x={18} y={-580} width={wl} height={560} fill="#C79363" {...st} />
        <g transform={`rotate(${door * (1 - open)} 302 -580)`}>
          <rect x={302 - wl} y={-560} width={wl} height={560} fill="#C79363" {...st} />
          {open < 0.5 && <circle cx={302 - wl + 16} cy={-280} r={9} fill={INK} />}
        </g>
        {open < 0.5 && <circle cx={18 + wl - 14} cy={-290} r={9} fill={INK} />}
        <g transform={`translate(0,${-420 * lidOff}) rotate(${-50 * lidOff} 160 -610)`} opacity={1 - Math.max(0, lidOff - 0.8) * 5}>
          <rect x={-6} y={-624} width={332} height={26} rx={6} fill="#9C6B41" {...st} />
        </g>
        {lidOff === 0 && <path d="M40,-630 l90,-40 M200,-624 l60,30" stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.6} />}
      </g>
    </g>
  );
};

export const Screw: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x},${y}) rotate(${r})`}>
    <rect x={-6} y={-4} width={30} height={9} rx={3} fill="#9AA0A6" stroke={INK} strokeWidth={3} />
    <rect x={-14} y={-10} width={10} height={20} rx={3} fill="#B5BBC1" stroke={INK} strokeWidth={3} />
  </g>
);

/** Звуковой «баббл» — надпись-звук в стиле комикса. */
export const Bubble: React.FC<{ x: number; y: number; text: string; k: number; rot?: number; fill?: string }> = ({ x, y, text, k, rot = -8, fill = "#FFE14D" }) => {
  if (k <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${k})`}>
      <path d="M0,-110 L32,-46 L108,-62 L58,0 L112,52 L36,52 L24,118 L-18,58 L-94,88 L-56,18 L-118,-26 L-44,-44 Z" fill={fill} {...st} />
      <text y={18} textAnchor="middle" fontSize={50} fontWeight={900} fontFamily="RubikLocal" fill={INK}>{text}</text>
    </g>
  );
};

export const Heart: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) =>
  k <= 0.01 ? null : (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <path d="M0,30 C-60,-10 -50,-60 -18,-60 C-6,-60 0,-50 0,-42 C0,-50 6,-60 18,-60 C50,-60 60,-10 0,30 Z" fill="#E54848" {...st} />
      <text x={70} y={-6} fontSize={54} fontWeight={900} fontFamily="RubikLocal" fill="#E54848" stroke={INK} strokeWidth={10} paintOrder="stroke">+1</text>
    </g>
  );

/** Входная дверь квартиры изнутри: проём, за ним лестничная клетка (зелёная краска, побелка, табличка «5 этаж»). */
export const Doorway: React.FC<{ open: number; children?: React.ReactNode }> = ({ open, children }) => (
  <g>
    <rect width={1080} height={1920} fill="#EFE3CF" />
    {/* проём */}
    <g>
      <rect x={150} y={330} width={780} height={1700} fill="#E8E4D8" />
      <rect x={150} y={1000} width={780} height={1100} fill="#8FB09A" />
      <path d="M150,1000 H930" stroke="#6E9580" strokeWidth={10} />
      <g transform="translate(700,640)">
        <rect width={150} height={70} rx={8} fill="#F4F4F0" stroke={INK} strokeWidth={5} />
        <text x={75} y={47} textAnchor="middle" fontSize={34} fontWeight={900} fontFamily="RubikLocal" fill={INK}>5 ЭТАЖ</text>
      </g>
      <g transform="translate(200,1080)" opacity={0.85}>
        {[0, 1, 2].map((i) => <rect key={i} x={i * 70} width={62} height={90} rx={4} fill="#7C8A94" stroke={INK} strokeWidth={4} />)}
      </g>
    </g>
    {children}
    {/* дверная коробка */}
    <path d="M110,2000 V290 H970 V2000 H930 V330 H150 V2000 Z" fill="#8A5A3A" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {/* полотно двери, распахивается к зрителю (сужается к петлям справа) */}
    <g transform={`translate(930,0) scale(${1 - 0.86 * open},1) translate(-930,0)`}>
      <rect x={150} y={330} width={780} height={1700} fill="#A0704C" stroke={INK} strokeWidth={8} />
      <rect x={230} y={430} width={620} height={560} rx={10} fill="none" stroke="#7A5236" strokeWidth={12} />
      <circle cx={230} cy={1180} r={24} fill="#D9B44A" stroke={INK} strokeWidth={6} />
    </g>
  </g>
);
