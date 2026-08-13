import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

function activeOptions(list = []) {
  return list.filter((item) => item.is_active !== false)
}

export function ReportFilters({
  reportType,
  anchorDate,
  customFrom,
  customTo,
  filters,
  onAnchorDateChange,
  onCustomFromChange,
  onCustomToChange,
  onFiltersChange,
  instruments = [],
  preferences = {},
}) {
  const [open, setOpen] = useState(true)

  function updateFilter(key, value) {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <section className="rounded-card border border-border bg-card p-4 shadow-card sm:p-5 print:hidden">
      <button
        type="button"
        className="flex w-full items-start gap-2 rounded-control text-left outline-none transition-colors hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-expanded={open}
        aria-controls="report-filters-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <ChevronDown
          aria-hidden
          className={cn(
            'mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-in-out',
            open && 'rotate-180',
          )}
        />
        <div className="min-w-0">
          <h2 className="text-heading-4">Filters</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Refine the report before preview or export.
          </p>
        </div>
      </button>

      <div
        id="report-filters-panel"
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              'grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
              'transition-[padding,opacity] duration-300 ease-in-out',
              open ? 'pt-4 opacity-100' : 'pt-0 opacity-0',
            )}
          >
            {reportType === 'custom' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="customFrom">Date from</Label>
                  <Input
                    id="customFrom"
                    type="date"
                    value={customFrom}
                    onChange={(event) => onCustomFromChange(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customTo">Date to</Label>
                  <Input
                    id="customTo"
                    type="date"
                    value={customTo}
                    onChange={(event) => onCustomToChange(event.target.value)}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="anchorDate">
                  {reportType === 'daily' ? 'Report date' : 'As of date'}
                </Label>
                <Input
                  id="anchorDate"
                  type="date"
                  value={anchorDate}
                  onChange={(event) => onAnchorDateChange(event.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Instrument</Label>
              <Select
                value={filters.instrumentId}
                onValueChange={(value) => updateFilter('instrumentId', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All instruments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All instruments</SelectItem>
                  {instruments.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trade type</Label>
              <Select
                value={filters.tradeType}
                onValueChange={(value) => updateFilter('tradeType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="scalp">Scalp</SelectItem>
                  <SelectItem value="intraday">Intraday</SelectItem>
                  <SelectItem value="swing">Swing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Result</Label>
              <Select
                value={filters.result}
                onValueChange={(value) => updateFilter('result', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All results" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All results</SelectItem>
                  <SelectItem value="win">Win</SelectItem>
                  <SelectItem value="loss">Loss</SelectItem>
                  <SelectItem value="breakeven">Breakeven</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select
                value={filters.timeframe}
                onValueChange={(value) => updateFilter('timeframe', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All timeframes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All timeframes</SelectItem>
                  {activeOptions(preferences.timeframes).map((item) => (
                    <SelectItem key={item.id} value={item.label}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
