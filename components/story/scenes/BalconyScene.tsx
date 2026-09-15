"use client";

import { DEPTHS } from "@/lib/story/camera";
import type { ScenePalette } from "@/lib/story/types";
import { ParallaxLayer } from "../parallax";
import { Backdrop, Band, Glow, GroundPlane, LitWindows, Prop, Stars, skylinePath, tile, Vignette } from "./primitives";

const FAR_SKYLINE = tile([58, 96, 72, 130, 88, 150, 104, 76, 122, 92, 140, 66, 110, 84, 128, 70], 12);
const MID_SKYLINE = tile([110, 156, 128, 178, 140, 120, 168, 134, 190, 122, 150, 176], 12);

/** CHAPTER 01 — a balcony at first light. */
export function BalconyBase({ palette }: { palette: ScenePalette }) {
  return (
    <>
      <ParallaxLayer depth={DEPTHS.sky} pointerStrength={0.25}>
        <Backdrop from={palette.sky[0]} to={palette.sky[1]} />
        <div className="absolute inset-0 opacity-40">
          <Stars count={44} />
        </div>
        <Glow x="20%" y="60%" r="52vw" color={palette.glow} opacity={0.55} />
        <div
          className="absolute rounded-full"
          style={{
            left: "20%",
            top: "60%",
            width: "8vw",
            height: "8vw",
            transform: "translate(-50%, -50%)",
            background: "#fff6e2",
            boxShadow: `0 0 90px 26px ${palette.glow}`,
          }}
        />
        {/* dawn cloud bands */}
        <Band bottom="46%" height="16%" viewBox="0 0 1200 120">
          <path d="M0 74 C160 52 260 88 420 68 C580 48 700 84 860 66 C1000 50 1100 78 1200 62 L1200 120 L0 120 Z" fill={palette.glow} opacity={0.16} />
          <path d="M0 96 C200 80 340 106 520 92 C700 78 840 104 1010 90 C1110 82 1160 96 1200 90 L1200 120 L0 120 Z" fill="#ffffff" opacity={0.08} />
        </Band>
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.far} pointerStrength={0.5}>
        <Band bottom="22%" height="19%">
          <path d={skylinePath(FAR_SKYLINE)} fill={palette.far} opacity={0.75} />
          <LitWindows heights={FAR_SKYLINE} color={palette.glow} density={2} />
        </Band>
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.mid} pointerStrength={0.8}>
        <Band bottom="22%" height="26%">
          <path d={skylinePath(MID_SKYLINE)} fill={palette.mid} />
          <LitWindows heights={MID_SKYLINE} color={palette.glow} density={4} />
        </Band>
        {/* a water tower, because every skyline needs one thing that isn't a box */}
        <Prop x="22%" bottom="46%" width="6%" viewBox="0 0 60 90">
          <rect x={12} y={20} width={36} height={30} rx={4} fill={palette.near} />
          <path d="M10 20 L30 4 L50 20 Z" fill={palette.near} />
          <rect x={18} y={50} width={5} height={40} fill={palette.near} />
          <rect x={37} y={50} width={5} height={40} fill={palette.near} />
        </Prop>
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.ground}>
        <GroundPlane color={palette.ground} edge={palette.glow} />
        {/* floor tiling */}
        <Band bottom="0" height="22%" viewBox="0 0 1200 140">
          {Array.from({ length: 90 }, (_, i) => (
            <line key={i} x1={i * 13.5} y1={0} x2={i * 13.5 - 6} y2={140} stroke={palette.near} strokeWidth={0.6} opacity={0.45} />
          ))}
        </Band>
      </ParallaxLayer>
    </>
  );
}

/** Foreground plane — rendered AFTER the avatar so it occludes the character. */
export function BalconyFore({ palette }: { palette: ScenePalette }) {
  return (
    <>
      <ParallaxLayer depth={DEPTHS.fore} pointerStrength={1.4}>
        {/* balcony railing — in FRONT of the character, which is what makes it
            read as a balcony rather than a rooftop */}
        <Band bottom="20%" height="13%" viewBox="0 0 1200 110">
          <rect x={0} y={6} width={1200} height={7} rx={3} fill={palette.near} />
          <rect x={0} y={96} width={1200} height={6} fill={palette.near} />
          {/* Spacing is in viewBox units across a 705vw band, so a railing needs
              ~300 balusters, not 40 — otherwise it reads as a fence of walls. */}
          {Array.from({ length: 300 }, (_, i) => (
            <rect key={i} x={i * 4 + 1.4} y={12} width={1.1} height={88} fill={palette.near} />
          ))}
          <rect x={0} y={6} width={1200} height={3} fill={palette.glow} opacity={0.35} />
        </Band>
        {/* potted plant framing the left edge */}
        <Prop x="7%" bottom="19%" width="13%" viewBox="0 0 120 160">
          <path d="M60 150 C30 130 12 96 22 60 C34 88 46 104 58 116 C50 84 52 48 66 22 C74 52 76 90 68 116 C82 100 94 76 100 48 C108 88 92 128 62 150 Z" fill={palette.ink} />
          <path d="M38 148 L82 148 L76 160 L44 160 Z" fill={palette.ink} />
        </Prop>
        {/* vignette */}
      </ParallaxLayer>

      <Vignette ink={palette.ink} />
    </>
  );
}
