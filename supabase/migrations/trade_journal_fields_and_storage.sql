alter table public.trades
  add column if not exists style text,
  add column if not exists risk_amount numeric(18, 2),
  add column if not exists reward_amount numeric(18, 2),
  add column if not exists capital_after numeric(18, 2),
  add column if not exists entry_reason text,
  add column if not exists exit_reason text,
  add column if not exists timeframe text,
  add column if not exists mistakes text,
  add column if not exists followed_rules boolean,
  add column if not exists lesson_learned text;

alter table public.trades drop constraint if exists trades_style_check;
alter table public.trades
  add constraint trades_style_check
  check (style is null or style in ('scalp', 'intraday', 'swing'));

insert into storage.buckets (id, name, public)
values ('trade-screenshots', 'trade-screenshots', false)
on conflict (id) do nothing;

drop policy if exists "trade_screenshots_select_own" on storage.objects;
drop policy if exists "trade_screenshots_insert_own" on storage.objects;
drop policy if exists "trade_screenshots_update_own" on storage.objects;
drop policy if exists "trade_screenshots_delete_own" on storage.objects;

create policy "trade_screenshots_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "trade_screenshots_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'trade-screenshots'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "trade_screenshots_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "trade_screenshots_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and split_part(name, '/', 1) = auth.uid()::text
);
