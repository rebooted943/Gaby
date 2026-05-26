import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedExhibitions, formatExhibitionDates } from "@/lib/exhibitions";
import { useI18n, pick } from "@/lib/i18n";
import { MockPreviewBanner } from "@/components/mock-preview-banner";
import { PageBody, PageHeader, PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/exhibitions")({
  head: () => ({
    meta: [
      { title: "Exhibitions — Andreea Gabriela Tudor" },
      { name: "description", content: "Exhibitions and solo shows by Andreea Gabriela Tudor." },
    ],
  }),
  component: ExhibitionsIndex,
});

function ExhibitionsIndex() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["exhibitions-all"],
    queryFn: async () => {
      const { data } = await fetchPublishedExhibitions();
      return data;
    },
  });

  const showingMocks = data?.some((e) => e.id.startsWith("mock-exhibition-")) ?? false;

  return (
    <PageShell>
      <PageHeader eyebrow={t.exhibitions.eyebrow} title={t.exhibitions.title} subtitle={t.exhibitions.subtitle} />

      <MockPreviewBanner show={showingMocks} />

      <PageBody>
        {data && data.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2">
            {data.map((ex, i) => (
              <Reveal key={ex.id} delay={i * 80}>
                <Link to="/exhibitions/$exhibitionId" params={{ exhibitionId: ex.id }} className="group block overflow-hidden bg-card ring-1 ring-border/50 transition-colors duration-500 hover:ring-primary/40">
                  {ex.poster_url ? (
                    <img src={ex.poster_url} alt={pick(lang, ex.title_en, ex.title_ro)} className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
                  ) : (
                    <div className="aspect-[3/4] w-full bg-muted" />
                  )}
                  <div className="space-y-2 p-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-primary">
                      {formatExhibitionDates(ex.start_date, ex.end_date, lang)}
                    </p>
                    <h2 className="font-display text-3xl italic leading-tight text-foreground">{pick(lang, ex.title_en, ex.title_ro)}</h2>
                    {pick(lang, ex.subtitle_en, ex.subtitle_ro) && (
                      <p className="text-sm text-muted-foreground">{pick(lang, ex.subtitle_en, ex.subtitle_ro)}</p>
                    )}
                    {pick(lang, ex.venue_en, ex.venue_ro) && (
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{pick(lang, ex.venue_en, ex.venue_ro)}</p>
                    )}
                    <span className="inline-block pt-2 text-xs uppercase tracking-[0.28em] text-foreground">{t.exhibitions.viewExhibition} →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <p className="max-w-3xl font-display text-xl italic text-muted-foreground">{t.exhibitions.empty}</p>
          </Reveal>
        )}
      </PageBody>
    </PageShell>
  );
}
