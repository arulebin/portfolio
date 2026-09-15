import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Story Mode — Ebin A",
  description:
    "An interactive, avatar-led portfolio in four chapters: the intro, the origin, the quests, and the next adventure.",
  alternates: {
    // The classic site stays the indexed, canonical page. Story mode is a
    // richer view of the same content, not a second copy of it.
    canonical: "/",
  },
  openGraph: {
    title: "Story Mode — Ebin A",
    description: "An interactive portfolio in four chapters.",
    url: "/story",
    type: "website",
  },
};

/**
 * `dark` is set here rather than left to next-themes: the story's scenes are
 * lit at night regardless of the visitor's site preference, and the UI chrome
 * (modal, form, buttons) needs the dark token set so it sits in the same world
 * as the art. The `@custom-variant dark` in globals.css matches `.dark *`, so
 * a wrapper element is enough — no theme flip required.
 */
export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return <div className="dark bg-[#0b0713] text-foreground">{children}</div>;
}
