import type { Chapter } from "./types";
import { skillGroups } from "@/lib/skills";

/**
 * THE SCREENPLAY — the single source of truth for story mode.
 *
 * Content rules:
 *  - Projects are referenced by `projectId` against `lib/projects.ts`. Never
 *    copy project prose in here; it would fork on the next edit.
 *  - `cues[].t` are seconds. When real voiceover is recorded, re-time these to
 *    the waveform; nothing else has to change.
 */

export const SCENE_VH = 165;
/** How far the avatar is allowed to drift, in vw, before the world takes over. */
export const AVATAR_DRIFT = 14;

export const chapters: Chapter[] = [
  {
    id: "intro",
    number: "01",
    title: "The Intro",
    subtitle: "Where the story starts",
    ambientKey: "dawn",
    palette: {
      sky: ["#2b1b3d", "#f4a26b"],
      far: "#5b3f63",
      mid: "#3d2a4a",
      near: "#2a1c33",
      ground: "#1a1020",
      glow: "#ffb877",
      ink: "#150d1c",
    },
    avatarPath: { from: 44, to: 56 },
    cues: [
      { t: 0.0, speaker: "avatar", text: "Hey there. Welcome to my world." },
      { t: 3.4, speaker: "avatar", text: "I'm Ebin — I build things for the web." },
      { t: 7.2, speaker: "narrator", text: "The sun is coming up. It seems like a good place to begin." },
      { t: 11.4, speaker: "avatar", text: "Let me tell you how it started. Keep scrolling." },
    ],
    hotspots: [],
  },

  {
    id: "origin",
    number: "02",
    title: "The Origin",
    subtitle: "Where it was learned",
    ambientKey: "room",
    palette: {
      sky: ["#3a2418", "#7a4a2c"],
      far: "#4a2f1e",
      mid: "#5c3a24",
      near: "#3d2617",
      ground: "#241610",
      glow: "#ffc46b",
      ink: "#1a0f0a",
    },
    avatarPath: { from: 40, to: 58 },
    cues: [
      { t: 0.0, speaker: "narrator", text: "This is the room where most of it actually happened." },
      { t: 4.2, speaker: "avatar", text: "I'm a Computer Science student at St. Xavier's Catholic College of Engineering." },
      { t: 9.6, speaker: "avatar", text: "And right now I'm interning at Flutter Frog, working across mobile and web." },
      { t: 15.0, speaker: "avatar", text: "Have a look around — everything in here taught me something." },
    ],
    hotspots: [
      {
        id: "desk",
        kind: "lore",
        x: 0.2,
        y: 0.6,
        label: "A worn study desk",
        title: "Education",
        body: "B.E. Computer Science at St. Xavier's Catholic College of Engineering. A solid foundation in programming, and the place I found out I actually liked the web.",
      },
      {
        id: "laptop",
        kind: "lore",
        x: 0.44,
        y: 0.52,
        label: "A glowing laptop",
        title: "Currently",
        body: "Software intern at Flutter Frog, building mobile and web apps. Hands-on work across several products — the fastest I've ever learned.",
      },
      {
        id: "shelf",
        kind: "lore",
        x: 0.72,
        y: 0.44,
        label: "A crowded bookshelf",
        title: "The Toolkit",
        body: "Picked up one problem at a time, not one tutorial at a time.",
        // Sourced from lib/skills.ts so the shelf can never drift from the site.
        items: skillGroups.flatMap((g) => g.items),
      },
      {
        id: "window",
        kind: "lore",
        x: 0.88,
        y: 0.34,
        label: "A window onto the street",
        title: "Focus",
        body: "Web development, problem solving, and shipping things people actually use. My goal is simple: contribute to thoughtful projects and keep growing.",
      },
    ],
  },

  {
    id: "quests",
    number: "03",
    title: "The Quests",
    subtitle: "Where it was tested",
    ambientKey: "lab",
    palette: {
      sky: ["#04141c", "#0b3a4a"],
      far: "#0d3d4e",
      mid: "#10505f",
      near: "#092b38",
      ground: "#04161d",
      glow: "#5eead4",
      ink: "#02090d",
    },
    avatarPath: { from: 38, to: 60 },
    cues: [
      { t: 0.0, speaker: "narrator", text: "Every project here started as a problem he couldn't put down." },
      { t: 4.8, speaker: "avatar", text: "Some of these run for thousands of people. Some I built just to see how things work." },
      { t: 10.2, speaker: "avatar", text: "They all cost something, and they all left something behind." },
      { t: 15.0, speaker: "narrator", text: "Touch an artifact to see what it holds." },
    ],
    hotspots: [
      { id: "a-redstar", kind: "project", projectId: "redstar", x: 0.14, y: 0.38, label: "A red star, still counting" },
      { id: "a-veby", kind: "project", projectId: "veby", x: 0.28, y: 0.6, label: "A delivery crate, warm" },
      { id: "a-quika", kind: "project", projectId: "quika", x: 0.4, y: 0.33, label: "A map pin, pulsing" },
      { id: "a-diocese", kind: "project", projectId: "diocese-registry", x: 0.52, y: 0.58, label: "A ledger, recovered" },
      { id: "a-iris", kind: "project", projectId: "iris", x: 0.63, y: 0.36, label: "A sealed letter, glowing violet" },
      { id: "a-warden", kind: "project", projectId: "warden", x: 0.74, y: 0.61, label: "A small shield, keeping watch" },
      { id: "a-lcv", kind: "project", projectId: "leetcode-visualizer", x: 0.85, y: 0.37, label: "A grid that fills itself in" },
      { id: "a-agri", kind: "project", projectId: "agribiotrace", x: 0.94, y: 0.59, label: "A seedling under glass" },
    ],
  },

  {
    id: "contact",
    number: "04",
    title: "The Next Adventure",
    subtitle: "Where it goes from here",
    ambientKey: "dusk",
    palette: {
      sky: ["#170f2e", "#6b3a6e"],
      far: "#2c1d4a",
      mid: "#3d2757",
      near: "#241640",
      ground: "#120b23",
      glow: "#ff8fb1",
      ink: "#0b0618",
    },
    avatarPath: { from: 42, to: 52 },
    cues: [
      { t: 0.0, speaker: "narrator", text: "The last platform. The light is going, but the train is still running." },
      { t: 5.0, speaker: "avatar", text: "That's the story so far." },
      { t: 7.8, speaker: "avatar", text: "The good part is the chapter I haven't written yet." },
      { t: 12.0, speaker: "avatar", text: "The story doesn't end here. Let's build the next one together — drop me a message." },
    ],
    hotspots: [
      {
        id: "mailbox",
        kind: "contact",
        x: 0.26,
        y: 0.58,
        label: "A station mailbox",
        title: "Send a letter",
        body: "Have a project, a role, or just want to say hi? My inbox is always open — I'll get back to you.",
      },
    ],
  },
];

export const chapterCount = chapters.length;

export function chapterAt(stage: number) {
  const index = Math.min(Math.max(Math.floor(stage), 0), chapterCount - 1);
  return { index, chapter: chapters[index], local: Math.min(Math.max(stage - index, 0), 1) };
}
