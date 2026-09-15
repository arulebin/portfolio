"use client";

import {
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

/**
 * A custom, theme-aware hero illustration: a floating code-editor window
 * surrounded by subtle geometric accents. Colors reference the CSS design
 * tokens so it adapts to light/dark. On pointer-capable devices the whole
 * scene parallaxes toward the cursor; code lines "type" themselves in on view.
 * All motion is disabled under prefers-reduced-motion.
 */
export function HeroArt() {
  const reduce = useReducedMotionSafe();

  // pointer parallax — normalised offset from viewport centre
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 90, damping: 20 });
  const y = useSpring(my, { stiffness: 90, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx.set(nx * 26);
      my.set(ny * 26);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  const float = (duration: number, distance = 10, delay = 0) =>
    reduce
      ? { animate: { y: 0 }, transition: { duration: 0 } }
      : {
          animate: { y: [0, -distance, 0] },
          transition: {
            duration,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay,
          },
        };

  // animated "type-in" for the code lines (scaleX from the left)
  const line = (delay: number) =>
    reduce
      ? { initial: { scaleX: 0, originX: 0 }, animate: { scaleX: 1 }, transition: { duration: 0 } }
      : {
          initial: { scaleX: 0, originX: 0 },
          whileInView: { scaleX: 1 },
          viewport: { once: true },
          transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <motion.div
      style={reduce ? undefined : { x, y }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[460px]"
    >
      <svg
        viewBox="0 0 480 460"
        role="img"
        aria-label="Illustration of a floating code editor window"
        className="h-auto w-full"
      >
        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <filter id="hero-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="22"
              floodColor="var(--accent)"
              floodOpacity="0.12"
            />
          </filter>
        </defs>

        {/* soft accent glow */}
        <circle cx="250" cy="180" r="200" fill="url(#hero-glow)" />

        {/* faint rotating orbit ring */}
        <motion.circle
          cx="240"
          cy="232"
          r="182"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.5"
          strokeDasharray="3 13"
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
          {...(reduce
            ? {}
            : {
                animate: { rotate: 360 },
                transition: { duration: 60, repeat: Infinity, ease: "linear" },
              })}
        />

        {/* decorative ring, top-left */}
        <motion.circle
          cx="74"
          cy="112"
          r="16"
          fill="none"
          stroke="var(--foreground)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          {...float(7, 8, 0.4)}
        />

        {/* decorative dot grid, bottom-right */}
        <motion.g fill="var(--foreground)" fillOpacity="0.25" {...float(8, 6, 0.2)}>
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <circle
                key={`${row}-${col}`}
                cx={406 + col * 16}
                cy={330 + row * 16}
                r="2.5"
              />
            )),
          )}
        </motion.g>

        {/* main editor window */}
        <motion.g filter="url(#hero-shadow)" {...float(6, 12)}>
          <rect
            x="86"
            y="128"
            width="300"
            height="200"
            rx="18"
            fill="var(--card)"
            stroke="var(--border)"
            strokeWidth="1.5"
          />

          {/* window controls */}
          <circle cx="112" cy="154" r="5" fill="var(--accent)" />
          <circle cx="132" cy="154" r="5" fill="var(--foreground)" fillOpacity="0.25" />
          <circle cx="152" cy="154" r="5" fill="var(--foreground)" fillOpacity="0.25" />

          {/* header divider */}
          <line x1="86" y1="176" x2="386" y2="176" stroke="var(--border)" strokeWidth="1.5" />

          {/* code lines (type-in on view) */}
          <g style={{ transformBox: "fill-box" }}>
            <motion.rect x="110" y="196" width="64" height="9" rx="4.5" fill="var(--accent)" {...line(0.5)} />
            <motion.rect x="182" y="196" width="128" height="9" rx="4.5" fill="var(--foreground)" fillOpacity="0.18" {...line(0.58)} />

            <motion.rect x="126" y="222" width="150" height="9" rx="4.5" fill="var(--foreground)" fillOpacity="0.18" {...line(0.66)} />
            <motion.rect x="284" y="222" width="58" height="9" rx="4.5" fill="var(--accent)" fillOpacity="0.65" {...line(0.74)} />

            <motion.rect x="126" y="248" width="96" height="9" rx="4.5" fill="var(--foreground)" fillOpacity="0.18" {...line(0.82)} />

            <motion.rect x="142" y="274" width="132" height="9" rx="4.5" fill="var(--foreground)" fillOpacity="0.18" {...line(0.9)} />
            <motion.rect x="282" y="274" width="44" height="9" rx="4.5" fill="var(--accent)" fillOpacity="0.5" {...line(0.98)} />

            <motion.rect x="110" y="300" width="72" height="9" rx="4.5" fill="var(--foreground)" fillOpacity="0.18" {...line(1.06)} />

            {/* blinking caret */}
            {!reduce && (
              <motion.rect
                x="188"
                y="298"
                width="3"
                height="13"
                rx="1.5"
                fill="var(--accent)"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear", delay: 1.2 }}
              />
            )}
          </g>
        </motion.g>

        {/* accent ring, top-right */}
        <motion.circle
          cx="404"
          cy="108"
          r="30"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          {...float(6.5, 12, 0.6)}
        />

        {/* accent dot, bottom-left */}
        <motion.circle cx="72" cy="338" r="11" fill="var(--accent)" {...float(5.5, 10, 0.3)} />

        {/* mono "</>" mark */}
        <motion.text
          x="392"
          y="300"
          fontFamily="var(--font-mono), monospace"
          fontSize="26"
          fontWeight="600"
          fill="var(--accent)"
          fillOpacity="0.85"
          {...float(7.5, 9, 0.5)}
        >
          {"</>"}
        </motion.text>
      </svg>
    </motion.div>
  );
}
