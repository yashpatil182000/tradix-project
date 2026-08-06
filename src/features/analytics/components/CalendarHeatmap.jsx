import { formatCurrency } from '@/features/capital/utils/formatCapital'
import { cn } from '@/lib/utils'

function intensityClass(pnl, hasTrades) {
  if (!hasTrades) return 'bg-muted/40'
  if (pnl > 0) {
    if (pnl >= 200) return 'bg-status-profit'
    if (pnl >= 50) return 'bg-status-profit/70'
    return 'bg-status-profit/40'
  }
  if (pnl < 0) {
    if (pnl <= -200) return 'bg-status-loss'
    if (pnl <= -50) return 'bg-status-loss/70'
    return 'bg-status-loss/40'
  }
  return 'bg-chart-drawdown/50'
}

export function CalendarHeatmap({ days = [] }) {
  if (!days.length) {
    return (
      <div className="flex h-56 items-center justify-center rounded-card border border-dashed border-border text-sm text-muted-foreground">
        No data yet
      </div>
    )
  }

  const weeks = []
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7))
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.label}: ${day.hasTrades ? formatCurrency(day.pnl) : 'No trades'}`}
                  className={cn(
                    'size-3 rounded-[3px] sm:size-3.5',
                    intensityClass(day.pnl, day.hasTrades),
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 text-caption text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="size-3 rounded-[3px] bg-muted/40" />
          <div className="size-3 rounded-[3px] bg-status-loss/40" />
          <div className="size-3 rounded-[3px] bg-status-loss" />
          <div className="size-3 rounded-[3px] bg-status-profit/40" />
          <div className="size-3 rounded-[3px] bg-status-profit" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
