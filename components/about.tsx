import { Section, SectionLabel } from "./section";
import { Reveal, Stagger, RevealItem } from "./reveal";

const highlights = [
  {
    label: "Education",
    value:
      "B.E. Computer Science — St. Xavier's Catholic College of Engineering",
  },
  {
    label: "Currently",
    value: "Software intern at Flutter Frog, building mobile & web apps",
  },
  {
    label: "Focus",
    value: "Web development, problem solving, and shipping usable products",
  },
];

export function About() {
  return (
    <Section id="about">
      <SectionLabel index="04">About</SectionLabel>

      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted">
            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              A developer who likes to keep learning.
            </h2>
            <p>
              I&apos;m a Computer Science student with a solid foundation in
              programming and a real soft spot for the web. I spend my time
              exploring new technologies and sharpening how I build.
            </p>
            <p>
              Right now I&apos;m interning at{" "}
              <span className="text-foreground">Flutter Frog</span>, where I work
              across several apps and get hands-on experience in mobile and web
              development. I enjoy untangling complex problems and turning them
              into creative, practical solutions.
            </p>
            <p>
              My goal is simple: contribute to thoughtful projects, keep growing,
              and be part of a team that ships things people actually use.
            </p>
          </div>
        </Reveal>

        <Stagger className="space-y-4" delay={0.1}>
          {highlights.map((item) => (
            <RevealItem key={item.label}>
              <div className="group relative overflow-hidden rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-accent/50">
                {/* accent rail */}
                <span className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-100 bg-accent/50 transition-colors group-hover:bg-accent" />
                <dt className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150" />
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-foreground">
                  {item.value}
                </dd>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
