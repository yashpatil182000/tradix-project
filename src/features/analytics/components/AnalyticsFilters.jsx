import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EMPTY_ANALYTICS_FILTERS } from '@/features/analytics/utils/analyticsMetrics'
import { cn } from '@/lib/utils'

function activeOptions(list = []) {
  return list.filter((item) => item.is_active !== false)
}

export function AnalyticsFilters({
  filters,
  onChange,
  instruments = [],
  preferences = {},
}) {
  const [open, setOpen] = useState(true)

  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <section className="rounded-card border border-border bg-card p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-start gap-2 rounded-control text-left outline-none transition-colors hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-expanded={open}
          aria-controls="analytics-filters-panel"
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
              Narrow the dataset used for cards and charts.
            </p>
          </div>
        </button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 self-start sm:self-auto"
          onClick={() => onChange({ ...EMPTY_ANALYTICS_FILTERS })}
        >
          Reset
        </Button>
      </div>

      <div
        id="analytics-filters-panel"
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              'grid gap-3 sm:grid-cols-2 lg:grid-cols-4',
              'transition-[padding,opacity] duration-300 ease-in-out',
              open ? 'pt-4 opacity-100' : 'pt-0 opacity-0',
            )}
          >
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date from</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(event) => update('dateFrom', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Date to</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(event) => update('dateTo', event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Instrument</Label>
              <Select
                value={filters.instrumentId}
                onValueChange={(value) => update('instrumentId', value)}
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
              <Label>Timeframe</Label>
              <Select
                value={filters.timeframe}
                onValueChange={(value) => update('timeframe', value)}
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

            <div className="space-y-2">
              <Label>Entry reason</Label>
              <Select
                value={filters.entryReason}
                onValueChange={(value) => update('entryReason', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All entry reasons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All entry reasons</SelectItem>
                  {activeOptions(preferences.entry_reasons).map((item) => (
                    <SelectItem key={item.id} value={item.label}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Emotion</Label>
              <Select
                value={filters.emotion}
                onValueChange={(value) => update('emotion', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All emotions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All emotions</SelectItem>
                  {activeOptions(preferences.emotions).map((item) => (
                    <SelectItem key={item.id} value={item.label}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mistake</Label>
              <Select
                value={filters.mistake}
                onValueChange={(value) => update('mistake', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All mistakes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All mistakes</SelectItem>
                  {activeOptions(preferences.mistakes).map((item) => (
                    <SelectItem key={item.id} value={item.label}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trade type</Label>
              <Select
                value={filters.tradeType}
                onValueChange={(value) => update('tradeType', value)}
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
                onValueChange={(value) => update('result', value)}
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
          </div>
        </div>
      </div>
    </section>
  )
}
