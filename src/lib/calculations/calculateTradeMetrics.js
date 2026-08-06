/**
 * Single source of truth for trade risk/reward/P&L calculations.
 * Uses master instrument metadata (contract_size, pip_size) — never hardcode
 * those values in UI components.
 */

export function toNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function resolveContractSize(instrument) {
  const value = toNumberOrNull(instrument?.contract_size)
  return value != null && value > 0 ? value : 1
}

function resolvePipSize(instrument) {
  const value = toNumberOrNull(instrument?.pip_size)
  return value != null && value > 0 ? value : null
}

function priceToDistance(priceDiff, pipSize) {
  if (priceDiff == null) return null
  if (pipSize == null) return priceDiff
  return priceDiff / pipSize
}

function monetaryValue(priceDiff, contractSize, lotSize) {
  if (priceDiff == null || lotSize == null) return null
  return priceDiff * contractSize * lotSize
}

/**
 * @param {object} params
 * @param {object} [params.instrument] Master instrument metadata
 * @param {string} params.direction long|short|buy|sell
 * @param {number|string} params.entry_price
 * @param {number|string} [params.stop_loss]
 * @param {number|string} [params.target] Take-profit / target price
 * @param {number|string} [params.take_profit] Alias for target
 * @param {number|string} [params.exit_price]
 * @param {number|string} [params.lot_size] Position size in lots
 * @param {number|string} [params.quantity] Alias for lot_size
 * @param {number|string} [params.fees]
 * @param {number|string} [params.current_capital] When set, capital_after is returned
 */
export function calculateTradeMetrics({
  instrument = null,
  direction,
  entry_price,
  stop_loss,
  target,
  take_profit,
  exit_price,
  lot_size,
  quantity,
  fees = 0,
  current_capital,
} = {}) {
  const isLong = direction === 'long' || direction === 'buy'
  const entry = toNumberOrNull(entry_price)
  const stopLoss = toNumberOrNull(stop_loss)
  const targetPrice = toNumberOrNull(
    target !== undefined ? target : take_profit,
  )
  const size = toNumberOrNull(lot_size !== undefined ? lot_size : quantity)
  const exit = toNumberOrNull(exit_price)
  const feeAmount = toNumberOrNull(fees) ?? 0
  const capital = toNumberOrNull(current_capital)

  const contractSize = resolveContractSize(instrument)
  const pipSize = resolvePipSize(instrument)

  let riskPriceDistance = null
  if (entry != null && stopLoss != null) {
    riskPriceDistance = Math.abs(isLong ? entry - stopLoss : stopLoss - entry)
  }

  let rewardPriceDistance = null
  if (entry != null && targetPrice != null) {
    rewardPriceDistance = Math.abs(
      isLong ? targetPrice - entry : entry - targetPrice,
    )
  }

  const riskDistance = priceToDistance(riskPriceDistance, pipSize)
  const rewardDistance = priceToDistance(rewardPriceDistance, pipSize)

  const riskAmount = monetaryValue(riskPriceDistance, contractSize, size)
  const rewardAmount = monetaryValue(rewardPriceDistance, contractSize, size)

  let riskReward = null
  if (riskAmount && rewardAmount && riskAmount > 0) {
    riskReward = rewardAmount / riskAmount
  }

  let pnl = null
  if (entry != null && exit != null && size != null) {
    const signedDiff = isLong ? exit - entry : entry - exit
    pnl = monetaryValue(signedDiff, contractSize, size) - feeAmount
  }

  let capitalAfter = null
  if (capital != null && pnl != null) {
    capitalAfter = capital + pnl
  }

  return {
    risk_distance: riskDistance,
    reward_distance: rewardDistance,
    risk_amount: riskAmount,
    reward_amount: rewardAmount,
    risk_reward: riskReward,
    pnl,
    capital_after: capitalAfter,
    // CamelCase aliases for callers that prefer them
    riskDistance,
    rewardDistance,
    riskAmount,
    rewardAmount,
    riskRewardRatio: riskReward,
    profitLoss: pnl,
    capitalAfter,
  }
}
