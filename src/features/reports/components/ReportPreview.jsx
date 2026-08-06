import {
  formatCurrency,
  formatDateTime,
} from '@/features/capital/utils/formatCapital'
import {
  formatReportMetric,
  tradeResultLabel,
} from '@/features/reports/utils/buildReport'
import { TradixLogo } from '@/components/shared/TradixLogo'
import { cn } from '@/lib/utils'

function SummaryTile({ label, value, className }) {
  return (
    <div className="rounded-control border border-border bg-card-secondary px-3 py-3">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-sm font-medium tabular-nums', className)}>
        {value}
      </p>
    </div>
  )
}

function pnlClass(value) {
  if (value > 0) return 'text-status-profit'
  if (value < 0) return 'text-status-loss'
  return undefined
}

export function ReportPreview({ report }) {
  const { summary } = report

  return (
    <article
      id="report-print-root"
      className="rounded-card border border-border bg-card p-4 shadow-card sm:p-6 print:border-0 print:p-0 print:shadow-none"
    >
      <header className="border-b border-border pb-4">
        <TradixLogo as="p" size="sm" className="text-muted-foreground" />
        <h2 className="mt-2 text-heading-2">{report.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{report.period.label}</p>
        <p className="mt-1 text-caption text-muted-foreground">
          Generated {formatDateTime(report.generatedAt)}
        </p>
      </header>

      <section className="mt-5">
        <h3 className="mb-3 text-heading-4">Summary</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryTile
            label="Total Trades"
            value={formatReportMetric(summary.totalTrades, 'number')}
          />
          <SummaryTile
            label="Win Rate"
            value={formatReportMetric(summary.winRate, 'percent')}
            className="text-status-profit"
          />
          <SummaryTile
            label="Net P/L"
            value={formatReportMetric(summary.netPnl)}
            className={pnlClass(summary.netPnl)}
          />
          <SummaryTile
            label="Profit Factor"
            value={formatReportMetric(summary.profitFactor, 'ratio')}
          />
          <SummaryTile
            label="Expectancy"
            value={formatReportMetric(summary.expectancy)}
            className={pnlClass(summary.expectancy || 0)}
          />
          <SummaryTile
            label="Total Profit"
            value={formatReportMetric(summary.totalProfit)}
            className="text-status-profit"
          />
          <SummaryTile
            label="Total Loss"
            value={formatReportMetric(summary.totalLoss)}
            className="text-status-loss"
          />
          <SummaryTile
            label="Average Win"
            value={formatReportMetric(summary.averageWin)}
            className="text-status-profit"
          />
          <SummaryTile
            label="Average Loss"
            value={formatReportMetric(summary.averageLoss)}
            className="text-status-loss"
          />
          <SummaryTile
            label="Average R:R"
            value={formatReportMetric(summary.averageRr, 'rr')}
          />
        </div>
      </section>

      <section className="mt-6">
        <h3 className="mb-3 text-heading-4">Trade Log</h3>
        {!report.trades.length ? (
          <p className="rounded-card border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
            No trades match this report period and filters.
          </p>
        ) : (
          <div className="overflow-hidden rounded-card border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">Instrument</th>
                    <th className="px-3 py-2 font-medium">Side</th>
                    <th className="px-3 py-2 font-medium">Style</th>
                    <th className="px-3 py-2 font-medium">Result</th>
                    <th className="px-3 py-2 text-right font-medium">Entry</th>
                    <th className="px-3 py-2 text-right font-medium">Exit</th>
                    <th className="px-3 py-2 text-right font-medium">P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {report.trades.map((trade) => (
                    <tr
                      key={trade.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-3 py-2 text-muted-foreground">
                        {formatDateTime(trade.exit_at || trade.entry_at)}
                      </td>
                      <td className="px-3 py-2 font-medium">
                        {trade.instrument?.symbol || '—'}
                      </td>
                      <td className="px-3 py-2">
                        {trade.direction === 'long' ? 'Buy' : 'Sell'}
                      </td>
                      <td className="px-3 py-2 capitalize">
                        {trade.style || '—'}
                      </td>
                      <td className="px-3 py-2 capitalize">
                        {tradeResultLabel(trade)}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {trade.entry_price ?? '—'}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {trade.exit_price ?? '—'}
                      </td>
                      <td
                        className={cn(
                          'px-3 py-2 text-right tabular-nums',
                          trade.pnl == null
                            ? 'text-muted-foreground'
                            : Number(trade.pnl) < 0
                              ? 'text-status-loss'
                              : 'text-status-profit',
                        )}
                      >
                        {trade.pnl == null ? '—' : formatCurrency(trade.pnl)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {report.byInstrument.length ? (
        <section className="mt-6">
          <h3 className="mb-3 text-heading-4">Instrument Breakdown</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {report.byInstrument.map((item) => (
              <div
                key={item.name}
                className="rounded-control border border-border px-3 py-3"
              >
                <p className="text-sm font-medium">{item.name}</p>
                <p className="mt-1 text-caption text-muted-foreground">
                  {item.trades} trades
                </p>
                <p
                  className={cn(
                    'mt-2 text-sm font-medium tabular-nums',
                    pnlClass(item.pnl),
                  )}
                >
                  {formatCurrency(item.pnl)}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
