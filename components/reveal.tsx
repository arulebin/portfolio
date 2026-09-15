"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: Direction;
  /** add a small blur-in for extra softness */
  blur?: boolean;
};

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 22 },
  down: { y: -22 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
};

const EASE = [0.16, 1, 0.3, 1] as const;
const SHOWN = { opacity: 1, x: 0, y: 0, filter: "blur(0px)" };

/**
 * Scroll-triggered entrance. Direction + optional blur let callers vary the
 * motion so sections don't all animate identically. No-ops under reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  direction = "up",
  blur = false,
}: RevealProps) {
  const reduce = useReducedMotionSafe();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset[direction], filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={reduce ? undefined : SHOWN}
      animate={reduce ? SHOWN : undefined}
      viewport={{ once: true, margin: "-60px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Container that staggers its <RevealItem> children as the group scrolls in.
 */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  const reduce = useReducedMotionSafe();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : gap, delayChildren: delay },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
