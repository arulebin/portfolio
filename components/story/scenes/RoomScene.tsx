"use client";

import { DEPTHS } from "@/lib/story/camera";
import type { ScenePalette } from "@/lib/story/types";
import { ParallaxLayer } from "../parallax";
import { Backdrop, Band, COVER_STYLE, Glow, GroundPlane, Prop, Vignette } from "./primitives";

/**
 * CHAPTER 02 — the room where the learning happened.
 *
 * Prop positions are authored to line up with the hotspot coordinates in
 * `script.ts`: desk 0.20, laptop 0.44, shelf 0.72, window 0.88.
 */
export function RoomBase({ palette }: { palette: ScenePalette }) {
  return (
    <>
      <ParallaxLayer depth={DEPTHS.sky} pointerStrength={0.2}>
        <Backdrop from={palette.sky[0]} to={palette.sky[1]} />
        <Glow x="88%" y="34%" r="42vw" color={palette.glow} opacity={0.42} />
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.far} pointerStrength={0.45}>
        {/* back wall + wainscot */}
        <div
          className="absolute bottom-[22%] top-0"
          style={{ ...COVER_STYLE, background: palette.far, opacity: 0.55 }}
        />
        <Band bottom="22%" height="8%" viewBox="0 0 1200 60">
          <rect x={0} y={30} width={1200} height={30} fill={palette.near} />
          <rect x={0} y={26} width={1200} height={5} fill={palette.glow} opacity={0.25} />
        </Band>

        {/* window, upper right — the room's light source */}
        <Prop x="88%" bottom="52%" width="17%" viewBox="0 0 200 200">
          <rect x={10} y={10} width={180} height={170} rx={6} fill={palette.ink} />
          <rect x={20} y={20} width={160} height={150} fill={palette.sky[1]} opacity={0.9} />
          <rect x={20} y={20} width={160} height={150} fill={palette.glow} opacity={0.28} />
          <rect x={96} y={20} width={8} height={150} fill={palette.ink} />
          <rect x={20} y={90} width={160} height={8} fill={palette.ink} />
        </Prop>

        {/* framed prints */}
        <Prop x="34%" bottom="56%" width="7%" viewBox="0 0 100 130">
          <rect x={4} y={4} width={92} height={122} rx={3} fill={palette.ink} />
          <rect x={12} y={12} width={76} height={106} fill={palette.mid} />
          <path d="M12 96 L38 62 L58 88 L76 68 L88 84 L88 118 L12 118 Z" fill={palette.glow} opacity={0.4} />
        </Prop>
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.mid} pointerStrength={0.85}>
        {/* desk, spanning x 0.12 -> 0.50 */}
        <Prop x="31%" bottom="22%" width="34%" viewBox="0 0 420 220">
          <rect x={0} y={78} width={420} height={16} rx={5} fill={palette.near} />
          <rect x={0} y={78} width={420} height={5} fill={palette.glow} opacity={0.3} />
          <rect x={18} y={94} width={16} height={126} fill={palette.near} />
          <rect x={386} y={94} width={16} height={126} fill={palette.near} />
          {/* drawers */}
          <rect x={44} y={94} width={120} height={110} rx={4} fill={palette.mid} />
          <rect x={60} y={116} width={88} height={5} rx={2} fill={palette.ink} opacity={0.7} />
          <rect x={60} y={156} width={88} height={5} rx={2} fill={palette.ink} opacity={0.7} />
          {/* stacked books */}
          <rect x={214} y={58} width={62} height={9} rx={2} fill={palette.glow} opacity={0.75} />
          <rect x={218} y={48} width={54} height={9} rx={2} fill={palette.far} />
          <rect x={212} y={38} width={64} height={9} rx={2} fill={palette.mid} />
          {/* mug */}
          <rect x={300} y={58} width={20} height={20} rx={3} fill={palette.glow} opacity={0.85} />
          <path d="M320 63 C330 63 330 73 320 73" fill="none" stroke={palette.glow} strokeWidth={3} opacity={0.85} />
        </Prop>

        {/* laptop at x 0.44, sitting on the desk */}
        <Prop x="44%" bottom="35.5%" width="9%" viewBox="0 0 140 100">
          <path d="M22 76 L118 76 L128 92 L12 92 Z" fill={palette.near} />
          <rect x={30} y={10} width={80} height={62} rx={4} fill={palette.ink} />
          <rect x={35} y={15} width={70} height={52} fill={palette.glow} opacity={0.85} />
          {/* code lines on screen */}
          <rect x={41} y={22} width={30} height={4} fill={palette.ink} opacity={0.55} />
          <rect x={41} y={32} width={48} height={4} fill={palette.ink} opacity={0.4} />
          <rect x={41} y={42} width={38} height={4} fill={palette.ink} opacity={0.4} />
          <rect x={41} y={52} width={24} height={4} fill={palette.ink} opacity={0.55} />
        </Prop>
        <Glow x="44%" y="49%" r="16vw" color={palette.glow} opacity={0.3} />

        {/* bookshelf at x 0.72 */}
        <Prop x="72%" bottom="22%" width="17%" viewBox="0 0 220 400">
          <rect x={0} y={0} width={220} height={400} rx={6} fill={palette.near} />
          {[0, 1, 2, 3].map((row) => (
            <g key={row}>
              <rect x={12} y={18 + row * 94} width={196} height={80} fill={palette.ink} opacity={0.55} />
              {Array.from({ length: 7 }, (_, b) => {
                const h = 52 + ((row * 7 + b) % 4) * 8;
                const fill = [palette.glow, palette.far, palette.mid, palette.sky[1]][(row + b) % 4];
                return (
                  <rect
                    key={b}
                    x={20 + b * 26}
                    y={18 + row * 94 + (80 - h)}
                    width={20}
                    height={h}
                    rx={2}
                    fill={fill}
                    opacity={0.85}
                  />
                );
              })}
              <rect x={12} y={96 + row * 94} width={196} height={8} fill={palette.near} />
            </g>
          ))}
        </Prop>

        {/* chair */}
        <Prop x="56%" bottom="22%" width="9%" viewBox="0 0 120 200">
          <rect x={40} y={10} width={44} height={80} rx={8} fill={palette.mid} />
          <rect x={26} y={92} width={72} height={14} rx={5} fill={palette.mid} />
          <rect x={56} y={106} width={12} height={62} fill={palette.near} />
          <path d="M28 176 L96 176" stroke={palette.near} strokeWidth={10} strokeLinecap="round" />
        </Prop>
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.ground}>
        <GroundPlane color={palette.ground} edge={palette.glow} />
        {/* rug */}
        <Band bottom="1%" height="17%" viewBox="0 0 1200 100">
          <ellipse cx={480} cy={60} rx={330} ry={44} fill={palette.mid} opacity={0.6} />
          <ellipse cx={480} cy={60} rx={250} ry={30} fill="none" stroke={palette.glow} strokeWidth={3} opacity={0.35} />
        </Band>
        {/* light pooling in from the window */}
        <div
          className="absolute bottom-0 right-0 h-[34%] w-[46%]"
          style={{
            background: `linear-gradient(215deg, ${palette.glow} 0%, transparent 62%)`,
            opacity: 0.22,
          }}
        />
      </ParallaxLayer>
    </>
  );
}

/** Foreground plane — rendered AFTER the avatar so it occludes the character. */
export function RoomFore({ palette }: { palette: ScenePalette }) {
  return (
    <>
      <ParallaxLayer depth={DEPTHS.fore} pointerStrength={1.3}>
        {/* hanging plant, top-left */}
        <Prop x="9%" bottom="62%" width="14%" viewBox="0 0 160 200" className="!bottom-auto top-0">
          <rect x={74} y={0} width={4} height={40} fill={palette.ink} />
          <path d="M40 40 L120 40 L108 76 L52 76 Z" fill={palette.ink} />
          <path d="M56 74 C44 100 44 132 56 158 C62 130 62 100 56 74 Z" fill={palette.ink} />
          <path d="M80 74 C74 108 80 146 96 172 C96 136 90 100 80 74 Z" fill={palette.ink} />
          <path d="M104 74 C112 98 112 126 100 148 C96 122 98 96 104 74 Z" fill={palette.ink} />
        </Prop>
      </ParallaxLayer>

      <Vignette ink={palette.ink} />
    </>
  );
}
