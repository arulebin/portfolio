"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import type { ScenePalette } from "@/lib/story/types";

/**
 * Controls and feedback.
 *
 * On desktop this is a quiet legend. On touch it becomes the actual movement
 * input — big thumb targets held down, feeding the same velocity integrator the
 * arrow keys do, so there is only ever one movement code path.
 */
export function Controls({
  palette,
  blocked,
  onPress,
  hasReach,
  onExamine,
}: {
  palette: ScenePalette;
  blocked: boolean;
  onPress: (dir: "left" | "right", down: boolean) => void;
  hasReach: boolean;
  onExamine: () => void;
}) {
  const hold = (dir: "left" | "right") => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      onPress(dir, true);
    },
    onPointerUp: () => onPress(dir, false),
    onPointerLeave: () => onPress(dir, false),
    onPointerCancel: () => onPress(dir, false),
  });

  return (
    <>
      {/* "the path is blocked" — the reason you cannot skip the story */}
      <AnimatePresence>
        {blocked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.28 }}
            className="pointer-events-none fixed left-1/2 top-[22%] z-40 -translate-x-1/2"
          >
            <div
              className="flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm backdrop-blur"
              style={{
                borderColor: palette.glow,
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
              }}
            >
              <Lock className="h-4 w-4" style={{ color: palette.glow }} />
              Hear the rest of the story before you go on
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* desktop legend */}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-4 rounded-full border border-white/10 bg-black/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 backdrop-blur lg:flex">
        <span className="flex items-center gap-1.5">
          <Key>←</Key>
          <Key>→</Key>
          Walk
        </span>
        <span className="flex items-center gap-1.5">
          <Key>E</Key>
          Examine
        </span>
        <span className="flex items-center gap-1.5">
          <Key>Space</Key>
          Skip line
        </span>
      </div>

      {/* touch movement */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-between px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] lg:hidden">
        <button
          type="button"
          aria-label="Walk left"
          {...hold("left")}
          className="pointer-events-auto flex h-16 w-16 touch-none select-none items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/80 backdrop-blur active:bg-white/20"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        {hasReach && (
          <button
            type="button"
            onClick={onExamine}
            className="pointer-events-auto mb-1 flex h-14 items-center gap-2 rounded-full border px-5 text-sm font-medium backdrop-blur"
            style={{
              borderColor: palette.glow,
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
            }}
          >
            Examine
          </button>
        )}

        <button
          type="button"
          aria-label="Walk right"
          {...hold("right")}
          className="pointer-events-auto flex h-16 w-16 touch-none select-none items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/80 backdrop-blur active:bg-white/20"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
    </>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/70">
      {children}
    </kbd>
  );
}
