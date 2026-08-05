export const ENTRY_TYPE_LABELS = {
  starting: 'Initial Capital',
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  adjustment: 'Adjustment',
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)
}

export function formatDateTime(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function toDateTimeLocalValue(date = new Date()) {
  const copy = new Date(date)
  const offset = copy.getTimezoneOffset()
  const local = new Date(copy.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 16)
}
