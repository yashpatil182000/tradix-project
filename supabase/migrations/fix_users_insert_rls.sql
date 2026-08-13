-- Allow authenticated users to create their own public.users row.
-- Required for upsert/insert from the client (ensureUserProfile).
create policy "users_insert_own"
on public.users
for insert
to authenticated
with check (id = auth.uid());

-- Backfill profiles for auth users created before the signup trigger existed.
insert into public.users (id, email, full_name)
select
  au.id,
  au.email,
  coalesce(au.raw_user_meta_data ->> 'full_name', null)
from auth.users au
left join public.users pu on pu.id = au.id
where pu.id is null;

insert into public.user_options (user_id)
select u.id
from public.users u
left join public.user_options uo on uo.user_id = u.id
where uo.user_id is null;
