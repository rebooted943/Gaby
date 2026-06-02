import { Link } from "@tanstack/react-router";
import { formatExhibitionDates, type Exhibition } from "@/lib/exhibitions";
import { pick, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ExhibitionListCardProps = {
  exhibition: Exhibition;
  lang: Lang;
  viewLabel: string;
  className?: string;
};

/** Equal-height cards: compact poster on top, full exhibition info always visible below. */
export function ExhibitionListCard({ exhibition: ex, lang, viewLabel, className }: ExhibitionListCardProps) {
  const title = pick(lang, ex.title_en, ex.title_ro);
  const subtitle = pick(lang, ex.subtitle_en, ex.subtitle_ro);
  const venue = pick(lang, ex.venue_en, ex.venue_ro);
  const dates = formatExhibitionDates(ex.start_date, ex.end_date, lang);

  return (
    <Link
      to="/exhibitions/$slug"
      params={{ slug: ex.slug }}
      className={cn(
        "group flex h-full flex-col bg-card ring-1 ring-border/50 transition-colors duration-500 hover:ring-primary/40",
        className,
      )}
    >
      <div className="relative h-50 w-full shrink-0 overflow-hidden bg-muted sm:h-50 md:h-80">
        {ex.poster_url ? (
          <img
            src={ex.poster_url}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-5 sm:p-6">
        <div className="space-y-2">
          {dates && (
            <p className="text-xs uppercase tracking-[0.28em] text-primary">{dates}</p>
          )}
          <h2 className="font-display text-2xl italic leading-tight text-foreground sm:text-3xl">{title}</h2>
          {subtitle && <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
          {venue && (
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{venue}</p>
          )}
        </div>
        <span className="inline-block pt-1 text-xs uppercase tracking-[0.28em] text-foreground">
          {viewLabel} →
        </span>
      </div>
    </Link>
  );
}
