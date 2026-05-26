
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql
set search_path = public
as $$ begin new.updated_at = now(); return new; end $$;

revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;

-- Restrict listing: only allow listing under known prefixes used by admin UI.
drop policy if exists "artwork images public read" on storage.objects;
create policy "artwork images public read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'artwork-images');
