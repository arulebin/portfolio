"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * `prefers-reduced-motion`, safe to branch markup on.
 *
 * Motion's own `useReducedMotion()` returns `null` on the server and the real
 * preference on the first client render, so any component that renders
 * differently under reduced motion hydrates against different HTML than the
 * server sent. Here the server snapshot is always `false`; React uses it for the
 * hydration pass and then re-renders with the real value.
 *
 * The consequence for callers: an entrance animation's `initial` state is
 * committed before the real value is known. A reduced-motion branch must
 * therefore move the element to its final state (with a zero-length
 * transition), not simply omit the animation — or it stays hidden.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
