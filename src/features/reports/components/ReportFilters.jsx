import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  function updateFilter(key, value) {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <section className="rounded-card border border-border bg-card p-4 shadow-card sm:p-5 print:hidden">
      <div className="mb-4">
        <h2 className="text-heading-4">Filters</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Refine the report before preview or export.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    </section>
  )
}
