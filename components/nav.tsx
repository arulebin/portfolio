"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

const links = [
  { href: "#internship", label: "Internship", id: "internship" },
  { href: "#freelance", label: "Freelance", id: "freelance" },
  { href: "#projects", label: "Projects", id: "projects" },
  { href: "#about", label: "About", id: "about" },
  { href: "#skills", label: "Skills", id: "skills" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export function Nav() {
  const reduce = useReducedMotionSafe();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  // Shrink + strengthen the nav surface once the page starts scrolling.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the nav item for whichever section owns the viewport.
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? "glass border-border shadow-sm shadow-black/[0.03]"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="group font-mono text-base font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="text-muted transition-colors group-hover:text-accent">
            &lt;
          </span>
          Ebin A
          <span className="text-accent">/&gt;</span>
        </a>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-0.5 md:flex">
            {links.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    className={`relative z-10 block rounded-full px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "text-accent"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-0 rounded-full bg-accent-soft"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 30 }
                      }
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mx-1 hidden h-5 w-px bg-border md:block" />

          <ThemeToggle />

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-accent hover:text-accent md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-background/95 px-6 backdrop-blur md:hidden"
          >
            {links.map((link, i) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
              >
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md py-3 text-sm transition-colors ${
                    active === link.id
                      ? "text-accent"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
