"use client";

import { useEffect, useRef } from "react";
import {  } from "motion/react";
import { narrationBus } from "@/lib/story/audio";
import type { Hotspot as HotspotData, ScenePalette } from "@/lib/story/types";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

/**
 * An interactive point in the world.
 *
 * RPG interaction model: the artifact glows from across the room, but only
 * becomes *actionable* once the character has actually walked over to it, at
 * which point it grows a "Press E" prompt. Walking somewhere to touch a thing
 * is the difference between a world and a menu.
 *
 * It is a real <button>, so it is tab-reachable, focus-ringed, announced, and
 * fires on Enter/Space with no extra work — mouse users can still just click it.
 */
export function Hotspot({
  data,
  palette,
  inReach,
  onOpen,
}: {
  data: HotspotData;
  palette: ScenePalette;
  inReach: boolean;
  onOpen: (data: HotspotData) => void;
}) {
  const reduce = useReducedMotionSafe();
  const wasInReach = useRef(false);

  // A small chime the moment an artifact comes within reach.
  useEffect(() => {
    if (inReach && !wasInReach.current) narrationBus.sfx("hover");
    wasInReach.current = inReach;
  }, [inReach]);

  return (
    <button
      type="button"
      onClick={() => onOpen(data)}
      aria-label={`${data.label} — open details`}
      data-in-reach={inReach ? "true" : "false"}
      className="group pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{
        left: `${data.x * 100}%`,
        top: `${data.y * 100}%`,
        outlineColor: palette.glow,
      }}
    >
      {/* pulse ring */}
      {!reduce && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${palette.glow}`,
            animation: "pulse-ring 2.4s ease-out infinite",
          }}
        />
      )}

      {/* core - swells once the character is close enough to act */}
      <span
        className="relative block rounded-full transition-all duration-300 group-hover:scale-125 group-focus-visible:scale-125"
        style={{
          width: inReach ? 34 : 24,
          height: inReach ? 34 : 24,
          background: `radial-gradient(circle at 35% 30%, #fff 0%, ${palette.glow} 45%, transparent 72%)`,
          boxShadow: `0 0 ${inReach ? 30 : 16}px ${inReach ? 8 : 4}px ${palette.glow}`,
        }}
      />

      {/* label, always on hover/focus */}
      <span className="pointer-events-none absolute left-1/2 top-full mt-3 w-max max-w-[42vw] -translate-x-1/2 rounded-lg border border-white/15 bg-black/75 px-3 py-1.5 text-xs text-white/90 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        {data.label}
      </span>

      {/* action prompt, only within reach */}
      <span
        className="pointer-events-none absolute bottom-full left-1/2 mb-4 flex w-max -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium whitespace-nowrap transition-all duration-300"
        style={{
          borderColor: palette.glow,
          background: "rgba(0,0,0,0.72)",
          color: "#fff",
          opacity: inReach ? 1 : 0,
          transform: `translate(-50%, ${inReach ? "0" : "6px"})`,
        }}
      >
        <kbd
          className="rounded border px-1.5 py-0.5 font-mono text-[10px]"
          style={{ borderColor: palette.glow, color: palette.glow }}
        >
          E
        </kbd>
        Examine
      </span>
    </button>
  );
}
