"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnimationFrame, useReducedMotion } from "motion/react";
import { narrationBus } from "./audio";
import type { Chapter } from "./types";

/** Reading pace for the no-speech fallback. */
const WORD_BASE_S = 0.17;
const WORD_PER_CHAR_S = 0.043;
/** Extra beat after a comma / full stop, so the fallback still has rhythm. */
const PUNCT_PAUSE_S = 0.28;
/** Gap between lines. */
const CUE_GAP_S = 0.45;

type Word = { index: number; at: number };

/**
 * Split a line into word-start character offsets with a predicted timestamp
 * for each. The character offsets are exactly what `speechSynthesis`
 * `onboundary` reports, so the spoken path and the silent path reveal text at
 * the same granularity and the component consuming them cannot tell which is
 * running.
 */
function planWords(text: string): { words: Word[]; total: number } {
  const words: Word[] = [];
  let at = 0;
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    words.push({ index: m.index, at });
    at += WORD_BASE_S + m[0].length * WORD_PER_CHAR_S;
    if (/[,;:]$/.test(m[0])) at += PUNCT_PAUSE_S * 0.6;
    if (/[.!?]$/.test(m[0])) at += PUNCT_PAUSE_S;
  }
  return { words, total: at };
}

/**
 * NARRATION.
 *
 * Owns one line at a time: speaks it (or times it), reveals it word by word,
 * advances to the next, and reports when the chapter has finished talking —
 * which is what unlocks the gate at the end of the room.
 *
 * `revealed` is a character count updated once per word, not per frame, so the
 * typewriter costs a handful of renders per line rather than sixty a second.
 */
export function useNarration(chapter: Chapter, active: boolean, alreadySeen: boolean) {
  const reduce = useReducedMotion();

  const [cueIndex, setCueIndex] = useState(0);
  const [revealed, setRevealed] = useState(0);
  // Bound to a chapter id, not a boolean: a bare flag outlives its chapter by
  // one render, and that was long enough to auto-unlock the next room's gate.
  const [finishedId, setFinishedId] = useState<string | null>(null);
  // Walking back into a room you have already heard should not restart the
  // narration at you. It settles on the last line, silently.
  const seen = useRef(alreadySeen);
  seen.current = alreadySeen;

  const cue = chapter.cues[cueIndex];
  const plan = useMemo(() => planWords(cue?.text ?? ""), [cue?.text]);

  const startedAt = useRef(0);
  const spoken = useRef(false);
  const advancing = useRef(false);
  const lineDone = useRef(false);

  const advance = useCallback(() => {
    if (advancing.current) return;
    advancing.current = true;
    window.setTimeout(
      () => {
        advancing.current = false;
        setCueIndex((i) => {
          if (i >= chapter.cues.length - 1) {
            setFinishedId(chapter.id);
            return i;
          }
          return i + 1;
        });
      },
      reduce ? 0 : CUE_GAP_S * 1000,
    );
  }, [chapter.cues.length, chapter.id, reduce]);

  // Restart whenever the chapter changes or it first takes the stage.
  useEffect(() => {
    if (!active) return;
    narrationBus.cancelSpeech();
    advancing.current = false;

    if (seen.current) {
      const last = chapter.cues.length - 1;
      setCueIndex(last);
      setRevealed(chapter.cues[last]?.text.length ?? 0);
      setFinishedId(chapter.id);
      lineDone.current = true;
      return;
    }

    setCueIndex(0);
    setRevealed(0);
    setFinishedId(null);
  }, [chapter.id, chapter.cues, active]);

  // Start each line: try to speak it, fall back to the reading timer.
  useEffect(() => {
    if (!active || !cue || seen.current) return;
    lineDone.current = false;
    startedAt.current = performance.now();
    setRevealed(reduce ? cue.text.length : 0);

    spoken.current = narrationBus.speak(cue.text, cue.speaker === "narrator", {
      onBoundary: (charIndex) => setRevealed(charIndex + 1),
      onEnd: () => {
        setRevealed(cue.text.length);
        lineDone.current = true;
        advance();
      },
    });

    if (reduce && !spoken.current) {
      lineDone.current = true;
      advance();
    }
  }, [cue, active, reduce, advance]);

  // The silent path, plus a watchdog over the spoken one.
  useAnimationFrame(() => {
    if (!active || !cue || lineDone.current || reduce) return;

    const elapsed = (performance.now() - startedAt.current) / 1000;

    if (spoken.current) {
      // speechSynthesis can die silently — muted mid-line, a tab backgrounded,
      // an engine that never fires `end`. Without this the chapter would never
      // report finished and the gate would never open.
      if (elapsed > plan.total * 2.5 + 5) {
        setRevealed(cue.text.length);
        lineDone.current = true;
        advance();
      }
      return;
    }

    let next = 0;
    for (let i = 0; i < plan.words.length; i += 1) {
      if (plan.words[i].at <= elapsed) {
        const w = plan.words[i];
        // Reveal through the end of this word.
        const after = cue.text.indexOf(" ", w.index);
        next = after === -1 ? cue.text.length : after;
      }
    }
    setRevealed((prev) => (prev === next ? prev : next));

    if (elapsed >= plan.total) {
      setRevealed(cue.text.length);
      lineDone.current = true;
      advance();
    }
  });

  /** Skip exactly one line. */
  const skipLine = useCallback(() => {
    if (!cue) return;
    narrationBus.cancelSpeech();
    setRevealed(cue.text.length);
    lineDone.current = true;
    advance();
  }, [cue, advance]);

  useEffect(() => () => narrationBus.cancelSpeech(), []);

  return {
    cue,
    cueIndex,
    revealed,
    finished: finishedId === chapter.id,
    skipLine,
    isLastCue: cueIndex >= chapter.cues.length - 1,
  };
}
