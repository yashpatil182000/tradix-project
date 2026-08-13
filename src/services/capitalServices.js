import { toUtcIsoFromLocalInput } from '@/features/capital/utils/formatCapital'
import { supabase, handleSupabaseError } from './api'

export const ADJUSTMENT_OUT_PREFIX = '[OUT] '

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

function toNumber(value) {
  return Number(value) || 0
}

export function isAdjustmentOut(entry) {
  return (
    entry.entry_type === 'adjustment' &&
    typeof entry.note === 'string' &&
    entry.note.startsWith(ADJUSTMENT_OUT_PREFIX)
  )
}

export function getDisplayNote(entry) {
  if (!entry?.note) return null
  if (isAdjustmentOut(entry)) {
    const text = entry.note.slice(ADJUSTMENT_OUT_PREFIX.length).trim()
    return text || null
  }
  return entry.note
}

export function getSignedAmount(entry) {
  const amount = Math.abs(toNumber(entry.amount))
  if (entry.entry_type === 'withdrawal' || isAdjustmentOut(entry)) {
    return -amount
  }
  return amount
}

export function decorateCapitalEntries(entries = []) {
  const chronological = [...entries].sort((a, b) => {
    const timeDiff = new Date(a.recorded_at) - new Date(b.recorded_at)
    if (timeDiff !== 0) return timeDiff
    return new Date(a.created_at) - new Date(b.created_at)
  })

  let runningBalance = 0
  const withBalance = chronological.map((entry) => {
    const signedAmount = getSignedAmount(entry)
    runningBalance += signedAmount
    return {
      ...entry,
      amount: toNumber(entry.amount),
      signed_amount: signedAmount,
      running_balance: runningBalance,
      display_note: getDisplayNote(entry),
      direction: signedAmount < 0 ? 'out' : 'in',
    }
  })

  return withBalance
}

export function buildCapitalSummary(entries = []) {
  const decorated = decorateCapitalEntries(entries)
  const current = decorated.at(-1)?.running_balance ?? 0

  return decorated.reduce(
    (summary, entry) => {
      if (entry.entry_type === 'starting') {
        summary.initialCapital += entry.amount
      }
      if (entry.entry_type === 'deposit') {
        summary.totalDeposits += entry.amount
      }
      if (entry.entry_type === 'withdrawal') {
        summary.totalWithdrawals += entry.amount
      }
      if (entry.entry_type === 'adjustment') {
        summary.netAdjustments += entry.signed_amount
      }
      return summary
    },
    {
      currentCapital: current,
      initialCapital: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      netAdjustments: 0,
      hasStartingCapital: decorated.some((entry) => entry.entry_type === 'starting'),
      transactionCount: decorated.length,
    },
  )
}

export async function getCapitalEntries() {
  const user = await getAuthUser()
  await ensureUserProfile(user)

  const { data, error } = await supabase
    .from('capital')
    .select('*')
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: true })

  if (error) {
    handleSupabaseError(error)
  }

  return decorateCapitalEntries(data ?? [])
}

export async function getCapitalSummary() {
  const entries = await getCapitalEntries()
  return {
    entries,
    summary: buildCapitalSummary(entries),
  }
}

export async function createCapitalEntry(payload) {
  const user = await getAuthUser()
  await ensureUserProfile(user)

  if (payload.entry_type === 'starting') {
    const existing = await getCapitalEntries()
    if (existing.some((entry) => entry.entry_type === 'starting')) {
      throw new Error('Initial capital has already been set')
    }
  }

  let note = payload.note?.trim() || null
  if (payload.entry_type === 'adjustment' && payload.direction === 'out') {
    note = `${ADJUSTMENT_OUT_PREFIX}${note || ''}`.trimEnd()
  }

  const { data, error } = await supabase
    .from('capital')
    .insert({
      user_id: user.id,
      entry_type: payload.entry_type,
      amount: payload.amount,
      currency: payload.currency || 'USD',
      note,
      recorded_at:
        toUtcIsoFromLocalInput(payload.recorded_at) ||
        payload.recorded_at ||
        new Date().toISOString(),
    })
    .select('*')
    .single()

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

export const TRADE_CAPITAL_MARKER = '[TRADE:'

export async function deleteCapitalEntry(id) {
  const { error } = await supabase.from('capital').delete().eq('id', id)

  if (error) {
    handleSupabaseError(error)
  }
}

export async function removeCapitalForTrade(tradeId) {
  const entries = await getCapitalEntries()
  const marker = `${TRADE_CAPITAL_MARKER}${tradeId}]`
  const related = entries.filter((entry) => entry.note?.includes(marker))

  await Promise.all(related.map((entry) => deleteCapitalEntry(entry.id)))
}

export async function syncCapitalForClosedTrade({
  tradeId,
  pnl,
  recordedAt,
  currency = 'USD',
}) {
  await removeCapitalForTrade(tradeId)

  const amount = Math.abs(Number(pnl) || 0)
  if (!amount) {
    const entries = await getCapitalEntries()
    return buildCapitalSummary(entries).currentCapital
  }

  await createCapitalEntry({
    entry_type: 'adjustment',
    amount,
    direction: Number(pnl) >= 0 ? 'in' : 'out',
    note: `${TRADE_CAPITAL_MARKER}${tradeId}] Closed trade P/L`,
    recorded_at: recordedAt,
    currency,
  })

  const entries = await getCapitalEntries()
  return buildCapitalSummary(entries).currentCapital
}
