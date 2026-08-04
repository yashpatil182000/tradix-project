import { supabase, handleSupabaseError } from './api'

async function ensureUserProfile(user) {
  const { error } = await supabase.from('users').upsert(
    {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
    },
    { onConflict: 'id' },
  )

  if (error) {
    handleSupabaseError(error)
  }
}

export async function getInstruments() {
  const { data, error } = await supabase
    .from('instruments')
    .select('*')
    .order('symbol', { ascending: true })

  if (error) {
    handleSupabaseError(error)
  }

  return data ?? []
}

export async function getInstrumentById(id) {
  const { data, error } = await supabase
    .from('instruments')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

export async function createInstrument(payload) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    handleSupabaseError(userError)
  }

  if (!user) {
    throw new Error('You must be signed in to create an instrument')
  }

  await ensureUserProfile(user)

  const { data, error } = await supabase
    .from('instruments')
    .insert({
      user_id: user.id,
      symbol: payload.symbol.trim().toUpperCase(),
      name: payload.name?.trim() || null,
      type: payload.type,
      exchange: payload.exchange?.trim() || null,
      is_active: payload.is_active ?? true,
    })
    .select('*')
    .single()

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

export async function updateInstrument(id, payload) {
  const { data, error } = await supabase
    .from('instruments')
    .update({
      symbol: payload.symbol.trim().toUpperCase(),
      name: payload.name?.trim() || null,
      type: payload.type,
      exchange: payload.exchange?.trim() || null,
      is_active: payload.is_active ?? true,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

export async function deleteInstrument(id) {
  const { error } = await supabase.from('instruments').delete().eq('id', id)

  if (error) {
    handleSupabaseError(error)
  }
}
