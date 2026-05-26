import { MOCK_SHOP_LIST, shopWithMocks } from "@/data/shop-mock";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ShopItem = Tables<"shop_items">;

export async function fetchShopItems(limit?: number): Promise<{ data: ShopItem[]; error: Error | null }> {
  let query = supabase.from("shop_items").select("*").order("created_at", { ascending: false });
  if (limit != null) query = query.limit(limit);

  const { data, error } = await query;
  const list = shopWithMocks(data ?? []);

  if (error && list.length === 0) {
    const fallback = limit != null ? MOCK_SHOP_LIST.slice(0, limit) : MOCK_SHOP_LIST;
    return { data: fallback, error: null };
  }

  return { data: limit != null ? list.slice(0, limit) : list, error: error ? new Error(error.message) : null };
}
