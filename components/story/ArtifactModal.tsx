"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Download, X } from "lucide-react";
import { getProject } from "@/lib/projects";
import type { Hotspot, ScenePalette } from "@/lib/story/types";
import { ContactLetter } from "./ContactLetter";

/**
 * Artifact / lore modal.
 *
 * Built on the native <dialog> + showModal(), which supplies the focus trap,
 * background inertness, Escape-to-close and — the one custom modals usually
 * miss — focus restoration back to the artifact that opened it. Keyboard
 * position through the scene survives opening and closing.
 *
 * Project content is read from `lib/projects.ts`, never re-authored, so the
 * story and the classic site can never disagree.
 */
export function ArtifactModal({
  data,
  palette,
  onClose,
}: {
  data: Hotspot | null;
  palette: ScenePalette;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (data && !el.open) el.showModal();
    if (!data && el.open) el.close();
  }, [data]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = () => onClose();
    el.addEventListener("close", handle);
    return () => el.removeEventListener("close", handle);
  }, [onClose]);

  const project = data?.kind === "project" ? getProject(data.projectId) : undefined;

  return (
    <dialog
      ref={ref}
      aria-labelledby="artifact-title"
      className="story-dialog m-auto w-[min(56rem,92vw)] rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      /* Clicking the backdrop (i.e. the dialog element itself) dismisses. */
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      {data && (
        <div className="relative">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-muted backdrop-blur transition-colors hover:border-accent hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>

          {project ? (
            <div className="grid gap-0 sm:grid-cols-[1.1fr_1fr]">
              {project.image && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl border-b border-border sm:aspect-auto sm:rounded-l-2xl sm:rounded-tr-none sm:border-b-0 sm:border-r">
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-6 sm:p-7">
                <p
                  className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em]"
                  style={{ color: palette.glow }}
                >
                  Artifact recovered
                </p>
                <h2 id="artifact-title" className="font-serif text-2xl font-medium sm:text-3xl">
                  {project.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                {project.links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-4 border-t border-border pt-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
                      >
                        {link.label}
                        {link.label === "Download" ? (
                          <Download className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : data.kind === "contact" ? (
            <ContactLetter palette={palette} />
          ) : data.kind === "lore" ? (
            <div className="p-6 sm:p-8">
              <p
                className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em]"
                style={{ color: palette.glow }}
              >
                {data.label}
              </p>
              <h2 id="artifact-title" className="font-serif text-2xl font-medium sm:text-3xl">
                {data.title}
              </h2>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{data.body}</p>

              {data.items && data.items.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {data.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-background/60 px-3 py-1.5 font-mono text-[11px] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      )}
    </dialog>
  );
}
