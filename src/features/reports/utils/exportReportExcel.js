import * as XLSX from 'xlsx'
import {
  formatReportMetric,
  mapTradeRows,
} from '@/features/reports/utils/buildReport'

export function exportReportToExcel(report, filename) {
  const summaryRows = [
    ['Report', report.title],
    ['Period', report.period.label],
    ['Generated', new Date(report.generatedAt).toLocaleString()],
    [],
    ['Metric', 'Value'],
    ['Total Trades', formatReportMetric(report.summary.totalTrades, 'number')],
    ['Closed Trades', formatReportMetric(report.summary.closedTrades, 'number')],
    ['Open Trades', formatReportMetric(report.summary.openTrades, 'number')],
    ['Win Rate', formatReportMetric(report.summary.winRate, 'percent')],
    ['Net P/L', formatReportMetric(report.summary.netPnl)],
    ['Total Profit', formatReportMetric(report.summary.totalProfit)],
    ['Total Loss', formatReportMetric(report.summary.totalLoss)],
    ['Profit Factor', formatReportMetric(report.summary.profitFactor, 'ratio')],
    ['Average Win', formatReportMetric(report.summary.averageWin)],
    ['Average Loss', formatReportMetric(report.summary.averageLoss)],
    ['Average R:R', formatReportMetric(report.summary.averageRr, 'rr')],
    ['Expectancy', formatReportMetric(report.summary.expectancy)],
  ]

  const workbook = XLSX.utils.book_new()
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows)
  summarySheet['!cols'] = [{ wch: 18 }, { wch: 28 }]
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

  const tradeRows = mapTradeRows(report.trades)
  const tradesSheet = XLSX.utils.json_to_sheet(
    tradeRows.length ? tradeRows : [{ Date: 'No trades in this period' }],
  )
  XLSX.utils.book_append_sheet(workbook, tradesSheet, 'Trades')

  if (report.byInstrument.length) {
    const instrumentRows = report.byInstrument.map((item) => ({
      Instrument: item.name,
      Trades: item.trades,
      'Net P/L': item.pnl,
    }))
    const instrumentSheet = XLSX.utils.json_to_sheet(instrumentRows)
    XLSX.utils.book_append_sheet(workbook, instrumentSheet, 'Instruments')
  }

  const safeName =
    filename ||
    `tradix-${report.reportType}-report-${report.period.dateFrom}.xlsx`
  XLSX.writeFile(workbook, safeName)
}
