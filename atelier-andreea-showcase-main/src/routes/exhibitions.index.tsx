import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedExhibitions } from "@/lib/exhibitions";
import { useI18n } from "@/lib/i18n";
import { ExhibitionListCard } from "@/components/exhibition-list-card";
import { MockPreviewBanner } from "@/components/mock-preview-banner";
import { PageBody, PageHeader, PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/exhibitions/")({
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
          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6">
            {data.map((ex, i) => (
              <Reveal key={ex.id} delay={i * 80} className="h-full">
                <ExhibitionListCard
                  exhibition={ex}
                  lang={lang}
                  viewLabel={t.exhibitions.viewExhibition}
                />
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
