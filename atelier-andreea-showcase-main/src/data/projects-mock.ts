import type { Tables } from "@/integrations/supabase/types";
import heroHome from "@/assets/hero-home.jpg";
import heroAtmosphere from "@/assets/hero-atmosphere.jpg";
import proPic from "@/assets/pro_pic.jpg";
import { shouldUseSiteMocks } from "@/data/mock-env";

export type MockProject = Tables<"projects">;

const imgs = [heroHome, heroAtmosphere, proPic, heroAtmosphere, heroHome, proPic, heroAtmosphere, heroHome, proPic];
const now = new Date().toISOString();

function project(
  id: string,
  sort: number,
  title_en: string,
  title_ro: string,
  year: number,
  museum: string,
  description_en: string,
  description_ro: string,
  imageIndex: number,
): MockProject {
  return {
    id,
    title_en,
    title_ro,
    description_en,
    description_ro,
    year,
    museum,
    image_url: imgs[imageIndex % imgs.length],
    sort_order: sort,
    created_at: now,
    updated_at: now,
  };
}

export const MOCK_PROJECT_LIST: MockProject[] = [
  project(
    "mock-project-echo-violet",
    90,
    "Echo in violet",
    "Ecou în violet",
    2024,
    "Elite Art Gallery · Bucharest",
    "Oil on canvas — a study in gesture and dusk light. The surface holds layers of transparent glaze over an underdrawing in charcoal.",
    "Ulei pe pânză — studiu al gestului și luminii de amurg. Suprafața păstrează straturi de glazură transparentă peste un desen subiacent în cărbune.",
    0,
  ),
  project(
    "mock-project-room-remembers",
    80,
    "The room remembers",
    "Camera își amintește",
    2023,
    "MNAC · Bucharest",
    "Mixed media on paper — domestic architecture dissolved into rhythmic marks.",
    "Tehnică mixtă pe hârtie — arhitectura domestică dizolvată în semne ritmice.",
    1,
  ),
  project(
    "mock-project-threshold",
    70,
    "Threshold figure",
    "Figură de prag",
    2025,
    "Private collection",
    "Oil and collage on canvas. A figure at the edge between presence and withdrawal.",
    "Ulei și colaj pe pânză. O figură la marginea dintre prezență și retragere.",
    2,
  ),
  project(
    "mock-project-collective-dream",
    60,
    "Collective dream residue",
    "Reziduu de vis colectiv",
    2024,
    "Galeria Arte · Galați",
    "Large-format painting examining shared myth and everyday ritual.",
    "Pictură de format mare care examinează mitul comun și ritualul cotidian.",
    3,
  ),
  project(
    "mock-project-desacral",
    50,
    "Desacralisation (study)",
    "Desacralizare (studiu)",
    2023,
    "Salonul Artelor Frumoase",
    "Collage and oil — fragments of folk motif reassembled in a contemporary register.",
    "Colaj și ulei — fragmente de motiv popular reasamblate într-un registru contemporan.",
    4,
  ),
  project(
    "mock-project-intimacy",
    40,
    "Interior with two windows",
    "Interior cu două ferestre",
    2022,
    "",
    "Intimate scale work on panel — light entering from opposite walls.",
    "Lucrare la scară intimă pe panou — lumină care intră din ziduri opuse.",
    5,
  ),
  project(
    "mock-project-lascar",
    30,
    "Biennial installation (detail)",
    "Detaliu instalație bienală",
    2024,
    "Palatul Cultural · Piatra Neamț",
    "Awarded debut work — spatial arrangement of painting, object, and projected drawing.",
    "Lucrare premiată la debut — aranjament spațial de pictură, obiect și desen proiectat.",
    6,
  ),
  project(
    "mock-project-fresh",
    20,
    "#Fresh — winning panel",
    "#Fresh — panou câștigător",
    2024,
    "Elite Art Gallery",
    "Competition work exploring egocentrism and the idea of freedom in a crowded visual field.",
    "Lucrare de concurs care explorează egocentrismul și ideea de libertate într-un câmp vizual aglomerat.",
    7,
  ),
  project(
    "mock-project-silent-field",
    10,
    "Silent field (triptych centre)",
    "Câmp mut (centrul tripticului)",
    2025,
    "Elite Art Gallery",
    "Central panel of a triptych shown at Fragments of a Silent Field.",
    "Panoul central al unui triptic expus în „Fragmente dintr-un câmp mut”.",
    8,
  ),
];

export function isMockProjectId(id: string): boolean {
  return id.startsWith("mock-project-");
}

export function projectsWithMocks(dbList: MockProject[]): MockProject[] {
  if (!shouldUseSiteMocks(dbList.length)) return dbList;
  const dbIds = new Set(dbList.map((p) => p.id));
  const extras = MOCK_PROJECT_LIST.filter((m) => !dbIds.has(m.id));
  return [...dbList, ...extras].sort((a, b) => b.sort_order - a.sort_order);
}
