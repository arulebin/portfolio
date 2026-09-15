"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * A thin accent bar pinned to the very top of the viewport that fills as the
 * page scrolls. Driven by a spring so it eases rather than tracking 1:1.
 * transform-only (scaleX) so it never triggers layout/CLS.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-accent-2 to-accent"
    />
  );
}
