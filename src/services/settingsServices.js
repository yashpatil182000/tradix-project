import { supabase, handleSupabaseError } from './api'

const EMPTY_PREFERENCES = {
  entry_reasons: [],
  exit_reasons: [],
  timeframes: [],
  emotions: [],
  mistakes: [],
  position_sizes: [],
}

async function getAuthUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    handleSupabaseError(error)
  }

  if (!user) {
    throw new Error('You must be signed in')
  }

  return user
}

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

function normalizePreferences(preferences = {}) {
  return {
    ...EMPTY_PREFERENCES,
    ...preferences,
    entry_reasons: preferences.entry_reasons ?? [],
    exit_reasons: preferences.exit_reasons ?? [],
    timeframes: preferences.timeframes ?? [],
    emotions: preferences.emotions ?? [],
    mistakes: preferences.mistakes ?? [],
    position_sizes: preferences.position_sizes ?? [],
  }
}

export async function getSettings() {
  const user = await getAuthUser()
  await ensureUserProfile(user)

  const { data, error } = await supabase
    .from('user_options')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    handleSupabaseError(error)
  }

  if (!data) {
    const { data: created, error: createError } = await supabase
      .from('user_options')
      .insert({
        user_id: user.id,
        preferences: EMPTY_PREFERENCES,
      })
      .select('*')
      .single()

    if (createError) {
      handleSupabaseError(createError)
    }

    return {
      ...created,
      preferences: normalizePreferences(created.preferences),
    }
  }

  return {
    ...data,
    preferences: normalizePreferences(data.preferences),
  }
}

export async function updateSettings(payload) {
  const user = await getAuthUser()
  await ensureUserProfile(user)

  const { data, error } = await supabase
    .from('user_options')
    .update(payload)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) {
    handleSupabaseError(error)
  }

  return {
    ...data,
    preferences: normalizePreferences(data.preferences),
  }
}

export async function getConfigOptions(categoryKey) {
  const settings = await getSettings()
  return settings.preferences[categoryKey] ?? []
}

export async function createConfigOption(categoryKey, option) {
  const settings = await getSettings()
  const current = settings.preferences[categoryKey] ?? []

  const nextOption = {
    id: crypto.randomUUID(),
    label: option.label.trim(),
    description: option.description?.trim() || null,
    value: option.value?.trim?.() ? option.value.trim() : option.value ?? null,
    is_active: option.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const preferences = {
    ...settings.preferences,
    [categoryKey]: [...current, nextOption],
  }

  const updated = await updateSettings({ preferences })
  return {
    option: nextOption,
    settings: updated,
  }
}

export async function updateConfigOption(categoryKey, id, option) {
  const settings = await getSettings()
  const current = settings.preferences[categoryKey] ?? []
  const index = current.findIndex((item) => item.id === id)

  if (index === -1) {
    throw new Error('Configuration item not found')
  }

  const nextOption = {
    ...current[index],
    label: option.label.trim(),
    description: option.description?.trim() || null,
    value: option.value?.trim?.() ? option.value.trim() : option.value ?? null,
    is_active: option.is_active ?? true,
    updated_at: new Date().toISOString(),
  }

  const nextList = [...current]
  nextList[index] = nextOption

  const preferences = {
    ...settings.preferences,
    [categoryKey]: nextList,
  }

  const updated = await updateSettings({ preferences })
  return {
    option: nextOption,
    settings: updated,
  }
}

export async function deleteConfigOption(categoryKey, id) {
  const settings = await getSettings()
  const current = settings.preferences[categoryKey] ?? []

  const preferences = {
    ...settings.preferences,
    [categoryKey]: current.filter((item) => item.id !== id),
  }

  const updated = await updateSettings({ preferences })
  return {
    id,
    settings: updated,
  }
}

export async function getProfile() {
  const user = await getAuthUser()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

export async function updateProfile(payload) {
  const user = await getAuthUser()

  const { data, error } = await supabase
    .from('users')
    .update(payload)
    .eq('id', user.id)
    .select('*')
    .single()

  if (error) {
    handleSupabaseError(error)
  }

  return data
}
