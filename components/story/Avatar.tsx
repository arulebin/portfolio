"use client";

import { useMemo, useRef } from "react";
import { motion, motionValue, useAnimationFrame, useTransform, type MotionValue } from "motion/react";
import { RIG_PARTS, computePose } from "@/lib/story/rig";
import { screenX } from "@/lib/story/world";
import { narrationBus } from "@/lib/story/audio";
import type { AvatarPose, ScenePalette } from "@/lib/story/types";
import { PlaceholderRig, type RigMotion } from "./rig/PlaceholderRig";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

/** Stride cadence: a floor, plus a term scaled by how fast they are moving. */
const BASE_CADENCE = 4.2;
const CADENCE_GAIN = 0.34;

/**
 * THE CHARACTER.
 *
 * Owns one MotionValue per rig part per axis and writes them all from a single
 * `useAnimationFrame`. Nothing here touches React state, so the character walks
 * at 60fps with ZERO renders — the tree only re-renders when the discrete pose
 * changes, a few times a minute.
 *
 * Screen position is derived: `screenX(charX, camX)`. The character is a world
 * object being looked at by a camera, not a sprite pinned to the viewport, so
 * they can walk toward the edge of the frame when the camera hits a world edge.
 */
export function Avatar({
  charX,
  camX,
  speed,
  walking,
  interacting,
  facing,
  palette,
}: {
  charX: MotionValue<number>;
  camX: MotionValue<number>;
  speed: MotionValue<number>;
  walking: boolean;
  interacting: boolean;
  facing: 1 | -1;
  palette: ScenePalette;
}) {
  const reduce = useReducedMotionSafe();
  const phase = useRef(0);
  const lastSin = useRef(0);
  const puffRef = useRef<HTMLSpanElement>(null);

  const rig = useMemo<RigMotion>(() => {
    const out = {} as RigMotion;
    for (const part of RIG_PARTS) {
      out[part] = { rotate: motionValue(0), x: motionValue(0), y: motionValue(0) };
    }
    return out;
  }, []);

  const rootY = useMemo(() => motionValue(0), []);
  const shadowScale = useMemo(() => motionValue(1), []);

  const pose: AvatarPose = interacting ? "interact" : walking ? "walk" : "idle";

  useAnimationFrame((t, deltaMs) => {
    if (reduce) return;
    const seconds = t / 1000;
    const dt = Math.min(deltaMs, 50) / 1000;

    if (pose === "walk") {
      phase.current += dt * (BASE_CADENCE + speed.get() * CADENCE_GAIN);

      // A footfall each time the stride crosses zero — twice per cycle.
      const s = Math.sin(phase.current);
      if (Math.sign(s) !== Math.sign(lastSin.current) && lastSin.current !== 0) {
        narrationBus.sfx("step");
        const puff = puffRef.current;
        if (puff) {
          // Restart the CSS animation without a React render.
          puff.style.animation = "none";
          void puff.offsetWidth;
          puff.style.animation = "";
        }
      }
      lastSin.current = s;
    }

    const { parts, root } = computePose(pose, phase.current, seconds);
    for (const part of RIG_PARTS) {
      rig[part].rotate.set(parts[part].rotate);
      rig[part].x.set(parts[part].x);
      rig[part].y.set(parts[part].y);
    }
    rootY.set(root.y);
    shadowScale.set(1 - Math.abs(root.y) * 0.06);
  });

  const x = useTransform([charX, camX], ([c, cam]: number[]) => `${screenX(c, cam)}vw`);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute bottom-[22%] left-0 h-[30vh] max-h-[290px] min-h-[175px]"
      style={{ x, willChange: "transform" }}
    >
      <div className="relative h-full -translate-x-1/2">
        {/* contact shadow — sells the character's weight on the ground */}
        <motion.div
          className="absolute bottom-[-2%] left-1/2 h-[5%] w-[62%] -translate-x-1/2 rounded-[50%] blur-[3px]"
          style={{ background: palette.ink, opacity: 0.45, scaleX: shadowScale }}
        />
        {/* dust kicked up on each footfall */}
        <span
          ref={puffRef}
          className="story-puff absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
          style={{ background: palette.glow, opacity: 0 }}
        />
        <motion.svg
          viewBox="0 0 100 160"
          className="h-full w-auto overflow-visible"
          style={{ y: rootY, scaleX: facing }}
        >
          <PlaceholderRig rig={rig} ink={palette.ink} glow={palette.glow} />
        </motion.svg>
      </div>
    </motion.div>
  );
}
