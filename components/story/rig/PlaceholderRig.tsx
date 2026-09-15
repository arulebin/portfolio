"use client";

import { motion, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { RIG_PARTS, transformOrigin, type RigPart } from "@/lib/story/rig";

export type RigMotion = Record<
  RigPart,
  { rotate: MotionValue<number>; x: MotionValue<number>; y: MotionValue<number> }
>;

/**
 * Wraps one part so it rotates about its authored joint.
 *
 * `transformBox: "view-box"` is the load-bearing detail — without it, CSS
 * transform-origin on an SVG element resolves against the element's own
 * bounding box, so every limb would pivot around its own centre instead of its
 * shoulder or hip.
 */
function Part({
  part,
  rig,
  children,
}: {
  part: RigPart;
  rig: RigMotion;
  children: ReactNode;
}) {
  return (
    <motion.g
      data-rig-part={part}
      style={{
        rotate: rig[part].rotate,
        x: rig[part].x,
        y: rig[part].y,
        transformOrigin: transformOrigin(part),
        transformBox: "view-box",
      }}
    >
      {children}
    </motion.g>
  );
}

const SKIN = "#f2c8a4";
const SKIN_SHADE = "#d29c76";
const HAIR = "#241a2b";
const HAIR_SHADE = "#150e1a";
const HOODIE = "#c2410c";
const HOODIE_SHADE = "#8a2c06";
const PANTS = "#33405e";
const PANTS_SHADE = "#222b44";
const SHOE = "#1b1620";

/**
 * PROCEDURAL CEL-SHADED PLACEHOLDER.
 *
 * The cel look is four passes per form: a flat base fill, a hard-edged shadow
 * shape (no gradients — that hard edge IS cel shading), a heavy ink outline,
 * and a rim light picking up the scene's own glow colour so the character sits
 * in whatever light the chapter is using.
 *
 * ARTIST HAND-OFF: deliver an SVG with viewBox="0 0 100 160", character facing
 * RIGHT, feet at y=152, one <g id="..."> per name in RIG_PARTS, joints at the
 * coordinates in JOINTS, and no baked transforms. Swap it in via
 * `avatarManifest.rig` — the animation code does not change.
 */
export function PlaceholderRig({
  rig,
  ink,
  glow,
}: {
  rig: RigMotion;
  ink: string;
  glow: string;
}) {
  const outline = { stroke: ink, strokeWidth: 2.6, strokeLinejoin: "round" as const };

  return (
    <>
      {/* ── back limbs (drawn first so the torso overlaps them) ── */}
      <Part part="backArm" rig={rig}>
        <rect x={36} y={50} width={9} height={46} rx={4.5} fill={HOODIE_SHADE} {...outline} />
      </Part>

      <Part part="backLeg" rig={rig}>
        <rect x={41} y={92} width={10} height={52} rx={4} fill={PANTS_SHADE} {...outline} />
        <rect x={39} y={140} width={15} height={12} rx={4} fill={SHOE} {...outline} />
      </Part>

      {/* ── torso ── */}
      <Part part="torso" rig={rig}>
        <path
          d="M35 54 C35 49 39 45 44 45 L58 45 C64 45 68 49 68 55 L70 88 C70 95 67 100 64 100 L38 100 C35 100 33 95 33 88 Z"
          fill={HOODIE}
          {...outline}
        />
        {/* hard cel shadow down the back half */}
        <path
          d="M35 54 C35 49 39 45 44 45 L49 45 L47 100 L38 100 C35 100 33 95 33 88 Z"
          fill={HOODIE_SHADE}
          opacity={0.85}
        />
        {/* hood roll */}
        <path d="M40 46 C44 52 58 52 62 46" fill="none" stroke={ink} strokeWidth={2.2} strokeLinecap="round" />
        {/* drawstring */}
        <path d="M50 50 L49 62" stroke={ink} strokeWidth={1.6} strokeLinecap="round" fill="none" />
        {/* rim light on the lit edge */}
        <path d="M68 55 L70 88" stroke={glow} strokeWidth={2.4} strokeLinecap="round" opacity={0.75} fill="none" />
      </Part>

      {/* ── front limbs ── */}
      <Part part="frontLeg" rig={rig}>
        <rect x={50} y={92} width={10} height={52} rx={4} fill={PANTS} {...outline} />
        <rect x={50} y={92} width={4} height={52} rx={2} fill={PANTS_SHADE} opacity={0.9} />
        <rect x={48} y={140} width={16} height={12} rx={4} fill={SHOE} {...outline} />
      </Part>

      <Part part="frontArm" rig={rig}>
        <rect x={55} y={50} width={9} height={40} rx={4.5} fill={HOODIE} {...outline} />
        <rect x={55} y={50} width={3.5} height={40} rx={2} fill={HOODIE_SHADE} opacity={0.85} />
        {/* hand */}
        <circle cx={59.5} cy={92} r={5.4} fill={SKIN} {...outline} />
      </Part>

      {/* ── head ── */}
      <Part part="head" rig={rig}>
        <path
          d="M40 26 C40 14 46 7 54 7 C63 7 69 15 69 26 C69 34 67 40 63 45 C60 48 56 50 53 50 C49 50 45 47 43 43 C41 38 40 32 40 26 Z"
          fill={SKIN}
          {...outline}
        />
        {/* cel shadow on the shaded side of the face */}
        <path
          d="M40 26 C40 14 46 7 54 7 L52 50 C49 50 45 47 43 43 C41 38 40 32 40 26 Z"
          fill={SKIN_SHADE}
          opacity={0.55}
        />
        {/* ear */}
        <path d="M41 28 C38 27 37 32 40 34" fill={SKIN_SHADE} stroke={ink} strokeWidth={1.8} />
        {/* eye — character faces right */}
        <path d="M56 29 C58 26 63 26 65 29 C63 33 58 33 56 29 Z" fill="#fdfcfb" stroke={ink} strokeWidth={1.6} />
        <circle cx={61} cy={29.4} r={2.3} fill={ink} />
        <circle cx={62} cy={28.4} r={0.85} fill="#ffffff" />
        {/* brow */}
        <path d="M56 22.5 L65.5 23.5" stroke={ink} strokeWidth={2.2} strokeLinecap="round" fill="none" />
        {/* mouth */}
        <path d="M60 39 C62 41 64 40.5 65 39" stroke={ink} strokeWidth={1.8} strokeLinecap="round" fill="none" />
        {/* rim light */}
        <path d="M67 18 C69.5 22 69.5 32 65 42" stroke={glow} strokeWidth={2.2} strokeLinecap="round" opacity={0.7} fill="none" />
      </Part>

      {/* ── hair (last: sits over the face, and swings a beat behind the head) ── */}
      <Part part="hair" rig={rig}>
        <path
          d="M37 28 C34 16 40 3 53 2 C66 1 72 10 71 21 C70 16 66 12 61 12 C63 15 62 18 60 19 C57 13 50 10 45 13 C47 15 47 18 45 20 C42 18 39 21 39 25 Z"
          fill={HAIR}
          {...outline}
        />
        {/* back tuft */}
        <path d="M38 20 C33 26 33 36 36 41 C38 36 38 30 40 26 Z" fill={HAIR_SHADE} {...outline} />
        {/* highlight band — the anime hair-shine stripe */}
        <path d="M45 9 C52 5 61 6 66 12" stroke={glow} strokeWidth={2.6} strokeLinecap="round" opacity={0.55} fill="none" />
      </Part>
    </>
  );
}

export const PLACEHOLDER_PART_COUNT = RIG_PARTS.length;
