import {
  buildAnalyticsSummary,
  buildInstrumentPerformance,
  filterTrades,
  getTradeResult,
} from '@/features/analytics/utils/analyticsMetrics'
import { getPeriodForReportType } from '@/features/reports/utils/reportPeriods'
import { formatCurrency, formatDateTime } from '@/features/capital/utils/formatCapital'

export const EMPTY_REPORT_FILTERS = {
  instrumentId: 'all',
  tradeType: 'all',
  result: 'all',
  timeframe: 'all',
}

export function buildReport({
  trades = [],
  reportType = 'monthly',
  anchorDate,
  customFrom,
  customTo,
  filters = EMPTY_REPORT_FILTERS,
}) {
  const period = getPeriodForReportType(reportType, {
    date: anchorDate ? new Date(anchorDate) : new Date(),
    dateFrom: customFrom,
    dateTo: customTo,
  })

  const filtered = filterTrades(trades, {
    dateFrom: period.dateFrom,
    dateTo: period.dateTo,
    instrumentId: filters.instrumentId,
    timeframe: filters.timeframe,
    entryReason: 'all',
    emotion: 'all',
    mistake: 'all',
    tradeType: filters.tradeType,
    result: filters.result,
  })

  const summary = buildAnalyticsSummary(filtered)
  const byInstrument = buildInstrumentPerformance(filtered)
  const typeMeta = {
    daily: 'Daily Report',
    weekly: 'Weekly Report',
    monthly: 'Monthly Report',
    yearly: 'Yearly Report',
    custom: 'Custom Date Range Report',
  }

  return {
    title: typeMeta[reportType] || 'Trading Report',
    reportType,
    period,
    filters,
    summary,
    byInstrument,
    trades: [...filtered].sort(
      (a, b) =>
        new Date(b.exit_at || b.entry_at) - new Date(a.exit_at || a.entry_at),
    ),
    generatedAt: new Date().toISOString(),
  }
}

export function formatReportMetric(value, type = 'currency') {
  if (value == null) return '—'
  if (type === 'percent') return `${Number(value).toFixed(1)}%`
  if (type === 'ratio') {
    if (!Number.isFinite(value)) return '∞'
    return Number(value).toFixed(2)
  }
  if (type === 'rr') return `1 : ${Number(value).toFixed(2)}`
  if (type === 'number') return String(value)
  return formatCurrency(value)
}

export function tradeResultLabel(trade) {
  return getTradeResult(trade) || trade.status || '—'
}

export function mapTradeRows(trades = []) {
  return trades.map((trade) => ({
    Date: formatDateTime(trade.exit_at || trade.entry_at),
    Instrument: trade.instrument?.symbol || '',
    Side: trade.direction === 'long' ? 'Buy' : 'Sell',
    Style: trade.style || '',
    Status: trade.status || '',
    Result: tradeResultLabel(trade),
    Timeframe: trade.timeframe || '',
    Entry: trade.entry_price ?? '',
    Exit: trade.exit_price ?? '',
    Quantity: trade.quantity ?? '',
    'P/L': trade.pnl ?? '',
    'R:R': trade.risk_reward ?? '',
  }))
}
