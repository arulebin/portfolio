/**
 * Story-mode domain types.
 *
 * Everything the engine renders is derived from a `Chapter[]` (see `script.ts`)
 * plus an asset manifest (`assets.ts`). Components hold no content of their own,
 * so re-ordering, re-writing or re-scoring the story never touches a component.
 */

export type ChapterId = "intro" | "origin" | "quests" | "contact";

/**
 * One line of narration. `t` is retained for ordering and for the sr-only
 * transcript; pacing now comes from the speech engine's own boundary events,
 * or a reading-speed timer when speech is unavailable. See `useNarration`.
 */
export type Cue = {
  t: number;
  text: string;
  speaker?: "avatar" | "narrator";
};

/**
 * An interactive point in a scene. Rendered as a real <button>, so it is
 * keyboard reachable and screen-reader announced regardless of the art.
 *
 * `x`/`y` are normalised to the scene viewport (0..1, origin top-left) so the
 * same coordinates hold at every screen size.
 */
export type Hotspot = {
  id: string;
  x: number;
  y: number;
  label: string;
} & (
  | {
      /** Opens the shared project modal, sourced from `lib/projects.ts`. */
      kind: "project";
      projectId: string;
    }
  | {
      /** Opens the letter-shaped contact form. */
      kind: "contact";
      title: string;
      body: string;
    }
  | {
      /** Opens an inline lore card written here in the script. */
      kind: "lore";
      title: string;
      body: string;
      /** Optional list rendered under the body (e.g. a skill group). */
      items?: string[];
    }
);

/**
 * Per-scene lighting. Story scenes carry their own palette rather than
 * inheriting the site's light/dark theme — an anime scene has its own time of
 * day. UI chrome still uses the global tokens so the brand reads as one site.
 */
export type ScenePalette = {
  sky: [string, string];
  far: string;
  mid: string;
  near: string;
  ground: string;
  /** Accent light used for glows, rim-light and hotspot pulses. */
  glow: string;
  /** Line/silhouette colour for cel-shaded art in this scene. */
  ink: string;
};

export type Chapter = {
  id: ChapterId;
  /** Display number, e.g. "01". */
  number: string;
  title: string;
  subtitle: string;
  palette: ScenePalette;
  /** Keys into the audio manifest; null until real audio exists. */
  ambientKey: string;
  cues: Cue[];
  hotspots: Hotspot[];
  /**
   * Where the avatar sits horizontally across the chapter, in vw. The world
   * scrolls past underneath, so this is a small drift rather than real travel.
   */
  avatarPath: { from: number; to: number };
};

export type AvatarPose = "idle" | "walk" | "interact";
