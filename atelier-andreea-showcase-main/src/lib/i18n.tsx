import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { persistLang } from "@/lib/lang-storage";

export type Lang = "en" | "ro";

export const dict = {
  en: {
    common: { mockPreview: "Preview — sample data for layout only" },
    nav: { home: "Home", about: "About", projects: "Works", shop: "Shop", exhibitions: "Exhibitions", admin: "Studio", login: "Sign in", logout: "Sign out" },
    home: {
      eyebrow: "Andreea Gabriela Tudor — Painter",
      title: "Fragments of a silent field",
      sub: "Painting, drawing, collage. An ongoing inquiry into the self, the collective mind, and the spaces between the figurative and the abstract.",
      ctaWorks: "See the works",
      ctaAbout: "About the artist",
      latestEyebrow: "Recent works",
      exhibitionsEyebrow: "Exhibitions",
      shopEyebrow: "Available pieces",
      viewAll: "View all",
      empty: "Nothing here yet.",
      studioEyebrow: "The artist",
      studioTeaser:
        "Painting, drawing and collage — an inquiry into the self, the collective mind, and the threshold between figurative and abstract.",
      studioCta: "Read the full story",
    },
    about: {
      portraitAlt: "Portrait of Andreea Gabriela Tudor",
      eyebrow: "About",
      title: "Andreea Gabriela Tudor",
      role: '22 years old · "Dunărea de Jos" University of Galați, Faculty of Arts, Painting — 2nd-year Master',
      bio1: "Andreea Gabriela Tudor studied painting at the Faculty of Arts of the \"Dunărea de Jos\" University of Galați and is a scholar of the Young Talents programme supported by the Princess Margareta of Romania Royal Foundation. At this stage of her path, she values experiment as essential to her development — a way of exploring both her own creative identity and the technical procedures she adapts and combines to materialise her ideas.",
      bio2: "In her works, painting, drawing, photography and collage meet to create a symbiosis between the figurative and the abstract, between the two- and three-dimensional. The question of identity is the general theme at the centre of her recent practice. The works often propose reflections on the collective mind, the desacralisation of tradition in everyday life, egocentrism, the idea of freedom and intimacy.",
      bio3: "Drawing inspiration from personal experience as much as from the contemporary world, her recent work follows the relationship of the individual with the self and with the surrounding environment. Ease, spontaneity, and the force of the painterly gesture are defining elements of her visual language.",
      bio4: "Her trajectory has accelerated over the past two years. Among her recent recognitions are the Debut Prize at the 18th edition of the \"Lascăr Vorel\" National Biennial of Fine Arts and a selection among the winners of the #Fresh art competition organised by Elite Art Gallery. She has been a constant presence in national exhibitions, with over 30 participations in shows, salons and biennials in 2023 alone.",
    },
    projects: { eyebrow: "Works", title: "Selected paintings", year: "Year", museum: "Shown at", empty: "No works added yet." },
    shop: { eyebrow: "Shop", title: "Available works", buy: "Inquire", sold: "Sold", empty: "Nothing for sale at the moment." },
    events: { eyebrow: "Calendar", title: "Exhibitions & events", empty: "No upcoming events." },
    exhibitions: {
      eyebrow: "Exhibitions",
      title: "Exhibitions",
      subtitle: "Solo and group shows — past and present.",
      empty: "No exhibitions published yet.",
      viewExhibition: "View exhibition",
      backToIndex: "All exhibitions",
      notFound: "This exhibition could not be found.",
      artist: "Artist",
      curator: "Curator",
      visitVenue: "Visit venue",
      downloadPdf: "Download catalogue (PDF)",
      catalogIframe: "Exhibition catalogue",
      mockPreview: "Preview — sample data for layout only",
      sections: {
        overview: "Overview",
        credits: "Credits & poster",
        gallery: "Photo gallery",
        artworks: "Works on display",
        tour: "Tour & venues",
        press: "Press",
        book: "Exhibition book",
      },
    },
    admin: {
      title: "Studio",
      sub: "Manage works, shop, and exhibitions.",
      tabs: { projects: "Works", shop: "Shop", exhibitions: "Exhibitions", events: "Events (legacy)" },
      add: "Add new",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      uploading: "Uploading…",
      uploadImage: "Upload image",
      fields: {
        title_en: "Title (English)", title_ro: "Title (Romanian)",
        description_en: "Description (English)", description_ro: "Description (Romanian)",
        body_en: "Body (English)", body_ro: "Body (Romanian)",
        year: "Year", museum: "Museum / Gallery",
        price: "Price", currency: "Currency", purchase_url: "Purchase / contact link",
        available: "Available for sale",
        event_date: "Date", location: "Location",
        image_url: "Image URL", sort_order: "Sort order",
      },
      confirmDelete: "Delete this item?",
      exhibitions: {
        published: "Published",
        draft: "Draft",
        sections: {
          basics: "Basics",
          credits: "Credits & poster",
          gallery: "Photo gallery",
          venues: "Tour & venues",
          press: "Press",
          book: "Catalogue (PDF)",
          artworks: "Tagged artworks",
        },
        fields: {
          subtitle_en: "Subtitle (English)",
          subtitle_ro: "Subtitle (Romanian)",
          slug: "URL slug",
          start_date: "Start date",
          end_date: "End date",
          venue_en: "Venue (English)",
          venue_ro: "Venue (Romanian)",
          overview_en: "Overview (English)",
          overview_ro: "Overview (Romanian)",
          published: "Published on site",
          poster: "Poster image",
          artist_name: "Artist name",
          curator_en: "Curator (English)",
          curator_ro: "Curator (Romanian)",
          curator_bio_en: "Curator bio (English)",
          curator_bio_ro: "Curator bio (Romanian)",
          galleryImage: "Gallery image",
          caption_en: "Caption (English)",
          caption_ro: "Caption (Romanian)",
          external_url: "External link",
          article_url: "Article URL",
          book_pdf: "Catalogue PDF",
        },
        addGalleryImage: "Add gallery image",
        addVenue: "Add venue",
        addPress: "Add press link",
        artworksHint: "Select paintings displayed in this exhibition.",
      },
    },
    login: { title: "Studio access", sub: "Sign in to manage your site.", email: "Email", password: "Password", submit: "Sign in", error: "Invalid credentials." },
    footer: { rights: "All works © Andreea Gabriela Tudor" },
  },
  ro: {
    common: { mockPreview: "Previzualizare — date demonstrative pentru layout" },
    nav: { home: "Acasă", about: "Despre", projects: "Lucrări", shop: "Magazin", exhibitions: "Expoziții", admin: "Atelier", login: "Conectare", logout: "Deconectare" },
    home: {
      eyebrow: "Andreea Gabriela Tudor — Pictor",
      title: "Fragmente dintr-un câmp mut",
      sub: "Pictură, desen, colaj. O cercetare continuă a sinelui, a mentalului colectiv și a spațiilor dintre figurativ și abstract.",
      ctaWorks: "Vezi lucrările",
      ctaAbout: "Despre artistă",
      latestEyebrow: "Lucrări recente",
      exhibitionsEyebrow: "Expoziții",
      shopEyebrow: "Piese disponibile",
      viewAll: "Vezi toate",
      empty: "Nimic aici încă.",
      studioEyebrow: "Artistă",
      studioTeaser:
        "Pictură, desen și colaj — o cercetare a sinelui, a mentalului colectiv și a graniței dintre figurativ și abstract.",
      studioCta: "Citește povestea completă",
    },
    about: {
      portraitAlt: "Portret Andreea Gabriela Tudor",
      eyebrow: "Despre",
      title: "Andreea Gabriela Tudor",
      role: '22 de ani · Universitatea „Dunărea de Jos” din Galați, Facultatea de Arte, Pictură — Master anul II',
      bio1: "Andreea Gabriela Tudor a studiat pictura la Facultatea de Arte din cadrul Universității „Dunărea de Jos” din Galați și este bursieră a proiectului Tinere Talente, susținut de Fundația Regală Margareta a României. În această etapă a parcursului său, tânăra apreciază experimentul ca având un rol esențial în dezvoltarea sa, întrucât acesta îi permite să exploreze pe de o parte propria identitate creatoare și pe de altă parte diverse tehnici și procedee artistice pe care le adaptează și le asociază pentru a-și materializa ideile.",
      bio2: "În lucrările sale, mijloacele tehnice care îmbină pictura, grafica, fotografia și colajul se întâlnesc și creează o simbioză a figurativului cu abstractul, respectiv a bidimensionalului cu tridimensionalul. Problematica identității reprezintă tema generală care se află în centrul demersurilor sale artistice recente. Lucrările propun adesea reflecții asupra mentalului colectiv, desacralizării tradițiilor în lumea cotidiană, egocentrismului, ideii de libertate și intimitate.",
      bio3: "Găsind inspirația atât prin experiența personală, cât și prin analizarea lumii contemporane, creația sa urmărește raportul individului cu sinele și cu mediul exterior. Dezinvoltura, spontaneitatea și forța gestului pictural sunt elemente definitorii ale discursului său vizual.",
      bio4: "Parcursul Andreei a cunoscut o dezvoltare accelerată în ultimii doi ani. Printre realizările recente se regăsesc Premiul pentru Debut în cadrul ediției a XVIII-a a Bienalei Naționale de Artă Plastică „Lascăr Vorel” și selecționarea printre câștigătorii concursului de artă #Fresh, organizat de Elite Art Gallery. Este o prezență constantă în expoziții la nivel național, cu peste 30 de participări în 2023.",
    },
    projects: { eyebrow: "Lucrări", title: "Picturi selectate", year: "An", museum: "Expusă la", empty: "Nicio lucrare adăugată." },
    shop: { eyebrow: "Magazin", title: "Lucrări disponibile", buy: "Cere detalii", sold: "Vândută", empty: "Nimic de vânzare momentan." },
    events: { eyebrow: "Calendar", title: "Expoziții și evenimente", empty: "Niciun eveniment programat." },
    exhibitions: {
      eyebrow: "Expoziții",
      title: "Expoziții",
      subtitle: "Expoziții personale și de grup — trecut și prezent.",
      empty: "Nicio expoziție publicată încă.",
      viewExhibition: "Vezi expoziția",
      backToIndex: "Toate expozițiile",
      notFound: "Expoziția nu a fost găsită.",
      artist: "Artistă",
      curator: "Curator",
      visitVenue: "Vizitează locația",
      downloadPdf: "Descarcă catalogul (PDF)",
      catalogIframe: "Catalog expoziție",
      mockPreview: "Previzualizare — date demonstrative pentru layout",
      sections: {
        overview: "Prezentare",
        credits: "Credite & poster",
        gallery: "Galerie foto",
        artworks: "Lucrări expuse",
        tour: "Tur & locații",
        press: "Presă",
        book: "Cartea expoziției",
      },
    },
    admin: {
      title: "Atelier",
      sub: "Gestionează lucrările, magazinul și expozițiile.",
      tabs: { projects: "Lucrări", shop: "Magazin", exhibitions: "Expoziții", events: "Evenimente (vechi)" },
      add: "Adaugă",
      edit: "Editează",
      delete: "Șterge",
      save: "Salvează",
      cancel: "Anulează",
      uploading: "Se încarcă…",
      uploadImage: "Încarcă imagine",
      fields: {
        title_en: "Titlu (Engleză)", title_ro: "Titlu (Română)",
        description_en: "Descriere (Engleză)", description_ro: "Descriere (Română)",
        body_en: "Conținut (Engleză)", body_ro: "Conținut (Română)",
        year: "An", museum: "Muzeu / Galerie",
        price: "Preț", currency: "Monedă", purchase_url: "Link cumpărare / contact",
        available: "Disponibilă",
        event_date: "Dată", location: "Locație",
        image_url: "URL imagine", sort_order: "Ordine",
      },
      confirmDelete: "Ștergi acest element?",
      exhibitions: {
        published: "Publicată",
        draft: "Ciornă",
        sections: {
          basics: "Informații de bază",
          credits: "Credite & poster",
          gallery: "Galerie foto",
          venues: "Tur & locații",
          press: "Presă",
          book: "Catalog (PDF)",
          artworks: "Lucrări asociate",
        },
        fields: {
          subtitle_en: "Subtitlu (Engleză)",
          subtitle_ro: "Subtitlu (Română)",
          slug: "Slug URL",
          start_date: "Data început",
          end_date: "Data sfârșit",
          venue_en: "Locație (Engleză)",
          venue_ro: "Locație (Română)",
          overview_en: "Prezentare (Engleză)",
          overview_ro: "Prezentare (Română)",
          published: "Publicată pe site",
          poster: "Imagine poster",
          artist_name: "Nume artistă",
          curator_en: "Curator (Engleză)",
          curator_ro: "Curator (Română)",
          curator_bio_en: "Bio curator (Engleză)",
          curator_bio_ro: "Bio curator (Română)",
          galleryImage: "Imagine galerie",
          caption_en: "Legendă (Engleză)",
          caption_ro: "Legendă (Română)",
          external_url: "Link extern",
          article_url: "URL articol",
          book_pdf: "Catalog PDF",
        },
        addGalleryImage: "Adaugă imagine",
        addVenue: "Adaugă locație",
        addPress: "Adaugă link presă",
        artworksHint: "Selectează picturile expuse în această expoziție.",
      },
    },
    login: { title: "Acces atelier", sub: "Conectează-te pentru a gestiona site-ul.", email: "Email", password: "Parolă", submit: "Conectare", error: "Date incorecte." },
    footer: { rights: "Toate lucrările © Andreea Gabriela Tudor" },
  },
} as const;

type Dict = typeof dict.en;
const D: Record<Lang, Dict> = dict as unknown as Record<Lang, Dict>;

const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({
  lang: "en", t: dict.en, setLang: () => {},
});

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    persistLang(lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    persistLang(l);
  };

  return <Ctx.Provider value={{ lang, t: D[lang], setLang }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
export const pick = <T,>(lang: Lang, en: T, ro: T): T => (lang === "ro" ? ro : en);