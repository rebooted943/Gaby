
-- Exhibitions feature: main entity + related content + artwork tagging

create table public.exhibitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ro text not null,
  subtitle_en text not null default '',
  subtitle_ro text not null default '',
  overview_en text not null default '',
  overview_ro text not null default '',
  start_date date,
  end_date date,
  venue_en text not null default '',
  venue_ro text not null default '',
  poster_url text not null default '',
  artist_name text not null default 'Andreea Gabriela Tudor',
  curator_name_en text not null default '',
  curator_name_ro text not null default '',
  curator_bio_en text not null default '',
  curator_bio_ro text not null default '',
  book_pdf_url text not null default '',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exhibition_gallery_images (
  id uuid primary key default gen_random_uuid(),
  exhibition_id uuid not null references public.exhibitions(id) on delete cascade,
  image_url text not null,
  caption_en text not null default '',
  caption_ro text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.exhibition_venues (
  id uuid primary key default gen_random_uuid(),
  exhibition_id uuid not null references public.exhibitions(id) on delete cascade,
  title_en text not null,
  title_ro text not null,
  image_url text not null default '',
  external_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.exhibition_press_links (
  id uuid primary key default gen_random_uuid(),
  exhibition_id uuid not null references public.exhibitions(id) on delete cascade,
  title_en text not null,
  title_ro text not null,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.exhibition_projects (
  exhibition_id uuid not null references public.exhibitions(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (exhibition_id, project_id)
);

alter table public.exhibitions enable row level security;
alter table public.exhibition_gallery_images enable row level security;
alter table public.exhibition_venues enable row level security;
alter table public.exhibition_press_links enable row level security;
alter table public.exhibition_projects enable row level security;

create trigger exhibitions_updated before update on public.exhibitions
  for each row execute function public.tg_set_updated_at();

create policy "exhibitions public read published"
  on public.exhibitions for select
  using (published = true or public.has_role(auth.uid(), 'admin'));

create policy "exhibitions admin write"
  on public.exhibitions for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "exhibition gallery public read"
  on public.exhibition_gallery_images for select
  using (
    exists (
      select 1 from public.exhibitions e
      where e.id = exhibition_id and (e.published = true or public.has_role(auth.uid(), 'admin'))
    )
  );

create policy "exhibition gallery admin write"
  on public.exhibition_gallery_images for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "exhibition venues public read"
  on public.exhibition_venues for select
  using (
    exists (
      select 1 from public.exhibitions e
      where e.id = exhibition_id and (e.published = true or public.has_role(auth.uid(), 'admin'))
    )
  );

create policy "exhibition venues admin write"
  on public.exhibition_venues for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "exhibition press public read"
  on public.exhibition_press_links for select
  using (
    exists (
      select 1 from public.exhibitions e
      where e.id = exhibition_id and (e.published = true or public.has_role(auth.uid(), 'admin'))
    )
  );

create policy "exhibition press admin write"
  on public.exhibition_press_links for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "exhibition projects public read"
  on public.exhibition_projects for select
  using (
    exists (
      select 1 from public.exhibitions e
      where e.id = exhibition_id and (e.published = true or public.has_role(auth.uid(), 'admin'))
    )
  );

create policy "exhibition projects admin write"
  on public.exhibition_projects for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create index exhibitions_published_sort_idx on public.exhibitions (published, sort_order desc, start_date desc);
create index exhibition_gallery_exhibition_idx on public.exhibition_gallery_images (exhibition_id, sort_order);
create index exhibition_venues_exhibition_idx on public.exhibition_venues (exhibition_id, sort_order);
create index exhibition_press_exhibition_idx on public.exhibition_press_links (exhibition_id, sort_order);
