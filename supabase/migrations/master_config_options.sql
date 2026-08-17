-- =============================================================================
-- Master + user catalogs for journal configuration options
-- entry_reasons, exit_reasons, timeframes, emotions, mistakes
-- Users enable master items and may add custom rows of their own.
-- =============================================================================

do $$
declare
  cats text[] := array['entry_reasons', 'exit_reasons', 'timeframes', 'emotions', 'mistakes'];
  cat text;
  master_table text;
  user_table text;
begin
  foreach cat in array cats loop
    master_table := 'master_' || cat;
    user_table := 'user_' || cat;

    execute format($sql$
      create table if not exists public.%I (
        id uuid primary key default gen_random_uuid(),
        label text not null,
        description text,
        sort_order integer not null default 0,
        is_active boolean not null default true,
        created_at timestamptz not null default timezone('utc', now()),
        updated_at timestamptz not null default timezone('utc', now()),
        constraint %I unique (label)
      )
    $sql$, master_table, master_table || '_label_key');

    execute format(
      'create index if not exists %I on public.%I (is_active, sort_order, label)',
      master_table || '_active_sort_idx',
      master_table
    );

    execute format('drop trigger if exists %I on public.%I', master_table || '_set_updated_at', master_table);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      master_table || '_set_updated_at',
      master_table
    );

    execute format($sql$
      create table if not exists public.%I (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null references public.users (id) on delete cascade,
        master_id uuid references public.%I (id) on delete restrict,
        label text not null,
        description text,
        is_enabled boolean not null default true,
        created_at timestamptz not null default timezone('utc', now()),
        updated_at timestamptz not null default timezone('utc', now())
      )
    $sql$, user_table, master_table);

    execute format(
      'create unique index if not exists %I on public.%I (user_id, master_id) where master_id is not null',
      user_table || '_user_master_key',
      user_table
    );

    execute format(
      'create unique index if not exists %I on public.%I (user_id, lower(label))',
      user_table || '_user_label_key',
      user_table
    );

    execute format(
      'create index if not exists %I on public.%I (user_id)',
      user_table || '_user_id_idx',
      user_table
    );

    execute format('drop trigger if exists %I on public.%I', user_table || '_set_updated_at', user_table);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      user_table || '_set_updated_at',
      user_table
    );

    execute format('alter table public.%I enable row level security', master_table);
    execute format('alter table public.%I enable row level security', user_table);

    execute format('drop policy if exists %I on public.%I', master_table || '_select_authenticated', master_table);
    execute format(
      'create policy %I on public.%I for select to authenticated using (true)',
      master_table || '_select_authenticated',
      master_table
    );

    execute format('drop policy if exists %I on public.%I', user_table || '_select_own', user_table);
    execute format(
      'create policy %I on public.%I for select to authenticated using (user_id = auth.uid())',
      user_table || '_select_own',
      user_table
    );

    execute format('drop policy if exists %I on public.%I', user_table || '_insert_own', user_table);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (user_id = auth.uid())',
      user_table || '_insert_own',
      user_table
    );

    execute format('drop policy if exists %I on public.%I', user_table || '_update_own', user_table);
    execute format(
      'create policy %I on public.%I for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())',
      user_table || '_update_own',
      user_table
    );

    execute format('drop policy if exists %I on public.%I', user_table || '_delete_own', user_table);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (user_id = auth.uid())',
      user_table || '_delete_own',
      user_table
    );

    execute format('grant select on table public.%I to authenticated', master_table);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', user_table);
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- Seed master catalogs
-- -----------------------------------------------------------------------------
insert into public.master_entry_reasons (label, description, sort_order) values
  ('Breakout', 'Price breaks a key level or range', 10),
  ('Pullback', 'Entry on a retrace within the trend', 20),
  ('Support Bounce', 'Rejection from a support zone', 30),
  ('Resistance Rejection', 'Rejection from a resistance zone', 40),
  ('Trend Continuation', 'Follow-through in the existing trend', 50),
  ('News Catalyst', 'Entry driven by a scheduled or breaking event', 60),
  ('Order Block', 'Entry from an institutional order block', 70),
  ('Liquidity Sweep', 'Entry after a stop hunt / liquidity grab', 80),
  ('Break and Retest', 'Retest of a broken level as support or resistance', 90),
  ('Mean Reversion', 'Fade of an extended move back to value', 100)
on conflict (label) do update set
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = timezone('utc', now());

insert into public.master_exit_reasons (label, description, sort_order) values
  ('Take Profit Hit', 'Price reached the planned target', 10),
  ('Stop Loss Hit', 'Price reached the planned invalidation', 20),
  ('Partial Close', 'Scaled out of part of the position', 30),
  ('Manual Exit', 'Closed by discretion before TP or SL', 40),
  ('Trailing Stop', 'Exited as the trail was hit', 50),
  ('Time Stop', 'Exited because the idea expired', 60),
  ('Invalidation', 'Structure or thesis no longer valid', 70),
  ('News Event', 'Exited ahead of or because of news', 80)
on conflict (label) do update set
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = timezone('utc', now());

insert into public.master_timeframes (label, description, sort_order) values
  ('1M', '1 minute', 10),
  ('5M', '5 minutes', 20),
  ('15M', '15 minutes', 30),
  ('30M', '30 minutes', 40),
  ('1H', '1 hour', 50),
  ('4H', '4 hours', 60),
  ('1D', 'Daily', 70),
  ('1W', 'Weekly', 80)
on conflict (label) do update set
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = timezone('utc', now());

insert into public.master_emotions (label, description, sort_order) values
  ('Calm', 'Steady and in control', 10),
  ('Confident', 'Clear thesis, comfortable with risk', 20),
  ('Focused', 'Present and following the plan', 30),
  ('Patient', 'Willing to wait for the setup', 40),
  ('Neutral', 'No strong emotional charge', 50),
  ('FOMO', 'Fear of missing out', 60),
  ('Anxious', 'Uneasy about the outcome', 70),
  ('Overconfident', 'Sizing or holding beyond the plan', 80),
  ('Frustrated', 'Annoyed by price or process', 90),
  ('Revenge', 'Trading to make back a loss', 100)
on conflict (label) do update set
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = timezone('utc', now());

insert into public.master_mistakes (label, description, sort_order) values
  ('Moved Stop Loss', 'Widened or removed the planned stop', 10),
  ('Early Entry', 'Entered before confirmation', 20),
  ('Late Entry', 'Chased after the move was underway', 30),
  ('Oversized Position', 'Risked more than the plan allowed', 40),
  ('No Stop Loss', 'Entered without a defined invalidation', 50),
  ('Ignored Plan', 'Took a trade outside the playbook', 60),
  ('Overtrading', 'Took extra trades after the plan was done', 70),
  ('Held Too Long', 'Gave back profit or sat in a loser', 80),
  ('Cut Winner Early', 'Exited a winner before the target', 90),
  ('Revenge Trade', 'Traded to recover a loss', 100)
on conflict (label) do update set
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = timezone('utc', now());

-- -----------------------------------------------------------------------------
-- Migrate existing user_options.preferences JSON into user_* tables
-- -----------------------------------------------------------------------------
do $$
declare
  rec record;
  item jsonb;
  master_uuid uuid;
  item_label text;
  item_description text;
  item_enabled boolean;
  cats text[] := array['entry_reasons', 'exit_reasons', 'timeframes', 'emotions', 'mistakes'];
  cat text;
  user_table text;
  master_table text;
begin
  foreach cat in array cats loop
    master_table := 'master_' || cat;
    user_table := 'user_' || cat;

    for rec in
      select user_id, coalesce(preferences->cat, '[]'::jsonb) as items
      from public.user_options
    loop
      if jsonb_typeof(rec.items) <> 'array' then
        continue;
      end if;

      for item in select * from jsonb_array_elements(rec.items)
      loop
        item_label := nullif(trim(item->>'label'), '');
        if item_label is null then
          continue;
        end if;

        item_description := nullif(trim(item->>'description'), '');
        item_enabled := coalesce((item->>'is_active')::boolean, true);

        execute format(
          'select id from public.%I where lower(label) = lower($1) limit 1',
          master_table
        ) into master_uuid using item_label;

        if master_uuid is not null then
          execute format(
            'insert into public.%I (user_id, master_id, label, description, is_enabled)
             select $1, $2, m.label, coalesce($3, m.description), $4
             from public.%I m
             where m.id = $2
               and not exists (
                 select 1 from public.%I u
                 where u.user_id = $1 and lower(u.label) = lower(m.label)
               )',
            user_table, master_table, user_table
          ) using rec.user_id, master_uuid, item_description, item_enabled;

          execute format(
            'update public.%I
             set is_enabled = $3,
                 master_id = coalesce(master_id, $2),
                 updated_at = timezone(''utc'', now())
             where user_id = $1 and lower(label) = (
               select lower(label) from public.%I where id = $2
             )',
            user_table, master_table
          ) using rec.user_id, master_uuid, item_enabled;
        else
          execute format(
            'insert into public.%I (user_id, master_id, label, description, is_enabled)
             select $1, null, $2, $3, $4
             where not exists (
               select 1 from public.%I u
               where u.user_id = $1 and lower(u.label) = lower($2)
             )',
            user_table, user_table
          ) using rec.user_id, item_label, item_description, item_enabled;
        end if;
      end loop;
    end loop;
  end loop;
end $$;
