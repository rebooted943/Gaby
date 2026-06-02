-- Authenticated users must read their own row in user_roles to detect admin in the app.
-- The previous policy also called has_role(), but execute on has_role was revoked from
-- authenticated in 20260526071228, which blocked the entire SELECT via RLS.
drop policy if exists "user_roles readable by self" on public.user_roles;

create policy "user_roles readable by self"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);
