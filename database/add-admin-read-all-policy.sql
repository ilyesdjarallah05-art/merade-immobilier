-- Merade Immobilier — allow logged-in admins to see every property in admin dashboard.
-- Run this once in Supabase > SQL Editor if some properties do not appear in admin.

drop policy if exists "Admins can read all properties" on public.properties;
create policy "Admins can read all properties"
on public.properties for select
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));
