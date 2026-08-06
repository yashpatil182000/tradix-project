import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnalyticsCharts } from '@/features/analytics/components/AnalyticsCharts'
import { AnalyticsFilters } from '@/features/analytics/components/AnalyticsFilters'
import { AnalyticsSummaryCards } from '@/features/analytics/components/AnalyticsSummaryCards'
import { useAnalyticsSource } from '@/features/analytics/hooks/useAnalytics'
import {
  buildAnalyticsView,
  EMPTY_ANALYTICS_FILTERS,
} from '@/features/analytics/utils/analyticsMetrics'
import { exportTradesToExcel } from '@/features/analytics/utils/exportAnalytics'
import { useInstruments } from '@/features/instruments/hooks/useInstruments'
import { useSettings } from '@/features/settings/hooks/useSettings'

export function AnalyticsPage() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsSource()
  const { data: instruments = [] } = useInstruments()
  const { data: settings } = useSettings()
  const [filters, setFilters] = useState(EMPTY_ANALYTICS_FILTERS)

  const view = useMemo(() => {
    if (!data) return null
    return buildAnalyticsView(data.trades, data.capitalEntries, filters)
  }, [data, filters])

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="rounded-card border border-border px-4 py-12 text-center text-sm text-muted-foreground">
          Loading analytics...
        </div>
      </div>
    )
  }

  if (isError || !view) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="rounded-card border border-destructive/30 px-4 py-12 text-center">
          <p className="text-sm text-destructive">
            {error?.message || 'Unable to load analytics'}
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-heading-2">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Filter performance, inspect charts, and export the dataset.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            exportTradesToExcel(
              view.trades,
              `tradix-analytics-${new Date().toISOString().slice(0, 10)}.xlsx`,
            )
          }
        >
          <Download className="size-4" />
          Export Excel
        </Button>
      </div>

      <AnalyticsFilters
        filters={filters}
        onChange={setFilters}
        instruments={instruments}
        preferences={settings?.preferences || {}}
      />

      <AnalyticsSummaryCards summary={view.summary} />

      <AnalyticsCharts
        winRateSeries={view.winRateSeries}
        capitalCurve={view.capitalCurve}
        drawdownSeries={view.drawdownSeries}
        monthlyReturns={view.monthlyReturns}
        tradeDistribution={view.tradeDistribution}
        emotionAnalysis={view.emotionAnalysis}
        mistakeAnalysis={view.mistakeAnalysis}
        instrumentPerformance={view.instrumentPerformance}
        riskReward={view.riskReward}
        calendarHeatmap={view.calendarHeatmap}
        timeframeAnalysis={view.timeframeAnalysis}
      />
    </div>
  )
}
