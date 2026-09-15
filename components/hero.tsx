"use client";

import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { Magnetic } from "./magnetic";
import { HeroArt } from "./hero-art";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

const RESUME_URL =
  "https://drive.google.com/file/d/1ykiocvGePFocspE3D4QsIhcryqOTJOa1/view?usp=sharing";

export function Hero() {
  const reduce = useReducedMotionSafe();

  return (
    <section id="top" className="relative scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-20 sm:pb-24 sm:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.22em] text-muted backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Open to opportunities
              </p>
            </Reveal>

            <TextReveal
              as="h1"
              text="Ebin A"
              delay={0.05}
              stagger={0.09}
              className="block font-serif text-6xl font-light leading-[1.02] tracking-tight sm:text-8xl"
            />

            <Reveal delay={0.15}>
              <p className="mt-5 max-w-2xl text-2xl font-light leading-snug text-foreground sm:text-3xl">
                Developer building{" "}
                <span className="relative whitespace-nowrap font-normal text-accent">
                  <span className="text-gradient-animate">web &amp; mobile apps</span>
                  <svg
                    aria-hidden
                    viewBox="0 0 300 12"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-2.5 w-full"
                  >
                    <motion.path
                      d="M2 8 C 70 2, 150 2, 298 6"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={reduce ? undefined : { pathLength: 1 }}
                      animate={reduce ? { pathLength: 1 } : undefined}
                      viewport={{ once: true }}
                      transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.5, ease: "easeInOut" }}
                    />
                  </svg>
                </span>{" "}
                that feel effortless.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
                Computer Science student at St. Xavier&apos;s Catholic College of
                Engineering and a software intern at Flutter Frog. I like turning
                fuzzy problems into clean, usable products.
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a
                    href="#internship"
                    className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30"
                  >
                    View work
                    <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <Link
                    href="/story"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-accent/40 bg-accent-soft px-5 py-3 text-sm font-medium text-accent transition-colors hover:border-accent"
                  >
                    <Sparkles className="h-4 w-4" />
                    Enter the story
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </Link>
                </Magnetic>
                <Magnetic>
                  <a
                    href={RESUME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-accent hover:text-accent"
                  >
                    Résumé
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3} direction="left" className="hidden justify-self-center lg:block">
            <HeroArt />
          </Reveal>
        </div>
      </div>

      {/* scroll cue */}
      {!reduce && (
        <motion.a
          href="#internship"
          aria-label="Scroll to work"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mx-auto hidden w-fit flex-col items-center gap-2 pb-6 text-muted sm:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-border p-1">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.a>
      )}
    </section>
  );
}
