import type { AvatarPose } from "./types";

/**
 * THE RIG CONTRACT.
 *
 * The avatar is a set of named parts with fixed joint origins inside a
 * 100 x 160 viewBox. The animation below is written against these names only —
 * it never knows what the parts look like.
 *
 * That is the whole point: `PlaceholderRig` draws procedural cel-shaded stand-ins
 * today, and an illustrator's SVG with matching <g id="..."> and the same joint
 * positions drops into the same sockets later. The walk cycle is written once.
 *
 * Hand-off spec for an artist:
 *   viewBox="0 0 100 160", character faces RIGHT, feet at y=152.
 *   One <g> per id below. Do not bake transforms into the groups.
 */

export const RIG_PARTS = [
  "backArm",
  "backLeg",
  "torso",
  "frontLeg",
  "frontArm",
  "head",
  "hair",
] as const;

export type RigPart = (typeof RIG_PARTS)[number];

/** Rotation origin for each part, in viewBox units. */
export const JOINTS: Record<RigPart, readonly [number, number]> = {
  torso: [50, 96], // hips
  head: [50, 50], // neck
  hair: [50, 50],
  backArm: [42, 56], // shoulder
  frontArm: [58, 56],
  backLeg: [47, 96],
  frontLeg: [53, 96],
};

export type PartTransform = { rotate: number; x: number; y: number };
export type RigPose = Record<RigPart, PartTransform>;

const zero = (): PartTransform => ({ rotate: 0, x: 0, y: 0 });

function blankPose(): RigPose {
  return {
    backArm: zero(),
    backLeg: zero(),
    torso: zero(),
    frontLeg: zero(),
    frontArm: zero(),
    head: zero(),
    hair: zero(),
  };
}

/** Root offset applied to the whole rig (bob + settle), not to any one part. */
export type RootTransform = { y: number; rotate: number };

export type PoseResult = { parts: RigPose; root: RootTransform };

/**
 * Pure function: (pose, phase, time) -> transforms.
 *
 * `phase` advances with scroll speed while walking, so the character's stride
 * naturally matches how fast the reader is travelling. `time` drives the
 * ambient breathing that runs under every pose.
 */
export function computePose(pose: AvatarPose, phase: number, time: number): PoseResult {
  const parts = blankPose();
  const breathe = Math.sin(time * 1.9);

  if (pose === "walk") {
    const p = phase;
    const swing = Math.sin(p);
    const counter = Math.cos(p);

    parts.frontLeg.rotate = swing * 26;
    parts.backLeg.rotate = -swing * 26;
    parts.frontArm.rotate = -swing * 20;
    parts.backArm.rotate = swing * 20;

    // Lean into the walk, and bob twice per stride (once per footfall).
    parts.torso.rotate = 3.5;
    parts.head.rotate = -2 + counter * 1.5;
    parts.hair.rotate = -swing * 6;
    parts.hair.y = -Math.abs(counter) * 1.2;

    return { parts, root: { y: -Math.abs(counter) * 2.4, rotate: 0 } };
  }

  if (pose === "interact") {
    // Reach toward the thing being examined, weight shifted onto the back leg.
    parts.frontArm.rotate = -68 + breathe * 3;
    parts.backArm.rotate = 8;
    parts.torso.rotate = -2;
    parts.head.rotate = -7;
    parts.hair.rotate = 3 + breathe * 2;
    parts.frontLeg.rotate = 6;
    parts.backLeg.rotate = -4;
    return { parts, root: { y: breathe * 0.5, rotate: 0 } };
  }

  // idle — quiet breathing, hair drifting a beat behind the body
  parts.torso.rotate = breathe * 0.7;
  parts.head.rotate = -breathe * 1.1;
  parts.hair.rotate = Math.sin(time * 1.9 - 0.6) * 3.2;
  parts.frontArm.rotate = breathe * 2.4;
  parts.backArm.rotate = -breathe * 2;
  return { parts, root: { y: breathe * 0.9, rotate: 0 } };
}

/** CSS transform string for one part, including its joint origin. */
export function partTransform(t: PartTransform): string {
  return `translate(${t.x}px, ${t.y}px) rotate(${t.rotate}deg)`;
}

export function transformOrigin(part: RigPart): string {
  const [x, y] = JOINTS[part];
  return `${x}px ${y}px`;
}
