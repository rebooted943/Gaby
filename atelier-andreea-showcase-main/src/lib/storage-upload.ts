import { supabase } from "@/integrations/supabase/client";

const BUCKET = "artwork-images";

export async function uploadAsset(
  folder: string,
  file: File,
): Promise<{ url: string | null; error: string | null }> {
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, "_")}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "exhibition";
}
