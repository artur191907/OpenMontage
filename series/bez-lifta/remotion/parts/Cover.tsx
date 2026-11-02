import React from "react";
import { AbsoluteFill } from "remotion";
import { INK } from "./anim";
import { CAPTION_FONT } from "./Captions";
import { Tolik, HIPS_L, HIPS_R } from "./Tolik";
import { Gena } from "./Gena";
import { Wardrobe } from "./Props";

// Series cover template for «Без лифта». Same frame for every episode; only `episode`, `title`
// and the scene slot change. Everything that matters sits inside the 3:4 grid crop (y 240…1680).

export type CoverProps = { episode: number; title: string };

const Burst: React.FC = () => (
  <g>
    {Array.from({ length: 18 }, (_, i) => {
      const a0 = (i / 18) * Math.PI * 2;
      const a1 = a0 + Math.PI / 18;
      const R = 1600;
      return <path key={i} d={`M540,1000 L${540 + Math.cos(a0) * R},${1000 + Math.sin(a0) * R} L${540 + Math.cos(a1) * R},${1000 + Math.sin(a1) * R} Z`} fill="#24705A" />;
    })}
  </g>
);

const Outlined: React.FC<{ x: number; y: number; size: number; fill: string; children: string; rot?: number; shadow?: string; stroke?: number }> = ({ x, y, size, fill, children, rot = 0, shadow, stroke = 0.16 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    {shadow && <text x={8} y={10} textAnchor="middle" fontFamily={CAPTION_FONT} fontWeight={900} fontSize={size} fill={shadow} stroke={shadow} strokeWidth={size * stroke * 2} strokeLinejoin="round">{children}</text>}
    <text textAnchor="middle" fontFamily={CAPTION_FONT} fontWeight={900} fontSize={size} fill={fill} stroke={INK} strokeWidth={size * stroke * 2} strokeLinejoin="round" paintOrder="stroke">{children}</text>
  </g>
);

export const Cover: React.FC<CoverProps> = ({ episode, title }) => {
  const titleSize = Math.min(150, 960 / (title.length * 0.78));
  return (
    <AbsoluteFill style={{ background: "#1F5E4A" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <Burst />
        {/* scene slot — episode 1: дед выныривает из «тумбочки», Толик в шоке, кот осуждает */}
        <Wardrobe x={540} y={1700} lean={4} door={9} lidOff={0}
          inside={<Gena x={160} y={-430} s={1.05} thumb={1} browY={10} lookX={-0.3} mood="grin" v="A" />} />
        <g transform="translate(610,800) rotate(-14)">
          <rect x={-6} y={-24} width={332} height={26} rx={6} fill="#9C6B41" stroke={INK} strokeWidth={6} />
        </g>
        <Tolik x={300} y={2260} s={2.0} lean={-6} headTilt={-4} tuft={62} armL={HIPS_L} armR={HIPS_R}
          lookX={0.7} lookY={-0.2} lid={0} open={1} brow="up" mood="shock" v="O" />
        {/* episode badge */}
        <g transform="translate(540,350) rotate(-4)">
          <rect x={-300} y={-82} width={600} height={164} rx={82} fill="#FFD23F" stroke={INK} strokeWidth={12} />
          <text y={44} textAnchor="middle" fontFamily={CAPTION_FONT} fontWeight={900} fontSize={104} fill={INK}>СЕРИЯ {episode}</text>
        </g>
        {/* episode title */}
        <Outlined x={540} y={1610} size={titleSize} fill="#FFFFFF" rot={-3} shadow="#FF7A1A">{title}</Outlined>
        {/* series mark */}
        <g transform="translate(540,505)">
          <text textAnchor="middle" fontFamily={CAPTION_FONT} fontWeight={900} fontSize={52} fill="#FFFFFF" stroke={INK} strokeWidth={12} paintOrder="stroke" letterSpacing={6}>БЕЗ ЛИФТА</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
