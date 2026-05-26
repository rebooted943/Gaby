import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/reveal";
import { ArtistPortrait, PageBody, PageHeader, PageShell } from "@/components/page-shell";
import artistPortrait from "@/assets/pro_pic.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Andreea Gabriela Tudor" },
      { name: "description", content: "Romanian contemporary painter exploring identity, the collective mind, and the meeting of figurative and abstract." },
      { property: "og:title", content: "About — Andreea Gabriela Tudor" },
      { property: "og:description", content: "Romanian contemporary painter exploring identity, the collective mind, and the meeting of figurative and abstract." },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();
  return (
    <PageShell>
      <PageHeader eyebrow={t.about.eyebrow} title={t.about.title} subtitle={t.about.role} />

      <PageBody>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start lg:gap-16">
          <Reveal immediate className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <ArtistPortrait src={artistPortrait} alt={t.about.portraitAlt} priority />
          </Reveal>

          <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-foreground/90">
            {[t.about.bio1, t.about.bio2, t.about.bio3, t.about.bio4].map((para, i) => (
              <Reveal key={i} delay={i * 80} variant="fade">
                <p>{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </PageBody>
    </PageShell>
  );
}
