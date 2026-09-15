export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border">
      {/* thin accent hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted sm:flex-row">
        <a href="#top" className="group font-mono">
          <span className="text-muted transition-colors group-hover:text-accent">
            &lt;
          </span>
          Ebin A
          <span className="text-accent">/&gt;</span>
        </a>
        <p className="font-mono text-xs tracking-wide">
          Designed &amp; built by Ebin A · © {year}
        </p>
      </div>
    </footer>
  );
}
