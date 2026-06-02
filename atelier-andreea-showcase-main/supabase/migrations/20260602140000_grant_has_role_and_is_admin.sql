-- RLS policies call has_role(), but execute was revoked from authenticated.
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

drop policy if exists "user_roles readable by self" on public.user_roles;
create policy "user_roles readable by self"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

-- Reliable admin check from the app (bypasses RLS on user_roles).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'::public.app_role
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
