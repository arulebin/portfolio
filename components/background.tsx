/**
 * Ambient page backdrop: a soft aurora of blurred accent blobs, a fading grid,
 * and a fine film-grain layer for texture. Pure CSS (animation lives in
 * globals.css), so it renders on the server and adds no main-thread work.
 * The aurora animation is automatically stilled under prefers-reduced-motion.
 */
export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* fading grid, masked so it dissolves toward the middle of the screen */}
      <div
        className="bg-grid absolute inset-0 opacity-[0.35] dark:opacity-25"
        style={{
          maskImage:
            "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 68%)",
          WebkitMaskImage:
            "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 68%)",
        }}
      />

      {/* aurora blobs */}
      <div className="animate-aurora absolute -left-[10%] -top-[12%] h-[46vw] w-[46vw] rounded-full bg-accent/25 blur-[110px] dark:bg-accent/20" />
      <div
        className="animate-aurora absolute right-[-8%] top-[6%] h-[40vw] w-[40vw] rounded-full blur-[120px]"
        style={{
          backgroundColor: "color-mix(in oklab, var(--accent-2) 24%, transparent)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="animate-aurora absolute bottom-[-14%] left-[28%] h-[38vw] w-[38vw] rounded-full bg-accent/15 blur-[130px]"
        style={{ animationDelay: "-11s" }}
      />

      {/* film grain */}
      <div className="grain absolute inset-0 opacity-[0.05] mix-blend-soft-light dark:opacity-[0.09]" />
    </div>
  );
}
