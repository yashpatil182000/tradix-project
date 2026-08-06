import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
import {
  ChartTooltipContent,
  chartLegendProps,
} from '@/components/shared/charts/chartHelpers'

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
          <div className="flex h-56 w-full flex-col outline-none [&_*]:outline-none">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ChartBody({ children }) {
  return <div className="min-h-0 flex-1">{children}</div>
}

function PnlLegend({ profitColor = 'var(--chart-profit)' }) {
  return (
    <div className="mb-2 flex shrink-0 justify-end gap-3 text-caption text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2 rounded-full" style={{ backgroundColor: profitColor }} />
        Profit
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-[var(--chart-loss)]" />
        Loss
      </span>
    </div>
  )
}

function compactTick(value) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
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
        <ChartBody>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={capitalGrowth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                tickFormatter={compactTick}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend {...chartLegendProps} />
              <Area
                type="monotone"
                dataKey="capital"
                name="Capital"
                stroke="var(--chart-capital)"
                fill="var(--chart-capital)"
                fillOpacity={0.18}
                strokeWidth={2}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartBody>
      </ChartCard>

      <ChartCard
        title="Monthly Profit"
        description="Closed trade P/L by month"
        empty={!monthlyProfit.length}
      >
        <PnlLegend />
        <ChartBody>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyProfit} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
                tickFormatter={compactTick}
              />
              <Tooltip content={<ChartTooltipContent />} />
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
        </ChartBody>
      </ChartCard>

      <ChartCard
        title="Instrument Performance"
        description="Net P/L by instrument"
        empty={!instrumentPerformance.length}
      >
        <PnlLegend />
        <ChartBody>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={instrumentPerformance}
              layout="vertical"
              margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--chart-grid)' }}
                tickLine={false}
                tickFormatter={compactTick}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={72}
                tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltipContent />} />
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
        </ChartBody>
      </ChartCard>

      <ChartCard
        title="Setup Performance"
        description="Net P/L by entry reason"
        empty={!setupPerformance.length}
      >
        <PnlLegend profitColor="var(--chart-analytics)" />
        <ChartBody>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={setupPerformance}
              layout="vertical"
              margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--chart-grid)' }}
                tickLine={false}
                tickFormatter={compactTick}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={88}
                tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltipContent />} />
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
        </ChartBody>
      </ChartCard>
    </div>
  )
}
