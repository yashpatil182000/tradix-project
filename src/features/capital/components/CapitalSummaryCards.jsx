import { ArrowDownRight, ArrowUpRight, Landmark, Wallet } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/features/capital/utils/formatCapital'

function SummaryCard({ title, value, hint, icon: Icon, valueClassName }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className={valueClassName}>{value}</CardTitle>
        </div>
        <div className="rounded-control bg-muted p-2 text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      {hint ? <CardContent className="pt-0 text-caption text-muted-foreground">{hint}</CardContent> : null}
    </Card>
  )
}

export function CapitalSummaryCards({ summary, currency = 'USD' }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Current Capital"
        value={formatCurrency(summary.currentCapital, currency)}
        hint="Manual transactions only"
        icon={Wallet}
        valueClassName="text-heading-3"
      />
      <SummaryCard
        title="Initial Capital"
        value={formatCurrency(summary.initialCapital, currency)}
        hint={summary.hasStartingCapital ? 'Starting balance' : 'Not set yet'}
        icon={Landmark}
      />
      <SummaryCard
        title="Total Deposits"
        value={formatCurrency(summary.totalDeposits, currency)}
        hint="All inbound deposits"
        icon={ArrowUpRight}
        valueClassName="text-status-profit"
      />
      <SummaryCard
        title="Total Withdrawals"
        value={formatCurrency(summary.totalWithdrawals, currency)}
        hint="All outbound withdrawals"
        icon={ArrowDownRight}
        valueClassName="text-status-loss"
      />
    </div>
  )
}
