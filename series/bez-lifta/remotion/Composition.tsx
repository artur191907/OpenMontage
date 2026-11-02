import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { FPS, Line, blink, isTalking, landing, mix, mixP, ramp, springAt, visemeAt, wobble } from "./parts/anim";
import { Tolik, HIPS_L, HIPS_R, RUB_L, RUB_R, THROW_R, POINT_UP_R } from "./parts/Tolik";
import { Gena } from "./parts/Gena";
import { AssemblyCloud, Box, Bubble, Heart, Paper, Pelmen, Room, Screw, Wardrobe } from "./parts/Props";
import { Captions } from "./parts/Captions";

// ATELIER — «Без лифта» · 01 «Инструкция». Hand-authored; no stock components.

export interface SceneProps {
  durationSec: number;
  lines: Line[];
  sfx: { src: string; at: number; vol: number }[];
  beats: Record<string, [number, number]>;
}

const Camera: React.FC<{ s: number; cx: number; cy: number; dx?: number; dy?: number; children: React.ReactNode }> = ({ s, cx, cy, dx = 0, dy = 0, children }) => (
  <g transform={`translate(${cx + dx},${cy + dy}) scale(${s}) translate(${-cx},${-cy})`}>{children}</g>
);

// ------------------------------------------------------------- beat 1: hook
const Beat1: React.FC<{ t: number; f: number; lines: Line[] }> = ({ t, f, lines }) => {
  const kHips = springAt(f, 0.45, 9);
  const kL = springAt(f, 0.5, 10);
  const u = ramp(t, 0, 0.5, Easing.in(Easing.quad));
  const landed = t >= 0.5;
  const [, csy] = landing(t, 0.5, 0.16);
  const paperX = landed ? 878 : mix(654, 878, u);
  const paperY = landed ? 1300 + (1 - csy) * 120 : mix(741, 1300, u) - 300 * Math.sin(Math.PI * u);
  const [tsx, tsy] = landing(t, 0.6, 0.07);
  const talk = isTalking(lines, "tolik", t);
  const catLook = ramp(t, 0.9, 1.3);
  return (
    <Camera s={mix(1, 1.04, ramp(t, 0, 3.4))} cx={540} cy={1150}>
      <Room t={t} />
      <Box x={40} y={1480} flap={1} />
      <Pelmen x={880} y={1480} s={1.5} sy={csy} lookX={0} lookY={mix(-0.9, 0, catLook)} lid={mix(0.1, 0.6, catLook)} open={blink(t, [2.6])} tail={wobble(t, 0.5, 22, 2)} />
      <Paper x={paperX} y={paperY} r={landed ? 12 : 540 * u} s={1.1} />
      <Tolik
        x={520} y={1480} s={1.12} sx={tsx} sy={tsy}
        lean={mix(8, -8, springAt(f, 0.4, 11))}
        headTilt={(talk ? Math.sin(t * 13) * 2.5 : 0) - 7 * ramp(t, 2.25, 2.45) + 7 * ramp(t, 3.1, 3.3)}
        tuft={wobble(t, 0, 16) + wobble(t, 0.6, 10) + wobble(t, 2.3, 8)}
        armR={mixP(THROW_R, HIPS_R, kHips)} armL={mixP({ x: -120, y: -440, bulge: 30 }, HIPS_L, kL)}
        lookX={0.2} lid={0.25} open={blink(t, [1.55, 3.2])} brow="smug" mood="smug"
        v={visemeAt(lines, "tolik", t)} jitter={t * 30}
      />
      <Bubble x={760} y={1130} text="ШЛЁП" k={springAt(f, 0.5, 8, 220) * (1 - ramp(t, 1.0, 1.25))} rot={10} />
    </Camera>
  );
};

// ------------------------------------------------- beat 2: turbo assembly
const Beat2: React.FC<{ t: number; f: number; lines: Line[] }> = ({ t, f, lines }) => {
  const crouch = ramp(t, 3.4, 3.5);
  const stretch = ramp(t, 3.5, 3.57);
  const tolikVisible = t < 3.6;
  const cloudK = springAt(f, 3.58, 8, 160) * (1 - ramp(t, 7.95, 8.25, Easing.in(Easing.back(2))));
  const shake = cloudK > 0.05 ? Math.sin(t * 47) * 6 : 0;
  const talk = isTalking(lines, "gena", t);
  const laugh = t > 5.95 && t < 6.75;
  const thumb = springAt(f, 6.8, 8);
  const lookCam = ramp(t, 6.7, 6.85);
  return (
    <Camera s={0.94} cx={540} cy={1150} dx={shake} dy={shake * 0.5}>
      <Room t={t} />
      {tolikVisible && (
        <Tolik x={360} y={1480} s={1.05}
          sx={mix(1, 1.1, crouch) * mix(1, 0.8, stretch)} sy={mix(1, 0.84, crouch) * mix(1, 1.35, stretch)}
          lean={mix(-4, 10, crouch)} armL={RUB_L} armR={RUB_R} tuft={wobble(t, 3.4, 12)}
          lid={0.3} brow="smug" mood="grin" v="rest" open={1} lookX={0.4} />
      )}
      <AssemblyCloud x={370} y={1170} t={t} k={cloudK} />
      <Gena x={810} y={1500} s={1.15}
        caneUp={springAt(f, 3.5, 12)} thumb={thumb}
        hop={(talk ? Math.abs(Math.sin(t * 9)) * 14 : Math.abs(Math.sin(t * 4)) * 5) + (laugh ? 8 : 0)}
        shake={laugh ? Math.sin(t * 70) * 5 : 0}
        browY={wobble(t, 4.1, 16, 4) + wobble(t, 6.85, 22, 3) + Math.sin(t * 6) * 3}
        lookX={mix(-0.8, 0, lookCam)} lookY={mix(-0.2, 0, lookCam)} open={blink(t, [4.9, 7.95])}
        mood="grin" v={visemeAt(lines, "gena", t)} jitter={t * 25} />
      <Bubble x={520} y={820} text="ВЖУХ" k={springAt(f, 3.58, 8, 220) * (1 - ramp(t, 4.2, 4.4))} rot={-10} />
      <Bubble x={200} y={860} text="ТР-Р-Р" k={springAt(f, 5.4, 8, 220) * (1 - ramp(t, 6.0, 6.2))} rot={8} fill="#FFFFFF" />
      <Heart x={560} y={900} k={springAt(f, 7.52, 8, 200) * (1 - ramp(t, 8.05, 8.25))} />
    </Camera>
  );
};

// ---------------------------------------------- beat 3: «лишние детали»
const SCREWS = [
  { x: 210, y: 1520, r: 20 }, { x: 270, y: 1548, r: -40 }, { x: 335, y: 1510, r: 70 }, { x: 395, y: 1556, r: 5 }, { x: 455, y: 1528, r: -15 },
];

const Beat3: React.FC<{ t: number; f: number; lines: Line[] }> = ({ t, f, lines }) => {
  const lean = 6 * ramp(t, 11.5, 12.8, Easing.in(Easing.cubic));
  const door = 9 + wobble(t, 11.5, 5, 3, 3) + wobble(t, 8.3, 4, 3, 4);
  const talk = isTalking(lines, "tolik", t);
  const lookScrews = ramp(t, 8.85, 9.0) * (1 - ramp(t, 10.0, 10.15));
  const point = springAt(f, 11.3, 8);
  const [sx, sy] = landing(t, 11.32, 0.1);
  const dust = 1 - ramp(t, 8.3, 8.9);
  return (
    <Camera s={mix(1, 1.07, ramp(t, 8.3, 12.8, Easing.inOut(Easing.quad)))} cx={420} cy={1380}>
      <Room t={t} />
      <Wardrobe x={110} y={1470} lean={lean} door={door} />
      {SCREWS.map((s, i) => {
        const t0 = 8.32 + i * 0.05;
        const u = ramp(t, t0, t0 + 0.35, Easing.out(Easing.bounce));
        return <Screw key={i} x={mix(380, s.x, ramp(t, t0, t0 + 0.35))} y={mix(1330, s.y, u)} r={s.r * u} />;
      })}
      {dust > 0 && [0, 1, 2, 3].map((i) => (
        <circle key={i} cx={300 + i * 110} cy={1300 - i * 40 - (1 - dust) * 120} r={50 * dust} fill="#F4EEE4" opacity={0.8 * dust} />
      ))}
      <Tolik x={800} y={1480} s={1.1} sx={sx} sy={sy}
        lean={-10 + (talk ? Math.sin(t * 7) * 1.5 : 0)}
        headTilt={(talk ? Math.sin(t * 12) * 2 : 0) - 5 * point}
        tuft={wobble(t, 8.3, 10) + wobble(t, 11.32, 16)}
        armL={HIPS_L} armR={mixP(HIPS_R, POINT_UP_R, point)}
        lookX={mix(0.1, -0.9, lookScrews)} lookY={mix(0, 0.7, lookScrews)} lid={0.25}
        open={blink(t, [10.4, 12.5])} brow={point > 0.5 ? "up" : "smug"} mood={point > 0.5 ? "grin" : "smug"}
        v={visemeAt(lines, "tolik", t)} jitter={t * 30} />
      <Bubble x={430} y={1290} text="ДЗЫНЬ" k={springAt(f, 8.35, 8, 220) * (1 - ramp(t, 8.9, 9.1))} rot={-6} fill="#FFFFFF" />
      <Bubble x={250} y={780} text="СКРИП" k={springAt(f, 11.5, 9, 200) * (1 - ramp(t, 12.3, 12.6))} rot={-12} fill="#FFFFFF" />
    </Camera>
  );
};

export const Scene: React.FC<SceneProps> = ({ lines, sfx, beats }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const inBeat = (k: string) => t >= beats[k][0] && t < beats[k][1];
  return (
    <AbsoluteFill style={{ background: "#EFE3CF" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {inBeat("b1") && <Beat1 t={t} f={f} lines={lines} />}
        {inBeat("b2") && <Beat2 t={t} f={f} lines={lines} />}
        {inBeat("b3") && <Beat3 t={t} f={f} lines={lines} />}
      </svg>
      <Captions lines={lines} t={t} frame={f} />
      {lines.map((l) => (
        <Sequence key={l.id} from={Math.round(l.start * FPS)}>
          <Audio src={staticFile(l.src)} volume={1} />
        </Sequence>
      ))}
      {sfx.map((s, i) => (
        <Sequence key={`sfx${i}`} from={Math.round(s.at * FPS)}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const calculateMetadata: CalculateMetadataFunction<SceneProps> = async ({ props }) => ({
  durationInFrames: Math.round((props.durationSec ?? 12.8) * FPS),
  fps: FPS,
  width: 1080,
  height: 1920,
});
