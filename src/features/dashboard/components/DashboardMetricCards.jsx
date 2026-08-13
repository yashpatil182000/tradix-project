import {
  Activity,
  CircleDollarSign,
  Landmark,
  Percent,
  Scale,
  TrendingDown,
  TrendingUp,
  Wallet,
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

function formatRr(value) {
  if (value == null) return '—'
  return `1 : ${value.toFixed(2)}`
}

export function DashboardMetricCards({ metrics }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <MetricCard
        title="Current Capital"
        value={formatCurrency(metrics.currentCapital)}
        hint={metrics.hasStartingCapital ? 'Live balance' : 'Set initial capital'}
        icon={Wallet}
      />
      <MetricCard
        title="Today's P/L"
        value={formatCurrency(metrics.todayPnl)}
        icon={CircleDollarSign}
        valueClassName={pnlClass(metrics.todayPnl)}
      />
      <MetricCard
        title="Weekly P/L"
        value={formatCurrency(metrics.weeklyPnl)}
        icon={TrendingUp}
        valueClassName={pnlClass(metrics.weeklyPnl)}
      />
      <MetricCard
        title="Monthly P/L"
        value={formatCurrency(metrics.monthlyPnl)}
        icon={Landmark}
        valueClassName={pnlClass(metrics.monthlyPnl)}
      />
      <MetricCard
        title="Total Profit"
        value={formatCurrency(metrics.totalProfit)}
        icon={TrendingUp}
        valueClassName="text-status-profit"
      />
      <MetricCard
        title="Total Loss"
        value={formatCurrency(metrics.totalLoss)}
        icon={TrendingDown}
        valueClassName="text-status-loss"
      />
      <MetricCard
        title="Win Rate"
        value={formatPercent(metrics.winRate)}
        icon={Percent}
        valueClassName="text-status-profit"
      />
      <MetricCard
        title="Loss Rate"
        value={formatPercent(metrics.lossRate)}
        icon={Percent}
        valueClassName="text-status-loss"
      />
      <MetricCard
        title="Average R:R"
        value={formatRr(metrics.averageRr)}
        icon={Scale}
      />
      <MetricCard
        title="Active Trades"
        value={String(metrics.activeTrades)}
        icon={Activity}
      />
      <MetricCard
        title="Closed Trades"
        value={String(metrics.closedTrades)}
        icon={Activity}
      />
    </div>
  )
}
