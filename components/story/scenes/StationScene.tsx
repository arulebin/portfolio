"use client";

import { DEPTHS } from "@/lib/story/camera";
import type { ScenePalette } from "@/lib/story/types";
import { ParallaxLayer } from "../parallax";
import { Backdrop, Band, Glow, GroundPlane, LitWindows, Prop, Stars, skylinePath, tile, Vignette } from "./primitives";

const CITY = tile([46, 78, 58, 104, 70, 122, 84, 62, 98, 74, 112, 54, 88, 66], 12);

/** CHAPTER 04 — the platform, at the end of the day. */
export function StationBase({ palette }: { palette: ScenePalette }) {
  return (
    <>
      <ParallaxLayer depth={DEPTHS.sky} pointerStrength={0.22}>
        <Backdrop from={palette.sky[0]} to={palette.sky[1]} />
        <Stars count={80} />
        <div
          className="absolute rounded-full"
          style={{
            left: "10%",
            top: "20%",
            width: "6vw",
            height: "6vw",
            transform: "translate(-50%, -50%)",
            background: "#fdf6ff",
            boxShadow: `0 0 70px 18px ${palette.glow}`,
          }}
        />
        <Glow x="26%" y="56%" r="54vw" color={palette.glow} opacity={0.34} />
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.far} pointerStrength={0.45}>
        {/* distant hills */}
        <Band bottom="30%" height="13%" viewBox="0 0 1200 120">
          <path d="M0 120 C160 52 300 74 460 40 C620 6 760 66 920 44 C1050 26 1140 62 1200 48 L1200 120 Z" fill={palette.far} opacity={0.6} />
        </Band>
        <Band bottom="22%" height="17%">
          <path d={skylinePath(CITY)} fill={palette.mid} opacity={0.7} />
          <LitWindows heights={CITY} color={palette.glow} density={2} />
        </Band>
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.mid} pointerStrength={0.85}>
        {/* the train, waiting */}
        <Prop x="72%" bottom="22%" width="52%" viewBox="0 0 700 220">
          <rect x={0} y={40} width={700} height={140} rx={22} fill={palette.near} />
          <rect x={0} y={40} width={700} height={10} rx={5} fill={palette.glow} opacity={0.4} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={40 + i * 130} y={70} width={92} height={56} rx={7} fill={palette.glow} opacity={0.72} />
          ))}
          <rect x={0} y={180} width={700} height={16} fill={palette.ink} />
          {[80, 240, 420, 600].map((cx) => (
            <circle key={cx} cx={cx} cy={202} r={17} fill={palette.ink} stroke={palette.near} strokeWidth={4} />
          ))}
        </Prop>

        {/* platform canopy */}
        <Band bottom="58%" height="16%" viewBox="0 0 1200 100">
          <path d="M0 40 L1200 40 L1200 58 L0 58 Z" fill={palette.ink} />
          <path d="M0 40 L1200 40 L1200 46 L0 46 Z" fill={palette.glow} opacity={0.28} />
        </Band>
        {[14, 42, 70, 96].map((x) => (
          <Prop key={x} x={`${x}%`} bottom="22%" width="1.6%" viewBox="0 0 20 300">
            <rect x={6} y={0} width={8} height={300} fill={palette.ink} />
            <rect x={0} y={0} width={20} height={12} rx={3} fill={palette.ink} />
          </Prop>
        ))}

        {/* departures board */}
        <Prop x="58%" bottom="46%" width="12%" viewBox="0 0 200 90">
          <rect x={0} y={0} width={200} height={72} rx={6} fill={palette.ink} />
          <rect x={8} y={8} width={184} height={56} rx={3} fill={palette.near} opacity={0.8} />
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <rect x={16} y={16 + r * 16} width={70} height={7} rx={2} fill={palette.glow} opacity={0.8} />
              <rect x={98} y={16 + r * 16} width={40} height={7} rx={2} fill={palette.glow} opacity={0.5} />
            </g>
          ))}
        </Prop>
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.ground}>
        <GroundPlane color={palette.ground} edge={palette.glow} />
        {/* tactile platform edge */}
        <Band bottom="17%" height="6%" viewBox="0 0 1200 40">
          <rect x={0} y={12} width={1200} height={16} fill={palette.near} />
          {Array.from({ length: 420 }, (_, i) => (
            <circle key={i} cx={i * 2.86 + 1.4} cy={20} r={0.9} fill={palette.glow} opacity={0.3} />
          ))}
        </Band>

        {/* mailbox at x 0.26, matching its hotspot */}
        <Prop x="26%" bottom="22%" width="7%" viewBox="0 0 100 190">
          <rect x={42} y={80} width={14} height={110} fill={palette.ink} />
          <path d="M16 44 C16 22 34 10 50 10 C66 10 84 22 84 44 L84 84 L16 84 Z" fill={palette.near} />
          <path d="M16 44 C16 22 34 10 50 10 L50 84 L16 84 Z" fill={palette.ink} opacity={0.45} />
          <rect x={28} y={38} width={44} height={7} rx={3} fill={palette.ink} />
          <circle cx={50} cy={64} r={5} fill={palette.glow} opacity={0.9} />
        </Prop>
      </ParallaxLayer>
    </>
  );
}

/** Foreground plane — rendered AFTER the avatar so it occludes the character. */
export function StationFore({ palette }: { palette: ScenePalette }) {
  return (
    <>
      <ParallaxLayer depth={DEPTHS.fore} pointerStrength={1.35}>
        {/* lamp posts, throwing pools of light onto the platform */}
        {[8, 88].map((x) => (
          <div key={x}>
            <Prop x={`${x}%`} bottom="18%" width="4%" viewBox="0 0 60 340">
              <rect x={25} y={40} width={10} height={300} fill={palette.ink} />
              <path d="M8 40 L52 40 L44 12 L16 12 Z" fill={palette.ink} />
              <rect x={16} y={30} width={28} height={9} rx={4} fill={palette.glow} opacity={0.95} />
            </Prop>
            <Glow x={`${x}%`} y="72%" r="20vw" color={palette.glow} opacity={0.3} />
          </div>
        ))}
      </ParallaxLayer>

      <Vignette ink={palette.ink} />
    </>
  );
}
