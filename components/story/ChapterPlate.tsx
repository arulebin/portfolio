"use client";

import type { Chapter } from "@/lib/story/types";

/**
 * The room's name card.
 *
 * Deliberately viewport-anchored rather than painted into the world: when it
 * lived on a parallax plane, walking past it left the title sliced in half
 * against the screen edge. It announces the room, then gets out of the way —
 * the fade-out is a pure CSS animation keyed on the chapter, so re-entering a
 * room replays it with no timers to manage.
 */
export function ChapterPlate({ chapter }: { chapter: Chapter }) {
  return (
    <div
      className="story-plate pointer-events-none absolute left-[6%] top-[12%] z-30 max-w-[80vw] sm:max-w-[46vw]"
      aria-hidden
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.3em] sm:text-[11px]"
        style={{ color: chapter.palette.glow }}
      >
        Chapter {chapter.number}
      </p>
      <h2 className="mt-1.5 font-serif text-3xl font-light leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] sm:text-5xl">
        {chapter.title}
      </h2>
      <p className="mt-1 text-sm text-white/65 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] sm:text-base">
        {chapter.subtitle}
      </p>
    </div>
  );
}
