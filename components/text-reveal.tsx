"use client";

import { motion } from "motion/react";
import type { ElementType } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

type TextRevealProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** seconds before the first word starts */
  delay?: number;
  /** seconds between each word */
  stagger?: number;
  once?: boolean;
};

/**
 * Word-by-word "mask" reveal: each word sits inside an overflow-hidden clip and
 * slides up from below with a staggered spring. The clip has a hair of bottom
 * padding (cancelled by a negative margin) so descenders like g/y aren't shaved.
 * Falls back to plain text when the user prefers reduced motion.
 */
export function TextReveal({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.06,
  once = true,
}: TextRevealProps) {
  const reduce = useReducedMotionSafe();
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      <motion.span
        style={{ display: "inline" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-12% 0px" }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        aria-hidden
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span className="inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
              <motion.span
                className="inline-block will-change-transform"
                variants={{ hidden: { y: "115%" }, visible: { y: "0%" } }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </motion.span>
      {/* Accessible, un-split copy for screen readers */}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
