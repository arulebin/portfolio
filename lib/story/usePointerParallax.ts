"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * Normalised pointer offset from the centre of the viewport, -0.5..0.5,
 * spring-smoothed. Feeds a second, subtler axis of parallax on top of the
 * scroll camera so scenes have depth even while the reader is standing still.
 *
 * Same technique already used by the classic site's hero illustration
 * (`components/hero-art.tsx`). Disabled outright under reduced motion.
 */
export function usePointerParallax() {
  const raw = { x: useMotionValue(0), y: useMotionValue(0) };
  const reduce = useReducedMotion();

  const x = useSpring(raw.x, { stiffness: 80, damping: 22, mass: 0.5 });
  const y = useSpring(raw.y, { stiffness: 80, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      raw.x.set(e.clientX / window.innerWidth - 0.5);
      raw.y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
    // raw values are stable MotionValues for the life of the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return { x, y };
}
