import type { ComponentType } from "react";
import type { ChapterId, ScenePalette } from "@/lib/story/types";
import { BalconyBase, BalconyFore } from "./BalconyScene";
import { RoomBase, RoomFore } from "./RoomScene";
import { LabBase, LabFore } from "./LabScene";
import { StationBase, StationFore } from "./StationScene";

type ScenePart = ComponentType<{ palette: ScenePalette }>;

/**
 * Scene registry. Each chapter contributes two passes:
 *   Base — sky through ground, painted behind the avatar
 *   Fore — the plane in front of the avatar (railings, lamp posts, vignette)
 *
 * They are rendered in two separate sweeps with the avatar between them, so
 * occlusion depends on DOM order rather than on z-index surviving a scene's
 * opacity-induced stacking context.
 */
export const SCENES: Record<ChapterId, { Base: ScenePart; Fore: ScenePart }> = {
  intro: { Base: BalconyBase, Fore: BalconyFore },
  origin: { Base: RoomBase, Fore: RoomFore },
  quests: { Base: LabBase, Fore: LabFore },
  contact: { Base: StationBase, Fore: StationFore },
};
