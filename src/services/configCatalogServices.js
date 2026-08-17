import { supabase, handleSupabaseError } from './api'

export const CONFIG_CATALOG_KEYS = [
  'entry_reasons',
  'exit_reasons',
  'timeframes',
  'emotions',
  'mistakes',
]

const TABLES = {
  entry_reasons: {
    master: 'master_entry_reasons',
    user: 'user_entry_reasons',
  },
  exit_reasons: {
    master: 'master_exit_reasons',
    user: 'user_exit_reasons',
  },
  timeframes: {
    master: 'master_timeframes',
    user: 'user_timeframes',
  },
  emotions: {
    master: 'master_emotions',
    user: 'user_emotions',
  },
  mistakes: {
    master: 'master_mistakes',
    user: 'user_mistakes',
  },
}

function getTables(categoryKey) {
  const tables = TABLES[categoryKey]
  if (!tables) {
    throw new Error(`Unknown configuration category: ${categoryKey}`)
  }
  return tables
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

function decorateOption(master, userRow = null) {
  const isCustom = Boolean(userRow && !userRow.master_id)
  const label = isCustom ? userRow.label : (master?.label ?? userRow?.label)
  const description = isCustom
    ? userRow.description
    : (master?.description ?? userRow?.description)
  const isEnabled = userRow ? Boolean(userRow.is_enabled) : false

  return {
    id: isCustom ? userRow.id : master.id,
    user_option_id: userRow?.id ?? null,
    master_id: master?.id ?? userRow?.master_id ?? null,
    label,
    description: description || null,
    is_active: isEnabled,
    is_enabled: isEnabled,
    is_custom: isCustom,
    sort_order: master?.sort_order ?? 1000,
  }
}

export function toPreferenceOption(item) {
  return {
    id: item.id,
    label: item.label,
    description: item.description,
    value: null,
    is_active: item.is_enabled !== false,
    is_custom: Boolean(item.is_custom),
  }
}

/**
 * Full master catalog with the current user's enable state.
 */
export async function getMasterConfigCatalog(categoryKey) {
  const user = await getAuthUser()
  const { master, user: userTable } = getTables(categoryKey)

  const [{ data: masters, error: masterError }, { data: userRows, error: userError }] =
    await Promise.all([
      supabase
        .from(master)
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('label', { ascending: true }),
      supabase.from(userTable).select('*').eq('user_id', user.id),
    ])

  if (masterError) {
    handleSupabaseError(masterError)
  }

  if (userError) {
    handleSupabaseError(userError)
  }

  const userByMasterId = new Map(
    (userRows ?? [])
      .filter((row) => row.master_id)
      .map((row) => [row.master_id, row]),
  )

  return (masters ?? []).map((row) =>
    decorateOption(row, userByMasterId.get(row.id) ?? null),
  )
}

/**
 * Items the user has enabled from catalog, plus custom items they created.
 */
export async function getYourConfigOptions(categoryKey) {
  const user = await getAuthUser()
  const { master, user: userTable } = getTables(categoryKey)

  const { data, error } = await supabase
    .from(userTable)
    .select(`*, master:${master}!master_id(*)`)
    .eq('user_id', user.id)
    .eq('is_enabled', true)
    .order('created_at', { ascending: true })

  if (error) {
    handleSupabaseError(error)
  }

  return (data ?? [])
    .filter((row) => !row.master_id || row.master?.is_active !== false)
    .map((row) => decorateOption(row.master, row))
    .sort((a, b) => {
      if (a.is_custom !== b.is_custom) return a.is_custom ? 1 : -1
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order
      return a.label.localeCompare(b.label)
    })
}

export async function getEnabledConfigOptions(categoryKey) {
  const items = await getYourConfigOptions(categoryKey)
  return items.map(toPreferenceOption)
}

export async function getAllEnabledConfigPreferences() {
  const entries = await Promise.all(
    CONFIG_CATALOG_KEYS.map(async (key) => [key, await getEnabledConfigOptions(key)]),
  )
  return Object.fromEntries(entries)
}

async function findUserRowByMasterId(userTable, userId, masterId) {
  const { data, error } = await supabase
    .from(userTable)
    .select('*')
    .eq('user_id', userId)
    .eq('master_id', masterId)
    .maybeSingle()

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

async function getMasterById(masterTable, masterId) {
  const { data, error } = await supabase
    .from(masterTable)
    .select('*')
    .eq('id', masterId)
    .single()

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

export async function setConfigOptionEnabled(categoryKey, masterId, isEnabled) {
  const user = await getAuthUser()
  const { master, user: userTable } = getTables(categoryKey)
  const masterRow = await getMasterById(master, masterId)
  const existing = await findUserRowByMasterId(userTable, user.id, masterId)

  if (existing) {
    const { error } = await supabase
      .from(userTable)
      .update({ is_enabled: isEnabled })
      .eq('id', existing.id)

    if (error) {
      handleSupabaseError(error)
    }

    return decorateOption(masterRow, { ...existing, is_enabled: isEnabled })
  }

  if (!isEnabled) {
    return decorateOption(masterRow, null)
  }

  const { data, error } = await supabase
    .from(userTable)
    .insert({
      user_id: user.id,
      master_id: masterId,
      label: masterRow.label,
      description: masterRow.description,
      is_enabled: true,
    })
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      const { data: byLabel, error: labelError } = await supabase
        .from(userTable)
        .select('*')
        .eq('user_id', user.id)
        .ilike('label', masterRow.label)
        .maybeSingle()

      if (labelError) {
        handleSupabaseError(labelError)
      }

      if (byLabel) {
        const { data: updated, error: updateError } = await supabase
          .from(userTable)
          .update({
            master_id: byLabel.master_id || masterId,
            is_enabled: true,
            label: masterRow.label,
            description: masterRow.description,
          })
          .eq('id', byLabel.id)
          .select('*')
          .single()

        if (updateError) {
          handleSupabaseError(updateError)
        }

        return decorateOption(masterRow, updated)
      }
    }

    handleSupabaseError(error)
  }

  return decorateOption(masterRow, data)
}

async function findMasterByLabel(masterTable, label) {
  const { data, error } = await supabase
    .from(masterTable)
    .select('*')
    .ilike('label', label.trim())
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

export async function createCustomConfigOption(categoryKey, option) {
  const user = await getAuthUser()
  const { master, user: userTable } = getTables(categoryKey)
  const label = option.label.trim()
  const description = option.description?.trim() || null
  const isEnabled = option.is_active ?? true

  const matchingMaster = await findMasterByLabel(master, label)
  if (matchingMaster) {
    return setConfigOptionEnabled(categoryKey, matchingMaster.id, isEnabled)
  }

  const { data, error } = await supabase
    .from(userTable)
    .insert({
      user_id: user.id,
      master_id: null,
      label,
      description,
      is_enabled: isEnabled,
    })
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('An item with this label already exists')
    }
    handleSupabaseError(error)
  }

  return decorateOption(null, data)
}

export async function updateCustomConfigOption(categoryKey, id, option) {
  const user = await getAuthUser()
  const { user: userTable } = getTables(categoryKey)

  const { data: existing, error: existingError } = await supabase
    .from(userTable)
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingError) {
    handleSupabaseError(existingError)
  }

  if (!existing) {
    throw new Error('Configuration item not found')
  }

  if (existing.master_id) {
    throw new Error('Catalog items cannot be edited. Disable it instead.')
  }

  const { data, error } = await supabase
    .from(userTable)
    .update({
      label: option.label.trim(),
      description: option.description?.trim() || null,
      is_enabled: option.is_active ?? existing.is_enabled,
    })
    .eq('id', existing.id)
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('An item with this label already exists')
    }
    handleSupabaseError(error)
  }

  return decorateOption(null, data)
}

export async function deleteCustomConfigOption(categoryKey, id) {
  const user = await getAuthUser()
  const { user: userTable } = getTables(categoryKey)

  const { data: existing, error: existingError } = await supabase
    .from(userTable)
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingError) {
    handleSupabaseError(existingError)
  }

  if (!existing) {
    throw new Error('Configuration item not found')
  }

  if (existing.master_id) {
    throw new Error('Catalog items cannot be deleted. Disable it instead.')
  }

  const { error } = await supabase.from(userTable).delete().eq('id', existing.id)

  if (error) {
    handleSupabaseError(error)
  }

  return { id }
}
