"use client";

import {
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** how far the element is allowed to drift toward the cursor (px) */
  strength?: number;
};

/**
 * Wraps content so it drifts toward the pointer while hovered, then springs
 * back on leave. Pointer-only (skipped on touch + reduced-motion). The spring
 * gives it that weighty, "premium" feel rather than a linear follow.
 */
export function Magnetic({ children, className, strength = 14 }: MagneticProps) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    // normalise to [-1, 1] across the element then scale by strength
    x.set((relX / (rect.width / 2)) * strength);
    y.set((relY / (rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
