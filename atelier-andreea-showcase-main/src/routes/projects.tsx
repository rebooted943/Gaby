import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { isMockProjectId } from "@/data/projects-mock";
import { MockPreviewBanner } from "@/components/mock-preview-banner";
import { useI18n, pick } from "@/lib/i18n";
import { fetchProjects } from "@/lib/projects";
import { Reveal } from "@/components/reveal";
import { PageBody, PageHeader, PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Works — Andreea Gabriela Tudor" },
      { name: "description", content: "Selected paintings by Andreea Gabriela Tudor." },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["projects-all"],
    queryFn: async () => {
      const { data } = await fetchProjects();
      return data;
    },
  });

  const showingMocks = data?.some((p) => isMockProjectId(p.id)) ?? false;

  return (
    <PageShell>
      <PageHeader eyebrow={t.projects.eyebrow} title={t.projects.title} />

      <MockPreviewBanner show={showingMocks} />

      <PageBody>
        {data && data.length > 0 ? (
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 [column-fill:_balance]">
            {data.map((p, i) => (
              <Reveal key={p.id} delay={(i % 6) * 70} className="mb-8 break-inside-avoid">
                <article className="artwork-card group bg-card">
                  {p.image_url ? (
                    <img src={p.image_url} alt={pick(lang, p.title_en, p.title_ro)} className="w-full overflow-hidden" loading="lazy" />
                  ) : (
                    <div className="aspect-[4/5] w-full bg-muted" />
                  )}
                  <div className="space-y-3 p-6 transition-colors duration-700 group-hover:bg-card/80">
                    <h2 className="font-display text-3xl italic text-foreground">{pick(lang, p.title_en, p.title_ro)}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {p.year && <span>{t.projects.year} {p.year}</span>}
                      {p.museum && <span>· {t.projects.museum}: {p.museum}</span>}
                    </div>
                    {(pick(lang, p.description_en, p.description_ro) ?? "").trim() && (
                      <p className="pt-2 text-sm leading-relaxed text-foreground/80">
                        {pick(lang, p.description_en, p.description_ro)}
                      </p>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <p className="max-w-3xl font-display text-xl italic text-muted-foreground">{t.projects.empty}</p>
          </Reveal>
        )}
      </PageBody>
    </PageShell>
  );
}
