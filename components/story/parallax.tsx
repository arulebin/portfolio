"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { ROOM_VW, layerX } from "@/lib/story/world";

type SceneContextValue = {
  /** This room's chapter index. */
  index: number;
  /** Camera position in world vw. */
  camX: MotionValue<number>;
  /** Pointer parallax, -0.5..0.5 on each axis. Zero under reduced motion. */
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
};

const SceneContext = createContext<SceneContextValue | null>(null);

export function SceneProvider({
  value,
  children,
}: {
  value: SceneContextValue;
  children: ReactNode;
}) {
  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export function useScene() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useScene must be used inside a <SceneProvider>");
  return ctx;
}

/**
 * One depth plane of one room.
 *
 * THE PARALLAX MATH, in one line:
 *
 *     x = (roomStart - camX) * depth + 50   [vw]
 *
 * The scaled term is the parallax; the unscaled +50 puts the camera's focus at
 * screen centre. At depth 1 this reduces to the exact world-to-screen mapping
 * the character and the hotspots use, which is why an artifact authored at 30%
 * of the room is standing precisely where the art puts it — at every depth the
 * planes converge on the same point.
 *
 * The layer box is exactly one room wide, so children positioned with
 * percentages are positioned in room coordinates. Wide cover art (skylines,
 * ground) overhangs that box instead — see `OVERHANG_VW`.
 */
export function ParallaxLayer({
  depth,
  children,
  className = "",
  /** Multiplier on the pointer parallax; deeper planes should barely respond. */
  pointerStrength = 1,
  style,
}: {
  depth: number;
  children: ReactNode;
  className?: string;
  pointerStrength?: number;
  style?: CSSProperties;
}) {
  const { index, camX, pointer } = useScene();

  const x = useTransform(camX, (c) => `${layerX(index, c, depth)}vw`);
  const px = useTransform(pointer.x, (v) => v * 26 * depth * pointerStrength);
  const py = useTransform(pointer.y, (v) => v * 16 * depth * pointerStrength);

  return (
    <motion.div
      aria-hidden={depth !== 1 ? true : undefined}
      className={`pointer-events-none absolute inset-y-0 left-0 ${className}`}
      style={{ x, width: `${ROOM_VW}vw`, willChange: "transform", ...style }}
    >
      <motion.div className="absolute inset-0" style={{ x: px, y: py }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
