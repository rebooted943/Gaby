import { supabase } from "@/integrations/supabase/client";

const BUCKET = "artwork-images";
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 0.85;

export function isStoredImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.pathname.includes(`/storage/v1/object/public/${BUCKET}/`);
  } catch {
    return false;
  }
}

/** Light client-side compression before upload (JPEG, max width 1920px). */
export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }
  if (file.size < 200_000) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
  });
  if (!blob) return file;

  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

export async function uploadAsset(
  folder: string,
  file: File,
): Promise<{ url: string | null; error: string | null }> {
  const compressed = await compressImageFile(file);
  const path = `${folder}/${Date.now()}-${compressed.name.replace(/[^a-z0-9._-]/gi, "_")}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    upsert: false,
    contentType: compressed.type,
  });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

/** Fetch an external image URL and store it in Supabase (when CORS allows). */
export async function importImageFromUrl(
  url: string,
  folder: string,
): Promise<{ url: string | null; error: string | null }> {
  const trimmed = url.trim();
  if (!trimmed) return { url: null, error: "Empty URL" };
  if (isStoredImageUrl(trimmed)) return { url: trimmed, error: null };

  try {
    const res = await fetch(trimmed);
    if (!res.ok) return { url: null, error: `Could not fetch image (${res.status})` };
    const blob = await res.blob();
    if (!blob.type.startsWith("image/")) return { url: null, error: "URL does not point to an image" };
    const ext = blob.type.includes("png") ? "png" : "jpg";
    const file = new File([blob], `import.${ext}`, { type: blob.type });
    return uploadAsset(folder, file);
  } catch {
    return {
      url: null,
      error: "Cannot import this link (blocked by the site). Upload the file from your computer instead.",
    };
  }
}

export async function ensureStoredImageUrl(url: string, folder: string): Promise<string> {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (isStoredImageUrl(trimmed)) return trimmed;
  const { url: stored, error } = await importImageFromUrl(trimmed, folder);
  if (stored) return stored;
  throw new Error(error ?? "Import failed");
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

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
