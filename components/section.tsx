"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-20 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-5xl px-6">{children}</div>
    </section>
  );
}

export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotionSafe();

  return (
    <div className="mb-10 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.22em] text-muted">
      <span className="text-accent tabular-nums">{index}</span>
      <span>{children}</span>
      <motion.span
        className="h-px flex-1 origin-left bg-gradient-to-r from-border to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={reduce ? undefined : { scaleX: 1 }}
        animate={reduce ? { scaleX: 1 } : undefined}
        viewport={{ once: true, margin: "-40px" }}
        transition={reduce ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
