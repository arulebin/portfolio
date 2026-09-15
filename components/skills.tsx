import { Section, SectionLabel } from "./section";
import { Reveal, Stagger, RevealItem } from "./reveal";
import { skillGroups } from "@/lib/skills";

// Flattened, de-duplicated stack for the marquee band.
const marqueeItems = Array.from(
  new Set(skillGroups.flatMap((g) => g.items)),
);

export function Skills() {
  return (
    <Section id="skills">
      <SectionLabel index="05">Skills</SectionLabel>

      <Reveal>
        <h2 className="mb-12 max-w-xl font-serif text-3xl font-light tracking-tight sm:text-4xl">
          The tools I reach for.
        </h2>
      </Reveal>

      <div className="space-y-10">
        {skillGroups.map((group, i) => (
          <Reveal key={group.label} delay={i * 0.06}>
            <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-[160px_1fr]">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {group.label}
              </h3>
              <Stagger className="flex flex-wrap gap-2.5" gap={0.04}>
                {group.items.map((item) => (
                  <RevealItem key={item}>
                    <span className="inline-block cursor-default rounded-lg border border-border bg-card px-3.5 py-1.5 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-md hover:shadow-accent/10">
                      {item}
                    </span>
                  </RevealItem>
                ))}
              </Stagger>
            </div>
          </Reveal>
        ))}
      </div>

      {/* kinetic marquee band */}
      <Reveal delay={0.1}>
        <div
          className="relative mt-14 flex overflow-hidden border-y border-border py-5"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <div className="marquee-track flex shrink-0 items-center gap-8 pr-8">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex items-center gap-8 whitespace-nowrap font-serif text-xl font-light text-muted"
              >
                {item}
                <span className="text-accent">•</span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
