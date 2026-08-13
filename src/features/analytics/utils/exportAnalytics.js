import * as XLSX from 'xlsx'
import { formatDateTime } from '@/features/capital/utils/formatCapital'
import { getTradeResult } from '@/features/analytics/utils/analyticsMetrics'

function resultLabel(trade) {
  const result = getTradeResult(trade)
  if (!result) return trade.status
  return result
}

export function exportTradesToExcel(trades = [], filename = 'tradix-analytics.xlsx') {
  const rows = trades.map((trade) => ({
    Date: formatDateTime(trade.exit_at || trade.entry_at),
    Instrument: trade.instrument?.symbol || '',
    Side: trade.direction === 'long' ? 'Buy' : 'Sell',
    Style: trade.style || '',
    Status: trade.status || '',
    Result: resultLabel(trade),
    Timeframe: trade.timeframe || '',
    'Entry Reason': trade.entry_reason || '',
    Emotion: trade.emotion || trade.emotions || '',
    Mistakes: Array.isArray(trade.mistakes) ? trade.mistakes.join(', ') : '',
    Entry: trade.entry_price ?? '',
    Exit: trade.exit_price ?? '',
    Quantity: trade.quantity ?? '',
    Fees: trade.fees ?? '',
    'P/L': trade.pnl ?? '',
    Risk: trade.risk_amount ?? '',
    Reward: trade.reward_amount ?? '',
    'R:R': trade.risk_reward ?? '',
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Date: 'No trades' }])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Trades')
  XLSX.writeFile(workbook, filename)
}
