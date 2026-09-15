"use client";

import type { ReactNode } from "react";
import { OVERHANG_VW, ROOM_VW } from "@/lib/story/world";

/**
 * Shared drawing primitives for the procedural scenes.
 *
 * Everything is SVG or CSS gradients driven by the chapter palette, so a scene
 * costs a couple of KB and re-lights itself if the palette changes.
 *
 * COVER SIZING — the important detail in this file:
 *
 * Cover art must overhang the room box, because planes at different depths
 * travel different distances and anything sized to the room exactly leaves a
 * gap at the far end of the shallowest and deepest layers.
 *
 * But `<svg>` is a REPLACED element. On an absolutely positioned replaced
 * element, width comes from the intrinsic aspect ratio, and when left + right +
 * that width over-constrain the box, CSS silently drops `right`. Sizing these
 * with `left/right` therefore produced 113vw-wide skylines parked off-screen.
 * Every cover element below gets an explicit width AND height instead.
 */
const COVER_W = ROOM_VW + OVERHANG_VW * 2;
const COVER = {
  left: `${-OVERHANG_VW}vw`,
  width: `${COVER_W}vw`,
} as const;

/** Deterministic pseudo-random, seeded so server and client agree. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Round generated values before they reach the DOM. Full float precision
 * serialises differently on the server than the browser normalises it back,
 * which React reports as a hydration mismatch.
 */
const r3 = (n: number) => Math.round(n * 1000) / 1000;

/** Full-height SVG plane, e.g. the star field. */
export function SvgLayer({
  children,
  className = "",
  viewBox = "0 0 1200 620",
}: {
  children: ReactNode;
  className?: string;
  viewBox?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={`absolute ${className}`}
      style={{ ...COVER, top: 0, height: "100%" }}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Soft radial light source — the sun, a lamp, a crystal's bloom. */
export function Glow({
  x,
  y,
  r,
  color,
  opacity = 0.55,
}: {
  x: string;
  y: string;
  r: string;
  color: string;
  opacity?: number;
}) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: r,
        height: r,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
        opacity,
        filter: "blur(12px)",
      }}
    />
  );
}

/** Sky / wall wash behind everything. */
export function Backdrop({ from, to }: { from: string; to: string }) {
  return (
    <div
      className="absolute top-0 h-full"
      style={{ ...COVER, background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)` }}
    />
  );
}

export function Stars({ count = 90, color = "#fff" }: { count?: number; color?: string }) {
  return (
    <SvgLayer>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={r3(rand(i + 1) * 1200)}
          cy={r3(rand(i + 51) * 300)}
          r={r3(rand(i + 101) * 1.4 + 0.4)}
          fill={color}
          opacity={r3(0.25 + rand(i + 7) * 0.6)}
        />
      ))}
    </SvgLayer>
  );
}

/** Repeating silhouette band — hills, rooftops, treeline. */
export function Ridge({ d, fill, opacity = 1 }: { d: string; fill: string; opacity?: number }) {
  return <path d={d} fill={fill} opacity={opacity} />;
}

/**
 * A wide silhouette band (skyline, hills, ground edge).
 * `preserveAspectRatio="none"` on purpose: horizontal stretch is invisible on a
 * ridge line and gives exact control over where the band sits.
 */
export function Band({
  bottom,
  height,
  viewBox = "0 0 1200 200",
  children,
}: {
  bottom: string;
  height: string;
  viewBox?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className="absolute"
      style={{ ...COVER, bottom, height }}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/**
 * A discrete object (desk, lamp, train car) placed by percentage.
 * Keeps its aspect ratio, so nothing looks stretched.
 *
 * Convention across every scene: the ground plane occupies the bottom 22% of
 * the viewport and the character stands at `bottom-[22%]`. Anchoring props to
 * the same number is what keeps them standing ON the floor at any size.
 */
export function Prop({
  x,
  bottom,
  width,
  viewBox,
  children,
  className = "",
}: {
  /** Position as a share of the ROOM. */
  x: string;
  bottom: string;
  /** Size as a share of the VIEWPORT, e.g. "12%" renders 12vw wide. */
  width: string;
  viewBox: string;
  children: ReactNode;
  className?: string;
}) {
  const [, , vw, vh] = viewBox.split(/\s+/).map(Number);
  const widthVw = `${parseFloat(width)}vw`;
  return (
    <div
      className={`absolute ${className}`}
      style={{ left: x, bottom, width: widthVw, transform: "translateX(-50%)" }}
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMax meet"
        style={{ width: "100%", aspectRatio: `${vw} / ${vh}` }}
        aria-hidden
      >
        {children}
      </svg>
    </div>
  );
}

/** Flat ground plane. Every scene uses the same 22% so the character lands right. */
export function GroundPlane({
  color,
  edge,
  height = "22%",
}: {
  color: string;
  edge: string;
  height?: string;
}) {
  return (
    <div className="absolute bottom-0" style={{ ...COVER, height, background: color }}>
      <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: edge, opacity: 0.5 }} />
    </div>
  );
}

/** Build a stepped skyline path from an array of building heights. */
export function skylinePath(heights: number[], w = 1200, h = 200): string {
  const step = w / heights.length;
  let d = `M0 ${h}`;
  heights.forEach((ht, i) => {
    d += ` L${(i * step).toFixed(1)} ${h - ht} L${((i + 1) * step).toFixed(1)} ${h - ht}`;
  });
  return `${d} L${w} ${h} Z`;
}

/** Lit windows scattered over a skyline. Seeded, so SSR and client agree. */
export function LitWindows({
  heights,
  color,
  w = 1200,
  h = 200,
  density = 3,
}: {
  heights: number[];
  color: string;
  w?: number;
  h?: number;
  density?: number;
}) {
  const step = w / heights.length;
  const cells: ReactNode[] = [];
  heights.forEach((ht, i) => {
    for (let row = 0; row < density; row += 1) {
      const seed = i * 17 + row * 7 + 3;
      if (rand(seed) < 0.45) continue;
      const wx = i * step + step * (0.22 + rand(seed + 1) * 0.5);
      const wy = h - ht + 14 + row * 22;
      if (wy > h - 6) continue;
      cells.push(
        <rect
          key={`${i}-${row}`}
          x={r3(wx)}
          y={r3(wy)}
          width={r3(step * 0.3)}
          height={9}
          fill={color}
          opacity={r3(0.35 + rand(seed + 2) * 0.5)}
        />,
      );
    }
  });
  return <>{cells}</>;
}

/**
 * Repeat a silhouette profile with variation.
 *
 * Cover bands span the room plus a wide overhang, so a 16-building skyline
 * stretched across that reads as 16 enormous slabs. Tiling a base profile with
 * per-copy jitter keeps the density right without hand-authoring 200 numbers.
 */
export function tile(base: number[], times: number, jitter = 0.22): number[] {
  const out: number[] = [];
  for (let t = 0; t < times; t += 1) {
    base.forEach((v, i) => {
      const f = 1 + (rand(t * 31 + i * 7 + 1) - 0.5) * 2 * jitter;
      out.push(Math.max(24, Math.round(v * f)));
    });
  }
  return out;
}

/**
 * Screen vignette.
 *
 * MUST be rendered outside a <ParallaxLayer>: inside one its box is the room
 * (220vw), so the ellipse centre lands off-screen and only its dark rim is ever
 * visible — which uniformly greys out the whole scene.
 */
export function Vignette({ ink, strength = 0.5 }: { ink: string; strength?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at 50% 56%, transparent 44%, ${ink} 116%)`,
        opacity: strength,
      }}
    />
  );
}

export { rand, r3, COVER as COVER_STYLE };
