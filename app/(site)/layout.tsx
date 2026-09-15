import { Background } from "@/components/background";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollToTop } from "@/components/scroll-to-top";

/**
 * Chrome for the classic editorial site only.
 *
 * Route groups `(site)` and `story` share the root layout's fonts, metadata and
 * theme provider but not this ambient background / scroll furniture — story
 * mode paints its own world and would fight with it.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Background />
      <ScrollProgress />
      {children}
      <ScrollToTop />
    </>
  );
}
