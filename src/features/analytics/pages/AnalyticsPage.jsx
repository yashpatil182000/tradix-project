import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  PageError,
  PageSkeleton,
} from '@/components/shared/PageStates'
import { AnalyticsCharts } from '@/features/analytics/components/AnalyticsCharts'
import { AnalyticsFilters } from '@/features/analytics/components/AnalyticsFilters'
import { AnalyticsSummaryCards } from '@/features/analytics/components/AnalyticsSummaryCards'
import { useAnalyticsSource } from '@/features/analytics/hooks/useAnalytics'
import {
  buildAnalyticsView,
  EMPTY_ANALYTICS_FILTERS,
} from '@/features/analytics/utils/analyticsMetrics'
import { useInstruments } from '@/features/instruments/hooks/useInstruments'
import { useSettings } from '@/features/settings/hooks/useSettings'

export function AnalyticsPage() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsSource()
  const { data: instruments = [] } = useInstruments()
  const { data: settings } = useSettings()
  const [filters, setFilters] = useState(EMPTY_ANALYTICS_FILTERS)
  const [isExporting, setIsExporting] = useState(false)

  const view = useMemo(() => {
    if (!data) return null
    return buildAnalyticsView(data.trades, data.capitalEntries, filters)
  }, [data, filters])

  async function handleExport() {
    if (!view) return
    setIsExporting(true)
    try {
      const { exportTradesToExcel } = await import(
        '@/features/analytics/utils/exportAnalytics'
      )
      exportTradesToExcel(
        view.trades,
        `tradix-analytics-${new Date().toISOString().slice(0, 10)}.xlsx`,
      )
      toast.success('Excel export downloaded')
    } catch (exportError) {
      toast.error(exportError.message || 'Unable to export Excel')
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) return <PageSkeleton />

  if (isError || !view) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <PageError
          message={error?.message || 'Unable to load analytics'}
          onRetry={() => refetch()}
        />
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
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download className="size-4" />
          {isExporting ? 'Exporting...' : 'Export Excel'}
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
