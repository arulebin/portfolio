import Image from "next/image";
import { ArrowUpRight, Download, Lock } from "lucide-react";
import { Section, SectionLabel } from "./section";
import { Reveal, Stagger, RevealItem } from "./reveal";
import { TiltCard } from "./tilt-card";
import { projectsIn, type ProjectCategory } from "@/lib/projects";

function ProjectSection({
  id,
  index,
  label,
  heading,
  intro,
  category,
}: {
  id: string;
  index: string;
  label: string;
  heading: string;
  intro: string;
  category: ProjectCategory;
}) {
  const list = projectsIn(category);

  return (
    <Section id={id}>
      <SectionLabel index={index}>{label}</SectionLabel>

      <Reveal>
        <h2 className="mb-3 font-serif text-3xl font-light tracking-tight sm:text-4xl">
          {heading}
        </h2>
        <p className="mb-12 max-w-xl text-base leading-relaxed text-muted">{intro}</p>
      </Reveal>

      <Stagger className="grid gap-6 sm:grid-cols-2" gap={0.09}>
        {list.map((project, i) => (
          <RevealItem key={project.id} className="[perspective:1000px]">
            <TiltCard className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-accent/60">
              {project.image && (
                <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-background">
                  <Image
                    src={project.image}
                    alt={project.imageAlt ?? `${project.title} preview`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 490px"
                    className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                  {/* index badge */}
                  <span className="absolute left-3 top-3 rounded-md bg-background/70 px-2 py-1 font-mono text-xs tabular-nums text-muted backdrop-blur">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* image sheen on hover */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              )}

              <div className="relative z-10 flex flex-1 flex-col p-6">
                <h3 className="font-serif text-xl font-medium transition-colors duration-300 group-hover:text-accent">
                  {project.title}
                </h3>
                {project.role && (
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-accent">
                    {project.role}
                  </p>
                )}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-muted transition-colors group-hover:border-accent/30"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                {project.links.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link -my-3 inline-flex items-center gap-1.5 py-3 text-sm font-medium text-foreground transition-colors hover:text-accent"
                      >
                        {link.label}
                        {link.label === "Download" ? (
                          <Download className="h-3.5 w-3.5 transition-transform group-hover/link:translate-y-0.5" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        )}
                      </a>
                    ))}
                  </div>
                )}

                {/* Say why there is nothing to click, rather than leaving a silent gap. */}
                {project.links.length === 0 && (
                  <p className="mt-5 flex items-center gap-1.5 border-t border-border pt-4 text-xs text-muted">
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    {category === "personal" ? "Source not public yet" : "Client work · source is private"}
                  </p>
                )}
              </div>
            </TiltCard>
          </RevealItem>
        ))}
      </Stagger>
    </Section>
  );
}

export function Internship() {
  return (
    <ProjectSection
      id="internship"
      index="01"
      label="Internship"
      heading="Shipped at Flutter Frog"
      intro="Production web and mobile apps I built at Flutter Frog Software Solutions, first as an intern and then as a part-time developer, used daily by real customers, retailers and field teams."
      category="internship"
    />
  );
}

export function Freelance() {
  return (
    <ProjectSection
      id="freelance"
      index="02"
      label="Freelance"
      heading="Built for clients"
      intro="Independent engagements, from recovering a legacy system nobody could read any more to a website an NGO's staff now run themselves."
      category="freelance"
    />
  );
}

export function PersonalProjects() {
  return (
    <ProjectSection
      id="projects"
      index="03"
      label="Projects"
      heading="Things I build for myself"
      intro="Side projects where I go deep on one hard thing: encryption, networking, interpreters, or retrieval."
      category="personal"
    />
  );
}
