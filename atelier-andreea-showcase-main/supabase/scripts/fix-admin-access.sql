-- Run this once in Supabase Dashboard → SQL Editor (project rptwowkkejecvvbfsgkt).
-- Replace USER_ID if different from the id shown on /admin.

-- 1) Ensure admin role row exists
insert into public.user_roles (user_id, role)
values ('c4763865-263e-441f-aed6-26bbbff3a939', 'admin')
on conflict (user_id, role) do nothing;

-- 2) Fix has_role + user_roles policy + is_admin() RPC
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

drop policy if exists "user_roles readable by self" on public.user_roles;
create policy "user_roles readable by self"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

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

-- 3) Verify (should return one row with role admin)
select * from public.user_roles
where user_id = 'c4763865-263e-441f-aed6-26bbbff3a939';
