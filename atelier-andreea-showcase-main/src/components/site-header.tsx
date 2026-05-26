import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n, type Lang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useScrollHeaderVisibility } from "@/hooks/use-scroll-header";
import { cn } from "@/lib/utils";

const NAV_SLOTS = [
  { to: "/", slot: "nav-slot-home" },
  { to: "/projects", slot: "nav-slot-projects" },
  { to: "/shop", slot: "nav-slot-shop" },
  { to: "/exhibitions", slot: "nav-slot-events" },
  { to: "/about", slot: "nav-slot-about" },
] as const;

/** Fallback before ResizeObserver measures the bar (mobile ≈2 rows). */
const HEADER_FALLBACK_CLASS = "h-[7.25rem] md:h-[5.25rem]";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const { isAdmin, signOut } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { visible, show } = useScrollHeaderVisibility();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    show();
  }, [path, show]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const measure = () => setHeaderHeight(el.getBoundingClientRect().height);

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isAdmin]);

  const labels: Record<(typeof NAV_SLOTS)[number]["to"], string> = {
    "/": t.nav.home,
    "/projects": t.nav.projects,
    "/shop": t.nav.shop,
    "/exhibitions": t.nav.exhibitions,
    "/about": t.nav.about,
  };

  return (
    <>
      <header ref={headerRef} className={cn("site-header", !visible && "is-hidden")}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-6">
          <Link to="/" className="group flex min-w-0 shrink flex-col leading-none md:justify-self-start">
            <span className="text-eyebrow text-[0.62rem] sm:text-[0.7rem]">Painter · Galați</span>
            <span className="font-display text-xl tracking-tight text-foreground sm:text-2xl">Andreea G. Tudor</span>
          </Link>

          <nav className="hidden items-center justify-center gap-6 md:flex lg:gap-8">
            {NAV_SLOTS.map(({ to, slot }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  slot,
                  "inline-block text-center text-sm tracking-wide text-muted-foreground transition-colors duration-500 hover:text-foreground",
                  (path === to || (to !== "/" && path.startsWith(`${to}/`))) && "text-foreground",
                )}
              >
                {labels[to]}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4 md:justify-self-end">
            <div className="flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {(["en", "ro"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={cn(
                    "w-7 py-1 text-center transition-colors hover:text-foreground sm:w-6",
                    lang === l && "text-primary",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            {isAdmin ? (
              <div className="hidden items-center gap-3 sm:flex">
                <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.nav.admin}
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t.nav.logout}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <nav
          className="flex overflow-x-auto border-t border-border/40 px-3 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
          aria-label="Main"
        >
          <div className="flex min-w-min items-center justify-center gap-4 px-1 sm:gap-5">
            {NAV_SLOTS.map(({ to }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "shrink-0 whitespace-nowrap text-xs uppercase tracking-widest transition-colors",
                  (path === to || (to !== "/" && path.startsWith(`${to}/`))) ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {labels[to]}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <div
        aria-hidden
        className={cn("site-header-spacer", visible && !headerHeight && HEADER_FALLBACK_CLASS)}
        style={{ height: visible ? headerHeight || undefined : 0 }}
      />
    </>
  );
}
