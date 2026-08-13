import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  formatReportMetric,
  mapTradeRows,
} from '@/features/reports/utils/buildReport'

const COLORS = {
  primary: [37, 99, 235],
  text: [15, 23, 42],
  muted: [100, 116, 139],
  border: [226, 232, 240],
  profit: [22, 163, 74],
  loss: [220, 38, 38],
  surface: [248, 250, 252],
}

export function exportReportToPdf(report, filename) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40

  doc.setFillColor(...COLORS.primary)
  doc.rect(0, 0, pageWidth, 72, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Tradix', margin, 32)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(report.title, margin, 52)

  doc.setTextColor(...COLORS.text)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(report.period.label, margin, 100)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...COLORS.muted)
  doc.text(
    `Generated ${new Date(report.generatedAt).toLocaleString()}`,
    margin,
    116,
  )

  const summaryPairs = [
    ['Total Trades', formatReportMetric(report.summary.totalTrades, 'number')],
    ['Win Rate', formatReportMetric(report.summary.winRate, 'percent')],
    ['Net P/L', formatReportMetric(report.summary.netPnl)],
    ['Profit Factor', formatReportMetric(report.summary.profitFactor, 'ratio')],
    ['Total Profit', formatReportMetric(report.summary.totalProfit)],
    ['Total Loss', formatReportMetric(report.summary.totalLoss)],
    ['Average Win', formatReportMetric(report.summary.averageWin)],
    ['Average Loss', formatReportMetric(report.summary.averageLoss)],
    ['Average R:R', formatReportMetric(report.summary.averageRr, 'rr')],
    ['Expectancy', formatReportMetric(report.summary.expectancy)],
  ]

  autoTable(doc, {
    startY: 136,
    head: [['Metric', 'Value']],
    body: summaryPairs,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 6,
      textColor: COLORS.text,
      lineColor: COLORS.border,
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: COLORS.surface,
    },
    margin: { left: margin, right: margin },
  })

  const tradeRows = mapTradeRows(report.trades)
  const tradeStartY = (doc.lastAutoTable?.finalY || 136) + 24

  doc.setTextColor(...COLORS.text)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Trade Log', margin, tradeStartY)

  autoTable(doc, {
    startY: tradeStartY + 10,
    head: [
      [
        'Date',
        'Instrument',
        'Side',
        'Style',
        'Result',
        'Entry',
        'Exit',
        'P/L',
      ],
    ],
    body: tradeRows.length
      ? tradeRows.map((row) => [
          row.Date,
          row.Instrument,
          row.Side,
          row.Style,
          row.Result,
          row.Entry,
          row.Exit,
          row['P/L'],
        ])
      : [['No trades in this period', '', '', '', '', '', '', '']],
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: COLORS.text,
      lineColor: COLORS.border,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: COLORS.surface,
    },
    columnStyles: {
      7: { halign: 'right' },
    },
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 7) {
        const value = Number(data.cell.raw)
        if (Number.isFinite(value)) {
          data.cell.styles.textColor =
            value < 0 ? COLORS.loss : value > 0 ? COLORS.profit : COLORS.text
        }
      }
    },
    margin: { left: margin, right: margin },
  })

  if (report.byInstrument.length) {
    const instrumentStartY = (doc.lastAutoTable?.finalY || tradeStartY) + 24
    doc.setTextColor(...COLORS.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Instrument Breakdown', margin, instrumentStartY)

    autoTable(doc, {
      startY: instrumentStartY + 10,
      head: [['Instrument', 'Trades', 'Net P/L']],
      body: report.byInstrument.map((item) => [
        item.name,
        item.trades,
        formatReportMetric(item.pnl),
      ]),
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 5,
        textColor: COLORS.text,
        lineColor: COLORS.border,
      },
      headStyles: {
        fillColor: COLORS.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: COLORS.surface,
      },
      margin: { left: margin, right: margin },
    })
  }

  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    doc.setFontSize(8)
    doc.setTextColor(...COLORS.muted)
    doc.text(
      `Tradix Report · Page ${page} of ${pageCount}`,
      margin,
      doc.internal.pageSize.getHeight() - 20,
    )
  }

  const safeName =
    filename ||
    `tradix-${report.reportType}-report-${report.period.dateFrom}.pdf`
  doc.save(safeName)
}
