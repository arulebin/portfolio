"use client";

import { motion } from "motion/react";
import { ChevronRight, CornerDownRight } from "lucide-react";
import type { Chapter, Cue } from "@/lib/story/types";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

/**
 * VISUAL-NOVEL DIALOGUE BOX.
 *
 * Two separate text surfaces, deliberately:
 *
 *  1. The visible line is sliced to `revealed`, a character count advanced once
 *     per word — by real `speechSynthesis` boundary events when the narrator is
 *     speaking, or by a reading-pace timer when they are not. Either way it is
 *     a few renders per line, not sixty a second.
 *
 *  2. A visually-hidden aria-live region holds the WHOLE line and updates once
 *     per cue, so screen readers announce a finished sentence instead of
 *     stuttering out one word at a time.
 */
export function DialogueBox({
  chapter,
  cue,
  cueIndex,
  revealed,
  finished,
  onSkip,
}: {
  chapter: Chapter;
  cue: Cue | undefined;
  cueIndex: number;
  revealed: number;
  finished: boolean;
  onSkip: () => void;
}) {
  const reduce = useReducedMotionSafe();
  if (!cue) return null;

  const speaker = cue.speaker === "narrator" ? "Narration" : "Ebin";
  const shown = cue.text.slice(0, revealed);
  const typing = revealed < cue.text.length;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-4 pb-24 sm:px-8 lg:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto mx-auto w-full max-w-3xl rounded-2xl border border-white/15 bg-black/60 p-5 shadow-2xl backdrop-blur-md sm:p-6"
      >
        <div className="mb-2 flex items-center gap-2.5">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: chapter.palette.glow }}
          />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.24em]"
            style={{ color: chapter.palette.glow }}
          >
            {speaker}
          </span>
          <span className="ml-auto font-mono text-[10px] tabular-nums text-white/40">
            {chapter.number} · {chapter.title}
          </span>
        </div>

        <p className="min-h-[3.25rem] text-base leading-relaxed text-white/95 sm:min-h-[3.5rem] sm:text-lg">
          <span aria-hidden>{shown}</span>
          {typing && (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-pulse bg-white/70"
            />
          )}
        </p>

        {/* Announced once per cue, in full. */}
        <div key={`${chapter.id}-${cueIndex}`} className="sr-only" aria-live="polite">
          {speaker}: {cue.text}
        </div>

        <div className="mt-3 flex items-center gap-3">
          {/* cue progress pips */}
          <div className="flex flex-1 gap-1.5">
            {chapter.cues.map((c, i) => (
              <span
                key={c.t}
                className="h-[3px] flex-1 rounded-full transition-colors duration-500"
                style={{
                  background:
                    i < cueIndex || (i === cueIndex && !typing)
                      ? chapter.palette.glow
                      : i === cueIndex
                        ? "rgba(255,255,255,0.45)"
                        : "rgba(255,255,255,0.16)",
                }}
              />
            ))}
          </div>

          {finished ? (
            <span
              className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: chapter.palette.glow }}
            >
              The way is open
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white/50 hover:text-white"
            >
              <CornerDownRight className="h-3 w-3" />
              Skip line
              <kbd className="ml-1 hidden rounded border border-white/25 px-1 py-px text-[9px] text-white/50 lg:inline-block">
                Space
              </kbd>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
