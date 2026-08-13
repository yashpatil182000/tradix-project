import { supabase, handleSupabaseError } from './api'

async function ensureUserProfile(user) {
  const { data: existing, error: selectError } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (selectError) {
    handleSupabaseError(selectError)
  }

  if (existing) {
    return
  }

  const { error } = await supabase.from('users').insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name ?? null,
  })

  if (error) {
    handleSupabaseError(error)
  }
}

async function getAuthUser() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    handleSupabaseError(userError)
  }

  if (!user) {
    throw new Error('You must be signed in')
  }

  return user
}

/**
 * Normalize a master + optional user_instrument row into the shape expected by
 * Trade Journal and Instrument Management UIs.
 */
export function decorateInstrument(master, userInstrument = null) {
  if (!master) return null

  const isEnabled = userInstrument ? Boolean(userInstrument.is_enabled) : false

  return {
    id: master.id,
    master_instrument_id: master.id,
    user_instrument_id: userInstrument?.id ?? null,
    symbol: master.symbol,
    name: master.display_name,
    display_name: master.display_name,
    asset_class: master.asset_class,
    type: master.asset_class,
    contract_size: Number(master.contract_size),
    pip_size: Number(master.pip_size),
    price_precision: master.price_precision,
    min_lot: Number(master.min_lot),
    lot_step: Number(master.lot_step),
    max_lot: Number(master.max_lot),
    is_active: isEnabled,
    is_enabled: isEnabled,
    master_is_active: master.is_active !== false,
  }
}

/**
 * Catalog browse: all active master instruments with the current user's
 * enable state. Used by Instrument Management.
 */
export async function getMasterInstrumentsCatalog() {
  const user = await getAuthUser()
  await ensureUserProfile(user)

  const [{ data: masters, error: masterError }, { data: userRows, error: userError }] =
    await Promise.all([
      supabase
        .from('master_instruments')
        .select('*')
        .eq('is_active', true)
        .order('asset_class', { ascending: true })
        .order('symbol', { ascending: true }),
      supabase
        .from('user_instruments')
        .select('*')
        .eq('user_id', user.id),
    ])

  if (masterError) {
    handleSupabaseError(masterError)
  }

  if (userError) {
    handleSupabaseError(userError)
  }

  const userByMasterId = new Map(
    (userRows ?? []).map((row) => [row.master_instrument_id, row]),
  )

  return (masters ?? []).map((master) =>
    decorateInstrument(master, userByMasterId.get(master.id) ?? null),
  )
}

/**
 * Enabled instruments for the current user (Trade Journal select).
 * Shape stays compatible: id = master_instrument id, is_active, symbol, name.
 */
export async function getInstruments() {
  const user = await getAuthUser()
  await ensureUserProfile(user)

  const { data, error } = await supabase
    .from('user_instruments')
    .select('*, master_instruments(*)')
    .eq('user_id', user.id)
    .eq('is_enabled', true)
    .order('created_at', { ascending: true })

  if (error) {
    handleSupabaseError(error)
  }

  return (data ?? [])
    .filter((row) => row.master_instruments?.is_active !== false)
    .map((row) => decorateInstrument(row.master_instruments, row))
    .sort((a, b) => a.symbol.localeCompare(b.symbol))
}

export async function getInstrumentById(id) {
  const user = await getAuthUser()
  await ensureUserProfile(user)

  const { data: master, error: masterError } = await supabase
    .from('master_instruments')
    .select('*')
    .eq('id', id)
    .single()

  if (masterError) {
    handleSupabaseError(masterError)
  }

  const { data: userRow, error: userError } = await supabase
    .from('user_instruments')
    .select('*')
    .eq('user_id', user.id)
    .eq('master_instrument_id', id)
    .maybeSingle()

  if (userError) {
    handleSupabaseError(userError)
  }

  return decorateInstrument(master, userRow)
}

/**
 * Enable a master instrument for the current user.
 */
export async function enableInstrument(masterInstrumentId) {
  const user = await getAuthUser()
  await ensureUserProfile(user)

  const { data: existing, error: existingError } = await supabase
    .from('user_instruments')
    .select('*')
    .eq('user_id', user.id)
    .eq('master_instrument_id', masterInstrumentId)
    .maybeSingle()

  if (existingError) {
    handleSupabaseError(existingError)
  }

  if (existing) {
    if (existing.is_enabled) {
      return getInstrumentById(masterInstrumentId)
    }

    const { error } = await supabase
      .from('user_instruments')
      .update({ is_enabled: true })
      .eq('id', existing.id)

    if (error) {
      handleSupabaseError(error)
    }

    return getInstrumentById(masterInstrumentId)
  }

  const { error } = await supabase.from('user_instruments').insert({
    user_id: user.id,
    master_instrument_id: masterInstrumentId,
    is_enabled: true,
  })

  if (error) {
    handleSupabaseError(error)
  }

  return getInstrumentById(masterInstrumentId)
}

/**
 * Disable a master instrument for the current user.
 */
export async function disableInstrument(masterInstrumentId) {
  const user = await getAuthUser()
  await ensureUserProfile(user)

  const { data: existing, error: existingError } = await supabase
    .from('user_instruments')
    .select('*')
    .eq('user_id', user.id)
    .eq('master_instrument_id', masterInstrumentId)
    .maybeSingle()

  if (existingError) {
    handleSupabaseError(existingError)
  }

  if (!existing) {
    return getInstrumentById(masterInstrumentId)
  }

  const { error } = await supabase
    .from('user_instruments')
    .update({ is_enabled: false })
    .eq('id', existing.id)

  if (error) {
    handleSupabaseError(error)
  }

  return getInstrumentById(masterInstrumentId)
}

export async function setInstrumentEnabled(masterInstrumentId, isEnabled) {
  return isEnabled
    ? enableInstrument(masterInstrumentId)
    : disableInstrument(masterInstrumentId)
}
