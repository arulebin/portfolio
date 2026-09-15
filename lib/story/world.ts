/**
 * WORLD GEOMETRY.
 *
 * Everything is measured in `vw` (1 unit = 1% of viewport width), so the world
 * scales with the screen and props authored as percentages land in the same
 * place on a phone and a monitor.
 *
 * The character — not the scrollbar — is the source of truth. `charX` is a
 * world position; the camera chases it. That is what separates a world you walk
 * through from a filmstrip you scrub.
 */

/** Each chapter is a "room" a little over two screens wide. */
export const ROOM_VW = 185;

/** Top walking speed, vw per second. */
export const WALK_SPEED = 38;
/** How hard the character accelerates into a walk. */
export const ACCEL = 420;
/** Exponential drag — gives weight on stop without feeling icy. */
export const FRICTION = 9.5;
/** A wheel notch's contribution to velocity. */
export const WHEEL_IMPULSE = 0.09;
/** How fast the camera closes on the character (higher = tighter). */
export const CAM_FOLLOW = 4.2;
/** The camera stops at the world edges rather than showing the void. */
export const CAM_EDGE = 50;
/** How near the character must be to an artifact to interact. */
export const REACH_VW = 17;

export const totalWidth = (count: number) => count * ROOM_VW;
export const roomStart = (index: number) => index * ROOM_VW;
export const roomCenter = (index: number) => index * ROOM_VW + ROOM_VW / 2;

export function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function chapterFromX(x: number, count: number) {
  return clamp(Math.floor(x / ROOM_VW), 0, count - 1);
}

/** World position of a hotspot authored at room-fraction `fx`. */
export function hotspotWorldX(chapterIndex: number, fx: number) {
  return roomStart(chapterIndex) + fx * ROOM_VW;
}

/**
 * The barrier. Until a chapter's narration finishes, the character cannot walk
 * past this point — so it is impossible to blow through the story by spinning
 * the wheel. Opening it is the chapter's reward.
 */
export function gateX(chapterIndex: number) {
  return roomStart(chapterIndex) + ROOM_VW * 0.9;
}

/**
 * Parallax transform for one room at one depth.
 *
 *   x = (roomStart - camX) * depth + 50
 *
 * The unscaled +50 puts the camera's focus at screen centre. At depth 1 this
 * reduces to the exact world-to-screen mapping used for the character and the
 * hotspots, which is why artifacts sit precisely where the art says they do.
 */
export function layerX(chapterIndex: number, camX: number, depth: number) {
  return (roomStart(chapterIndex) - camX) * depth + 50;
}

/** Screen position (vw) of a world point, at ground depth. */
export function screenX(worldX: number, camX: number) {
  return worldX - camX + 50;
}

/**
 * Cover bands overhang the room by this much on each side. Layers at different
 * depths travel different distances, so a band sized to the room exactly would
 * leave a gap at the far end of the deepest and shallowest planes.
 */
export const OVERHANG_VW = 260;
