function toDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function tradeDate(trade) {
  return toDate(trade.exit_at) || toDate(trade.entry_at)
}

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function endOfDay(date) {
  const next = new Date(date)
  next.setHours(23, 59, 59, 999)
  return next
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key) {
  const [year, month] = key.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: '2-digit',
  }).format(new Date(year, month - 1, 1))
}

function dayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function getTradeResult(trade) {
  if (trade.status !== 'closed' || trade.pnl == null) return null
  const pnl = Number(trade.pnl)
  if (pnl > 0) return 'win'
  if (pnl < 0) return 'loss'
  return 'breakeven'
}

export const EMPTY_ANALYTICS_FILTERS = {
  dateFrom: '',
  dateTo: '',
  instrumentId: 'all',
  timeframe: 'all',
  entryReason: 'all',
  emotion: 'all',
  mistake: 'all',
  tradeType: 'all',
  result: 'all',
}

export function filterTrades(trades = [], filters = EMPTY_ANALYTICS_FILTERS) {
  const from = filters.dateFrom ? startOfDay(new Date(filters.dateFrom)) : null
  const to = filters.dateTo ? endOfDay(new Date(filters.dateTo)) : null

  return trades.filter((trade) => {
    const date = tradeDate(trade)
    if (from && (!date || date < from)) return false
    if (to && (!date || date > to)) return false

    if (filters.instrumentId !== 'all' && trade.instrument_id !== filters.instrumentId) {
      return false
    }
    if (filters.timeframe !== 'all' && (trade.timeframe || '') !== filters.timeframe) {
      return false
    }
    if (
      filters.entryReason !== 'all' &&
      (trade.entry_reason || '') !== filters.entryReason
    ) {
      return false
    }
    if (
      filters.emotion !== 'all' &&
      (trade.emotion || trade.emotions || '') !== filters.emotion
    ) {
      return false
    }
    if (filters.mistake !== 'all') {
      const mistakes = Array.isArray(trade.mistakes) ? trade.mistakes : []
      if (!mistakes.includes(filters.mistake)) return false
    }
    if (filters.tradeType !== 'all' && (trade.style || '') !== filters.tradeType) {
      return false
    }
    if (filters.result !== 'all') {
      const result = getTradeResult(trade)
      if (result !== filters.result) return false
    }

    return true
  })
}

function closedWithPnl(trades) {
  return trades.filter((trade) => trade.status === 'closed' && trade.pnl != null)
}

function sumBy(items, getter) {
  return items.reduce((total, item) => total + (Number(getter(item)) || 0), 0)
}

export function buildAnalyticsSummary(trades = []) {
  const closed = closedWithPnl(trades)
  const wins = closed.filter((trade) => Number(trade.pnl) > 0)
  const losses = closed.filter((trade) => Number(trade.pnl) < 0)
  const totalProfit = sumBy(wins, (trade) => trade.pnl)
  const totalLoss = sumBy(losses, (trade) => Math.abs(trade.pnl))
  const netPnl = sumBy(closed, (trade) => trade.pnl)
  const avgWin = wins.length ? totalProfit / wins.length : null
  const avgLoss = losses.length ? totalLoss / losses.length : null
  const rrValues = closed
    .map((trade) => Number(trade.risk_reward))
    .filter((value) => Number.isFinite(value) && value > 0)

  return {
    totalTrades: trades.length,
    closedTrades: closed.length,
    openTrades: trades.filter((trade) => trade.status === 'open').length,
    winRate: closed.length ? (wins.length / closed.length) * 100 : null,
    lossRate: closed.length ? (losses.length / closed.length) * 100 : null,
    netPnl,
    totalProfit,
    totalLoss,
    profitFactor:
      totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Number.POSITIVE_INFINITY : null,
    averageWin: avgWin,
    averageLoss: avgLoss,
    averageRr:
      rrValues.length > 0
        ? rrValues.reduce((total, value) => total + value, 0) / rrValues.length
        : null,
    expectancy: closed.length ? netPnl / closed.length : null,
  }
}

export function buildWinRateSeries(trades = []) {
  const closed = closedWithPnl(trades)
    .map((trade) => ({ trade, date: tradeDate(trade) }))
    .filter((item) => item.date)
    .sort((a, b) => a.date - b.date)

  let wins = 0
  return closed.map((item, index) => {
    if (Number(item.trade.pnl) > 0) wins += 1
    const count = index + 1
    return {
      label: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(item.date),
      winRate: (wins / count) * 100,
      trades: count,
    }
  })
}

export function buildCapitalCurve(capitalEntries = [], filters = EMPTY_ANALYTICS_FILTERS) {
  const from = filters.dateFrom ? startOfDay(new Date(filters.dateFrom)) : null
  const to = filters.dateTo ? endOfDay(new Date(filters.dateTo)) : null

  return capitalEntries
    .filter((entry) => {
      const date = toDate(entry.recorded_at)
      if (!date) return false
      if (from && date < from) return false
      if (to && date > to) return false
      return true
    })
    .map((entry) => ({
      date: entry.recorded_at,
      label: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(entry.recorded_at)),
      capital: Number(entry.running_balance) || 0,
    }))
}

export function buildDrawdownSeries(capitalCurve = []) {
  let peak = 0
  return capitalCurve.map((point) => {
    peak = Math.max(peak, point.capital)
    const drawdown = peak > 0 ? ((peak - point.capital) / peak) * 100 : 0
    return {
      label: point.label,
      drawdown: Number(drawdown.toFixed(2)),
      capital: point.capital,
    }
  })
}

export function buildMonthlyReturns(trades = []) {
  const buckets = new Map()
  closedWithPnl(trades).forEach((trade) => {
    const date = tradeDate(trade)
    if (!date) return
    const key = monthKey(date)
    buckets.set(key, (buckets.get(key) || 0) + (Number(trade.pnl) || 0))
  })

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([key, pnl]) => ({
      month: monthLabel(key),
      pnl,
    }))
}

export function buildTradeDistribution(trades = []) {
  const closed = closedWithPnl(trades)
  const wins = closed.filter((trade) => Number(trade.pnl) > 0).length
  const losses = closed.filter((trade) => Number(trade.pnl) < 0).length
  const breakeven = closed.filter((trade) => Number(trade.pnl) === 0).length
  const open = trades.filter((trade) => trade.status === 'open').length

  return [
    { name: 'Wins', value: wins, color: 'var(--chart-profit)' },
    { name: 'Losses', value: losses, color: 'var(--chart-loss)' },
    { name: 'Breakeven', value: breakeven, color: 'var(--chart-drawdown)' },
    { name: 'Open', value: open, color: 'var(--chart-capital)' },
  ].filter((item) => item.value > 0)
}

function groupPnlByLabel(trades, getLabel) {
  const buckets = new Map()
  closedWithPnl(trades).forEach((trade) => {
    const labels = getLabel(trade)
    const list = Array.isArray(labels) ? labels : [labels]
    list.forEach((label) => {
      const key = label || 'Unspecified'
      const current = buckets.get(key) || { name: key, pnl: 0, trades: 0 }
      current.pnl += Number(trade.pnl) || 0
      current.trades += 1
      buckets.set(key, current)
    })
  })
  return [...buckets.values()]
    .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
    .slice(0, 10)
}

export function buildEmotionAnalysis(trades = []) {
  return groupPnlByLabel(trades, (trade) => trade.emotion || trade.emotions)
}

export function buildMistakeAnalysis(trades = []) {
  return groupPnlByLabel(trades, (trade) =>
    Array.isArray(trade.mistakes) && trade.mistakes.length
      ? trade.mistakes
      : ['None'],
  )
}

export function buildInstrumentPerformance(trades = []) {
  return groupPnlByLabel(
    trades,
    (trade) => trade.instrument?.symbol || 'Unknown',
  )
}

export function buildRiskRewardScatter(trades = []) {
  return closedWithPnl(trades)
    .map((trade) => ({
      id: trade.id,
      symbol: trade.instrument?.symbol || '—',
      risk: Number(trade.risk_amount) || 0,
      reward: Number(trade.reward_amount) || 0,
      pnl: Number(trade.pnl) || 0,
      result: getTradeResult(trade),
    }))
    .filter((item) => item.risk > 0 || item.reward > 0)
}

export function buildCalendarHeatmap(trades = []) {
  const buckets = new Map()
  closedWithPnl(trades).forEach((trade) => {
    const date = tradeDate(trade)
    if (!date) return
    const key = dayKey(date)
    buckets.set(key, (buckets.get(key) || 0) + (Number(trade.pnl) || 0))
  })

  const today = startOfDay(new Date())
  const start = new Date(today)
  start.setDate(start.getDate() - 119)
  while (start.getDay() !== 0) {
    start.setDate(start.getDate() - 1)
  }

  const days = []
  const cursor = new Date(start)
  while (cursor <= today) {
    const key = dayKey(cursor)
    days.push({
      date: key,
      label: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(cursor),
      pnl: buckets.get(key) || 0,
      hasTrades: buckets.has(key),
      weekday: cursor.getDay(),
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return days
}

export function buildTimeframeAnalysis(trades = []) {
  return groupPnlByLabel(trades, (trade) => trade.timeframe || 'Unspecified')
}

export function buildAnalyticsView(trades = [], capitalEntries = [], filters = EMPTY_ANALYTICS_FILTERS) {
  const filteredTrades = filterTrades(trades, filters)
  const capitalCurve = buildCapitalCurve(capitalEntries, filters)

  return {
    filters,
    trades: filteredTrades,
    summary: buildAnalyticsSummary(filteredTrades),
    winRateSeries: buildWinRateSeries(filteredTrades),
    capitalCurve,
    drawdownSeries: buildDrawdownSeries(capitalCurve),
    monthlyReturns: buildMonthlyReturns(filteredTrades),
    tradeDistribution: buildTradeDistribution(filteredTrades),
    emotionAnalysis: buildEmotionAnalysis(filteredTrades),
    mistakeAnalysis: buildMistakeAnalysis(filteredTrades),
    instrumentPerformance: buildInstrumentPerformance(filteredTrades),
    riskReward: buildRiskRewardScatter(filteredTrades),
    calendarHeatmap: buildCalendarHeatmap(filteredTrades),
    timeframeAnalysis: buildTimeframeAnalysis(filteredTrades),
  }
}
