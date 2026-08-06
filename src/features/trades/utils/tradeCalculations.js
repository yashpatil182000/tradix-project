export {
  calculateTradeMetrics,
  toNumberOrNull,
} from '@/lib/calculations/calculateTradeMetrics'

export function parseMistakes(value) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return String(value)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
}

export function serializeMistakes(values = []) {
  return JSON.stringify(values.filter(Boolean))
}
