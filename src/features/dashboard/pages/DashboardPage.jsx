import {
  PageError,
  PageSkeleton,
} from '@/components/shared/PageStates'
import { DashboardCharts } from '@/features/dashboard/components/DashboardCharts'
import { DashboardMetricCards } from '@/features/dashboard/components/DashboardMetricCards'
import { OpenTradesCard } from '@/features/dashboard/components/OpenTradesCard'
import { QuickActionsCard } from '@/features/dashboard/components/QuickActionsCard'
import { RecentTradesCard } from '@/features/dashboard/components/RecentTradesCard'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboard()

  if (isLoading) return <PageSkeleton />

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <PageError
          message={error?.message || 'Unable to load dashboard'}
          onRetry={() => refetch()}
        />
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
