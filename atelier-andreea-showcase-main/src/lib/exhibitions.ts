import {
  exhibitionsWithMocks,
  getMockExhibitionDetail,
  isMockExhibitionId,
} from "@/data/exhibitions-mock";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Exhibition = Tables<"exhibitions">;
export type GalleryImage = Tables<"exhibition_gallery_images">;
export type ExhibitionVenue = Tables<"exhibition_venues">;
export type PressLink = Tables<"exhibition_press_links">;

export type ExhibitionProject = Tables<"projects">;

export type ExhibitionDetail = Exhibition & {
  gallery: GalleryImage[];
  venues: ExhibitionVenue[];
  press: PressLink[];
  artworks: ExhibitionProject[];
};

export async function fetchPublishedExhibitions() {
  const { data, error } = await supabase
    .from("exhibitions")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: false })
    .order("start_date", { ascending: false });

  const list = data ?? [];
  if (error && list.length === 0) {
    return { data: exhibitionsWithMocks([]), error: null };
  }
  return { data: exhibitionsWithMocks(list), error };
}

export async function fetchExhibitionDetail(id: string): Promise<{ data: ExhibitionDetail | null; error: Error | null }> {
  if (isMockExhibitionId(id)) {
    return { data: getMockExhibitionDetail(id), error: null };
  }

  const { data: exhibition, error } = await supabase
    .from("exhibitions")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error) return { data: null, error: new Error(error.message) };
  if (!exhibition) return { data: null, error: null };

  const [gallery, venues, press, links] = await Promise.all([
    supabase.from("exhibition_gallery_images").select("*").eq("exhibition_id", id).order("sort_order"),
    supabase.from("exhibition_venues").select("*").eq("exhibition_id", id).order("sort_order"),
    supabase.from("exhibition_press_links").select("*").eq("exhibition_id", id).order("sort_order"),
    supabase.from("exhibition_projects").select("project_id, sort_order").eq("exhibition_id", id).order("sort_order"),
  ]);

  let artworks: ExhibitionProject[] = [];
  const projectIds = (links.data ?? []).map((l) => l.project_id);
  if (projectIds.length > 0) {
    const { data: projects } = await supabase.from("projects").select("*").in("id", projectIds);
    const order = new Map(projectIds.map((pid, i) => [pid, i]));
    artworks = (projects ?? []).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  }

  return {
    data: {
      ...exhibition,
      gallery: gallery.data ?? [],
      venues: venues.data ?? [],
      press: press.data ?? [],
      artworks,
    },
    error: null,
  };
}

export function formatExhibitionDates(
  start: string | null,
  end: string | null,
  lang: "en" | "ro",
) {
  if (!start && !end) return "";
  const locale = lang === "ro" ? "ro-RO" : "en-GB";
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  if (start && end && start !== end) return `${fmt(start)} — ${fmt(end)}`;
  if (start) return fmt(start);
  return end ? fmt(end) : "";
}
