"use client";

import { DEPTHS } from "@/lib/story/camera";
import type { ScenePalette } from "@/lib/story/types";
import { ParallaxLayer } from "../parallax";
import { Backdrop, Band, Glow, GroundPlane, Prop, Stars, skylinePath, tile, Vignette } from "./primitives";

const TOWERS = tile([120, 68, 158, 96, 182, 74, 140, 104, 170, 86, 130, 150], 12);

/** Artifact anchors, matching the hotspot coordinates in `script.ts`. */
const PEDESTALS = [
  { x: 14, y: 38 },
  { x: 28, y: 60 },
  { x: 40, y: 33 },
  { x: 52, y: 58 },
  { x: 63, y: 36 },
  { x: 74, y: 61 },
  { x: 85, y: 37 },
  { x: 94, y: 59 },
];

/** CHAPTER 03 — the lab where the projects are kept. */
export function LabBase({ palette }: { palette: ScenePalette }) {
  return (
    <>
      <ParallaxLayer depth={DEPTHS.sky} pointerStrength={0.25}>
        <Backdrop from={palette.sky[0]} to={palette.sky[1]} />
        <Stars count={70} color={palette.glow} />
        <Glow x="22%" y="30%" r="70vw" color={palette.glow} opacity={0.22} />
        <Glow x="8%" y="20%" r="34vw" color="#7c5cff" opacity={0.24} />
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.far} pointerStrength={0.5}>
        <Band bottom="22%" height="24%">
          <path d={skylinePath(TOWERS)} fill={palette.far} opacity={0.55} />
          {TOWERS.map((h, i) => {
            // Spacing must derive from the array length: TOWERS is tiled, so a
            // hardcoded stride would run straight off the viewBox.
            const step = 1200 / TOWERS.length;
            return (
              <rect
                key={i}
                x={i * step + step * 0.42}
                y={200 - h + 8}
                width={step * 0.16}
                height={h - 16}
                fill={palette.glow}
                opacity={0.18}
              />
            );
          })}
        </Band>
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.mid} pointerStrength={0.85}>
        {/* crystal pillars */}
        {[10, 34, 58, 82].map((x, i) => (
          <Prop key={x} x={`${x}%`} bottom="22%" width="9%" viewBox="0 0 100 320">
            <path d="M50 0 L82 76 L72 300 L28 300 L18 76 Z" fill={palette.mid} opacity={0.75} />
            <path d="M50 0 L82 76 L64 300 L50 300 Z" fill={palette.near} opacity={0.85} />
            <path d="M50 0 L82 76 L72 300" fill="none" stroke={palette.glow} strokeWidth={2.5} opacity={0.55} />
            <rect x={16} y={296} width={68} height={16} rx={4} fill={palette.near} />
            {i % 2 === 0 && <circle cx={50} cy={120} r={9} fill={palette.glow} opacity={0.6} />}
          </Prop>
        ))}
        {/* suspended data arcs */}
        <Band bottom="40%" height="22%" viewBox="0 0 1200 140">
          <path d="M0 120 C220 40 400 40 620 108 C820 168 1000 60 1200 96" fill="none" stroke={palette.glow} strokeWidth={2} opacity={0.3} />
          <path d="M0 66 C260 130 460 22 700 60 C900 92 1060 34 1200 52" fill="none" stroke={palette.glow} strokeWidth={1.6} opacity={0.2} />
        </Band>
      </ParallaxLayer>

      <ParallaxLayer depth={DEPTHS.ground}>
        <GroundPlane color={palette.ground} edge={palette.glow} />
        {/* perspective floor grid */}
        <Band bottom="0" height="22%" viewBox="0 0 1200 140">
          {Array.from({ length: 120 }, (_, i) => (
            <line key={`v${i}`} x1={i * 10} y1={0} x2={i * 20 - 40} y2={140} stroke={palette.glow} strokeWidth={0.5} opacity={0.2} />
          ))}
          {[10, 30, 58, 96, 140].map((y, i) => (
            <line key={`h${i}`} x1={0} y1={y} x2={1200} y2={y} stroke={palette.glow} strokeWidth={1.2} opacity={0.16} />
          ))}
        </Band>

        {/* a plinth and a beam of light under each artifact */}
        {PEDESTALS.map((p) => (
          <div key={p.x} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translateX(-50%)" }}>
            <div
              className="h-[26vh] w-[3.2vw] max-w-[46px] rounded-full"
              style={{
                background: `linear-gradient(180deg, ${palette.glow} 0%, transparent 88%)`,
                opacity: 0.14,
                filter: "blur(4px)",
              }}
            />
          </div>
        ))}
      </ParallaxLayer>
    </>
  );
}

/** Foreground plane — rendered AFTER the avatar so it occludes the character. */
export function LabFore({ palette }: { palette: ScenePalette }) {
  return (
    <>
      <ParallaxLayer depth={DEPTHS.fore} pointerStrength={1.35}>
        <Prop x="4%" bottom="12%" width="16%" viewBox="0 0 160 280">
          <path d="M80 12 L134 96 L118 268 L42 268 L26 96 Z" fill={palette.ink} />
          <path d="M80 12 L134 96 L118 268 L86 268 Z" fill={palette.near} opacity={0.5} />
        </Prop>
        <Prop x="97%" bottom="8%" width="18%" viewBox="0 0 180 300">
          <path d="M90 24 L152 110 L132 292 L48 292 L28 110 Z" fill={palette.ink} />
        </Prop>
      </ParallaxLayer>

      <Vignette ink={palette.ink} />
    </>
  );
}
