import { MOCK_PROJECT_LIST, projectsWithMocks } from "@/data/projects-mock";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;

export async function fetchProjects(limit?: number): Promise<{ data: Project[]; error: Error | null }> {
  let query = supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });

  if (limit != null) query = query.limit(limit);

  const { data, error } = await query;
  const list = projectsWithMocks(data ?? []);

  if (error && list.length === 0) {
    const fallback = limit != null ? MOCK_PROJECT_LIST.slice(0, limit) : MOCK_PROJECT_LIST;
    return { data: fallback, error: null };
  }

  return { data: limit != null ? list.slice(0, limit) : list, error: error ? new Error(error.message) : null };
}
