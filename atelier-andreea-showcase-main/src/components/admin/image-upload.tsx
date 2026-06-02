import { useState } from "react";
import { importImageFromUrl, isStoredImageUrl } from "@/lib/storage-upload";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AdminImageUpload({
  label,
  url,
  folder,
  onUrl,
  onFile,
  uploading,
}: {
  label: string;
  url: string;
  folder: string;
  onUrl: (url: string) => void;
  onFile: (file: File) => void;
  uploading: boolean;
}) {
  const { t } = useI18n();
  const [importing, setImporting] = useState(false);
  const imageT = t.admin.exhibitions;

  const handleImportUrl = async () => {
    if (!url.trim() || isStoredImageUrl(url)) return;
    setImporting(true);
    const { url: stored, error } = await importImageFromUrl(url, folder);
    setImporting(false);
    if (error) toast.error(error);
    else if (stored) onUrl(stored);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded border border-border/60 px-3 py-2 text-xs uppercase tracking-wider hover:bg-card/50">
          {imageT.uploadFromPc}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
        </label>
        {(uploading || importing) && <span className="text-xs text-muted-foreground">{t.admin.uploading}</span>}
        {url && isStoredImageUrl(url) && (
          <span className="text-xs text-primary">{imageT.imageStored}</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{imageT.imageUrlOptional}</p>
      <div className="flex gap-2">
        <Input value={url} onChange={(e) => onUrl(e.target.value)} placeholder="https://…" className="flex-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!url.trim() || isStoredImageUrl(url) || importing || uploading}
          onClick={() => void handleImportUrl()}
        >
          {imageT.importUrl}
        </Button>
      </div>
      {url && (
        <img
          src={url}
          alt=""
          className="mt-2 max-h-48 object-contain"
          onError={() => toast.error("Preview failed — import to storage or upload from computer.")}
        />
      )}
    </div>
  );
}
