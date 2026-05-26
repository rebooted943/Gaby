import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type MockPreviewBannerProps = {
  show: boolean;
  className?: string;
};

export function MockPreviewBanner({ show, className }: MockPreviewBannerProps) {
  const { t } = useI18n();
  if (!show) return null;
  return (
    <p
      className={cn(
        "mb-8 max-w-3xl border border-primary/30 bg-primary/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-primary",
        className,
      )}
    >
      {t.common.mockPreview}
    </p>
  );
}
