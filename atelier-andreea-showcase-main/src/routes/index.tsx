import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArtworkImageButton, useImageLightbox, type LightboxImage } from "@/components/image-lightbox";
import { useI18n, pick } from "@/lib/i18n";
import { fetchPublishedExhibitions, formatExhibitionDates } from "@/lib/exhibitions";
import { fetchProjects } from "@/lib/projects";
import { fetchShopItems } from "@/lib/shop";
import { Reveal } from "@/components/reveal";
import { ArtistPortrait, SectionHeader } from "@/components/page-shell";
import { useHeroEntered } from "@/hooks/use-hero-entered";
import { cn } from "@/lib/utils";
import hero from "@/assets/hero-home.jpg";
import artistPortrait from "@/assets/pro_pic.jpg";
import atmosphere from "@/assets/hero-atmosphere.jpg";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { t, lang } = useI18n();
  const heroReady = useHeroEntered();

  const projects = useQuery({
    queryKey: ["projects-home"],
    queryFn: async () => {
      const { data } = await fetchProjects(6);
      return data;
    },
  });
  const shop = useQuery({
    queryKey: ["shop-home"],
    queryFn: async () => {
      const { data } = await fetchShopItems(3);
      return data;
    },
  });

  const homeProjectLightbox = useMemo(() => {
    const images: LightboxImage[] = [];
    const indexById = new Map<string, number>();
    for (const p of projects.data ?? []) {
      if (p.image_url) {
        indexById.set(p.id, images.length);
        images.push({ src: p.image_url, alt: pick(lang, p.title_en, p.title_ro) });
      }
    }
    return { images, indexById };
  }, [projects.data, lang]);

  const { openAt: openProjectAt, lightbox: projectLightbox } = useImageLightbox(homeProjectLightbox.images);

  const homeShopLightbox = useMemo(() => {
    const images: LightboxImage[] = [];
    const indexById = new Map<string, number>();
    for (const s of shop.data ?? []) {
      if (s.image_url) {
        indexById.set(s.id, images.length);
        images.push({ src: s.image_url, alt: pick(lang, s.title_en, s.title_ro) });
      }
    }
    return { images, indexById };
  }, [shop.data, lang]);

  const { openAt: openShopAt, lightbox: shopLightbox } = useImageLightbox(homeShopLightbox.images);
  const exhibitions = useQuery({
    queryKey: ["exhibitions-home"],
    queryFn: async () => {
      const { data } = await fetchPublishedExhibitions();
      return data.slice(0, 3);
    },
  });

  return (
    <>
      <section className="hero-section relative isolate min-h-[min(100svh,52rem)] overflow-hidden md:min-h-[min(100svh,58rem)]">
        <img
          src={hero}
          alt=""
          width={1920}
          height={1080}
          className={cn(
            "hero-image absolute inset-0 -z-10 h-full w-full object-cover opacity-50",
            !heroReady && "hero-image-animate",
          )}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div
          className={cn(
            "hero-stagger mx-auto max-w-7xl px-6 pb-32 pt-28 md:pb-48 md:pt-44",
            heroReady && "hero-ready",
          )}
        >
          <p className="text-eyebrow">{t.home.eyebrow}</p>
          <span className={cn("ornament-line mt-4", heroReady && "ornament-line-static")} aria-hidden />
          <h1 className="hero-title-slot mt-6 max-w-4xl font-display text-5xl leading-[1.05] tracking-tight text-foreground md:text-7xl lg:text-8xl">
            {t.home.title}
          </h1>
          <p className="hero-sub-slot mt-8 max-w-xl font-display text-xl italic leading-relaxed text-muted-foreground md:text-2xl">
            {t.home.sub}
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Link
              to="/projects"
              className="group link-underline-grow inline-flex items-center gap-3 border-b border-primary pb-1 text-sm uppercase tracking-[0.28em] text-primary"
            >
              {t.home.ctaWorks}
              <span className="transition-transform duration-700 ease-out group-hover:translate-x-1.5">→</span>
            </Link>
            <Link
              to="/about"
              className="link-underline-grow text-sm uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground"
            >
              {t.home.ctaAbout}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-border/40 bg-card/20">
        <img
          src={atmosphere}
          alt=""
          width={1920}
          height={1080}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.14]"
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/95 to-background/80" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
          <Reveal immediate className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <ArtistPortrait src={artistPortrait} alt={t.about.portraitAlt} />
          </Reveal>
          <Reveal immediate className="max-w-xl">
            <p className="text-eyebrow">{t.home.studioEyebrow}</p>
            <span className="ornament-line ornament-line-static mt-4 block" aria-hidden />
            <p className="mt-6 font-display text-2xl italic leading-relaxed text-foreground md:text-3xl">
              {t.home.studioTeaser}
            </p>
            <Link
              to="/about"
              className="link-underline-grow mt-10 inline-block text-sm uppercase tracking-[0.28em] text-primary"
            >
              {t.home.studioCta} →
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeader
          eyebrow={t.home.latestEyebrow}
          title={t.projects.title}
          action={
            <Link
              to="/projects"
              className="link-underline-grow shrink-0 text-xs uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground"
            >
              {t.home.viewAll}
            </Link>
          }
          className="mb-16"
        />
        {projects.data && projects.data.length > 0 ? (
          <>
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
              {projects.data.map((p, i) => (
                <Reveal key={p.id} delay={i * 90} className="mb-6 break-inside-avoid">
                  <article className="artwork-protected artwork-card group overflow-hidden bg-card">
                    {p.image_url ? (
                      <ArtworkImageButton
                        image={{ src: p.image_url, alt: pick(lang, p.title_en, p.title_ro) }}
                        onOpen={() => openProjectAt(homeProjectLightbox.indexById.get(p.id) ?? 0)}
                        imgClassName="w-full"
                      />
                    ) : (
                      <div className="aspect-[4/5] w-full bg-muted" />
                    )}
                    <Link to="/projects" className="block p-5 transition-colors duration-700 group-hover:bg-card/80">
                      <h3 className="font-display text-2xl italic text-foreground">{pick(lang, p.title_en, p.title_ro)}</h3>
                      {p.year && <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{p.year}</p>}
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
            {projectLightbox}
          </>
        ) : (
          <Reveal>
            <p className="max-w-3xl font-display text-xl italic text-muted-foreground">{t.home.empty}</p>
          </Reveal>
        )}
      </section>

      <section className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeader
            eyebrow={t.home.shopEyebrow}
            title={t.shop.title}
            action={
              <Link
                to="/shop"
                className="link-underline-grow shrink-0 text-xs uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground"
              >
                {t.home.viewAll}
              </Link>
            }
            className="mb-16"
          />
          {shop.data && shop.data.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {shop.data.map((s, i) => {
                const fmt = new Intl.NumberFormat(lang === "ro" ? "ro-RO" : "en-GB", {
                  style: "currency",
                  currency: s.currency || "EUR",
                });
                return (
                  <Reveal key={s.id} delay={i * 90} variant="scale">
                    <article className="artwork-protected group block">
                      <div className="artwork-card relative overflow-hidden bg-card">
                        {s.image_url ? (
                          <ArtworkImageButton
                            image={{ src: s.image_url, alt: pick(lang, s.title_en, s.title_ro) }}
                            onOpen={() => openShopAt(homeShopLightbox.indexById.get(s.id) ?? 0)}
                            imgClassName="aspect-[4/5] w-full object-cover"
                          />
                        ) : (
                          <div className="aspect-[4/5] w-full bg-muted" />
                        )}
                        {!s.available && (
                          <span className="pointer-events-none absolute left-4 top-4 z-10 bg-background/90 px-3 py-1 text-xs uppercase tracking-[0.28em] text-foreground">
                            {t.shop.sold}
                          </span>
                        )}
                      </div>
                      <Link to="/shop" className="block">
                        <h3 className="mt-4 font-display text-2xl italic text-foreground">
                          {pick(lang, s.title_en, s.title_ro)}
                        </h3>
                        <p className="mt-1 font-display text-lg text-primary">{fmt.format(Number(s.price))}</p>
                      </Link>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <Reveal>
              <p className="max-w-3xl font-display text-xl italic text-muted-foreground">{t.home.empty}</p>
            </Reveal>
          )}
          {shopLightbox}
        </div>
      </section>

      <section className="border-t border-border/40 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal immediate>
              <div className="max-w-md border-b border-border/30 pb-10">
                <p className="text-eyebrow">{t.home.exhibitionsEyebrow}</p>
                <span className="ornament-line ornament-line-static mt-4 block" aria-hidden />
                <h2 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-5xl">{t.exhibitions.title}</h2>
                <Link
                  to="/exhibitions"
                  className="link-underline-grow mt-6 inline-block text-xs uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground"
                >
                  {t.home.viewAll}
                </Link>
              </div>
            </Reveal>
            <div className="space-y-8">
              {exhibitions.data && exhibitions.data.length > 0 ? exhibitions.data.map((e, i) => (
                <Reveal key={e.id} delay={i * 100} variant="fade-right">
                  <Link to="/exhibitions/$slug" params={{ slug: e.slug }} className="event-line block border-l-2 border-primary/60 pl-6">
                    <p className="text-xs uppercase tracking-[0.28em] text-primary">
                      {formatExhibitionDates(e.start_date, e.end_date, lang)}
                    </p>
                    <h3 className="mt-2 font-display text-2xl italic text-foreground">{pick(lang, e.title_en, e.title_ro)}</h3>
                    {pick(lang, e.venue_en, e.venue_ro) && <p className="mt-1 text-sm text-muted-foreground">{pick(lang, e.venue_en, e.venue_ro)}</p>}
                  </Link>
                </Reveal>
              )) : (
                <Reveal>
                  <p className="font-display text-xl italic text-muted-foreground">{t.home.empty}</p>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
