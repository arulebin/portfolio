import { ArrowUpRight } from "lucide-react";
import { Section, SectionLabel } from "./section";
import { Reveal, Stagger, RevealItem } from "./reveal";
import { Magnetic } from "./magnetic";
import {
  GitHubIcon,
  InstagramIcon,
  LeetCodeIcon,
  LinkedInIcon,
} from "./icons";

const EMAIL = "arulebin995@gmail.com";

const socials = [
  { label: "GitHub", href: "https://github.com/arulebin", Icon: GitHubIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ebin-a-259812290",
    Icon: LinkedInIcon,
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/u/arulebin/",
    Icon: LeetCodeIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/ebin_arul/",
    Icon: InstagramIcon,
  },
];

export function Contact() {
  return (
    <Section id="contact">
      <SectionLabel index="06">Contact</SectionLabel>

      <Reveal>
        <h2 className="max-w-2xl font-serif text-4xl font-light leading-tight tracking-tight sm:text-6xl">
          Let&apos;s build something{" "}
          <span className="text-gradient-animate">together.</span>
        </h2>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
          Have a project, a role, or just want to say hi? My inbox is always
          open — I&apos;ll get back to you.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <a
          href={`mailto:${EMAIL}`}
          className="group mt-8 inline-flex w-fit max-w-full items-center gap-2 font-serif text-2xl font-light text-foreground transition-colors hover:text-accent sm:text-3xl"
        >
          <span className="relative break-all">
            {EMAIL}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </span>
          <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </Reveal>

      <Stagger className="mt-10 flex flex-wrap gap-3" delay={0.15} gap={0.06}>
        {socials.map(({ label, href, Icon }) => (
          <RevealItem key={label}>
            <Magnetic strength={8}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2.5 text-sm text-muted backdrop-blur transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            </Magnetic>
          </RevealItem>
        ))}
      </Stagger>
    </Section>
  );
}
