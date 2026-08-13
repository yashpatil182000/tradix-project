-- =============================================================================
-- Master Instruments + User Instruments
-- Replaces per-user freeform instruments with an app-managed catalog.
-- Users enable/disable master instruments; trades reference master_instruments.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'asset_class' and n.nspname = 'public'
  ) then
    create type public.asset_class as enum (
      'forex',
      'metals',
      'crypto',
      'indices',
      'stocks'
    );
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- master_instruments (app-managed catalog)
-- -----------------------------------------------------------------------------
create table if not exists public.master_instruments (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  display_name text not null,
  asset_class public.asset_class not null,
  contract_size numeric(18, 8) not null,
  pip_size numeric(18, 8) not null,
  price_precision integer not null default 5,
  min_lot numeric(18, 8) not null default 0.01,
  lot_step numeric(18, 8) not null default 0.01,
  max_lot numeric(18, 8) not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint master_instruments_symbol_key unique (symbol),
  constraint master_instruments_contract_size_positive check (contract_size > 0),
  constraint master_instruments_pip_size_positive check (pip_size > 0),
  constraint master_instruments_price_precision_nonneg check (price_precision >= 0),
  constraint master_instruments_min_lot_positive check (min_lot > 0),
  constraint master_instruments_lot_step_positive check (lot_step > 0),
  constraint master_instruments_max_lot_gte_min check (max_lot >= min_lot)
);

create index if not exists master_instruments_asset_class_idx
  on public.master_instruments (asset_class);

create index if not exists master_instruments_is_active_idx
  on public.master_instruments (is_active);

drop trigger if exists master_instruments_set_updated_at on public.master_instruments;
create trigger master_instruments_set_updated_at
before update on public.master_instruments
for each row
execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- user_instruments (user enable/disable of master catalog)
-- -----------------------------------------------------------------------------
create table if not exists public.user_instruments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  master_instrument_id uuid not null references public.master_instruments (id) on delete restrict,
  is_enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint user_instruments_user_master_key unique (user_id, master_instrument_id)
);

create index if not exists user_instruments_user_id_idx
  on public.user_instruments (user_id);

create index if not exists user_instruments_master_instrument_id_idx
  on public.user_instruments (master_instrument_id);

drop trigger if exists user_instruments_set_updated_at on public.user_instruments;
create trigger user_instruments_set_updated_at
before update on public.user_instruments
for each row
execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Seed master catalog
-- -----------------------------------------------------------------------------
insert into public.master_instruments (
  symbol, display_name, asset_class, contract_size, pip_size, price_precision,
  min_lot, lot_step, max_lot, is_active
) values
  -- Forex
  ('EURUSD', 'Euro / US Dollar', 'forex', 100000, 0.0001, 5, 0.01, 0.01, 100, true),
  ('GBPUSD', 'Pound / US Dollar', 'forex', 100000, 0.0001, 5, 0.01, 0.01, 100, true),
  ('USDJPY', 'US Dollar / Yen', 'forex', 100000, 0.01, 3, 0.01, 0.01, 100, true),
  ('USDCHF', 'US Dollar / Swiss Franc', 'forex', 100000, 0.0001, 5, 0.01, 0.01, 100, true),
  ('AUDUSD', 'Australian Dollar / US Dollar', 'forex', 100000, 0.0001, 5, 0.01, 0.01, 100, true),
  ('USDCAD', 'US Dollar / Canadian Dollar', 'forex', 100000, 0.0001, 5, 0.01, 0.01, 100, true),
  ('NZDUSD', 'New Zealand Dollar / US Dollar', 'forex', 100000, 0.0001, 5, 0.01, 0.01, 100, true),
  ('EURGBP', 'Euro / Pound', 'forex', 100000, 0.0001, 5, 0.01, 0.01, 100, true),
  ('EURJPY', 'Euro / Yen', 'forex', 100000, 0.01, 3, 0.01, 0.01, 100, true),
  ('GBPJPY', 'Pound / Yen', 'forex', 100000, 0.01, 3, 0.01, 0.01, 100, true),
  ('GBPSNZD', 'Pound / New Zealand Dollar', 'forex', 100000, 0.0001, 5, 0.01, 0.01, 100, true),
  ('GPBSNZD', 'Pound / New Zealand Dollar (legacy)', 'forex', 100000, 0.0001, 5, 0.01, 0.01, 100, true),

  -- Metals
  ('XAUUSD', 'Gold / US Dollar', 'metals', 100, 0.01, 2, 0.01, 0.01, 50, true),
  ('XAGUSD', 'Silver / US Dollar', 'metals', 5000, 0.001, 3, 0.01, 0.01, 50, true),

  -- Crypto
  ('BTCUSD', 'Bitcoin / US Dollar', 'crypto', 1, 0.01, 2, 0.001, 0.001, 50, true),
  ('ETHUSD', 'Ethereum / US Dollar', 'crypto', 1, 0.01, 2, 0.01, 0.01, 100, true),
  ('SOLUSD', 'Solana / US Dollar', 'crypto', 1, 0.001, 3, 0.1, 0.1, 500, true),

  -- Indices
  ('NAS100', 'Nasdaq 100', 'indices', 1, 0.1, 1, 0.1, 0.1, 100, true),
  ('US100', 'US 100', 'indices', 1, 0.1, 1, 0.1, 0.1, 100, true),
  ('US30', 'Dow Jones 30', 'indices', 1, 1, 0, 0.1, 0.1, 100, true),
  ('SPX500', 'S&P 500', 'indices', 1, 0.1, 1, 0.1, 0.1, 100, true),
  ('GER40', 'Germany 40', 'indices', 1, 0.1, 1, 0.1, 0.1, 100, true),
  ('UK100', 'UK 100', 'indices', 1, 0.1, 1, 0.1, 0.1, 100, true),

  -- Stocks
  ('AAPL', 'Apple Inc.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('TSLA', 'Tesla Inc.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('MSFT', 'Microsoft Corp.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('AMZN', 'Amazon.com Inc.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('NVDA', 'NVIDIA Corp.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('GOOGL', 'Alphabet Inc.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('META', 'Meta Platforms Inc.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true)
on conflict (symbol) do update set
  display_name = excluded.display_name,
  asset_class = excluded.asset_class,
  contract_size = excluded.contract_size,
  pip_size = excluded.pip_size,
  price_precision = excluded.price_precision,
  min_lot = excluded.min_lot,
  lot_step = excluded.lot_step,
  max_lot = excluded.max_lot,
  is_active = excluded.is_active,
  updated_at = timezone('utc', now());

-- -----------------------------------------------------------------------------
-- Migrate legacy instruments → user_instruments + remap trades
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'instruments'
  ) then
    -- Create master rows for any legacy symbols not already in the catalog
    insert into public.master_instruments (
      symbol, display_name, asset_class, contract_size, pip_size, price_precision,
      min_lot, lot_step, max_lot, is_active
    )
    select distinct
      upper(trim(i.symbol)),
      coalesce(nullif(trim(i.name), ''), upper(trim(i.symbol))),
      case
        when i.type::text in ('forex') then 'forex'::public.asset_class
        when i.type::text in ('crypto') then 'crypto'::public.asset_class
        when i.type::text in ('index') then 'indices'::public.asset_class
        when i.type::text in ('stock') then 'stocks'::public.asset_class
        else 'forex'::public.asset_class
      end,
      1,
      0.0001,
      5,
      0.01,
      0.01,
      100,
      true
    from public.instruments i
    where not exists (
      select 1
      from public.master_instruments m
      where upper(trim(m.symbol)) = upper(trim(i.symbol))
    )
    and nullif(trim(i.symbol), '') is not null;

    -- Enable matching master symbols for each legacy user instrument
    insert into public.user_instruments (user_id, master_instrument_id, is_enabled)
    select
      i.user_id,
      m.id,
      coalesce(i.is_active, true)
    from public.instruments i
    inner join public.master_instruments m
      on upper(trim(m.symbol)) = upper(trim(i.symbol))
    on conflict (user_id, master_instrument_id) do update
      set is_enabled = excluded.is_enabled,
          updated_at = timezone('utc', now());
  end if;
end $$;

-- Drop old FK before remapping trade instrument ids to master uuids
do $$
begin
  if exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'trades'
      and constraint_name = 'trades_instrument_id_fkey'
  ) then
    alter table public.trades drop constraint trades_instrument_id_fkey;
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'instruments'
  ) then
    update public.trades t
    set instrument_id = m.id
    from public.instruments i
    inner join public.master_instruments m
      on upper(trim(m.symbol)) = upper(trim(i.symbol))
    where t.instrument_id = i.id
      and t.instrument_id is distinct from m.id;
  end if;
end $$;

-- Point trades.instrument_id at master_instruments
do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'trades'
      and constraint_name = 'trades_instrument_id_fkey'
  ) then
    alter table public.trades
      add constraint trades_instrument_id_fkey
      foreign key (instrument_id)
      references public.master_instruments (id)
      on delete restrict;
  end if;
end $$;

-- Drop legacy instruments table (data already migrated where possible)
drop table if exists public.instruments cascade;

-- Drop unused instrument_type enum if nothing references it
do $$
begin
  if exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'instrument_type' and n.nspname = 'public'
  ) and not exists (
    select 1
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_type t on t.oid = a.atttypid
    where n.nspname = 'public'
      and t.typname = 'instrument_type'
      and a.attnum > 0
      and not a.attisdropped
  ) then
    drop type public.instrument_type;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.master_instruments enable row level security;
alter table public.user_instruments enable row level security;

drop policy if exists "master_instruments_select_authenticated" on public.master_instruments;
create policy "master_instruments_select_authenticated"
on public.master_instruments
for select
to authenticated
using (true);

-- No insert/update/delete policies for authenticated users — catalog is app-managed.

drop policy if exists "user_instruments_select_own" on public.user_instruments;
create policy "user_instruments_select_own"
on public.user_instruments
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "user_instruments_insert_own" on public.user_instruments;
create policy "user_instruments_insert_own"
on public.user_instruments
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "user_instruments_update_own" on public.user_instruments;
create policy "user_instruments_update_own"
on public.user_instruments
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "user_instruments_delete_own" on public.user_instruments;
create policy "user_instruments_delete_own"
on public.user_instruments
for delete
to authenticated
using (user_id = auth.uid());
