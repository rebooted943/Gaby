import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ExhibitionAdmin } from "@/components/admin/exhibition-admin";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Row = Record<string, any>;
type FieldKind = "text" | "textarea" | "number" | "switch" | "date" | "image";
type Field = { name: string; label: string; kind: FieldKind };

function AdminPage() {
  const { t } = useI18n();
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [diag, setDiag] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user || isAdmin || loading) return;
    void (async () => {
      const rpc = await supabase.rpc("is_admin");
      const roles = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const lines = [
        rpc.error ? `is_admin(): ${rpc.error.message}` : `is_admin(): ${String(rpc.data)}`,
        roles.error ? `user_roles: ${roles.error.message}` : `user_roles: ${roles.data?.map((r) => r.role).join(", ") || "(nessuna riga visibile)"}`,
      ];
      setDiag(lines.join("\n"));
    })();
  }, [user, isAdmin, loading]);

  if (loading) return <div className="p-12 text-muted-foreground">…</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Access required</h1>
        <p className="mt-3 text-muted-foreground">This account does not have admin access. Ask the site owner to grant the admin role.</p>
        <p className="mt-2 text-xs text-muted-foreground">Your user id: {user.id}</p>
        {diag && (
          <pre className="mt-6 max-h-40 overflow-auto rounded border border-border bg-muted/40 p-3 text-left text-xs text-muted-foreground whitespace-pre-wrap">
            {diag}
          </pre>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          In Supabase → SQL Editor esegui il file <code className="text-foreground">supabase/scripts/fix-admin-access.sql</code>, poi logout e login.
        </p>
      </div>
    );
  }

  const projectFields: Field[] = [
    { name: "title_en", label: t.admin.fields.title_en, kind: "text" },
    { name: "title_ro", label: t.admin.fields.title_ro, kind: "text" },
    { name: "year", label: t.admin.fields.year, kind: "number" },
    { name: "museum", label: t.admin.fields.museum, kind: "text" },
    { name: "description_en", label: t.admin.fields.description_en, kind: "textarea" },
    { name: "description_ro", label: t.admin.fields.description_ro, kind: "textarea" },
    { name: "image_url", label: t.admin.fields.image_url, kind: "image" },
    { name: "sort_order", label: t.admin.fields.sort_order, kind: "number" },
  ];
  const shopFields: Field[] = [
    { name: "title_en", label: t.admin.fields.title_en, kind: "text" },
    { name: "title_ro", label: t.admin.fields.title_ro, kind: "text" },
    { name: "description_en", label: t.admin.fields.description_en, kind: "textarea" },
    { name: "description_ro", label: t.admin.fields.description_ro, kind: "textarea" },
    { name: "price", label: t.admin.fields.price, kind: "number" },
    { name: "currency", label: t.admin.fields.currency, kind: "text" },
    { name: "purchase_url", label: t.admin.fields.purchase_url, kind: "text" },
    { name: "image_url", label: t.admin.fields.image_url, kind: "image" },
    { name: "available", label: t.admin.fields.available, kind: "switch" },
  ];
  const eventFields: Field[] = [
    { name: "title_en", label: t.admin.fields.title_en, kind: "text" },
    { name: "title_ro", label: t.admin.fields.title_ro, kind: "text" },
    { name: "event_date", label: t.admin.fields.event_date, kind: "date" },
    { name: "location", label: t.admin.fields.location, kind: "text" },
    { name: "body_en", label: t.admin.fields.body_en, kind: "textarea" },
    { name: "body_ro", label: t.admin.fields.body_ro, kind: "textarea" },
    { name: "image_url", label: t.admin.fields.image_url, kind: "image" },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-eyebrow">{t.admin.title}</p>
      <h1 className="mt-3 font-display text-5xl text-foreground">{t.admin.sub}</h1>

      <Tabs defaultValue="projects" className="mt-12">
        <TabsList>
          <TabsTrigger value="projects">{t.admin.tabs.projects}</TabsTrigger>
          <TabsTrigger value="shop">{t.admin.tabs.shop}</TabsTrigger>
          <TabsTrigger value="exhibitions">{t.admin.tabs.exhibitions}</TabsTrigger>
          <TabsTrigger value="events">{t.admin.tabs.events}</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="mt-8">
          <CrudSection table="projects" queryKey={["projects-all"]} fields={projectFields} display={(r) => `${r.title_en}${r.year ? " · " + r.year : ""}`} />
        </TabsContent>
        <TabsContent value="shop" className="mt-8">
          <CrudSection table="shop_items" queryKey={["shop-all"]} fields={shopFields} defaults={{ available: true, currency: "EUR" }} display={(r) => `${r.title_en} — ${r.price} ${r.currency}`} />
        </TabsContent>
        <TabsContent value="exhibitions" className="mt-8">
          <ExhibitionAdmin />
        </TabsContent>
        <TabsContent value="events" className="mt-8">
          <CrudSection table="events" queryKey={["events-all"]} fields={eventFields} display={(r) => `${r.title_en}${r.event_date ? " · " + r.event_date : ""}`} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function CrudSection({
  table, queryKey, fields, display, defaults = {},
}: {
  table: "projects" | "shop_items" | "events";
  queryKey: any[];
  fields: Field[];
  display: (r: Row) => string;
  defaults?: Row;
}) {
  const qc = useQueryClient();
  const { t } = useI18n();
  const [editing, setEditing] = useState<Row | null>(null);

  const { data, refetch } = useQuery({
    queryKey: [table, "admin"],
    queryFn: async () => {
      const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false });
      return (data ?? []) as Row[];
    },
  });

  const startNew = () => setEditing({ ...defaults });

  const remove = async (id: string) => {
    if (!confirm(t.admin.confirmDelete)) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); refetch(); qc.invalidateQueries({ queryKey }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={startNew}>+ {t.admin.add}</Button>
      </div>

      {editing && (
        <RecordForm
          table={table}
          fields={fields}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); refetch(); qc.invalidateQueries({ queryKey }); qc.invalidateQueries({ queryKey: ["projects-home"] }); qc.invalidateQueries({ queryKey: ["events-home"] }); }}
        />
      )}

      <ul className="divide-y divide-border/40 border border-border/40">
        {(data ?? []).map((r) => (
          <li key={r.id} className="flex items-center gap-4 p-4">
            {r.image_url && <img src={r.image_url} alt="" className="h-14 w-14 object-cover" />}
            <span className="flex-1 text-sm">{display(r)}</span>
            <Button variant="ghost" size="sm" onClick={() => setEditing(r)}>{t.admin.edit}</Button>
            <Button variant="ghost" size="sm" onClick={() => remove(r.id)}>{t.admin.delete}</Button>
          </li>
        ))}
        {(data ?? []).length === 0 && <li className="p-6 text-sm text-muted-foreground">—</li>}
      </ul>
    </div>
  );
}

function RecordForm({
  table, fields, initial, onCancel, onSaved,
}: {
  table: "projects" | "shop_items" | "events";
  fields: Field[];
  initial: Row;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const [form, setForm] = useState<Row>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const update = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const uploadFile = async (file: File, fieldName: string) => {
    setUploading(true);
    const path = `${table}/${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, "_")}`;
    const { error } = await supabase.storage.from("artwork-images").upload(path, file, { upsert: false });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("artwork-images").getPublicUrl(path);
    update(fieldName, data.publicUrl);
    setUploading(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload: Row = {};
    for (const f of fields) {
      let v = form[f.name];
      if (f.kind === "number") v = v === "" || v == null ? null : Number(v);
      if (f.kind === "date") v = v || null;
      payload[f.name] = v;
    }
    const isUpdate = !!form.id;
    const tbl = supabase.from(table) as any;
    const res = isUpdate
      ? await tbl.update(payload).eq("id", form.id)
      : await tbl.insert(payload);
    setSaving(false);
    if (res.error) toast.error(res.error.message);
    else { toast.success("Saved"); onSaved(); }
  };

  return (
    <form onSubmit={save} className="space-y-5 border border-border/60 bg-card/30 p-6">
      {fields.map((f) => (
        <Field key={f.name} field={f} value={form[f.name] ?? ""} onChange={(v) => update(f.name, v)} onUpload={(file) => uploadFile(file, f.name)} uploading={uploading} />
      ))}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>{t.admin.cancel}</Button>
        <Button type="submit" disabled={saving || uploading}>{t.admin.save}</Button>
      </div>
    </form>
  );
}

function Field({ field, value, onChange, onUpload, uploading }: { field: Field; value: any; onChange: (v: any) => void; onUpload: (f: File) => void; uploading: boolean }) {
  const { t } = useI18n();
  const wrap = (node: ReactNode) => (
    <div className="space-y-2">
      <Label>{field.label}</Label>
      {node}
    </div>
  );
  switch (field.kind) {
    case "textarea":
      return wrap(<Textarea rows={4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />);
    case "number":
      return wrap(<Input type="number" step="any" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />);
    case "date":
      return wrap(<Input type="date" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />);
    case "switch":
      return (
        <div className="flex items-center justify-between border border-border/40 p-4">
          <Label>{field.label}</Label>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      );
    case "image":
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
              className="text-xs"
            />
            {uploading && <span className="text-xs text-muted-foreground">{t.admin.uploading}</span>}
          </div>
          {value && <img src={value} alt="" className="mt-2 max-h-40 object-contain" />}
        </div>
      );
    default:
      return wrap(<Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />);
  }
}