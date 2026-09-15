"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { sceneOpacity, DEPTHS } from "@/lib/story/camera";
import { ROOM_VW, gateX, roomStart } from "@/lib/story/world";
import type { Chapter, Hotspot as HotspotData } from "@/lib/story/types";
import { SceneProvider, ParallaxLayer } from "./parallax";
import { Hotspot } from "./Hotspot";
import { AmbientLife } from "./AmbientLife";
import { SCENES } from "./scenes";

type SceneProps = {
  index: number;
  chapter: Chapter;
  camX: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
};

function useRoomOpacity(camX: MotionValue<number>, index: number) {
  return useTransform(camX, (c) => sceneOpacity(c, index));
}

/**
 * Background pass: sky through ground, ambient life, the chapter plate, the
 * barrier, and the interactive layer. Painted BEHIND the character.
 */
export function Scene({
  index,
  chapter,
  camX,
  pointer,
  nearId,
  gated,
  onOpenHotspot,
}: SceneProps & {
  /** Which artifact the character is standing next to, if any. */
  nearId: string | null;
  /** True while this room's narration still blocks the way onward. */
  gated: boolean;
  onOpenHotspot: (h: HotspotData) => void;
}) {
  const opacity = useRoomOpacity(camX, index);
  const { Base } = SCENES[chapter.id];

  // The barrier sits at the far end of the room, in room-local coordinates.
  const gateLeft = ((gateX(index) - roomStart(index)) / ROOM_VW) * 100;

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <SceneProvider value={{ index, camX, pointer }}>
        <Base palette={chapter.palette} />
        <AmbientLife id={chapter.id} palette={chapter.palette} />

        {/* Interactive layer + barrier, both on the ground plane so they track
            the world exactly. The layer is pointer-events:none; the buttons
            opt back in. */}
        <ParallaxLayer depth={DEPTHS.ground}>
          {chapter.hotspots.map((h) => (
            <Hotspot
              key={h.id}
              data={h}
              palette={chapter.palette}
              inReach={nearId === h.id}
              onOpen={onOpenHotspot}
            />
          ))}

          {gated && (
            <div
              className="absolute inset-y-0 w-[2.5vw] -translate-x-1/2"
              style={{ left: `${gateLeft}%` }}
              aria-hidden
            >
              <div
                className="absolute inset-y-[8%] left-1/2 w-full -translate-x-1/2 rounded-full blur-md"
                style={{
                  background: `linear-gradient(180deg, transparent, ${chapter.palette.glow}, transparent)`,
                  opacity: 0.45,
                  animation: "story-barrier 2.6s ease-in-out infinite",
                }}
              />
            </div>
          )}
        </ParallaxLayer>
      </SceneProvider>
    </motion.div>
  );
}

/** Foreground pass, rendered AFTER the character so it occludes them. */
export function SceneForeground({ index, chapter, camX, pointer }: SceneProps) {
  const opacity = useRoomOpacity(camX, index);
  const { Fore } = SCENES[chapter.id];

  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ opacity }}>
      <SceneProvider value={{ index, camX, pointer }}>
        <Fore palette={chapter.palette} />
      </SceneProvider>
    </motion.div>
  );
}
