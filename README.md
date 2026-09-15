# Ebin A — Portfolio

A personal portfolio site in two modes: a fast, minimal/editorial single-page
app at `/`, and **Story Mode** at `/story` — an anime-inspired, avatar-led
adventure that walks a cel-shaded character through four chapters of the same
content, narrated like a storybook.

**Live:** https://ebinarul.web.app

## Tech stack

- **[Next.js 15](https://nextjs.org)** (App Router) + **React 19**
- **TypeScript**
- **[Tailwind CSS v4](https://tailwindcss.com)** with CSS-variable design tokens
- **[Motion](https://motion.dev)** for subtle scroll-reveal animations
- **[next-themes](https://github.com/pacocoursey/next-themes)** for light/dark mode
- **[lucide-react](https://lucide.dev)** for UI icons
- **Web Audio + `speechSynthesis`** for story-mode music and narration — no
  audio library and no audio files
- Static export (`output: "export"`) deployed on **[Firebase Hosting](https://firebase.google.com/docs/hosting)**

## Deploy

```
npm run build                 # writes the static site to out/
firebase deploy --only hosting
```

No GSAP and no Three.js: Motion's `useScroll` / `useVelocity` / `useTransform`
already cover the scroll camera, and the art direction is 2D.

## Design

Minimal, typography-led layout: a Fraunces serif for display headings, Inter for
body, and JetBrains Mono for code accents and the `<Ebin A/>` brand. A single
terracotta accent carries the palette, with a light-default theme and a dark
toggle. Animations respect `prefers-reduced-motion`.

## Project structure

```
app/
  layout.tsx        # fonts, metadata, theme provider
  (site)/           # the classic editorial site at "/"
    layout.tsx      #   ambient background + scroll furniture
    page.tsx        #   assembles the page sections
  story/            # story mode at "/story"
  globals.css       # Tailwind v4 + design tokens (light/dark)
components/         # nav, hero, work, about, skills, contact, footer, ...
  story/            # story engine: stage, scenes, avatar, dialogue, chrome
lib/
  projects.ts       # project data (referenced by stable `id`)
  skills.ts         # grouped skill data
  story/            # screenplay, asset manifest, camera + audio + rig
public/assets/      # images, project screenshots, icons
```

To edit content, update the data in [`lib/projects.ts`](lib/projects.ts) and
[`lib/skills.ts`](lib/skills.ts) — no component changes needed. Both modes read
the same data, so they can never disagree.

## Story mode

An avatar-led RPG at `/story`. You **walk** a cel-shaded character through four
rooms with the arrow keys; the camera follows, the world parallaxes in five
depth planes, and each room narrates a chapter of the portfolio.

Controls: `←` `→` or `A` `D` to walk · `E` to examine an artifact ·
`Space` to skip a line · mouse wheel and touch-drag also walk.

Everything the story renders comes from two files:

- [`lib/story/script.ts`](lib/story/script.ts) — the screenplay: chapters,
  narration lines, room palettes, and artifact positions. Projects are
  referenced by `id`, never re-described.
- [`lib/story/assets.ts`](lib/story/assets.ts) — the art manifest. **Every entry
  is nullable.** `null` means "no hand-made art yet, draw the procedural
  version", so the world runs today on generated cel-shaded art and painted art
  drops in one line at a time.

How it works:

- **The character is the source of truth, not the scrollbar.** `useWorld` runs a
  small velocity integrator (accelerate, exponential drag, integrate) that keys,
  wheel and touch all push on, so movement feels the same from every input.
  `useWorld` and `Avatar` write MotionValues only — walking the whole world
  costs zero React renders.
- **The story cannot be skipped.** A shimmering barrier closes each room until
  its narration finishes. Endless scrolling gets you a locked gate, not the end.
- **Audio is synthesised, not downloaded.** `lib/story/audio.ts` is a small
  Web Audio orchestra — sub bass, detuned saw pad, plucked arp, sine lead, noise
  percussion, and a convolution reverb built from a generated impulse — driven
  by a lookahead scheduler. Each room has its own key, tempo and instrument mix.
  Narration is spoken by `speechSynthesis`, and its `onboundary` events drive
  the caption typewriter so text tracks the voice. **Zero audio files.**
- **The avatar is a rigged SVG.** `lib/story/rig.ts` defines named parts and
  joint origins; the walk cycle is written against those names only. An
  illustrator's SVG with matching part ids replaces the placeholder without
  touching animation code. Hand-off spec is in `PlaceholderRig.tsx`.
- Reduced motion, an always-visible escape hatch back to `/`, native `<dialog>`
  for artifacts, on-screen controls for touch, and an sr-only linear transcript
  of all four chapters.

---

© Ebin A
