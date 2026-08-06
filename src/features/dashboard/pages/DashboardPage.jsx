import { Button } from '@/components/ui/button'
import { DashboardCharts } from '@/features/dashboard/components/DashboardCharts'
import { DashboardMetricCards } from '@/features/dashboard/components/DashboardMetricCards'
import { OpenTradesCard } from '@/features/dashboard/components/OpenTradesCard'
import { QuickActionsCard } from '@/features/dashboard/components/QuickActionsCard'
import { RecentTradesCard } from '@/features/dashboard/components/RecentTradesCard'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboard()

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="rounded-card border border-border px-4 py-12 text-center text-sm text-muted-foreground">
          Loading dashboard...
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="rounded-card border border-destructive/30 px-4 py-12 text-center">
          <p className="text-sm text-destructive">
            {error?.message || 'Unable to load dashboard'}
          </p>
          <Button className="mt-4" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-heading-2">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Capital, performance, and open risk at a glance.
        </p>
      </div>

      <DashboardMetricCards metrics={data.metrics} />

      <DashboardCharts
        capitalGrowth={data.capitalGrowth}
        monthlyProfit={data.monthlyProfit}
        instrumentPerformance={data.instrumentPerformance}
        setupPerformance={data.setupPerformance}
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <RecentTradesCard trades={data.recentTrades} />
        <div className="space-y-4">
          <QuickActionsCard />
          <OpenTradesCard trades={data.openTrades} />
        </div>
      </div>
    </div>
  )
}
