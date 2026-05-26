import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { isMockShopId } from "@/data/shop-mock";
import { MockPreviewBanner } from "@/components/mock-preview-banner";
import { useI18n, pick } from "@/lib/i18n";
import { fetchShopItems } from "@/lib/shop";
import { Reveal } from "@/components/reveal";
import { PageBody, PageHeader, PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Andreea Gabriela Tudor" },
      { name: "description", content: "Original paintings available for purchase." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["shop-all"],
    queryFn: async () => {
      const { data } = await fetchShopItems();
      return data;
    },
  });

  const showingMocks = data?.some((s) => isMockShopId(s.id)) ?? false;

  return (
    <PageShell>
      <PageHeader eyebrow={t.shop.eyebrow} title={t.shop.title} />

      <MockPreviewBanner show={showingMocks} />

      <PageBody>
        {data && data.length > 0 ? (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {data.map((s, i) => {
              const fmt = new Intl.NumberFormat(lang === "ro" ? "ro-RO" : "en-GB", { style: "currency", currency: s.currency || "EUR" });
              return (
                <Reveal key={s.id} delay={(i % 3) * 100} variant="scale">
                  <article className="group">
                    <div className="artwork-card relative overflow-hidden bg-card">
                      {s.image_url ? (
                        <img
                          src={s.image_url}
                          alt={pick(lang, s.title_en, s.title_ro)}
                          className="aspect-[4/5] w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="aspect-[4/5] w-full bg-muted" />
                      )}
                      {!s.available && (
                        <span className="absolute left-4 top-4 bg-background/90 px-3 py-1 text-xs uppercase tracking-[0.28em] text-foreground">
                          {t.shop.sold}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-4 font-display text-2xl italic text-foreground">{pick(lang, s.title_en, s.title_ro)}</h2>
                    {(pick(lang, s.description_en, s.description_ro) ?? "").trim() && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {pick(lang, s.description_en, s.description_ro)}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-display text-xl text-primary">{fmt.format(Number(s.price))}</span>
                      {s.available && (
                        <a
                          href={s.purchase_url || `mailto:?subject=${encodeURIComponent(pick(lang, s.title_en, s.title_ro))}`}
                          target={s.purchase_url ? "_blank" : undefined}
                          rel="noreferrer"
                          className="link-underline-grow text-xs uppercase tracking-[0.28em] text-foreground"
                        >
                          {t.shop.buy} →
                        </a>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Reveal>
            <p className="max-w-3xl font-display text-xl italic text-muted-foreground">{t.shop.empty}</p>
          </Reveal>
        )}
      </PageBody>
    </PageShell>
  );
}
