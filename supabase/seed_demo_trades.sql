-- Demo seed for zedishere1570@gmail.com
-- Instruments, config options, capital top-up, and dummy trade journal data.

do $$
declare
  uid uuid := 'e3529656-19dc-4b6a-8883-ec1a5d542173';
  inst_xau uuid;
  inst_eur uuid;
  inst_gbp uuid;
  inst_nas uuid;
  inst_btc uuid;
  inst_us30 uuid;
  inst_gbpsnzd uuid;
  t_id uuid;
  prefs jsonb;
begin
  -- Resolve master instruments ------------------------------------------------
  select id into inst_xau from public.master_instruments where symbol = 'XAUUSD';
  select id into inst_eur from public.master_instruments where symbol = 'EURUSD';
  select id into inst_gbp from public.master_instruments where symbol = 'GBPUSD';
  select id into inst_nas from public.master_instruments where symbol = 'NAS100';
  select id into inst_btc from public.master_instruments where symbol = 'BTCUSD';
  select id into inst_us30 from public.master_instruments where symbol = 'US30';
  select id into inst_gbpsnzd from public.master_instruments where symbol = 'GPBSNZD';

  if inst_gbpsnzd is null then
    select id into inst_gbpsnzd from public.master_instruments where symbol = 'GBPSNZD';
  end if;

  -- Enable demo instruments for the user --------------------------------------
  insert into public.user_instruments (user_id, master_instrument_id, is_enabled)
  select uid, m.id, true
  from public.master_instruments m
  where m.symbol in (
    'XAUUSD', 'EURUSD', 'GBPUSD', 'NAS100', 'BTCUSD', 'US30', 'GPBSNZD', 'GBPSNZD'
  )
  on conflict (user_id, master_instrument_id) do update
    set is_enabled = true,
        updated_at = timezone('utc', now());

  -- Config options (trade form dropdowns / chips) --------------------------------
  prefs := jsonb_build_object(
    'entry_reasons', jsonb_build_array(
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Breakout', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Pullback', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Support Bounce', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Resistance Rejection', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Trend Continuation', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'News Catalyst', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Order Block', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Liquidity Sweep', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now())
    ),
    'exit_reasons', jsonb_build_array(
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Take Profit Hit', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Stop Loss Hit', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Partial Close', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Manual Exit', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Trailing Stop', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Time Stop', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Invalidation', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now())
    ),
    'timeframes', jsonb_build_array(
      jsonb_build_object('id', gen_random_uuid()::text, 'label', '1M', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', '5M', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', '15M', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', '1H', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', '4H', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', '1D', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', '1W', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now())
    ),
    'emotions', jsonb_build_array(
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Calm', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Confident', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Focused', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'FOMO', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Anxious', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Revenge', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Overconfident', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Frustrated', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now())
    ),
    'mistakes', jsonb_build_array(
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Moved Stop Loss', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Early Entry', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Late Entry', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Oversized Position', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'No Stop Loss', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Ignored Plan', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Overtrading', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Held Too Long', 'value', null, 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now())
    ),
    'position_sizes', jsonb_build_array(
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Micro 0.01', 'value', '0.01', 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Small 0.05', 'value', '0.05', 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Standard 0.10', 'value', '0.10', 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Medium 0.25', 'value', '0.25', 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now()),
      jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Large 0.50', 'value', '0.50', 'is_active', true, 'description', null, 'created_at', now(), 'updated_at', now())
    )
  );

  insert into public.user_options (user_id, default_currency, timezone, risk_per_trade_percent, theme, preferences)
  values (uid, 'USD', 'Asia/Kolkata', 1.00, 'system', prefs)
  on conflict (user_id) do update
    set preferences = excluded.preferences,
        default_currency = excluded.default_currency,
        timezone = excluded.timezone,
        updated_at = timezone('utc', now());

  -- Capital top-up so charts have room to grow ----------------------------------
  if not exists (
    select 1 from public.capital
    where user_id = uid and note = 'Demo seed deposit'
  ) then
    insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
    values (uid, 'deposit', 5000.00, 'USD', 'Demo seed deposit', '2026-05-01 04:00:00+00');
  end if;

  -- Helper: insert closed trade + capital P/L adjustment ------------------------
  -- May 2026
  t_id := 'a1000001-0000-4000-8000-000000000001';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount, capital_after,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_eur, 'long', 'closed',
    1.07500, 1.08200, 1.00, 1.07100, 1.08300, 2.00,
    5.00, 2.0000, 4.00, 8.00, null,
    'London Open Breakout', 'Clean trend day.', 'Calm', 'intraday', 'Breakout', 'Take Profit Hit', '15M',
    '[]', true, 'Wait for London open confirmation.', 4,
    '2026-05-05 08:15:00+00', '2026-05-05 11:40:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 5.00, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-05-05 11:40:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000002';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_xau, 'long', 'closed',
    2320.00, 2305.00, 0.10, 2308.00, 2344.00, 3.00,
    -4.50, 2.0000, 1.20, 2.40,
    'Asian Range Fade', 'Got chopped.', 'Anxious', 'scalp', 'Support Bounce', 'Stop Loss Hit', '5M',
    '["Early Entry"]', false, 'Do not force fades in thin liquidity.', 2,
    '2026-05-08 03:20:00+00', '2026-05-08 04:05:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 4.50, 'USD', '[OUT] [TRADE:' || t_id || '] Closed trade P/L', '2026-05-08 04:05:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000003';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_nas, 'short', 'closed',
    18500.00, 18380.00, 0.50, 18560.00, 18320.00, 4.00,
    56.00, 3.0000, 30.00, 90.00,
    'Supply Zone Short', 'Nice rejection.', 'Confident', 'swing', 'Resistance Rejection', 'Take Profit Hit', '4H',
    '[]', true, 'Respect higher timeframe supply.', 5,
    '2026-05-12 14:00:00+00', '2026-05-14 18:30:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 56.00, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-05-14 18:30:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000004';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_gbp, 'long', 'closed',
    1.26500, 1.27100, 0.80, 1.26100, 1.27300, 2.50,
    2.30, 2.0000, 3.20, 6.40,
    'NY Session Continuation', null, 'Focused', 'intraday', 'Trend Continuation', 'Partial Close', '1H',
    '[]', true, null, 4,
    '2026-05-20 13:10:00+00', '2026-05-20 16:45:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 2.30, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-05-20 16:45:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000005';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_btc, 'long', 'closed',
    64000.00, 62800.00, 0.05, 63200.00, 66000.00, 5.00,
    -65.00, 2.5000, 40.00, 100.00,
    'Breakout Retest Fail', 'FOMO entry after pump.', 'FOMO', 'swing', 'Breakout', 'Stop Loss Hit', '1H',
    '["Late Entry","Oversized Position"]', false, 'Size down after big candles.', 1,
    '2026-05-27 09:00:00+00', '2026-05-28 02:15:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 65.00, 'USD', '[OUT] [TRADE:' || t_id || '] Closed trade P/L', '2026-05-28 02:15:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  -- June 2026
  t_id := 'a1000001-0000-4000-8000-000000000006';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_us30, 'long', 'closed',
    39200.00, 39480.00, 0.40, 39080.00, 39560.00, 3.50,
    108.50, 3.0000, 48.00, 144.00,
    'US Open Momentum', 'Followed rules.', 'Confident', 'intraday', 'News Catalyst', 'Trailing Stop', '15M',
    '[]', true, 'Trail under VWAP after news spike.', 5,
    '2026-06-03 14:35:00+00', '2026-06-03 17:50:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 108.50, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-06-03 17:50:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000007';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_eur, 'short', 'closed',
    1.09000, 1.09450, 1.20, 1.09350, 1.08300, 2.00,
    -7.40, 2.0000, 4.20, 8.40,
    'Range Reversal', null, 'Frustrated', 'intraday', 'Resistance Rejection', 'Stop Loss Hit', '1H',
    '["Moved Stop Loss"]', false, 'Never widen stops.', 2,
    '2026-06-10 10:00:00+00', '2026-06-10 12:20:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 7.40, 'USD', '[OUT] [TRADE:' || t_id || '] Closed trade P/L', '2026-06-10 12:20:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000008';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_xau, 'short', 'closed',
    2365.00, 2340.00, 0.20, 2378.00, 2325.00, 4.00,
    21.00, 3.0769, 2.60, 8.00,
    'Liquidity Sweep Short', 'Swept highs then sold.', 'Focused', 'scalp', 'Liquidity Sweep', 'Take Profit Hit', '5M',
    '[]', true, 'Enter after sweep closes.', 5,
    '2026-06-16 07:45:00+00', '2026-06-16 09:10:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 21.00, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-06-16 09:10:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000009';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_nas, 'long', 'closed',
    19200.00, 19450.00, 0.30, 19080.00, 19560.00, 3.00,
    72.00, 3.0000, 36.00, 108.00,
    'Order Block Long', null, 'Calm', 'swing', 'Order Block', 'Take Profit Hit', '4H',
    '[]', true, null, 4,
    '2026-06-22 15:00:00+00', '2026-06-25 19:00:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 72.00, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-06-25 19:00:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000010';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_gbp, 'short', 'closed',
    1.27800, 1.28200, 1.00, 1.28150, 1.27000, 2.00,
    -6.00, 2.2857, 3.50, 8.00,
    'Revenge After Miss', 'Should have skipped.', 'Revenge', 'intraday', 'Pullback', 'Manual Exit', '15M',
    '["Ignored Plan","Overtrading"]', false, 'Walk away after two losses.', 1,
    '2026-06-28 11:30:00+00', '2026-06-28 12:05:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 6.00, 'USD', '[OUT] [TRADE:' || t_id || '] Closed trade P/L', '2026-06-28 12:05:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  -- July 2026
  t_id := 'a1000001-0000-4000-8000-000000000011';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_btc, 'short', 'closed',
    68500.00, 66200.00, 0.04, 69200.00, 65000.00, 6.00,
    86.00, 5.0000, 28.00, 140.00,
    'Distribution Short', 'Patient entry.', 'Calm', 'swing', 'Resistance Rejection', 'Take Profit Hit', '1D',
    '[]', true, 'Higher TF bias first.', 5,
    '2026-07-02 08:00:00+00', '2026-07-06 16:00:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 86.00, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-07-06 16:00:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000012';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_xau, 'long', 'closed',
    2388.00, 2412.00, 0.15, 2375.00, 2425.00, 3.00,
    21.00, 2.8462, 1.95, 5.55,
    'Pullback to Demand', null, 'Confident', 'intraday', 'Pullback', 'Take Profit Hit', '1H',
    '[]', true, null, 4,
    '2026-07-09 06:20:00+00', '2026-07-09 14:55:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 21.00, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-07-09 14:55:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000013';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_eur, 'long', 'closed',
    1.08400, 1.07900, 1.50, 1.08000, 1.09200, 2.50,
    -10.00, 2.0000, 6.00, 12.00,
    'False Breakout', null, 'Anxious', 'scalp', 'Breakout', 'Stop Loss Hit', '5M',
    '["Early Entry","No Stop Loss"]', false, 'Confirm close beyond level.', 2,
    '2026-07-14 09:15:00+00', '2026-07-14 09:40:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 10.00, 'USD', '[OUT] [TRADE:' || t_id || '] Closed trade P/L', '2026-07-14 09:40:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000014';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_us30, 'short', 'closed',
    40500.00, 40120.00, 0.35, 40680.00, 39900.00, 4.00,
    129.00, 3.3333, 63.00, 210.00,
    'Trend Continuation Short', 'Strong bearish day.', 'Focused', 'intraday', 'Trend Continuation', 'Trailing Stop', '15M',
    '[]', true, null, 5,
    '2026-07-18 14:05:00+00', '2026-07-18 18:20:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 129.00, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-07-18 18:20:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000015';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_nas, 'long', 'closed',
    20100.00, 19940.00, 0.25, 19980.00, 20340.00, 3.00,
    -43.00, 2.0000, 30.00, 60.00,
    'Overextended Long', 'Chased candles.', 'Overconfident', 'scalp', 'Breakout', 'Stop Loss Hit', '5M',
    '["Late Entry","Oversized Position"]', false, 'No chase after 3 green candles.', 1,
    '2026-07-23 15:40:00+00', '2026-07-23 16:05:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 43.00, 'USD', '[OUT] [TRADE:' || t_id || '] Closed trade P/L', '2026-07-23 16:05:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000016';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_gbp, 'long', 'closed',
    1.29000, 1.29850, 0.90, 1.28600, 1.30200, 2.00,
    5.65, 3.0000, 3.60, 10.80,
    'Support Bounce', null, 'Calm', 'swing', 'Support Bounce', 'Take Profit Hit', '4H',
    '[]', true, null, 4,
    '2026-07-28 07:00:00+00', '2026-07-30 12:30:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 5.65, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-07-30 12:30:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  -- August 2026 (this month / week / today for dashboard cards)
  t_id := 'a1000001-0000-4000-8000-000000000017';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_xau, 'long', 'closed',
    2425.00, 2458.00, 0.20, 2410.00, 2470.00, 3.50,
    29.50, 3.0000, 3.00, 9.00,
    'London Trend Day', null, 'Confident', 'intraday', 'Trend Continuation', 'Take Profit Hit', '15M',
    '[]', true, null, 5,
    '2026-08-03 07:30:00+00', '2026-08-03 12:10:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 29.50, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-08-03 12:10:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000018';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_nas, 'short', 'closed',
    20850.00, 20980.00, 0.20, 20940.00, 20650.00, 3.00,
    -29.00, 2.2222, 18.00, 40.00,
    'Failed Breakdown', null, 'Frustrated', 'intraday', 'Liquidity Sweep', 'Stop Loss Hit', '15M',
    '["Held Too Long"]', false, 'Cut when structure flips.', 2,
    '2026-08-04 15:00:00+00', '2026-08-04 16:25:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 29.00, 'USD', '[OUT] [TRADE:' || t_id || '] Closed trade P/L', '2026-08-04 16:25:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000019';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_eur, 'long', 'closed',
    1.09500, 1.10120, 1.00, 1.09100, 1.10300, 2.00,
    4.20, 2.0000, 4.00, 8.00,
    'Order Block Long', null, 'Focused', 'intraday', 'Order Block', 'Partial Close', '1H',
    '[]', true, null, 4,
    '2026-08-05 08:40:00+00', '2026-08-05 13:15:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 4.20, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-08-05 13:15:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000020';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_btc, 'long', 'closed',
    70200.00, 71850.00, 0.03, 69400.00, 72500.00, 5.00,
    44.50, 2.8750, 24.00, 69.00,
    'News Catalyst Long', 'CPI reaction trade.', 'Confident', 'swing', 'News Catalyst', 'Trailing Stop', '1H',
    '[]', true, 'Scale out into strength.', 5,
    '2026-08-05 18:00:00+00', '2026-08-06 05:30:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 44.50, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-08-06 05:30:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000021';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, inst_us30, 'long', 'closed',
    41200.00, 41460.00, 0.25, 41040.00, 41600.00, 3.00,
    62.00, 2.5000, 40.00, 100.00,
    'US Open Momentum', 'Today winner.', 'Calm', 'intraday', 'Breakout', 'Take Profit Hit', '15M',
    '[]', true, null, 4,
    '2026-08-06 13:35:00+00', '2026-08-06 16:10:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 62.00, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-08-06 16:10:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  t_id := 'a1000001-0000-4000-8000-000000000022';
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values (
    t_id, uid, coalesce(inst_gbpsnzd, inst_gbp), 'short', 'closed',
    2.10000, 2.08500, 0.50, 2.11200, 2.07000, 2.00,
    5.50, 2.5000, 6.00, 15.00,
    'Range Fade', null, 'Focused', 'scalp', 'Resistance Rejection', 'Manual Exit', '5M',
    '[]', true, null, 3,
    '2026-08-06 07:20:00+00', '2026-08-06 08:05:00+00'
  ) on conflict (id) do nothing;
  insert into public.capital (user_id, entry_type, amount, currency, note, recorded_at)
  select uid, 'adjustment', 5.50, 'USD', '[TRADE:' || t_id || '] Closed trade P/L', '2026-08-06 08:05:00+00'
  where not exists (select 1 from public.capital where user_id = uid and note like '%' || t_id || '%');

  -- Open trades for Active Trades card
  insert into public.trades (
    id, user_id, instrument_id, direction, status,
    entry_price, exit_price, quantity, stop_loss, take_profit, fees,
    pnl, risk_reward, risk_amount, reward_amount,
    setup, notes, emotions, style, entry_reason, exit_reason, timeframe,
    mistakes, followed_rules, lesson_learned, rating, entry_at, exit_at
  ) values
  (
    'a1000001-0000-4000-8000-000000000023', uid, inst_xau, 'long', 'open',
    2460.00, null, 0.10, 2445.00, 2490.00, 0,
    null, 2.0000, 1.50, 3.00,
    'Pullback to Demand', 'Running overnight.', 'Calm', 'swing', 'Pullback', null, '4H',
    '[]', true, null, null,
    '2026-08-06 04:00:00+00', null
  ),
  (
    'a1000001-0000-4000-8000-000000000024', uid, inst_nas, 'short', 'open',
    21020.00, null, 0.15, 21140.00, 20720.00, 0,
    null, 2.5000, 18.00, 45.00,
    'Supply Zone Short', null, 'Focused', 'intraday', 'Resistance Rejection', null, '1H',
    '[]', true, null, null,
    '2026-08-06 14:50:00+00', null
  ),
  (
    'a1000001-0000-4000-8000-000000000025', uid, inst_eur, 'long', 'open',
    1.10200, null, 0.80, 1.09850, 1.10900, 0,
    null, 2.0000, 2.80, 5.60,
    'London Open Breakout', null, 'Confident', 'intraday', 'Breakout', null, '15M',
    '[]', true, null, null,
    '2026-08-06 08:20:00+00', null
  )
  on conflict (id) do nothing;

end $$;

-- Quick verification counts
select
  (select count(*) from public.user_instruments where user_id = 'e3529656-19dc-4b6a-8883-ec1a5d542173' and is_enabled = true) as enabled_instruments,
  (select count(*) from public.trades where user_id = 'e3529656-19dc-4b6a-8883-ec1a5d542173') as trades,
  (select count(*) from public.trades where user_id = 'e3529656-19dc-4b6a-8883-ec1a5d542173' and status = 'closed') as closed_trades,
  (select count(*) from public.trades where user_id = 'e3529656-19dc-4b6a-8883-ec1a5d542173' and status = 'open') as open_trades,
  (select count(*) from public.capital where user_id = 'e3529656-19dc-4b6a-8883-ec1a5d542173') as capital_entries;
