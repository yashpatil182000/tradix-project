import { formatCurrency } from '@/features/capital/utils/formatCapital'

export const chartTooltipStyle = {
  borderRadius: '10px',
  border: '1px solid var(--border)',
  background: 'var(--chart-tooltip)',
  color: 'var(--foreground)',
  fontSize: '12px',
}

export const chartLegendProps = {
  verticalAlign: 'top',
  align: 'right',
  iconType: 'circle',
  iconSize: 8,
  wrapperStyle: {
    fontSize: '12px',
    color: 'var(--chart-axis)',
    paddingBottom: 8,
  },
}

export function resolveTooltipColor(item) {
  const direct =
    item.color ||
    item.fill ||
    item.stroke ||
    item.payload?.fill ||
    item.payload?.stroke ||
    item.payload?.color

  if (direct) return direct

  const key = String(item.dataKey || item.name || '').toLowerCase()
  if (key.includes('pnl') || key === 'p/l') {
    const value = Number(item.value)
    if (value > 0) return 'var(--chart-profit)'
    if (value < 0) return 'var(--chart-loss)'
  }

  return 'var(--chart-analytics)'
}

export function formatChartValue(value, dataKey) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  const key = String(dataKey || '').toLowerCase()
  if (key.includes('rate') || key.includes('drawdown')) {
    return `${Number(value).toFixed(1)}%`
  }
  return formatCurrency(value)
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  valueFormatter,
}) {
  if (!active || !payload?.length) return null

  return (
    <div style={chartTooltipStyle} className="px-3 py-2 shadow-card">
      {label ? <p className="mb-1.5 font-medium">{label}</p> : null}
      <div className="space-y-1">
        {payload.map((item, index) => {
          const color = resolveTooltipColor(item)
          const name = item.name || item.dataKey || 'Value'
          const formatted = valueFormatter
            ? valueFormatter(item.value, item)
            : formatChartValue(item.value, item.dataKey)

          return (
            <div
              key={`${item.dataKey || name}-${index}`}
              className="flex items-center gap-2 tabular-nums"
            >
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground">{name}:</span>
              <span className="font-medium">{formatted}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
