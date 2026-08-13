import {
  Activity,
  CircleDollarSign,
  Percent,
  Scale,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/features/capital/utils/formatCapital'
import { cn } from '@/lib/utils'

function MetricCard({ title, value, hint, icon: Icon, valueClassName }) {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="min-w-0">
          <CardDescription>{title}</CardDescription>
          <CardTitle className={cn('mt-1 text-heading-4 tabular-nums', valueClassName)}>
            {value}
          </CardTitle>
        </div>
        <div className="rounded-control bg-muted p-2 text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      {hint ? (
        <CardContent className="pt-0 text-caption text-muted-foreground">{hint}</CardContent>
      ) : null}
    </Card>
  )
}

function pnlClass(value) {
  if (value > 0) return 'text-status-profit'
  if (value < 0) return 'text-status-loss'
  return undefined
}

function formatPercent(value) {
  if (value == null) return '—'
  return `${value.toFixed(1)}%`
}

function formatRatio(value) {
  if (value == null) return '—'
  if (!Number.isFinite(value)) return '∞'
  return value.toFixed(2)
}

export function AnalyticsSummaryCards({ summary }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <MetricCard
        title="Total Trades"
        value={String(summary.totalTrades)}
        hint={`${summary.closedTrades} closed · ${summary.openTrades} open`}
        icon={Activity}
      />
      <MetricCard
        title="Win Rate"
        value={formatPercent(summary.winRate)}
        icon={Percent}
        valueClassName="text-status-profit"
      />
      <MetricCard
        title="Net P/L"
        value={formatCurrency(summary.netPnl)}
        icon={CircleDollarSign}
        valueClassName={pnlClass(summary.netPnl)}
      />
      <MetricCard
        title="Profit Factor"
        value={formatRatio(summary.profitFactor)}
        icon={Scale}
      />
      <MetricCard
        title="Total Profit"
        value={formatCurrency(summary.totalProfit)}
        icon={TrendingUp}
        valueClassName="text-status-profit"
      />
      <MetricCard
        title="Total Loss"
        value={formatCurrency(summary.totalLoss)}
        icon={TrendingDown}
        valueClassName="text-status-loss"
      />
      <MetricCard
        title="Average Win"
        value={summary.averageWin == null ? '—' : formatCurrency(summary.averageWin)}
        icon={TrendingUp}
        valueClassName="text-status-profit"
      />
      <MetricCard
        title="Average Loss"
        value={summary.averageLoss == null ? '—' : formatCurrency(summary.averageLoss)}
        icon={TrendingDown}
        valueClassName="text-status-loss"
      />
      <MetricCard
        title="Average R:R"
        value={summary.averageRr == null ? '—' : `1 : ${summary.averageRr.toFixed(2)}`}
        icon={Scale}
      />
      <MetricCard
        title="Expectancy"
        value={summary.expectancy == null ? '—' : formatCurrency(summary.expectancy)}
        icon={CircleDollarSign}
        valueClassName={pnlClass(summary.expectancy || 0)}
      />
    </div>
  )
}
