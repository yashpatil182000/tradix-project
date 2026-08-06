-- =============================================================================
-- Tradix Trading Journal — Supabase Schema
-- DO NOT auto-execute from the app. Review, then run in Supabase SQL Editor.
-- =============================================================================

-- Extensions (usually already enabled on Supabase)
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
create type public.asset_class as enum (
  'forex',
  'metals',
  'crypto',
  'indices',
  'stocks'
);

create type public.trade_direction as enum ('long', 'short');

create type public.trade_status as enum ('open', 'closed', 'cancelled');

create type public.capital_entry_type as enum (
  'starting',
  'deposit',
  'withdrawal',
  'adjustment'
);

-- -----------------------------------------------------------------------------
-- updated_at helper
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- users
-- App profile table. 1:1 with auth.users
-- -----------------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint users_email_key unique (email)
);

create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- master_instruments
-- App-managed instrument catalog with calculation metadata.
-- Users cannot create or edit these rows.
-- -----------------------------------------------------------------------------
create table public.master_instruments (
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

create index master_instruments_asset_class_idx on public.master_instruments (asset_class);
create index master_instruments_is_active_idx on public.master_instruments (is_active);

create trigger master_instruments_set_updated_at
before update on public.master_instruments
for each row
execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- user_instruments
-- Per-user enable/disable of master instruments.
-- -----------------------------------------------------------------------------
create table public.user_instruments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  master_instrument_id uuid not null references public.master_instruments (id) on delete restrict,
  is_enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint user_instruments_user_master_key unique (user_id, master_instrument_id)
);

create index user_instruments_user_id_idx on public.user_instruments (user_id);
create index user_instruments_master_instrument_id_idx on public.user_instruments (master_instrument_id);

create trigger user_instruments_set_updated_at
before update on public.user_instruments
for each row
execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- capital
-- Capital ledger (starting balance, deposits, withdrawals, adjustments)
-- -----------------------------------------------------------------------------
create table public.capital (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  entry_type public.capital_entry_type not null,
  amount numeric(18, 2) not null,
  currency text not null default 'USD',
  note text,
  recorded_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint capital_amount_positive check (amount > 0)
);

create index capital_user_id_idx on public.capital (user_id);
create index capital_user_recorded_at_idx on public.capital (user_id, recorded_at desc);

create trigger capital_set_updated_at
before update on public.capital
for each row
execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- trades
-- Core journal entries. Belong to a user and reference an instrument.
-- -----------------------------------------------------------------------------
create table public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  instrument_id uuid not null references public.master_instruments (id) on delete restrict,
  direction public.trade_direction not null,
  status public.trade_status not null default 'open',
  entry_price numeric(18, 8) not null,
  exit_price numeric(18, 8),
  quantity numeric(18, 8) not null,
  stop_loss numeric(18, 8),
  take_profit numeric(18, 8),
  fees numeric(18, 2) not null default 0,
  pnl numeric(18, 2),
  risk_reward numeric(10, 4),
  setup text,
  notes text,
  emotions text,
  style text,
  risk_amount numeric(18, 2),
  reward_amount numeric(18, 2),
  capital_after numeric(18, 2),
  entry_reason text,
  exit_reason text,
  timeframe text,
  mistakes text,
  followed_rules boolean,
  lesson_learned text,
  rating smallint,
  entry_at timestamptz not null default timezone('utc', now()),
  exit_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint trades_quantity_positive check (quantity > 0),
  constraint trades_fees_non_negative check (fees >= 0),
  constraint trades_rating_range check (rating is null or (rating >= 1 and rating <= 5)),
  constraint trades_style_check check (style is null or style in ('scalp', 'intraday', 'swing')),
  constraint trades_exit_requires_price check (
    status <> 'closed'
    or (exit_price is not null and exit_at is not null)
  )
);

create index trades_user_id_idx on public.trades (user_id);
create index trades_instrument_id_idx on public.trades (instrument_id);
create index trades_user_entry_at_idx on public.trades (user_id, entry_at desc);
create index trades_user_status_idx on public.trades (user_id, status);

create trigger trades_set_updated_at
before update on public.trades
for each row
execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- trade_images
-- Screenshots / charts attached to a trade (paths in Supabase Storage)
-- -----------------------------------------------------------------------------
create table public.trade_images (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.trades (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  storage_path text not null,
  file_name text,
  mime_type text,
  file_size_bytes bigint,
  caption text,
  created_at timestamptz not null default timezone('utc', now()),

  constraint trade_images_file_size_non_negative check (
    file_size_bytes is null or file_size_bytes >= 0
  )
);

create index trade_images_trade_id_idx on public.trade_images (trade_id);
create index trade_images_user_id_idx on public.trade_images (user_id);

-- -----------------------------------------------------------------------------
-- user_options
-- 1:1 settings / preferences per user
-- -----------------------------------------------------------------------------
create table public.user_options (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  default_currency text not null default 'USD',
  timezone text not null default 'UTC',
  risk_per_trade_percent numeric(5, 2) not null default 1.00,
  theme text not null default 'system',
  date_format text not null default 'YYYY-MM-DD',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint user_options_user_id_key unique (user_id),
  constraint user_options_risk_range check (
    risk_per_trade_percent >= 0 and risk_per_trade_percent <= 100
  ),
  constraint user_options_theme_check check (
    theme in ('light', 'dark', 'system')
  )
);

create trigger user_options_set_updated_at
before update on public.user_options
for each row
execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Auth bootstrap: create public.users + user_options when auth user signs up
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  );

  insert into public.user_options (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table public.users enable row level security;
alter table public.master_instruments enable row level security;
alter table public.user_instruments enable row level security;
alter table public.capital enable row level security;
alter table public.trades enable row level security;
alter table public.trade_images enable row level security;
alter table public.user_options enable row level security;

-- users
create policy "users_select_own"
on public.users
for select
to authenticated
using (id = auth.uid());

create policy "users_insert_own"
on public.users
for insert
to authenticated
with check (id = auth.uid());

create policy "users_update_own"
on public.users
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- master_instruments (read-only catalog for authenticated users)
create policy "master_instruments_select_authenticated"
on public.master_instruments
for select
to authenticated
using (true);

-- user_instruments
create policy "user_instruments_select_own"
on public.user_instruments
for select
to authenticated
using (user_id = auth.uid());

create policy "user_instruments_insert_own"
on public.user_instruments
for insert
to authenticated
with check (user_id = auth.uid());

create policy "user_instruments_update_own"
on public.user_instruments
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "user_instruments_delete_own"
on public.user_instruments
for delete
to authenticated
using (user_id = auth.uid());

-- capital
create policy "capital_select_own"
on public.capital
for select
to authenticated
using (user_id = auth.uid());

create policy "capital_insert_own"
on public.capital
for insert
to authenticated
with check (user_id = auth.uid());

create policy "capital_update_own"
on public.capital
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "capital_delete_own"
on public.capital
for delete
to authenticated
using (user_id = auth.uid());

-- trades
create policy "trades_select_own"
on public.trades
for select
to authenticated
using (user_id = auth.uid());

create policy "trades_insert_own"
on public.trades
for insert
to authenticated
with check (user_id = auth.uid());

create policy "trades_update_own"
on public.trades
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "trades_delete_own"
on public.trades
for delete
to authenticated
using (user_id = auth.uid());

-- trade_images
create policy "trade_images_select_own"
on public.trade_images
for select
to authenticated
using (user_id = auth.uid());

create policy "trade_images_insert_own"
on public.trade_images
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.trades t
    where t.id = trade_id
      and t.user_id = auth.uid()
  )
);

create policy "trade_images_update_own"
on public.trade_images
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "trade_images_delete_own"
on public.trade_images
for delete
to authenticated
using (user_id = auth.uid());

-- user_options
create policy "user_options_select_own"
on public.user_options
for select
to authenticated
using (user_id = auth.uid());

create policy "user_options_update_own"
on public.user_options
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Inserts for user_options are handled by the signup trigger (security definer).
-- Optional explicit insert policy if app needs to recreate options:
create policy "user_options_insert_own"
on public.user_options
for insert
to authenticated
with check (user_id = auth.uid());

-- =============================================================================
-- Master instrument catalog seed (app-managed)
-- =============================================================================
insert into public.master_instruments (
  symbol, display_name, asset_class, contract_size, pip_size, price_precision,
  min_lot, lot_step, max_lot, is_active
) values
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
  ('XAUUSD', 'Gold / US Dollar', 'metals', 100, 0.01, 2, 0.01, 0.01, 50, true),
  ('XAGUSD', 'Silver / US Dollar', 'metals', 5000, 0.001, 3, 0.01, 0.01, 50, true),
  ('BTCUSD', 'Bitcoin / US Dollar', 'crypto', 1, 0.01, 2, 0.001, 0.001, 50, true),
  ('ETHUSD', 'Ethereum / US Dollar', 'crypto', 1, 0.01, 2, 0.01, 0.01, 100, true),
  ('SOLUSD', 'Solana / US Dollar', 'crypto', 1, 0.001, 3, 0.1, 0.1, 500, true),
  ('NAS100', 'Nasdaq 100', 'indices', 1, 0.1, 1, 0.1, 0.1, 100, true),
  ('US100', 'US 100', 'indices', 1, 0.1, 1, 0.1, 0.1, 100, true),
  ('US30', 'Dow Jones 30', 'indices', 1, 1, 0, 0.1, 0.1, 100, true),
  ('SPX500', 'S&P 500', 'indices', 1, 0.1, 1, 0.1, 0.1, 100, true),
  ('GER40', 'Germany 40', 'indices', 1, 0.1, 1, 0.1, 0.1, 100, true),
  ('UK100', 'UK 100', 'indices', 1, 0.1, 1, 0.1, 0.1, 100, true),
  ('AAPL', 'Apple Inc.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('TSLA', 'Tesla Inc.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('MSFT', 'Microsoft Corp.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('AMZN', 'Amazon.com Inc.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('NVDA', 'NVIDIA Corp.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('GOOGL', 'Alphabet Inc.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true),
  ('META', 'Meta Platforms Inc.', 'stocks', 1, 0.01, 2, 1, 1, 10000, true)
on conflict (symbol) do nothing;
