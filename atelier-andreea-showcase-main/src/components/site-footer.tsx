import { useI18n } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-32 border-t border-border/40">
      <Reveal immediate className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-end">
        <div>
          <p className="text-eyebrow">{t.footer.rights}</p>
          <p className="mt-2 font-display text-2xl text-foreground">Andreea Gabriela Tudor</p>
        </div>
      </Reveal>
    </footer>
  );
}