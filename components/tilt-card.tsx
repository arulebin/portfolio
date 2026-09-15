"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees on each axis */
  max?: number;
};

/**
 * A 3D-tilt surface that also renders a radial "spotlight" tracking the cursor.
 * The tilt is spring-damped so it settles naturally, and the inner content is
 * lifted on the Z axis for a subtle parallax/depth cue. Everything degrades to
 * a plain container under reduced-motion.
 */
export function TiltCard({ children, className, max = 6 }: TiltCardProps) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);

  // pointer position (0..1) drives the spotlight gradient
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(0, { stiffness: 200, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 18 });

  const spotlight = useMotionTemplate`radial-gradient(240px circle at calc(${px} * 100%) calc(${py} * 100%), rgba(var(--accent-rgb) / 0.15), transparent 62%)`;

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    px.set(nx);
    py.set(ny);
    rotateY.set((nx - 0.5) * (max * 2));
    rotateX.set((0.5 - ny) * (max * 2));
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
      }}
      className={className}
    >
      {!reduce && (
        <motion.span
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      {children}
    </motion.div>
  );
}
