-- Common master catalog items for Settings configuration.
-- Run in the Supabase SQL Editor after master_* tables exist
-- (see supabase/migrations/master_config_options.sql).

insert into public.master_entry_reasons (label, description, sort_order) values
  ('Breakout', 'Price breaks a key level or range', 10),
  ('Pullback', 'Entry on a retrace within the trend', 20),
  ('Support Bounce', 'Rejection from a support zone', 30),
  ('Resistance Rejection', 'Rejection from a resistance zone', 40),
  ('Trend Continuation', 'Follow-through in the existing trend', 50),
  ('News Catalyst', 'Entry driven by a scheduled or breaking event', 60)
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
  ('Trailing Stop', 'Exited as the trail was hit', 50)
on conflict (label) do update set
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = timezone('utc', now());

insert into public.master_timeframes (label, description, sort_order) values
  ('1M', '1 minute', 10),
  ('5M', '5 minutes', 20),
  ('15M', '15 minutes', 30),
  ('1H', '1 hour', 40),
  ('4H', '4 hours', 50),
  ('1D', 'Daily', 60)
on conflict (label) do update set
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = timezone('utc', now());

insert into public.master_emotions (label, description, sort_order) values
  ('Calm', 'Steady and in control', 10),
  ('Confident', 'Clear thesis, comfortable with risk', 20),
  ('Focused', 'Present and following the plan', 30),
  ('FOMO', 'Fear of missing out', 40),
  ('Anxious', 'Uneasy about the outcome', 50),
  ('Revenge', 'Trading to make back a loss', 60)
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
  ('Overtrading', 'Took extra trades after the plan was done', 60)
on conflict (label) do update set
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = timezone('utc', now());
