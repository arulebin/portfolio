"use client";

import type { ChapterId, ScenePalette } from "@/lib/story/types";
import { DEPTHS } from "@/lib/story/camera";
import { COVER_STYLE, r3, rand } from "./scenes/primitives";
import { ParallaxLayer } from "./parallax";

/**
 * AMBIENT LIFE.
 *
 * A world that only moves when you move is a diorama. These are the things that
 * keep going whether or not the character does: birds crossing the dawn, dust
 * turning in a shaft of window light, energy rising off the lab floor,
 * fireflies over the platform at dusk.
 *
 * All of it is CSS keyframes with per-element delays rather than JS animation.
 * Sixty drifting particles cost the compositor almost nothing and cost the main
 * thread literally nothing, which matters because the character is already
 * running a physics loop every frame.
 */

function Motes({
  count,
  color,
  seed,
  animation,
  sizeRange = [2, 5],
  duration = [9, 20],
  opacity = [0.25, 0.8],
  top = [10, 95],
}: {
  count: number;
  color: string;
  seed: number;
  animation: string;
  sizeRange?: [number, number];
  duration?: [number, number];
  opacity?: [number, number];
  top?: [number, number];
}) {
  return (
    <div className="absolute inset-y-0" style={COVER_STYLE}>
      {Array.from({ length: count }, (_, i) => {
        const s = seed + i * 13;
        const size = sizeRange[0] + rand(s) * (sizeRange[1] - sizeRange[0]);
        const dur = duration[0] + rand(s + 1) * (duration[1] - duration[0]);
        return (
          <span
            key={i}
            className={`absolute rounded-full ${animation}`}
            style={{
              left: `${r3(rand(s + 2) * 100)}%`,
              top: `${r3(top[0] + rand(s + 3) * (top[1] - top[0]))}%`,
              width: r3(size),
              height: r3(size),
              background: color,
              opacity: r3(opacity[0] + rand(s + 4) * (opacity[1] - opacity[0])),
              boxShadow: `0 0 ${r3(size * 3)}px ${color}`,
              animationDuration: `${r3(dur)}s`,
              animationDelay: `${r3(-rand(s + 5) * dur)}s`,
            }}
          />
        );
      })}
    </div>
  );
}

/** A silhouetted bird, wings beating, crossing the whole sky. */
function Birds({ color, count, seed }: { color: string; count: number; seed: number }) {
  return (
    <div className="absolute top-0 h-[45%]" style={COVER_STYLE}>
      {Array.from({ length: count }, (_, i) => {
        const s = seed + i * 29;
        const dur = 26 + rand(s) * 22;
        return (
          <svg
            key={i}
            viewBox="0 0 40 20"
            className="story-bird absolute"
            style={{
              top: `${r3(12 + rand(s + 1) * 62)}%`,
              width: r3(16 + rand(s + 2) * 16),
              animationDuration: `${r3(dur)}s`,
              animationDelay: `${r3(-rand(s + 3) * dur)}s`,
              opacity: r3(0.4 + rand(s + 4) * 0.4),
            }}
            aria-hidden
          >
            <path
              className="story-wing"
              d="M2 12 Q10 2 20 10 Q30 2 38 12"
              fill="none"
              stroke={color}
              strokeWidth="2.4"
              strokeLinecap="round"
              style={{ animationDelay: `${r3(-rand(s + 5) * 0.9)}s` }}
            />
          </svg>
        );
      })}
    </div>
  );
}

/** Slow cloud banks that drift regardless of where the camera is. */
function Clouds({ color, seed }: { color: string; seed: number }) {
  return (
    <div className="absolute top-0 h-[55%]" style={COVER_STYLE}>
      {Array.from({ length: 5 }, (_, i) => {
        const s = seed + i * 41;
        const dur = 70 + rand(s) * 90;
        return (
          <div
            key={i}
            className="story-drift absolute rounded-full blur-2xl"
            style={{
              top: `${r3(8 + rand(s + 1) * 60)}%`,
              width: `${r3(18 + rand(s + 2) * 26)}vw`,
              height: `${r3(4 + rand(s + 3) * 6)}vh`,
              background: color,
              opacity: r3(0.1 + rand(s + 4) * 0.16),
              animationDuration: `${r3(dur)}s`,
              animationDelay: `${r3(-rand(s + 5) * dur)}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export function AmbientLife({ id, palette }: { id: ChapterId; palette: ScenePalette }) {
  if (id === "intro") {
    return (
      <>
        <ParallaxLayer depth={DEPTHS.far} pointerStrength={0.4}>
          <Clouds color={palette.glow} seed={11} />
          <Birds color={palette.ink} count={7} seed={91} />
        </ParallaxLayer>
        <ParallaxLayer depth={DEPTHS.mid} pointerStrength={0.9}>
          <Motes count={22} color={palette.glow} seed={5} animation="story-float" top={[30, 90]} />
        </ParallaxLayer>
      </>
    );
  }

  if (id === "origin") {
    return (
      <ParallaxLayer depth={DEPTHS.mid} pointerStrength={0.9}>
        {/* dust turning in the window light */}
        <Motes
          count={40}
          color="#ffe6bd"
          seed={23}
          animation="story-float"
          sizeRange={[1.5, 3.5]}
          duration={[12, 26]}
          opacity={[0.18, 0.55]}
          top={[18, 88]}
        />
      </ParallaxLayer>
    );
  }

  if (id === "quests") {
    return (
      <>
        <ParallaxLayer depth={DEPTHS.mid} pointerStrength={0.9}>
          <Motes
            count={46}
            color={palette.glow}
            seed={37}
            animation="story-rise"
            sizeRange={[1.5, 4.5]}
            duration={[6, 15]}
            opacity={[0.3, 0.95]}
            top={[40, 100]}
          />
        </ParallaxLayer>
        <ParallaxLayer depth={DEPTHS.fore} pointerStrength={1.3}>
          <Motes
            count={12}
            color={palette.glow}
            seed={73}
            animation="story-rise"
            sizeRange={[3, 7]}
            duration={[5, 11]}
            opacity={[0.15, 0.4]}
            top={[55, 100]}
          />
        </ParallaxLayer>
      </>
    );
  }

  // contact - fireflies over the platform, and a last few clouds
  return (
    <>
      <ParallaxLayer depth={DEPTHS.far} pointerStrength={0.4}>
        <Clouds color={palette.glow} seed={53} />
      </ParallaxLayer>
      <ParallaxLayer depth={DEPTHS.mid} pointerStrength={0.9}>
        <Motes
          count={30}
          color="#ffe9a8"
          seed={67}
          animation="story-wander"
          sizeRange={[2, 4.5]}
          duration={[7, 16]}
          opacity={[0.35, 1]}
          top={[45, 92]}
        />
      </ParallaxLayer>
    </>
  );
}
