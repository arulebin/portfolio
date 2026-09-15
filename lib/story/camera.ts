import { ROOM_VW, roomCenter } from "./world";

/**
 * CAMERA + DEPTH.
 *
 * The camera is not an animation any more — it simply chases the character
 * (see `useWorld`). What lives here is how the world is layered in depth and
 * how neighbouring rooms hand off to each other.
 */

/** Depth of each parallax plane. 1 = the ground the character walks on. */
export const DEPTHS = {
  sky: 0.06,
  far: 0.24,
  mid: 0.52,
  ground: 1,
  fore: 1.38,
} as const;

/** Smoothstep - zero first derivative at both ends, so no visible jerk. */
function smoothstep(t: number): number {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
}

/**
 * How present a room is, given where the camera is standing.
 *
 * Rooms sit side by side, so at a boundary two of them are on screen at once —
 * and their skies do not match. Fading each room out just past its own edge,
 * combined with the veil below, hides that seam without stopping the walk.
 */
export function sceneOpacity(camX: number, index: number): number {
  const d = Math.abs(camX - roomCenter(index)) / ROOM_VW;
  if (d <= 0.42) return 1;
  // Gone by 0.58 rather than 0.74: a longer tail left the NEXT room ~38% visible
  // while standing at this room's barrier, which put pink station lamps in the
  // middle of the cyan lab. At the boundary itself both rooms sit near 0.5, so
  // the hand-off is still a clean crossfade.
  if (d >= 0.58) return 0;
  return 1 - smoothstep((d - 0.42) / 0.16);
}

/** A soft dark veil that peaks exactly on a room boundary. */
export function veilOpacity(camX: number): number {
  const frac = (camX / ROOM_VW) % 1;
  const dist = Math.min(frac, 1 - frac);
  return smoothstep(1 - dist / 0.13) * 0.72;
}

/** Which rooms are worth mounting for a given camera position. */
export function isNear(camX: number, index: number): boolean {
  return Math.abs(camX - roomCenter(index)) < ROOM_VW * 1.6;
}
