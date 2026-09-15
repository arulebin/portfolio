"use client";

import { motion } from "motion/react";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

/**
 * TITLE SCREEN + AUDIO GATE.
 *
 * Browsers refuse to start audio without a user gesture, so a gate is not
 * optional — it is the only moment we are allowed to construct the audio
 * graph. Rather than apologise for it, it doubles as the story's title card.
 *
 * Both buttons enter. Choosing silence is a first-class path: the captions
 * carry the entire narration.
 */
export function AudioGate({ onEnter }: { onEnter: (withSound: boolean) => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0713] px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb877]">
          An interactive portfolio
        </p>
        <h1 className="mt-4 font-serif text-6xl font-light tracking-tight text-white sm:text-8xl">
          Ebin A
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/60">
          Four chapters, one character, and everything he built along the way.
          Walk it yourself.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onEnter(true)}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#c2410c] px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#c2410c]/30 transition-all hover:shadow-xl hover:shadow-[#c2410c]/40"
          >
            <Volume2 className="h-4 w-4" />
            Enter with sound
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => onEnter(false)}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white"
          >
            <VolumeX className="h-4 w-4" />
            Enter silently
          </button>
        </div>

        <p className="mt-8 text-xs text-white/35">
          Arrow keys or A / D to walk · E to examine · Space to skip a line
        </p>

        <Link
          href="/"
          className="mt-6 inline-block text-xs text-white/45 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white/80"
        >
          Or read the classic portfolio instead
        </Link>
      </motion.div>
    </motion.div>
  );
}
