"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useTransform } from "motion/react";
import { chapters, chapterCount } from "@/lib/story/script";
import { veilOpacity } from "@/lib/story/camera";
import { REACH_VW, gateX, hotspotWorldX } from "@/lib/story/world";
import { useWorld } from "@/lib/story/useWorld";
import { usePointerParallax } from "@/lib/story/usePointerParallax";
import { useNarration } from "@/lib/story/useNarration";
import { narrationBus } from "@/lib/story/audio";
import type { Hotspot as HotspotData } from "@/lib/story/types";
import { Scene, SceneForeground } from "./Scene";
import { Avatar } from "./Avatar";
import { DialogueBox } from "./DialogueBox";
import { ArtifactModal } from "./ArtifactModal";
import { AudioGate } from "./AudioGate";
import { StoryChrome } from "./StoryChrome";
import { Controls } from "./Controls";
import { ChapterPlate } from "./ChapterPlate";

/**
 * ROOT ORCHESTRATOR.
 *
 * The world is a fixed viewport, not a scrolling document. The character is the
 * source of truth; the camera chases them; every room's layers are positioned
 * from the camera. Nothing here is driven by the scrollbar, which is why the
 * story cannot be skipped by spinning the wheel.
 *
 * Layering is decided by DOM order plus one explicit z per pass, because a
 * room's dissolve (opacity < 1) creates a stacking context that would otherwise
 * trap the foreground behind the character:
 *
 *   z-0   room background passes (+ their hotspots)
 *   z-10  the character
 *   z-20  room foreground passes  <- occludes the character
 *   z-30  transition veil
 *   z-40  dialogue box
 *
 * Every full-bleed wrapper is pointer-events:none and only the real controls
 * opt back in — otherwise an invisible overlay eats every click meant for an
 * artifact.
 */
export function StoryExperience() {
  const [entered, setEntered] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [open, setOpen] = useState<HotspotData | null>(null);
  const [completed, setCompleted] = useState<ReadonlySet<number>>(new Set());
  const [nearId, setNearId] = useState<string | null>(null);

  const pointer = usePointerParallax();

  // The barrier: this room's narration must finish before the way opens.
  const gate = useCallback(
    (index: number) => (completed.has(index) ? null : gateX(index)),
    [completed],
  );

  const [gateFor, setGateFor] = useState<number | null>(gateX(0));

  const world = useWorld({
    count: chapterCount,
    gate: gateFor,
    locked: !entered || open !== null,
  });

  const { charX, camX, speed, chapterIndex, facing, walking, blocked, press, jumpTo } = world;
  const chapter = chapters[chapterIndex];

  const narration = useNarration(chapter, entered, completed.has(chapterIndex));
  const { cue, cueIndex, revealed, finished, skipLine } = narration;

  useEffect(() => {
    setGateFor(gate(chapterIndex));
  }, [gate, chapterIndex, completed]);

  // Finishing a chapter's narration unlocks the road onward.
  useEffect(() => {
    if (!finished || completed.has(chapterIndex)) return;
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(chapterIndex);
      return next;
    });
    narrationBus.sfx("unlock");
  }, [finished, chapterIndex, completed]);

  // Score follows the room.
  useEffect(() => {
    if (entered) narrationBus.setMood(chapter.ambientKey);
  }, [chapter.ambientKey, entered]);

  useEffect(() => () => narrationBus.dispose(), []);

  // The world owns the viewport while it is on screen.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Which artifact is within arm's reach. Read from a MotionValue in the frame
  // loop and committed to state only when the answer changes.
  const hotspots = chapter.hotspots;
  useAnimationFrame(() => {
    if (!entered) return;
    const x = charX.get();
    let best: string | null = null;
    let bestD = REACH_VW;
    for (const h of hotspots) {
      const d = Math.abs(hotspotWorldX(chapterIndex, h.x) - x);
      if (d < bestD) {
        bestD = d;
        best = h.id;
      }
    }
    setNearId((prev) => (prev === best ? prev : best));
  });

  const nearHotspot = useMemo(
    () => hotspots.find((h) => h.id === nearId) ?? null,
    [hotspots, nearId],
  );

  const examine = useCallback(() => {
    if (nearHotspot) {
      narrationBus.sfx("open");
      setOpen(nearHotspot);
    }
  }, [nearHotspot]);

  // Keyboard verbs. Movement lives in useWorld; these are the actions.
  useEffect(() => {
    if (!entered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "e" && !open) {
        e.preventDefault();
        examine();
      }
      if ((k === " " || k === "enter") && !open) {
        const target = e.target as HTMLElement | null;
        // Do not hijack Space from a button or a form field.
        if (target && /^(button|input|textarea|a|select)$/i.test(target.tagName)) return;
        e.preventDefault();
        skipLine();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered, open, examine, skipLine]);

  const blockedRef = useRef(false);
  useEffect(() => {
    if (blocked && !blockedRef.current) narrationBus.sfx("blocked");
    blockedRef.current = blocked;
  }, [blocked]);

  const enter = useCallback(async (withSound: boolean) => {
    if (withSound) {
      const ok = await narrationBus.unlock();
      narrationBus.setMuted(false);
      setSoundOn(ok);
    }
    setEntered(true);
  }, []);

  const closeModal = useCallback(() => {
    narrationBus.sfx("close");
    setOpen(null);
  }, []);

  const veil = useTransform(camX, veilOpacity);

  // Only the current room and its neighbours are mounted; the rest cost
  // nothing. Derived from the chapter index rather than recomputed every frame,
  // which would allocate two arrays sixty times a second for no benefit.
  const visible = useMemo(
    () =>
      chapters
        .map((_, i) => i)
        .filter((i) => Math.abs(i - chapterIndex) <= 1),
    [chapterIndex],
  );

  const maxUnlocked = useMemo(() => {
    let i = 0;
    while (i < chapterCount - 1 && completed.has(i)) i += 1;
    return i;
  }, [completed]);

  return (
    <>
      <div className="story-stage relative h-[100dvh] w-full overflow-hidden bg-[#0b0713]">
        {visible.map((i) => (
          <div key={chapters[i].id} className="pointer-events-none absolute inset-0 z-0">
            <Scene
              index={i}
              chapter={chapters[i]}
              camX={camX}
              pointer={pointer}
              nearId={i === chapterIndex ? nearId : null}
              gated={gateFor !== null && i === chapterIndex}
              onOpenHotspot={(h) => {
                narrationBus.sfx("open");
                setOpen(h);
              }}
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 z-10">
          <Avatar
            charX={charX}
            camX={camX}
            speed={speed}
            walking={walking}
            interacting={open !== null}
            facing={facing}
            palette={chapter.palette}
          />
        </div>

        {visible.map((i) => (
          <div
            key={`${chapters[i].id}-fore`}
            className="pointer-events-none absolute inset-0 z-20"
          >
            <SceneForeground
              index={i}
              chapter={chapters[i]}
              camX={camX}
              pointer={pointer}
            />
          </div>
        ))}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 bg-black"
          style={{ opacity: veil }}
        />

        {entered && <ChapterPlate key={chapter.id} chapter={chapter} />}

        {entered && (
          <DialogueBox
            chapter={chapter}
            cue={cue}
            cueIndex={cueIndex}
            revealed={revealed}
            finished={finished}
            onSkip={skipLine}
          />
        )}
      </div>

      {entered && (
        <>
          <StoryChrome
            activeIndex={chapterIndex}
            maxUnlocked={maxUnlocked}
            onJump={jumpTo}
            soundAvailable={soundOn}
          />
          <Controls
            palette={chapter.palette}
            blocked={blocked}
            onPress={press}
            hasReach={nearHotspot !== null && open === null}
            onExamine={examine}
          />
        </>
      )}

      <ArtifactModal data={open} palette={chapter.palette} onClose={closeModal} />

      <AnimatePresence>{!entered && <AudioGate key="gate" onEnter={enter} />}</AnimatePresence>
    </>
  );
}
