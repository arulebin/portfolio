/**
 * ASSET MANIFEST.
 *
 * Every entry is nullable. `null` means "no hand-made asset yet — the engine
 * draws its procedural version instead". Dropping in finished art is a one-line
 * edit here; no component changes, ever.
 *
 * Audio is NOT in this manifest: the score is synthesised live in the Web Audio
 * graph and the narration is spoken by the browser (see `audio.ts`), so there
 * is nothing to host, download or license. If you later want a recorded
 * soundtrack instead, add a manifest here and swap the scheduler for playback —
 * `narrationBus` is already the single seam for it.
 */

/**
 * Avatar art. `rig` points at an SVG whose <g> ids match RIG_PARTS (see
 * `lib/story/rig.ts`). While null, `PlaceholderRig` draws a procedural
 * cel-shaded stand-in against the same skeleton — so the walk cycle written
 * against the rig is already the final walk cycle.
 */
export const avatarManifest: { rig: string | null } = {
  rig: null,
};

/**
 * Per-room background art. While null, each scene component draws its own
 * procedural cel-shaded layers from the chapter palette.
 */
export const sceneManifest: Record<string, { layers: string[] } | null> = {
  intro: null,
  origin: null,
  quests: null,
  contact: null,
};
