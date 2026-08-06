import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/features/capital/utils/formatCapital'

const tooltipStyle = {
  borderRadius: '10px',
  border: '1px solid var(--border)',
  background: 'var(--chart-tooltip)',
  color: 'var(--foreground)',
  fontSize: '12px',
}

function ChartCard({ title, description, children, empty }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {empty ? (
          <div className="flex h-56 items-center justify-center rounded-card border border-dashed border-border text-sm text-muted-foreground">
            No data yet
          </div>
        ) : (
          <div className="h-56 w-full">{children}</div>
        )}
      </CardContent>
    </Card>
  )
}

function CurrencyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={tooltipStyle} className="px-3 py-2 shadow-card">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="tabular-nums">
          {item.name}: {formatCurrency(item.value)}
        </p>
      ))}
    </div>
  )
}

export function DashboardCharts({
  capitalGrowth = [],
  monthlyProfit = [],
  instrumentPerformance = [],
  setupPerformance = [],
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard
        title="Capital Growth"
        description="Running capital over time"
        empty={!capitalGrowth.length}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={capitalGrowth}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={64}
              tickFormatter={(value) =>
                new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <Tooltip content={<CurrencyTooltip />} />
            <Area
              type="monotone"
              dataKey="capital"
              name="Capital"
              stroke="var(--chart-capital)"
              fill="var(--chart-capital)"
              fillOpacity={0.18}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Monthly Profit"
        description="Closed trade P/L by month"
        empty={!monthlyProfit.length}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyProfit}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={64}
              tickFormatter={(value) =>
                new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <Tooltip content={<CurrencyTooltip />} />
            <Bar dataKey="pnl" name="P/L" radius={[6, 6, 0, 0]}>
              {monthlyProfit.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={entry.pnl >= 0 ? 'var(--chart-profit)' : 'var(--chart-loss)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Instrument Performance"
        description="Net P/L by instrument"
        empty={!instrumentPerformance.length}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={instrumentPerformance} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              tickLine={false}
              tickFormatter={(value) =>
                new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              width={72}
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CurrencyTooltip />} />
            <Bar dataKey="pnl" name="P/L" radius={[0, 6, 6, 0]}>
              {instrumentPerformance.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.pnl >= 0 ? 'var(--chart-profit)' : 'var(--chart-loss)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Setup Performance"
        description="Net P/L by entry reason"
        empty={!setupPerformance.length}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={setupPerformance} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              tickLine={false}
              tickFormatter={(value) =>
                new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              width={88}
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CurrencyTooltip />} />
            <Bar dataKey="pnl" name="P/L" radius={[0, 6, 6, 0]}>
              {setupPerformance.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.pnl >= 0 ? 'var(--chart-analytics)' : 'var(--chart-loss)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
