import { supabase, handleSupabaseError } from './api'
import {
  CONFIG_CATALOG_KEYS,
  createCustomConfigOption,
  deleteCustomConfigOption,
  getAllEnabledConfigPreferences,
  updateCustomConfigOption,
} from './configCatalogServices'

const EMPTY_PREFERENCES = {
  entry_reasons: [],
  exit_reasons: [],
  timeframes: [],
  emotions: [],
  mistakes: [],
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

function stripUnsupportedPreferences(preferences = {}) {
  const cleaned = { ...preferences }
  delete cleaned.position_sizes
  return cleaned
}

function normalizePreferences(preferences = {}) {
  const cleaned = stripUnsupportedPreferences(preferences)

  return {
    ...EMPTY_PREFERENCES,
    ...cleaned,
    entry_reasons: cleaned.entry_reasons ?? [],
    exit_reasons: cleaned.exit_reasons ?? [],
    timeframes: cleaned.timeframes ?? [],
    emotions: cleaned.emotions ?? [],
    mistakes: cleaned.mistakes ?? [],
  }
}

async function withCatalogPreferences(settingsRow) {
  const catalogPreferences = await getAllEnabledConfigPreferences()

  return {
    ...settingsRow,
    preferences: normalizePreferences({
      ...settingsRow.preferences,
      ...catalogPreferences,
    }),
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

    return withCatalogPreferences(created)
  }

  return withCatalogPreferences(data)
}

export async function updateSettings(payload) {
  const user = await getAuthUser()
  await ensureUserProfile(user)

  const nextPayload = { ...payload }
  if (nextPayload.preferences) {
    nextPayload.preferences = normalizePreferences(nextPayload.preferences)
  }

  const { data, error } = await supabase
    .from('user_options')
    .update(nextPayload)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) {
    handleSupabaseError(error)
  }

  return withCatalogPreferences(data)
}

export async function getConfigOptions(categoryKey) {
  const settings = await getSettings()
  return settings.preferences[categoryKey] ?? []
}

export async function createConfigOption(categoryKey, option) {
  if (!CONFIG_CATALOG_KEYS.includes(categoryKey)) {
    throw new Error('Unknown configuration category')
  }

  const created = await createCustomConfigOption(categoryKey, option)
  const settings = await getSettings()
  return {
    option: created,
    settings,
  }
}

export async function updateConfigOption(categoryKey, id, option) {
  if (!CONFIG_CATALOG_KEYS.includes(categoryKey)) {
    throw new Error('Unknown configuration category')
  }

  const updatedOption = await updateCustomConfigOption(categoryKey, id, option)
  const settings = await getSettings()
  return {
    option: updatedOption,
    settings,
  }
}

export async function deleteConfigOption(categoryKey, id) {
  if (!CONFIG_CATALOG_KEYS.includes(categoryKey)) {
    throw new Error('Unknown configuration category')
  }

  await deleteCustomConfigOption(categoryKey, id)
  const settings = await getSettings()
  return {
    id,
    settings,
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
