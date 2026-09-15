"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motionValue, useAnimationFrame, useReducedMotion } from "motion/react";
import {
  ACCEL,
  CAM_EDGE,
  CAM_FOLLOW,
  FRICTION,
  ROOM_VW,
  WALK_SPEED,
  WHEEL_IMPULSE,
  chapterFromX,
  clamp,
  roomStart,
  totalWidth,
} from "./world";

type Facing = 1 | -1;

/**
 * MOVEMENT.
 *
 * A tiny physics integrator: held input accelerates, exponential drag decays,
 * position integrates, camera chases. Running it myself rather than borrowing
 * the browser's scroll curve is what makes the motion smooth and consistent
 * across keyboard, wheel and touch — they all just push on the same velocity.
 *
 * Position and camera live in MotionValues and never enter React state, so a
 * walk across the world costs zero renders. Only genuinely discrete facts —
 * which chapter, walking or not, which artifact is in reach — are state.
 */
export function useWorld({
  count,
  gate,
  locked,
}: {
  count: number;
  /** World X the character cannot pass yet, or null when the path is open. */
  gate: number | null;
  /** Freeze input (modal open, gate screen up). */
  locked: boolean;
}) {
  const reduce = useReducedMotion();

  const charX = useRef(motionValue(roomStart(0) + 34)).current;
  const camX = useRef(motionValue(roomStart(0) + 34)).current;
  const speed = useRef(motionValue(0)).current;

  const vel = useRef(0);
  const keys = useRef({ left: false, right: false });
  const impulse = useRef(0);
  const touch = useRef<{ x: number; last: number } | null>(null);
  const blockedUntil = useRef(0);

  const [chapterIndex, setChapterIndex] = useState(0);
  const [facing, setFacing] = useState<Facing>(1);
  const [walking, setWalking] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const world = totalWidth(count);

  // Input handlers are registered once, so they read `locked` through a ref
  // rather than closing over a stale value.
  const lockedRef = useRef(locked);
  lockedRef.current = locked;

  /**
   * Movement input must never be stolen from a text field or from the open
   * artifact dialog — arrow keys belong to the contact form's textarea while it
   * has focus, and the wheel belongs to the modal's own scroller.
   */
  const inputBusy = (target: EventTarget | null) => {
    if (lockedRef.current) return true;
    const el = target as HTMLElement | null;
    if (!el || !el.tagName) return false;
    if (/^(input|textarea|select)$/i.test(el.tagName)) return true;
    return typeof el.closest === "function" && el.closest("dialog[open]") !== null;
  };

  // ── input ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (inputBusy(e.target)) return;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") {
        keys.current.left = true;
        e.preventDefault();
      }
      if (k === "arrowright" || k === "d") {
        keys.current.right = true;
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") keys.current.left = false;
      if (k === "arrowright" || k === "d") keys.current.right = false;
    };
    // Keys can stick if focus leaves mid-press (alt-tab, devtools).
    const clear = () => {
      keys.current.left = false;
      keys.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Vertical wheel walks the character; the page itself never scrolls.
      // Inside the open dialog the wheel belongs to the dialog.
      if (inputBusy(e.target)) return;
      impulse.current += e.deltaY * WHEEL_IMPULSE;
      e.preventDefault();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const start = (e: TouchEvent) => {
      if (inputBusy(e.target)) return;
      touch.current = { x: e.touches[0].clientX, last: e.touches[0].clientX };
    };
    const move = (e: TouchEvent) => {
      if (!touch.current) return;
      const x = e.touches[0].clientX;
      const dx = touch.current.last - x;
      touch.current.last = x;
      impulse.current += (dx / window.innerWidth) * 100 * 1.6;
    };
    const end = () => {
      touch.current = null;
    };
    window.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", end, { passive: true });
    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
  }, []);

  /** Used by on-screen buttons on touch devices. */
  const press = useCallback((dir: "left" | "right", isDown: boolean) => {
    keys.current[dir] = isDown;
  }, []);

  /** Chapter jump — a smooth walk-to rather than a cut. */
  const jumpTo = useCallback(
    (index: number) => {
      const target = roomStart(index) + ROOM_VW * 0.18;
      const from = charX.get();
      const startedAt = performance.now();
      const duration = Math.min(1400, 260 + Math.abs(target - from) * 3.2);
      const step = () => {
        const t = Math.min(1, (performance.now() - startedAt) / duration);
        const eased = t * t * (3 - 2 * t);
        charX.set(from + (target - from) * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      if (reduce) charX.set(target);
      else requestAnimationFrame(step);
    },
    [charX, reduce],
  );

  // ── integration ─────────────────────────────────────────────────────────
  useAnimationFrame((_, deltaMs) => {
    const dt = Math.min(deltaMs, 50) / 1000;

    if (locked) {
      vel.current = 0;
      impulse.current = 0;
    } else {
      const dir = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0);
      if (dir !== 0) vel.current += dir * ACCEL * dt;
      vel.current += impulse.current;
      impulse.current = 0;
      vel.current *= Math.exp(-FRICTION * dt);
      vel.current = clamp(vel.current, -WALK_SPEED, WALK_SPEED);
    }

    const limit = gate ?? world - 6;
    const next = clamp(charX.get() + vel.current * dt, 6, Math.min(limit, world - 6));

    // Hitting a wall kills momentum instead of grinding against it. The hit is
    // LATCHED for a moment, because the same frame that detects it also zeroes
    // the velocity: an unlatched flag is true for exactly one frame and the
    // "path is blocked" message never gets a chance to appear.
    if (gate !== null && next >= limit - 0.5 && vel.current > 0) {
      blockedUntil.current = performance.now() + 1500;
    }
    if (next === charX.get() && Math.abs(vel.current) > 0.4) vel.current = 0;
    charX.set(next);
    const hitLimit = performance.now() < blockedUntil.current;

    const s = Math.abs(vel.current);
    speed.set(s);

    // Camera chase, framed away from the world's edges.
    const target = clamp(next, CAM_EDGE, Math.max(CAM_EDGE, world - CAM_EDGE));
    camX.set(reduce ? target : camX.get() + (target - camX.get()) * Math.min(1, dt * CAM_FOLLOW));

    // Discrete facts only.
    const isWalking = s > 1.2;
    setWalking((p) => (p === isWalking ? p : isWalking));
    if (isWalking) setFacing(vel.current > 0 ? 1 : -1);
    setBlocked((p) => (p === hitLimit ? p : hitLimit));

    const idx = chapterFromX(next, count);
    setChapterIndex((p) => (p === idx ? p : idx));
  });

  return { charX, camX, speed, chapterIndex, facing, walking, blocked, press, jumpTo };
}
