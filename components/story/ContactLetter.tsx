"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { GitHubIcon, InstagramIcon, LeetCodeIcon, LinkedInIcon } from "@/components/icons";
import type { ScenePalette } from "@/lib/story/types";

const EMAIL = "arulebin995@gmail.com";

const socials = [
  { label: "GitHub", href: "https://github.com/arulebin", Icon: GitHubIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ebin-a-259812290", Icon: LinkedInIcon },
  { label: "LeetCode", href: "https://leetcode.com/u/arulebin/", Icon: LeetCodeIcon },
  { label: "Instagram", href: "https://www.instagram.com/ebin_arul/", Icon: InstagramIcon },
];

/**
 * The letter.
 *
 * Composes a `mailto:` rather than posting to an API: no backend, no spam
 * surface, no secrets to deploy, and it matches how the classic site already
 * handles contact. Swapping in a route handler later means changing only the
 * submit handler.
 */
export function ContactLetter({ palette }: { palette: ScenePalette }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const subject = name ? `A message from ${name}` : "A message from your portfolio";
    const body = [message, "", "—", name, from].filter(Boolean).join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  const field =
    "w-full rounded-lg border border-border bg-background/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 focus:border-accent focus:outline-none";

  return (
    <div className="p-6 sm:p-8">
      <p
        className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em]"
        style={{ color: palette.glow }}
      >
        The next chapter
      </p>
      <h2 id="artifact-title" className="font-serif text-2xl font-medium sm:text-3xl">
        Send a letter
      </h2>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">
        Have a project, a role, or just want to say hi? Write it here and it&apos;ll open in
        your mail app — or reach me directly at{" "}
        <a href={`mailto:${EMAIL}`} className="text-foreground underline decoration-accent underline-offset-4">
          {EMAIL}
        </a>
        .
      </p>

      <form onSubmit={send} className="mt-6 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="letter-name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Your name
            </label>
            <input
              id="letter-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={field}
              placeholder="Who's writing?"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="letter-email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Your email
            </label>
            <input
              id="letter-email"
              type="email"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={field}
              placeholder="So I can write back"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="letter-body" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Message
          </label>
          <textarea
            id="letter-body"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${field} resize-none`}
            placeholder="Tell me about it…"
          />
        </div>

        <button
          type="submit"
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30"
        >
          Send it
          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2.5 border-t border-border pt-5">
        {socials.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3.5 py-2 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
