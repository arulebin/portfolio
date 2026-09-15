"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Volume2, VolumeX } from "lucide-react";
import { narrationBus } from "@/lib/story/audio";
import { chapters } from "@/lib/story/script";

/**
 * Persistent chrome: the escape hatch, the sound toggle, and chapter jumps.
 *
 * The "classic portfolio" link is always visible on purpose. An immersive
 * experience that traps someone who just wanted to read a CV is a failed
 * experience — and a recruiter with thirty seconds should never have to hunt
 * for the exit.
 */
export function StoryChrome({
  activeIndex,
  maxUnlocked,
  onJump,
  soundAvailable,
}: {
  activeIndex: number;
  /** Highest chapter reached. Later rooms cannot be jumped to. */
  maxUnlocked: number;
  onJump: (index: number) => void;
  soundAvailable: boolean;
}) {
  const [muted, setMuted] = useState(narrationBus.muted);

  useEffect(() => narrationBus.subscribe(() => setMuted(narrationBus.muted)), []);

  return (
    <>
      {/* escape hatch */}
      <Link
        href="/"
        className="group fixed left-4 top-4 z-40 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3.5 py-2 text-xs text-white/75 backdrop-blur transition-colors hover:border-white/45 hover:text-white sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Classic portfolio
      </Link>

      {soundAvailable && (
        <button
          type="button"
          onClick={() => narrationBus.setMuted(!muted)}
          aria-pressed={muted}
          aria-label={muted ? "Unmute narration" : "Mute narration"}
          className="fixed right-4 top-4 z-40 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/75 backdrop-blur transition-colors hover:border-white/45 hover:text-white sm:right-6 sm:top-6"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}

      {/* chapter jumps */}
      <nav
        aria-label="Chapters"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 sm:right-6 sm:flex"
      >
        {chapters.map((c, i) => {
          const active = i === activeIndex;
          const locked = i > maxUnlocked;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => !locked && onJump(i)}
              disabled={locked}
              aria-current={active ? "step" : undefined}
              aria-label={locked ? `${c.title} — not reached yet` : `Go to ${c.title}`}
              className="group relative flex items-center justify-end gap-2.5 disabled:cursor-not-allowed"
            >
              <span className="pointer-events-none flex items-center gap-1.5 whitespace-nowrap rounded-md border border-white/15 bg-black/70 px-2.5 py-1 text-[11px] text-white/85 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {locked && <Lock className="h-3 w-3 text-white/50" />}
                {c.number} · {c.title}
              </span>
              <span
                className="block h-2.5 w-2.5 rounded-full border transition-all duration-300"
                style={{
                  background: active ? c.palette.glow : "transparent",
                  borderColor: active
                    ? c.palette.glow
                    : locked
                      ? "rgba(255,255,255,0.16)"
                      : "rgba(255,255,255,0.4)",
                  transform: active ? "scale(1.35)" : "scale(1)",
                  boxShadow: active ? `0 0 12px ${c.palette.glow}` : "none",
                }}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
}
