import { shouldUseSiteMocks } from "@/data/mock-env";
import { MOCK_PROJECT_LIST } from "@/data/projects-mock";
import type { Exhibition, ExhibitionDetail } from "@/lib/exhibitions";
import heroHome from "@/assets/hero-home.jpg";
import heroAtmosphere from "@/assets/hero-atmosphere.jpg";
import proPic from "@/assets/pro_pic.jpg";

/** Public-domain sample PDF for catalogue preview */
export const MOCK_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const now = new Date().toISOString();

const mockArtworks = MOCK_PROJECT_LIST.slice(0, 3);

export const MOCK_EXHIBITION_IDS = {
  silentField: "mock-exhibition-silent-field",
  collectiveMind: "mock-exhibition-collective-mind",
  lascarVorel: "mock-exhibition-lascar-vorel",
} as const;

const exhibitionSilentField: Exhibition = {
  id: MOCK_EXHIBITION_IDS.silentField,
  slug: "fragments-silent-field",
  title_en: "Fragments of a Silent Field",
  title_ro: "Fragmente dintr-un câmp mut",
  subtitle_en: "Solo exhibition — paintings & collage",
  subtitle_ro: "Expoziție personală — pictură & colaj",
  overview_en:
    "A gathering of recent paintings and collages exploring the threshold between figurative memory and abstract atmosphere. The works trace interior landscapes shaped by silence, collective emotion, and the painterly gesture as an act of listening.",
  overview_ro:
    "O adunare de picturi și colaje recente care explorează pragul dintre memoria figurativă și atmosfera abstractă. Lucrările urmăresc peisaje interioare modelate de tăcere, emoție colectivă și gestul pictural ca act de ascultare.",
  start_date: "2025-03-14",
  end_date: "2025-05-18",
  venue_en: "Elite Art Gallery · Bucharest",
  venue_ro: "Elite Art Gallery · București",
  poster_url: heroHome,
  artist_name: "Andreea Gabriela Tudor",
  curator_name_en: "Dr. Elena Vasilescu",
  curator_name_ro: "Dr. Elena Vasilescu",
  curator_bio_en:
    "Elena Vasilescu is a curator and art historian based in Bucharest, specialising in contemporary painting in Eastern Europe. She has curated exhibitions for the National Museum of Contemporary Art and independent spaces across Romania.",
  curator_bio_ro:
    "Elena Vasilescu este curator și istoric de artă, cu sediul în București, specializată în pictura contemporană din Europa de Est. A curatoriat expoziții pentru Muzeul Național de Artă Contemporană și spații independente din România.",
  book_pdf_url: MOCK_PDF_URL,
  published: true,
  sort_order: 10,
  created_at: now,
  updated_at: now,
};

const exhibitionCollectiveMind: Exhibition = {
  id: MOCK_EXHIBITION_IDS.collectiveMind,
  slug: "collective-mind-residues",
  title_en: "Residues of the Collective Mind",
  title_ro: "Reziduuri ale minții colective",
  subtitle_en: "Group show — selected works",
  subtitle_ro: "Expoziție de grup — lucrări selectate",
  overview_en:
    "A concise presentation of works examining shared myths, everyday ritual, and the desacralisation of tradition in contemporary life.",
  overview_ro:
    "O prezentare concisă de lucrări care examinează miturile comune, ritualul cotidian și desacralizarea tradiției în viața contemporană.",
  start_date: "2024-11-02",
  end_date: "2024-12-20",
  venue_en: "Galeria Arte · Galați",
  venue_ro: "Galeria Arte · Galați",
  poster_url: heroAtmosphere,
  artist_name: "Andreea Gabriela Tudor",
  curator_name_en: "Mihai Popescu",
  curator_name_ro: "Mihai Popescu",
  curator_bio_en: "Independent curator and writer, focused on emerging Romanian artists.",
  curator_bio_ro: "Curator independent și scriitor, focusat pe artiști români emergenți.",
  book_pdf_url: "",
  published: true,
  sort_order: 5,
  created_at: now,
  updated_at: now,
};

const exhibitionLascarVorel: Exhibition = {
  id: MOCK_EXHIBITION_IDS.lascarVorel,
  slug: "lascar-vorel-debut",
  title_en: "Debut — Lascăr Vorel Biennial",
  title_ro: "Debut — Bienala „Lascăr Vorel”",
  subtitle_en: "Awarded work · Piatra Neamț",
  subtitle_ro: "Lucrare premiată · Piatra Neamț",
  overview_en:
    "Presentation of the debut prize-winning installation following the 18th edition of the Lascăr Vorel National Biennial of Fine Arts.",
  overview_ro:
    "Prezentarea instalației câștigătoare a Premiului pentru Debut în cadrul ediției a XVIII-a a Bienalei Naționale de Artă Plastică „Lascăr Vorel”.",
  start_date: "2024-06-01",
  end_date: "2024-07-15",
  venue_en: "Cuza Vodă Cultural Palace",
  venue_ro: "Palatul Cultural „Cuza Vodă”",
  poster_url: proPic,
  artist_name: "Andreea Gabriela Tudor",
  curator_name_en: "",
  curator_name_ro: "",
  curator_bio_en: "",
  curator_bio_ro: "",
  book_pdf_url: "",
  published: true,
  sort_order: 1,
  created_at: now,
  updated_at: now,
};

export const MOCK_EXHIBITION_LIST: Exhibition[] = [
  exhibitionSilentField,
  exhibitionCollectiveMind,
  exhibitionLascarVorel,
];

const detailSilentField: ExhibitionDetail = {
  ...exhibitionSilentField,
  gallery: [
    {
      id: "mock-gal-1",
      exhibition_id: exhibitionSilentField.id,
      image_url: heroHome,
      caption_en: "Installation view — main hall",
      caption_ro: "Vedere instalare — sala principală",
      sort_order: 0,
      created_at: now,
    },
    {
      id: "mock-gal-2",
      exhibition_id: exhibitionSilentField.id,
      image_url: heroAtmosphere,
      caption_en: "Detail of collage layer",
      caption_ro: "Detaliu strat de colaj",
      sort_order: 1,
      created_at: now,
    },
    {
      id: "mock-gal-3",
      exhibition_id: exhibitionSilentField.id,
      image_url: proPic,
      caption_en: "Opening night",
      caption_ro: "Vernisaj",
      sort_order: 2,
      created_at: now,
    },
    {
      id: "mock-gal-4",
      exhibition_id: exhibitionSilentField.id,
      image_url: heroAtmosphere,
      caption_en: "Works on paper series",
      caption_ro: "Seria de lucrări pe hârtie",
      sort_order: 3,
      created_at: now,
    },
  ],
  venues: [
    {
      id: "mock-venue-1",
      exhibition_id: exhibitionSilentField.id,
      title_en: "Elite Art Gallery — Bucharest",
      title_ro: "Elite Art Gallery — București",
      image_url: heroHome,
      external_url: "https://example.com/venues/bucharest",
      sort_order: 0,
      created_at: now,
    },
    {
      id: "mock-venue-2",
      exhibition_id: exhibitionSilentField.id,
      title_en: "Galeria Arte — Galați",
      title_ro: "Galeria Arte — Galați",
      image_url: heroAtmosphere,
      external_url: "https://example.com/venues/galati",
      sort_order: 1,
      created_at: now,
    },
  ],
  press: [
    {
      id: "mock-press-1",
      exhibition_id: exhibitionSilentField.id,
      title_en: "A painter listening to silence",
      title_ro: "O pictoriță care ascultă tăcerea",
      url: "https://example.com/press/article-1",
      sort_order: 0,
      created_at: now,
    },
    {
      id: "mock-press-2",
      exhibition_id: exhibitionSilentField.id,
      title_en: "Fragments between figurative and abstract",
      title_ro: "Fragmente între figurativ și abstract",
      url: "https://example.com/press/article-2",
      sort_order: 1,
      created_at: now,
    },
    {
      id: "mock-press-3",
      exhibition_id: exhibitionSilentField.id,
      title_en: "Studio visit: Andreea Gabriela Tudor",
      title_ro: "Vizită în atelier: Andreea Gabriela Tudor",
      url: "https://example.com/press/article-3",
      sort_order: 2,
      created_at: now,
    },
  ],
  artworks: mockArtworks,
};

const detailCollectiveMind: ExhibitionDetail = {
  ...exhibitionCollectiveMind,
  gallery: [
    {
      id: "mock-gal-c1",
      exhibition_id: exhibitionCollectiveMind.id,
      image_url: heroAtmosphere,
      caption_en: "Group hang",
      caption_ro: "Expunere de grup",
      sort_order: 0,
      created_at: now,
    },
  ],
  venues: [
    {
      id: "mock-venue-c1",
      exhibition_id: exhibitionCollectiveMind.id,
      title_en: "Galeria Arte",
      title_ro: "Galeria Arte",
      image_url: proPic,
      external_url: "https://example.com/venues/galeria-arte",
      sort_order: 0,
      created_at: now,
    },
  ],
  press: [
    {
      id: "mock-press-c1",
      exhibition_id: exhibitionCollectiveMind.id,
      title_en: "Young painters at Galeria Arte",
      title_ro: "Tineri pictori la Galeria Arte",
      url: "https://example.com/press/collective",
      sort_order: 0,
      created_at: now,
    },
  ],
  artworks: mockArtworks.slice(0, 2),
};

const detailLascarVorel: ExhibitionDetail = {
  ...exhibitionLascarVorel,
  gallery: [
    {
      id: "mock-gal-l1",
      exhibition_id: exhibitionLascarVorel.id,
      image_url: proPic,
      caption_en: "Award ceremony",
      caption_ro: "Ceremonia de premiere",
      sort_order: 0,
      created_at: now,
    },
    {
      id: "mock-gal-l2",
      exhibition_id: exhibitionLascarVorel.id,
      image_url: heroHome,
      caption_en: "Installation view",
      caption_ro: "Vedere instalare",
      sort_order: 1,
      created_at: now,
    },
  ],
  venues: [
    {
      id: "mock-venue-l1",
      exhibition_id: exhibitionLascarVorel.id,
      title_en: "Cuza Vodă Cultural Palace",
      title_ro: "Palatul Cultural „Cuza Vodă”",
      image_url: heroAtmosphere,
      external_url: "https://example.com/venues/piatra-neamt",
      sort_order: 0,
      created_at: now,
    },
  ],
  press: [
    {
      id: "mock-press-l1",
      exhibition_id: exhibitionLascarVorel.id,
      title_en: "Debut prize at Lascăr Vorel Biennial",
      title_ro: "Premiul pentru debut la Bienala „Lascăr Vorel”",
      url: "https://example.com/press/lascar-vorel",
      sort_order: 0,
      created_at: now,
    },
  ],
  artworks: [MOCK_PROJECT_LIST[6]],
};

export const MOCK_EXHIBITION_DETAILS: Record<string, ExhibitionDetail> = {
  [MOCK_EXHIBITION_IDS.silentField]: detailSilentField,
  [MOCK_EXHIBITION_IDS.collectiveMind]: detailCollectiveMind,
  [MOCK_EXHIBITION_IDS.lascarVorel]: detailLascarVorel,
};

export function isMockExhibitionId(id: string): boolean {
  return id.startsWith("mock-exhibition-");
}

export function isMockExhibitionKey(slugOrId: string): boolean {
  if (isMockExhibitionId(slugOrId)) return true;
  return MOCK_EXHIBITION_LIST.some((e) => e.slug === slugOrId);
}

export function getMockExhibitionDetail(slugOrId: string): ExhibitionDetail | null {
  if (MOCK_EXHIBITION_DETAILS[slugOrId]) return MOCK_EXHIBITION_DETAILS[slugOrId];
  const ex = MOCK_EXHIBITION_LIST.find((e) => e.slug === slugOrId);
  return ex ? (MOCK_EXHIBITION_DETAILS[ex.id] ?? null) : null;
}

export function exhibitionsWithMocks(dbList: Exhibition[]): Exhibition[] {
  if (!shouldUseSiteMocks(dbList.length)) return dbList;
  const dbIds = new Set(dbList.map((e) => e.id));
  const extras = MOCK_EXHIBITION_LIST.filter((m) => !dbIds.has(m.id));
  return [...dbList, ...extras].sort((a, b) => b.sort_order - a.sort_order);
}
