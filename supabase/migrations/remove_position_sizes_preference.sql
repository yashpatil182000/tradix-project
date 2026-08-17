-- Drop unused personalized position size presets from user preferences.
-- Lot size is chosen in the trade form LotSelector, not stored as config.

update public.user_options
set preferences = preferences - 'position_sizes'
where preferences ? 'position_sizes';
