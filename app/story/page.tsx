import { StoryExperience } from "@/components/story/StoryExperience";
import { chapters } from "@/lib/story/script";

/**
 * Story mode.
 *
 * The narration is rendered into the DOM as real text below the experience
 * (visually hidden), so the route is not an empty canvas to a crawler and the
 * whole story is readable by assistive tech in linear order without scrolling
 * through four chapters of parallax.
 */
export default function StoryPage() {
  return (
    <>
      <StoryExperience />

      <div className="sr-only">
        <h1>Ebin A — an interactive portfolio in four chapters</h1>
        {chapters.map((chapter) => (
          <section key={chapter.id}>
            <h2>
              Chapter {chapter.number}: {chapter.title}
            </h2>
            {chapter.cues.map((cue) => (
              <p key={cue.t}>{cue.text}</p>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
