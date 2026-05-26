import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { isMockExhibitionId } from "@/data/exhibitions-mock";
import { fetchExhibitionDetail, formatExhibitionDates } from "@/lib/exhibitions";
import { useI18n, pick } from "@/lib/i18n";
import { MockPreviewBanner } from "@/components/mock-preview-banner";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exhibitions/$exhibitionId")({
  component: ExhibitionDetail,
});

function ExhibitionDetail() {
  const { exhibitionId } = Route.useParams();
  const { t, lang } = useI18n();

  const { data: ex, isLoading } = useQuery({
    queryKey: ["exhibition", exhibitionId],
    queryFn: async () => {
      const { data } = await fetchExhibitionDetail(exhibitionId);
      return data;
    },
  });

  if (isLoading) {
    return (
      <PageShell>
        <p className="text-muted-foreground">…</p>
      </PageShell>
    );
  }

  const isMock = isMockExhibitionId(exhibitionId);

  if (!ex) {
    return (
      <PageShell>
        <p className="font-display text-2xl italic text-muted-foreground">{t.exhibitions.notFound}</p>
        <Link to="/exhibitions" className="link-underline-grow mt-6 inline-block text-sm uppercase tracking-[0.28em]">
          ← {t.exhibitions.backToIndex}
        </Link>
      </PageShell>
    );
  }

  const title = pick(lang, ex.title_en, ex.title_ro);
  const dates = formatExhibitionDates(ex.start_date, ex.end_date, lang);
  const venue = pick(lang, ex.venue_en, ex.venue_ro);

  return (
    <article>
      {ex.poster_url && (
        <div className="relative isolate max-h-[min(70vh,36rem)] overflow-hidden">
          <img src={ex.poster_url} alt="" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
        </div>
      )}

      <PageShell className={cn(ex.poster_url && "-mt-24 md:-mt-32")}>
        <MockPreviewBanner show={isMock} className="mb-6" />
        <Reveal immediate>
          <Link to="/exhibitions" className="text-xs uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground">
            ← {t.exhibitions.backToIndex}
          </Link>
          <header className="mt-8 max-w-4xl border-b border-border/30 pb-10">
            <p className="text-eyebrow">{dates}{venue ? ` · ${venue}` : ""}</p>
            <span className="ornament-line ornament-line-static mt-4 block" aria-hidden />
            <h1 className="mt-4 font-display text-5xl leading-tight text-foreground md:text-6xl lg:text-7xl">{title}</h1>
            {pick(lang, ex.subtitle_en, ex.subtitle_ro) && (
              <p className="mt-4 font-display text-xl italic text-muted-foreground md:text-2xl">
                {pick(lang, ex.subtitle_en, ex.subtitle_ro)}
              </p>
            )}
          </header>
        </Reveal>

        <ExhibitionSection title={t.exhibitions.sections.overview}>
          <p className="max-w-3xl text-lg leading-relaxed text-foreground/90">{pick(lang, ex.overview_en, ex.overview_ro)}</p>
        </ExhibitionSection>

        {(ex.poster_url || ex.curator_name_en) && (
          <ExhibitionSection title={t.exhibitions.sections.credits}>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-start">
              {ex.poster_url && (
                <figure className="overflow-hidden bg-card ring-1 ring-border/50">
                  <img src={ex.poster_url} alt={title} className="w-full object-cover" />
                </figure>
              )}
              <div className="max-w-2xl space-y-6">
                <div>
                  <p className="text-eyebrow">{t.exhibitions.artist}</p>
                  <p className="mt-2 font-display text-2xl text-foreground">{ex.artist_name}</p>
                </div>
                {pick(lang, ex.curator_name_en, ex.curator_name_ro) && (
                  <div>
                    <p className="text-eyebrow">{t.exhibitions.curator}</p>
                    <p className="mt-2 font-display text-2xl italic text-foreground">
                      {pick(lang, ex.curator_name_en, ex.curator_name_ro)}
                    </p>
                  </div>
                )}
                {(pick(lang, ex.curator_bio_en, ex.curator_bio_ro) ?? "").trim() && (
                  <p className="leading-relaxed text-foreground/85">{pick(lang, ex.curator_bio_en, ex.curator_bio_ro)}</p>
                )}
              </div>
            </div>
          </ExhibitionSection>
        )}

        {ex.gallery.length > 0 && (
          <ExhibitionSection title={t.exhibitions.sections.gallery}>
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
              {ex.gallery.map((img, i) => (
                <Reveal key={img.id} delay={(i % 6) * 60} className="mb-4 break-inside-avoid">
                  <figure className="overflow-hidden bg-card">
                    <img src={img.image_url} alt={pick(lang, img.caption_en, img.caption_ro) || title} className="w-full" loading="lazy" />
                    {pick(lang, img.caption_en, img.caption_ro) && (
                      <figcaption className="p-3 text-xs text-muted-foreground">{pick(lang, img.caption_en, img.caption_ro)}</figcaption>
                    )}
                  </figure>
                </Reveal>
              ))}
            </div>
          </ExhibitionSection>
        )}

        {ex.artworks.length > 0 && (
          <ExhibitionSection title={t.exhibitions.sections.artworks}>
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
              {ex.artworks.map((p, i) => (
                <Reveal key={p.id} delay={(i % 6) * 70} className="mb-6 break-inside-avoid">
                  <Link to="/projects" className="artwork-card group block overflow-hidden bg-card">
                    {p.image_url ? (
                      <img src={p.image_url} alt={pick(lang, p.title_en, p.title_ro)} className="w-full" loading="lazy" />
                    ) : (
                      <div className="aspect-[4/5] bg-muted" />
                    )}
                    <div className="p-4">
                      <h3 className="font-display text-xl italic">{pick(lang, p.title_en, p.title_ro)}</h3>
                      {p.year && <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{p.year}</p>}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </ExhibitionSection>
        )}

        {ex.venues.length > 0 && (
          <ExhibitionSection title={t.exhibitions.sections.tour}>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ex.venues.map((v, i) => (
                <Reveal key={v.id} delay={i * 80}>
                  <div className="flex h-full flex-col overflow-hidden bg-card ring-1 ring-border/40">
                    {v.image_url ? (
                      <img src={v.image_url} alt={pick(lang, v.title_en, v.title_ro)} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="aspect-[4/3] bg-muted" />
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-2xl italic text-foreground">{pick(lang, v.title_en, v.title_ro)}</h3>
                      {v.external_url && (
                        <a
                          href={v.external_url}
                          target="_blank"
                          rel="noreferrer"
                          className="link-underline-grow mt-auto pt-6 text-xs uppercase tracking-[0.28em] text-primary"
                        >
                          {t.exhibitions.visitVenue} →
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </ExhibitionSection>
        )}

        {ex.press.length > 0 && (
          <ExhibitionSection title={t.exhibitions.sections.press}>
            <ul className="max-w-3xl divide-y divide-border/40 border-y border-border/40">
              {ex.press.map((p) => (
                <li key={p.id}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 py-5 text-foreground transition-colors hover:text-primary"
                  >
                    <span className="font-display text-xl italic">{pick(lang, p.title_en, p.title_ro)}</span>
                    <span className="shrink-0 text-xs uppercase tracking-[0.28em]">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </ExhibitionSection>
        )}

        {ex.book_pdf_url && (
          <ExhibitionSection title={t.exhibitions.sections.book}>
            <div className="max-w-4xl space-y-6">
              <div className="overflow-hidden border border-border/50 bg-card">
                <iframe
                  title={t.exhibitions.catalogIframe}
                  src={`${ex.book_pdf_url}#view=FitH`}
                  className="h-[min(70vh,52rem)] w-full"
                />
              </div>
              <a
                href={ex.book_pdf_url}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-3 border-b border-primary pb-1 text-sm uppercase tracking-[0.28em] text-primary"
              >
                {t.exhibitions.downloadPdf} →
              </a>
            </div>
          </ExhibitionSection>
        )}
      </PageShell>
    </article>
  );
}

function ExhibitionSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="mt-20 border-t border-border/30 pt-16 first:mt-16">
      <h2 className="mb-8 font-display text-3xl text-foreground md:text-4xl">{title}</h2>
      {children}
    </Reveal>
  );
}
