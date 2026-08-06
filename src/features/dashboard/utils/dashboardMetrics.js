function startOfDay(date = new Date()) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function startOfWeek(date = new Date()) {
  const next = startOfDay(date)
  const day = next.getDay()
  const diff = day === 0 ? 6 : day - 1
  next.setDate(next.getDate() - diff)
  return next
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function toDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function closedTrades(trades = []) {
  return trades.filter((trade) => trade.status === 'closed' && trade.pnl != null)
}

function tradeCloseDate(trade) {
  return toDate(trade.exit_at) || toDate(trade.entry_at)
}

function sumPnl(trades) {
  return trades.reduce((total, trade) => total + (Number(trade.pnl) || 0), 0)
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

export function buildDashboardMetrics(trades = [], capitalSummary = {}) {
  const closed = closedTrades(trades)
  const open = trades.filter((trade) => trade.status === 'open')
  const now = new Date()
  const todayStart = startOfDay(now)
  const weekStart = startOfWeek(now)
  const monthStart = startOfMonth(now)

  const todayClosed = closed.filter((trade) => {
    const date = tradeCloseDate(trade)
    return date && date >= todayStart
  })
  const weekClosed = closed.filter((trade) => {
    const date = tradeCloseDate(trade)
    return date && date >= weekStart
  })
  const monthClosed = closed.filter((trade) => {
    const date = tradeCloseDate(trade)
    return date && date >= monthStart
  })

  const wins = closed.filter((trade) => Number(trade.pnl) > 0)
  const losses = closed.filter((trade) => Number(trade.pnl) < 0)
  const totalProfit = wins.reduce((total, trade) => total + Number(trade.pnl), 0)
  const totalLoss = losses.reduce(
    (total, trade) => total + Math.abs(Number(trade.pnl)),
    0,
  )

  const rrValues = closed
    .map((trade) => Number(trade.risk_reward))
    .filter((value) => Number.isFinite(value) && value > 0)
  const averageRr =
    rrValues.length > 0
      ? rrValues.reduce((total, value) => total + value, 0) / rrValues.length
      : null

  const closedCount = closed.length

  return {
    currentCapital: Number(capitalSummary.currentCapital) || 0,
    todayPnl: sumPnl(todayClosed),
    weeklyPnl: sumPnl(weekClosed),
    monthlyPnl: sumPnl(monthClosed),
    totalProfit,
    totalLoss,
    winRate: closedCount ? (wins.length / closedCount) * 100 : null,
    lossRate: closedCount ? (losses.length / closedCount) * 100 : null,
    averageRr,
    activeTrades: open.length,
    closedTrades: closedCount,
    hasStartingCapital: Boolean(capitalSummary.hasStartingCapital),
  }
}

export function buildCapitalGrowthSeries(capitalEntries = []) {
  return capitalEntries.map((entry) => ({
    date: entry.recorded_at,
    label: new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(entry.recorded_at)),
    capital: Number(entry.running_balance) || 0,
  }))
}

export function buildMonthlyProfitSeries(trades = []) {
  const closed = closedTrades(trades)
  const buckets = new Map()

  closed.forEach((trade) => {
    const date = tradeCloseDate(trade)
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
      profit: pnl >= 0 ? pnl : 0,
      loss: pnl < 0 ? Math.abs(pnl) : 0,
    }))
}

export function buildInstrumentPerformance(trades = []) {
  const closed = closedTrades(trades)
  const buckets = new Map()

  closed.forEach((trade) => {
    const key = trade.instrument?.symbol || 'Unknown'
    const current = buckets.get(key) || { name: key, pnl: 0, trades: 0 }
    current.pnl += Number(trade.pnl) || 0
    current.trades += 1
    buckets.set(key, current)
  })

  return [...buckets.values()]
    .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
    .slice(0, 8)
}

export function buildSetupPerformance(trades = []) {
  const closed = closedTrades(trades)
  const buckets = new Map()

  closed.forEach((trade) => {
    const key = trade.entry_reason || trade.style || 'Unspecified'
    const current = buckets.get(key) || { name: key, pnl: 0, trades: 0 }
    current.pnl += Number(trade.pnl) || 0
    current.trades += 1
    buckets.set(key, current)
  })

  return [...buckets.values()]
    .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
    .slice(0, 8)
}

export function getRecentTrades(trades = [], limit = 6) {
  return [...trades]
    .sort((a, b) => new Date(b.entry_at) - new Date(a.entry_at))
    .slice(0, limit)
}

export function getOpenTrades(trades = []) {
  return trades
    .filter((trade) => trade.status === 'open')
    .sort((a, b) => new Date(b.entry_at) - new Date(a.entry_at))
}
