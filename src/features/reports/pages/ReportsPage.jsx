import { useMemo, useState } from 'react'
import { Download, FileSpreadsheet, Printer } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  PageError,
  PageSkeleton,
} from '@/components/shared/PageStates'
import { ReportFilters } from '@/features/reports/components/ReportFilters'
import { ReportPreview } from '@/features/reports/components/ReportPreview'
import { ReportTypeSelector } from '@/features/reports/components/ReportTypeSelector'
import { useReportsSource } from '@/features/reports/hooks/useReports'
import {
  buildReport,
  EMPTY_REPORT_FILTERS,
} from '@/features/reports/utils/buildReport'
import { toInputDate } from '@/features/reports/utils/reportPeriods'
import { useInstruments } from '@/features/instruments/hooks/useInstruments'
import { useSettings } from '@/features/settings/hooks/useSettings'

export function ReportsPage() {
  const { data, isLoading, isError, error, refetch } = useReportsSource()
  const { data: instruments = [] } = useInstruments()
  const { data: settings } = useSettings()

  const [reportType, setReportType] = useState('monthly')
  const [anchorDate, setAnchorDate] = useState(toInputDate())
  const [customFrom, setCustomFrom] = useState(
    toInputDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
  )
  const [customTo, setCustomTo] = useState(toInputDate())
  const [filters, setFilters] = useState(EMPTY_REPORT_FILTERS)
  const [exporting, setExporting] = useState(null)

  const report = useMemo(() => {
    if (!data) return null
    return buildReport({
      trades: data.trades,
      reportType,
      anchorDate,
      customFrom,
      customTo,
      filters,
    })
  }, [anchorDate, customFrom, customTo, data, filters, reportType])

  function handlePrint() {
    window.print()
  }

  async function handleExcel() {
    if (!report) return
    setExporting('excel')
    try {
      const { exportReportToExcel } = await import(
        '@/features/reports/utils/exportReportExcel'
      )
      exportReportToExcel(report)
      toast.success('Excel report downloaded')
    } catch (exportError) {
      toast.error(exportError.message || 'Unable to export Excel')
    } finally {
      setExporting(null)
    }
  }

  async function handlePdf() {
    if (!report) return
    setExporting('pdf')
    try {
      const { exportReportToPdf } = await import(
        '@/features/reports/utils/exportReportPdf'
      )
      exportReportToPdf(report)
      toast.success('PDF report downloaded')
    } catch (exportError) {
      toast.error(exportError.message || 'Unable to export PDF')
    } finally {
      setExporting(null)
    }
  }

  if (isLoading) return <PageSkeleton />

  if (isError || !report) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <PageError
          message={error?.message || 'Unable to load reports'}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 print:hidden sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-heading-2">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build period reports, filter the dataset, then print or export.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="size-4" />
            Print
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleExcel}
            disabled={Boolean(exporting)}
          >
            <FileSpreadsheet className="size-4" />
            {exporting === 'excel' ? 'Exporting...' : 'Export Excel'}
          </Button>
          <Button
            type="button"
            onClick={handlePdf}
            disabled={Boolean(exporting)}
          >
            <Download className="size-4" />
            {exporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      <div className="print:hidden">
        <ReportTypeSelector value={reportType} onChange={setReportType} />
      </div>

      <ReportFilters
        reportType={reportType}
        anchorDate={anchorDate}
        customFrom={customFrom}
        customTo={customTo}
        filters={filters}
        onAnchorDateChange={setAnchorDate}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
        onFiltersChange={setFilters}
        instruments={instruments}
        preferences={settings?.preferences || {}}
      />

      <ReportPreview report={report} />
    </div>
  )
}
