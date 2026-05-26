
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "user_roles readable by self"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "admins manage roles"
on public.user_roles for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Shared updated_at trigger
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- Projects (paintings)
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ro text not null,
  description_en text default '',
  description_ro text default '',
  year integer,
  museum text default '',
  image_url text default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create trigger projects_updated before update on public.projects
  for each row execute function public.tg_set_updated_at();

create policy "projects public read" on public.projects for select using (true);
create policy "projects admin write" on public.projects for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Shop items
create table public.shop_items (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ro text not null,
  description_en text default '',
  description_ro text default '',
  price numeric(10,2) not null default 0,
  currency text not null default 'EUR',
  image_url text default '',
  available boolean not null default true,
  purchase_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.shop_items enable row level security;
create trigger shop_items_updated before update on public.shop_items
  for each row execute function public.tg_set_updated_at();

create policy "shop public read" on public.shop_items for select using (true);
create policy "shop admin write" on public.shop_items for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Events / feed
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ro text not null,
  body_en text default '',
  body_ro text default '',
  event_date date,
  location text default '',
  image_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.events enable row level security;
create trigger events_updated before update on public.events
  for each row execute function public.tg_set_updated_at();

create policy "events public read" on public.events for select using (true);
create policy "events admin write" on public.events for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for images
insert into storage.buckets (id, name, public) values ('artwork-images', 'artwork-images', true)
on conflict (id) do nothing;

create policy "artwork images public read"
on storage.objects for select
using (bucket_id = 'artwork-images');

create policy "artwork images admin write"
on storage.objects for insert to authenticated
with check (bucket_id = 'artwork-images' and public.has_role(auth.uid(), 'admin'));

create policy "artwork images admin update"
on storage.objects for update to authenticated
using (bucket_id = 'artwork-images' and public.has_role(auth.uid(), 'admin'));

create policy "artwork images admin delete"
on storage.objects for delete to authenticated
using (bucket_id = 'artwork-images' and public.has_role(auth.uid(), 'admin'));
