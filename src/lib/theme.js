export const THEME_STORAGE_KEY = 'tradix-theme'

export const themes = ['light', 'dark', 'system']

export const chartColors = {
  capital: 'var(--chart-capital)',
  profit: 'var(--chart-profit)',
  loss: 'var(--chart-loss)',
  drawdown: 'var(--chart-drawdown)',
  analytics: 'var(--chart-analytics)',
  grid: 'var(--chart-grid)',
  axis: 'var(--chart-axis)',
  tooltip: 'var(--chart-tooltip)',
}

export const statusColors = {
  profit: 'var(--status-profit)',
  loss: 'var(--status-loss)',
  pending: 'var(--status-pending)',
  cancelled: 'var(--status-cancelled)',
}

export const statusClassNames = {
  profit: 'text-status-profit bg-status-profit/10',
  loss: 'text-status-loss bg-status-loss/10',
  pending: 'text-status-pending bg-status-pending/10',
  cancelled: 'text-status-cancelled bg-status-cancelled/10',
}

export function getStatusClassName(status) {
  return statusClassNames[status] ?? statusClassNames.cancelled
}

export function getChartColor(key) {
  return chartColors[key] ?? chartColors.analytics
}
