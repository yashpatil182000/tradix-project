export function toNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function calculateTradeMetrics({
  direction,
  entry_price,
  stop_loss,
  take_profit,
  quantity,
  exit_price,
  fees = 0,
}) {
  const isLong = direction === 'long' || direction === 'buy'
  const entry = toNumberOrNull(entry_price)
  const stopLoss = toNumberOrNull(stop_loss)
  const target = toNumberOrNull(take_profit)
  const size = toNumberOrNull(quantity)
  const exit = toNumberOrNull(exit_price)
  const feeAmount = toNumberOrNull(fees) ?? 0

  let riskAmount = null
  if (entry != null && stopLoss != null && size != null) {
    riskAmount = Math.abs((isLong ? entry - stopLoss : stopLoss - entry) * size)
  }

  let rewardAmount = null
  if (entry != null && target != null && size != null) {
    rewardAmount = Math.abs((isLong ? target - entry : entry - target) * size)
  }

  let riskReward = null
  if (riskAmount && rewardAmount && riskAmount > 0) {
    riskReward = rewardAmount / riskAmount
  }

  let pnl = null
  if (entry != null && exit != null && size != null) {
    pnl = (isLong ? exit - entry : entry - exit) * size - feeAmount
  }

  return {
    risk_amount: riskAmount,
    reward_amount: rewardAmount,
    risk_reward: riskReward,
    pnl,
  }
}

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
