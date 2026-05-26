-- Optional: run after 20260526120000_exhibitions.sql to load the same preview data into Supabase.
-- Replace image/PDF URLs with your uploaded storage URLs in production.

insert into public.exhibitions (
  id, slug, title_en, title_ro, subtitle_en, subtitle_ro,
  overview_en, overview_ro, start_date, end_date,
  venue_en, venue_ro, poster_url, artist_name,
  curator_name_en, curator_name_ro, curator_bio_en, curator_bio_ro,
  book_pdf_url, published, sort_order
) values (
  'a0000000-0000-4000-8000-000000000001',
  'fragments-silent-field',
  'Fragments of a Silent Field',
  'Fragmente dintr-un câmp mut',
  'Solo exhibition — paintings & collage',
  'Expoziție personală — pictură & colaj',
  'A gathering of recent paintings and collages exploring the threshold between figurative memory and abstract atmosphere.',
  'O adunare de picturi și colaje recente care explorează pragul dintre memoria figurativă și atmosfera abstractă.',
  '2025-03-14', '2025-05-18',
  'Elite Art Gallery · Bucharest', 'Elite Art Gallery · București',
  '', 'Andreea Gabriela Tudor',
  'Dr. Elena Vasilescu', 'Dr. Elena Vasilescu',
  'Curator and art historian based in Bucharest.',
  'Curator și istoric de artă, cu sediul în București.',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  true, 10
) on conflict (id) do nothing;
