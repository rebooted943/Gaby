import type { Tables } from "@/integrations/supabase/types";
import heroHome from "@/assets/hero-home.jpg";
import heroAtmosphere from "@/assets/hero-atmosphere.jpg";
import proPic from "@/assets/pro_pic.jpg";
import { shouldUseSiteMocks } from "@/data/mock-env";

export type MockShopItem = Tables<"shop_items">;

const now = new Date().toISOString();

export const MOCK_SHOP_LIST: MockShopItem[] = [
  {
    id: "mock-shop-echo-violet",
    title_en: "Echo in violet",
    title_ro: "Ecou în violet",
    description_en: "Oil on canvas, 80 × 100 cm. Signed on verso. Ships rolled in a tube or stretched by arrangement.",
    description_ro: "Ulei pe pânză, 80 × 100 cm. Semnată pe verso. Expediere rulată în tub sau întinsă la cerere.",
    price: 2400,
    currency: "EUR",
    available: true,
    purchase_url: "mailto:atelier@example.com?subject=Echo%20in%20violet",
    image_url: heroHome,
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-shop-threshold",
    title_en: "Threshold figure",
    title_ro: "Figură de prag",
    description_en: "Oil and collage, 60 × 80 cm. One of a kind.",
    description_ro: "Ulei și colaj, 60 × 80 cm. Piesă unică.",
    price: 1800,
    currency: "EUR",
    available: true,
    purchase_url: "mailto:atelier@example.com?subject=Threshold%20figure",
    image_url: proPic,
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-shop-interior",
    title_en: "Interior with two windows",
    title_ro: "Interior cu două ferestre",
    description_en: "Oil on panel, 40 × 50 cm.",
    description_ro: "Ulei pe panou, 40 × 50 cm.",
    price: 950,
    currency: "EUR",
    available: false,
    purchase_url: null,
    image_url: heroAtmosphere,
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-shop-collective",
    title_en: "Collective dream residue",
    title_ro: "Reziduu de vis colectiv",
    description_en: "Oil on canvas, 100 × 120 cm. Studio price — inquiries welcome.",
    description_ro: "Ulei pe pânză, 100 × 120 cm. Preț de atelier — la cerere.",
    price: 3200,
    currency: "EUR",
    available: true,
    purchase_url: "mailto:atelier@example.com?subject=Collective%20dream",
    image_url: heroAtmosphere,
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-shop-study",
    title_en: "Desacralisation (study)",
    title_ro: "Desacralizare (studiu)",
    description_en: "Mixed media on paper, 50 × 70 cm. Framed under museum glass optional.",
    description_ro: "Tehnică mixtă pe hârtie, 50 × 70 cm. Înrămare sub sticlă muzeală opțională.",
    price: 620,
    currency: "EUR",
    available: true,
    purchase_url: "mailto:atelier@example.com?subject=Desacralisation%20study",
    image_url: heroHome,
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-shop-drawing",
    title_en: "Gesture suite IV",
    title_ro: "Suită de gest IV",
    description_en: "Charcoal and ink on paper, 30 × 42 cm.",
    description_ro: "Cărbune și cerneală pe hârtie, 30 × 42 cm.",
    price: 380,
    currency: "EUR",
    available: false,
    purchase_url: null,
    image_url: proPic,
    created_at: now,
    updated_at: now,
  },
];

export function isMockShopId(id: string): boolean {
  return id.startsWith("mock-shop-");
}

export function shopWithMocks(dbList: MockShopItem[]): MockShopItem[] {
  if (!shouldUseSiteMocks(dbList.length)) return dbList;
  const dbIds = new Set(dbList.map((s) => s.id));
  const extras = MOCK_SHOP_LIST.filter((m) => !dbIds.has(m.id));
  return [...dbList, ...extras].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}
