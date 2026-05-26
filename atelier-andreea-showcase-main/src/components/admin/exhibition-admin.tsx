import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { slugify, uploadAsset } from "@/lib/storage-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type GalleryRow = { image_url: string; caption_en: string; caption_ro: string; sort_order: number };
type VenueRow = { title_en: string; title_ro: string; image_url: string; external_url: string; sort_order: number };
type PressRow = { title_en: string; title_ro: string; url: string; sort_order: number };

type ExhibitionDraft = {
  id?: string;
  slug: string;
  title_en: string;
  title_ro: string;
  subtitle_en: string;
  subtitle_ro: string;
  overview_en: string;
  overview_ro: string;
  start_date: string;
  end_date: string;
  venue_en: string;
  venue_ro: string;
  poster_url: string;
  artist_name: string;
  curator_name_en: string;
  curator_name_ro: string;
  curator_bio_en: string;
  curator_bio_ro: string;
  book_pdf_url: string;
  published: boolean;
  sort_order: number;
  gallery: GalleryRow[];
  venues: VenueRow[];
  press: PressRow[];
  project_ids: string[];
};

const emptyDraft = (): ExhibitionDraft => ({
  slug: "",
  title_en: "",
  title_ro: "",
  subtitle_en: "",
  subtitle_ro: "",
  overview_en: "",
  overview_ro: "",
  start_date: "",
  end_date: "",
  venue_en: "",
  venue_ro: "",
  poster_url: "",
  artist_name: "Andreea Gabriela Tudor",
  curator_name_en: "",
  curator_name_ro: "",
  curator_bio_en: "",
  curator_bio_ro: "",
  book_pdf_url: "",
  published: false,
  sort_order: 0,
  gallery: [],
  venues: [],
  press: [],
  project_ids: [],
});

export function ExhibitionAdmin() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<ExhibitionDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: list, refetch } = useQuery({
    queryKey: ["exhibitions-admin"],
    queryFn: async () => {
      const { data } = await supabase.from("exhibitions").select("id, title_en, title_ro, slug, published, start_date, poster_url").order("sort_order", { ascending: false }).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: allProjects } = useQuery({
    queryKey: ["projects-all"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("id, title_en, title_ro, image_url, year").order("sort_order").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const loadForEdit = async (id: string) => {
    const { data: ex } = await supabase.from("exhibitions").select("*").eq("id", id).single();
    if (!ex) return;
    const [g, v, p, links] = await Promise.all([
      supabase.from("exhibition_gallery_images").select("*").eq("exhibition_id", id).order("sort_order"),
      supabase.from("exhibition_venues").select("*").eq("exhibition_id", id).order("sort_order"),
      supabase.from("exhibition_press_links").select("*").eq("exhibition_id", id).order("sort_order"),
      supabase.from("exhibition_projects").select("project_id").eq("exhibition_id", id).order("sort_order"),
    ]);
    setEditing({
      id: ex.id,
      slug: ex.slug,
      title_en: ex.title_en,
      title_ro: ex.title_ro,
      subtitle_en: ex.subtitle_en,
      subtitle_ro: ex.subtitle_ro,
      overview_en: ex.overview_en,
      overview_ro: ex.overview_ro,
      start_date: ex.start_date ?? "",
      end_date: ex.end_date ?? "",
      venue_en: ex.venue_en,
      venue_ro: ex.venue_ro,
      poster_url: ex.poster_url,
      artist_name: ex.artist_name,
      curator_name_en: ex.curator_name_en,
      curator_name_ro: ex.curator_name_ro,
      curator_bio_en: ex.curator_bio_en,
      curator_bio_ro: ex.curator_bio_ro,
      book_pdf_url: ex.book_pdf_url,
      published: ex.published,
      sort_order: ex.sort_order,
      gallery: (g.data ?? []).map((r) => ({ image_url: r.image_url, caption_en: r.caption_en, caption_ro: r.caption_ro, sort_order: r.sort_order })),
      venues: (v.data ?? []).map((r) => ({ title_en: r.title_en, title_ro: r.title_ro, image_url: r.image_url, external_url: r.external_url, sort_order: r.sort_order })),
      press: (p.data ?? []).map((r) => ({ title_en: r.title_en, title_ro: r.title_ro, url: r.url, sort_order: r.sort_order })),
      project_ids: (links.data ?? []).map((r) => r.project_id),
    });
  };

  const remove = async (id: string) => {
    if (!confirm(t.admin.confirmDelete)) return;
    const { error } = await supabase.from("exhibitions").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      refetch();
      qc.invalidateQueries({ queryKey: ["exhibitions-all"] });
    }
  };

  const upload = async (file: File, folder: string, onUrl: (url: string) => void) => {
    setUploading(true);
    const { url, error } = await uploadAsset(folder, file);
    setUploading(false);
    if (error || !url) toast.error(error ?? "Upload failed");
    else onUrl(url);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    let slug = editing.slug.trim() || slugify(editing.title_en);
    if (!slug) slug = `exhibition-${Date.now()}`;

    const payload = {
      slug,
      title_en: editing.title_en,
      title_ro: editing.title_ro,
      subtitle_en: editing.subtitle_en,
      subtitle_ro: editing.subtitle_ro,
      overview_en: editing.overview_en,
      overview_ro: editing.overview_ro,
      start_date: editing.start_date || null,
      end_date: editing.end_date || null,
      venue_en: editing.venue_en,
      venue_ro: editing.venue_ro,
      poster_url: editing.poster_url,
      artist_name: editing.artist_name,
      curator_name_en: editing.curator_name_en,
      curator_name_ro: editing.curator_name_ro,
      curator_bio_en: editing.curator_bio_en,
      curator_bio_ro: editing.curator_bio_ro,
      book_pdf_url: editing.book_pdf_url,
      published: editing.published,
      sort_order: Number(editing.sort_order) || 0,
    };

    let exhibitionId = editing.id;
    if (exhibitionId) {
      const { error } = await supabase.from("exhibitions").update(payload).eq("id", exhibitionId);
      if (error) {
        setSaving(false);
        toast.error(error.message);
        return;
      }
    } else {
      const { data, error } = await supabase.from("exhibitions").insert(payload).select("id").single();
      if (error || !data) {
        setSaving(false);
        toast.error(error?.message ?? "Insert failed");
        return;
      }
      exhibitionId = data.id;
    }

    await Promise.all([
      supabase.from("exhibition_gallery_images").delete().eq("exhibition_id", exhibitionId),
      supabase.from("exhibition_venues").delete().eq("exhibition_id", exhibitionId),
      supabase.from("exhibition_press_links").delete().eq("exhibition_id", exhibitionId),
      supabase.from("exhibition_projects").delete().eq("exhibition_id", exhibitionId),
    ]);

    if (editing.gallery.length) {
      await supabase.from("exhibition_gallery_images").insert(
        editing.gallery.map((g, i) => ({
          exhibition_id: exhibitionId!,
          image_url: g.image_url,
          caption_en: g.caption_en,
          caption_ro: g.caption_ro,
          sort_order: g.sort_order ?? i,
        })),
      );
    }
    if (editing.venues.length) {
      await supabase.from("exhibition_venues").insert(
        editing.venues.map((v, i) => ({
          exhibition_id: exhibitionId!,
          title_en: v.title_en,
          title_ro: v.title_ro,
          image_url: v.image_url,
          external_url: v.external_url,
          sort_order: v.sort_order ?? i,
        })),
      );
    }
    if (editing.press.length) {
      await supabase.from("exhibition_press_links").insert(
        editing.press.map((p, i) => ({
          exhibition_id: exhibitionId!,
          title_en: p.title_en,
          title_ro: p.title_ro,
          url: p.url,
          sort_order: p.sort_order ?? i,
        })),
      );
    }
    if (editing.project_ids.length) {
      await supabase.from("exhibition_projects").insert(
        editing.project_ids.map((project_id, i) => ({
          exhibition_id: exhibitionId!,
          project_id,
          sort_order: i,
        })),
      );
    }

    setSaving(false);
    toast.success("Saved");
    setEditing(null);
    refetch();
    qc.invalidateQueries({ queryKey: ["exhibitions-all"] });
    qc.invalidateQueries({ queryKey: ["exhibitions-home"] });
  };

  const set = <K extends keyof ExhibitionDraft>(key: K, value: ExhibitionDraft[K]) => {
    setEditing((d) => (d ? { ...d, [key]: value } : d));
  };

  if (!editing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setEditing(emptyDraft())}>+ {t.admin.add}</Button>
        </div>
        <ul className="divide-y divide-border/40 border border-border/40">
          {(list ?? []).map((r) => (
            <li key={r.id} className="flex items-center gap-4 p-4">
              {r.poster_url ? <img src={r.poster_url} alt="" className="h-14 w-10 object-cover" /> : <div className="h-14 w-10 bg-muted" />}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{r.title_en}</p>
                <p className="text-xs text-muted-foreground">
                  /exhibitions/{r.slug} · {r.published ? t.admin.exhibitions.published : t.admin.exhibitions.draft}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => loadForEdit(r.id)}>
                {t.admin.edit}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => remove(r.id)}>
                {t.admin.delete}
              </Button>
            </li>
          ))}
          {(list ?? []).length === 0 && <li className="p-6 text-sm text-muted-foreground">—</li>}
        </ul>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="space-y-10 border border-border/60 bg-card/30 p-6">
      <AdminSection title={t.admin.exhibitions.sections.basics}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.admin.fields.title_en}><Input value={editing.title_en} onChange={(e) => set("title_en", e.target.value)} required /></Field>
          <Field label={t.admin.fields.title_ro}><Input value={editing.title_ro} onChange={(e) => set("title_ro", e.target.value)} required /></Field>
          <Field label={t.admin.exhibitions.fields.subtitle_en}><Input value={editing.subtitle_en} onChange={(e) => set("subtitle_en", e.target.value)} /></Field>
          <Field label={t.admin.exhibitions.fields.subtitle_ro}><Input value={editing.subtitle_ro} onChange={(e) => set("subtitle_ro", e.target.value)} /></Field>
          <Field label={t.admin.exhibitions.fields.slug}><Input value={editing.slug} onChange={(e) => set("slug", e.target.value)} placeholder={slugify(editing.title_en)} /></Field>
          <Field label={t.admin.fields.sort_order}><Input type="number" value={editing.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} /></Field>
          <Field label={t.admin.exhibitions.fields.start_date}><Input type="date" value={editing.start_date} onChange={(e) => set("start_date", e.target.value)} /></Field>
          <Field label={t.admin.exhibitions.fields.end_date}><Input type="date" value={editing.end_date} onChange={(e) => set("end_date", e.target.value)} /></Field>
          <Field label={t.admin.exhibitions.fields.venue_en}><Input value={editing.venue_en} onChange={(e) => set("venue_en", e.target.value)} /></Field>
          <Field label={t.admin.exhibitions.fields.venue_ro}><Input value={editing.venue_ro} onChange={(e) => set("venue_ro", e.target.value)} /></Field>
        </div>
        <div className="mt-4 space-y-4">
          <Field label={t.admin.exhibitions.fields.overview_en}><Textarea rows={4} value={editing.overview_en} onChange={(e) => set("overview_en", e.target.value)} /></Field>
          <Field label={t.admin.exhibitions.fields.overview_ro}><Textarea rows={4} value={editing.overview_ro} onChange={(e) => set("overview_ro", e.target.value)} /></Field>
        </div>
        <div className="mt-4 flex items-center justify-between border border-border/40 p-4">
          <Label>{t.admin.exhibitions.fields.published}</Label>
          <Switch checked={editing.published} onCheckedChange={(v) => set("published", v)} />
        </div>
      </AdminSection>

      <AdminSection title={t.admin.exhibitions.sections.credits}>
        <ImageUpload label={t.admin.exhibitions.fields.poster} url={editing.poster_url} onUrl={(u) => set("poster_url", u)} onFile={(f) => upload(f, "exhibitions/posters", (u) => set("poster_url", u))} uploading={uploading} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label={t.admin.exhibitions.fields.artist_name}><Input value={editing.artist_name} onChange={(e) => set("artist_name", e.target.value)} /></Field>
          <Field label={t.admin.exhibitions.fields.curator_en}><Input value={editing.curator_name_en} onChange={(e) => set("curator_name_en", e.target.value)} /></Field>
          <Field label={t.admin.exhibitions.fields.curator_ro}><Input value={editing.curator_name_ro} onChange={(e) => set("curator_name_ro", e.target.value)} /></Field>
        </div>
        <div className="mt-4 space-y-4">
          <Field label={t.admin.exhibitions.fields.curator_bio_en}><Textarea rows={4} value={editing.curator_bio_en} onChange={(e) => set("curator_bio_en", e.target.value)} /></Field>
          <Field label={t.admin.exhibitions.fields.curator_bio_ro}><Textarea rows={4} value={editing.curator_bio_ro} onChange={(e) => set("curator_bio_ro", e.target.value)} /></Field>
        </div>
      </AdminSection>

      <AdminSection title={t.admin.exhibitions.sections.gallery}>
        {editing.gallery.map((row, i) => (
          <div key={i} className="mb-4 space-y-3 border border-border/40 p-4">
            <ImageUpload label={`${t.admin.exhibitions.fields.galleryImage} ${i + 1}`} url={row.image_url} onUrl={(u) => { const g = [...editing.gallery]; g[i] = { ...g[i], image_url: u }; set("gallery", g); }} onFile={(f) => upload(f, "exhibitions/gallery", (u) => { const g = [...editing.gallery]; g[i] = { ...g[i], image_url: u }; set("gallery", g); })} uploading={uploading} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t.admin.exhibitions.fields.caption_en}><Input value={row.caption_en} onChange={(e) => { const g = [...editing.gallery]; g[i] = { ...g[i], caption_en: e.target.value }; set("gallery", g); }} /></Field>
              <Field label={t.admin.exhibitions.fields.caption_ro}><Input value={row.caption_ro} onChange={(e) => { const g = [...editing.gallery]; g[i] = { ...g[i], caption_ro: e.target.value }; set("gallery", g); }} /></Field>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => set("gallery", editing.gallery.filter((_, j) => j !== i))}>{t.admin.delete}</Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => set("gallery", [...editing.gallery, { image_url: "", caption_en: "", caption_ro: "", sort_order: editing.gallery.length }])}>
          + {t.admin.exhibitions.addGalleryImage}
        </Button>
      </AdminSection>

      <AdminSection title={t.admin.exhibitions.sections.venues}>
        {editing.venues.map((row, i) => (
          <div key={i} className="mb-4 space-y-3 border border-border/40 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t.admin.fields.title_en}><Input value={row.title_en} onChange={(e) => { const v = [...editing.venues]; v[i] = { ...v[i], title_en: e.target.value }; set("venues", v); }} /></Field>
              <Field label={t.admin.fields.title_ro}><Input value={row.title_ro} onChange={(e) => { const v = [...editing.venues]; v[i] = { ...v[i], title_ro: e.target.value }; set("venues", v); }} /></Field>
              <Field label={t.admin.exhibitions.fields.external_url}><Input value={row.external_url} onChange={(e) => { const v = [...editing.venues]; v[i] = { ...v[i], external_url: e.target.value }; set("venues", v); }} /></Field>
            </div>
            <ImageUpload label={t.admin.fields.image_url} url={row.image_url} onUrl={(u) => { const v = [...editing.venues]; v[i] = { ...v[i], image_url: u }; set("venues", v); }} onFile={(f) => upload(f, "exhibitions/venues", (u) => { const v = [...editing.venues]; v[i] = { ...v[i], image_url: u }; set("venues", v); })} uploading={uploading} />
            <Button type="button" variant="ghost" size="sm" onClick={() => set("venues", editing.venues.filter((_, j) => j !== i))}>{t.admin.delete}</Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => set("venues", [...editing.venues, { title_en: "", title_ro: "", image_url: "", external_url: "", sort_order: editing.venues.length }])}>
          + {t.admin.exhibitions.addVenue}
        </Button>
      </AdminSection>

      <AdminSection title={t.admin.exhibitions.sections.press}>
        {editing.press.map((row, i) => (
          <div key={i} className="mb-4 grid gap-3 border border-border/40 p-4 sm:grid-cols-2">
            <Field label={t.admin.fields.title_en}><Input value={row.title_en} onChange={(e) => { const p = [...editing.press]; p[i] = { ...p[i], title_en: e.target.value }; set("press", p); }} /></Field>
            <Field label={t.admin.fields.title_ro}><Input value={row.title_ro} onChange={(e) => { const p = [...editing.press]; p[i] = { ...p[i], title_ro: e.target.value }; set("press", p); }} /></Field>
            <Field label={t.admin.exhibitions.fields.article_url} className="sm:col-span-2"><Input value={row.url} onChange={(e) => { const p = [...editing.press]; p[i] = { ...p[i], url: e.target.value }; set("press", p); }} /></Field>
            <Button type="button" variant="ghost" size="sm" className="sm:col-span-2" onClick={() => set("press", editing.press.filter((_, j) => j !== i))}>{t.admin.delete}</Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => set("press", [...editing.press, { title_en: "", title_ro: "", url: "", sort_order: editing.press.length }])}>
          + {t.admin.exhibitions.addPress}
        </Button>
      </AdminSection>

      <AdminSection title={t.admin.exhibitions.sections.book}>
        <Field label={t.admin.exhibitions.fields.book_pdf}>
          <Input value={editing.book_pdf_url} onChange={(e) => set("book_pdf_url", e.target.value)} placeholder="https://…" />
          <input type="file" accept="application/pdf" className="mt-2 text-xs" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, "exhibitions/catalogs", (u) => set("book_pdf_url", u)); }} />
        </Field>
      </AdminSection>

      <AdminSection title={t.admin.exhibitions.sections.artworks}>
        <p className="mb-3 text-sm text-muted-foreground">{t.admin.exhibitions.artworksHint}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(allProjects ?? []).map((p) => {
            const checked = editing.project_ids.includes(p.id);
            return (
              <label key={p.id} className="flex cursor-pointer items-center gap-3 border border-border/40 p-3 hover:bg-card/50">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    set(
                      "project_ids",
                      checked ? editing.project_ids.filter((id) => id !== p.id) : [...editing.project_ids, p.id],
                    );
                  }}
                  className="accent-primary"
                />
                {p.image_url && <img src={p.image_url} alt="" className="h-10 w-8 object-cover" />}
                <span className="text-sm">{p.title_en}{p.year ? ` · ${p.year}` : ""}</span>
              </label>
            );
          })}
        </div>
      </AdminSection>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => setEditing(null)}>{t.admin.cancel}</Button>
        <Button type="submit" disabled={saving || uploading}>{saving ? "…" : t.admin.save}</Button>
      </div>
    </form>
  );
}

function AdminSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border/40 pt-8 first:border-t-0 first:pt-0">
      <h3 className="mb-4 font-display text-2xl text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      {children}
    </div>
  );
}

function ImageUpload({
  label, url, onUrl, onFile, uploading,
}: {
  label: string;
  url: string;
  onUrl: (url: string) => void;
  onFile: (file: File) => void;
  uploading: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={url} onChange={(e) => onUrl(e.target.value)} placeholder="https://…" />
      <div className="flex items-center gap-3">
        <input type="file" accept="image/*" className="text-xs" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        {uploading && <span className="text-xs text-muted-foreground">{t.admin.uploading}</span>}
      </div>
      {url && <img src={url} alt="" className="mt-2 max-h-48 object-contain" />}
    </div>
  );
}
