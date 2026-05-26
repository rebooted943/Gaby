import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

/** Shared page width — all inner routes align to the same left edge. */
export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-6 py-24", className)}>{children}</div>;
}

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, className }: PageHeaderProps) {
  return (
    <Reveal immediate>
      <header className={cn("max-w-3xl border-b border-border/30 pb-10", className)}>
        <p className="text-eyebrow">{eyebrow}</p>
        <span className="ornament-line ornament-line-static mt-4 block" aria-hidden />
        <h1 className="mt-4 font-display text-5xl leading-tight text-foreground md:text-6xl">{title}</h1>
        {subtitle ? (
          <p className="mt-4 font-display text-lg italic leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </header>
    </Reveal>
  );
}

export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-16", className)}>{children}</div>;
}

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  className?: string;
}

/** In-page section titles (home) — same rhythm as PageHeader. */
export function SectionHeader({ eyebrow, title, action, className }: SectionHeaderProps) {
  return (
    <Reveal immediate className={cn("flex flex-wrap items-end justify-between gap-6 border-b border-border/30 pb-10", className)}>
      <div className="max-w-3xl">
        <p className="text-eyebrow">{eyebrow}</p>
        <span className="ornament-line ornament-line-static mt-4 block" aria-hidden />
        <h2 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-5xl">{title}</h2>
      </div>
      {action}
    </Reveal>
  );
}

interface ArtistPortraitProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ArtistPortrait({ src, alt, className, priority }: ArtistPortraitProps) {
  return (
    <figure
      className={cn(
        "relative isolate overflow-hidden bg-card shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)] ring-1 ring-border/50",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        width={720}
        height={900}
        className="aspect-[4/5] w-full object-cover object-[center_18%]"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
    </figure>
  );
}
