import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CalendarHeatmap } from '@/features/analytics/components/CalendarHeatmap'
import { formatCurrency } from '@/features/capital/utils/formatCapital'

const tooltipStyle = {
  borderRadius: '10px',
  border: '1px solid var(--border)',
  background: 'var(--chart-tooltip)',
  color: 'var(--foreground)',
  fontSize: '12px',
}

function ChartCard({ title, description, children, empty, className }) {
  return (
    <Card className={className}>
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
      {label ? <p className="mb-1 font-medium">{label}</p> : null}
      {payload.map((item) => (
        <p key={`${item.dataKey}-${item.name}`} className="tabular-nums">
          {item.name}:{' '}
          {typeof item.value === 'number' &&
          (String(item.dataKey).toLowerCase().includes('rate') ||
            String(item.dataKey).toLowerCase().includes('drawdown'))
            ? `${item.value.toFixed(1)}%`
            : formatCurrency(item.value)}
        </p>
      ))}
    </div>
  )
}

function compactTick(value) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function HorizontalPnlChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
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
          width={84}
          tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CurrencyTooltip />} />
        <Bar dataKey="pnl" name="P/L" radius={[0, 6, 6, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.pnl >= 0 ? 'var(--chart-profit)' : 'var(--chart-loss)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AnalyticsCharts({
  winRateSeries = [],
  capitalCurve = [],
  drawdownSeries = [],
  monthlyReturns = [],
  tradeDistribution = [],
  emotionAnalysis = [],
  mistakeAnalysis = [],
  instrumentPerformance = [],
  riskReward = [],
  calendarHeatmap = [],
  timeframeAnalysis = [],
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard
        title="Win Rate"
        description="Cumulative win rate over closed trades"
        empty={!winRateSeries.length}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={winRateSeries}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CurrencyTooltip />} />
            <Line
              type="monotone"
              dataKey="winRate"
              name="Win Rate"
              stroke="var(--chart-profit)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Capital Curve"
        description="Running capital balance"
        empty={!capitalCurve.length}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={capitalCurve}>
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
        title="Drawdown"
        description="Peak-to-trough capital decline"
        empty={!drawdownSeries.length}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={drawdownSeries}>
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
              width={48}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CurrencyTooltip />} />
            <Area
              type="monotone"
              dataKey="drawdown"
              name="Drawdown"
              stroke="var(--chart-drawdown)"
              fill="var(--chart-drawdown)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Monthly Returns"
        description="Closed trade P/L by month"
        empty={!monthlyReturns.length}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyReturns}>
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
            <Tooltip content={<CurrencyTooltip />} />
            <Bar dataKey="pnl" name="P/L" radius={[6, 6, 0, 0]}>
              {monthlyReturns.map((entry) => (
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
        title="Trade Distribution"
        description="Wins, losses, and open trades"
        empty={!tradeDistribution.length}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={tradeDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={48}
              outerRadius={80}
              paddingAngle={3}
            >
              {tradeDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const item = payload[0]
                return (
                  <div style={tooltipStyle} className="px-3 py-2 shadow-card">
                    <p className="font-medium">{item.name}</p>
                    <p className="tabular-nums">{item.value} trades</p>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Emotion Analysis"
        description="Net P/L by emotion"
        empty={!emotionAnalysis.length}
      >
        <HorizontalPnlChart data={emotionAnalysis} />
      </ChartCard>

      <ChartCard
        title="Mistake Analysis"
        description="Net P/L by mistake"
        empty={!mistakeAnalysis.length}
      >
        <HorizontalPnlChart data={mistakeAnalysis} />
      </ChartCard>

      <ChartCard
        title="Instrument Performance"
        description="Net P/L by instrument"
        empty={!instrumentPerformance.length}
      >
        <HorizontalPnlChart data={instrumentPerformance} />
      </ChartCard>

      <ChartCard
        title="Risk vs Reward"
        description="Planned risk against reward"
        empty={!riskReward.length}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="risk"
              name="Risk"
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              tickLine={false}
              tickFormatter={compactTick}
            />
            <YAxis
              type="number"
              dataKey="reward"
              name="Reward"
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={64}
              tickFormatter={compactTick}
            />
            <ZAxis range={[60, 60]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const point = payload[0]?.payload
                if (!point) return null
                return (
                  <div style={tooltipStyle} className="px-3 py-2 shadow-card">
                    <p className="mb-1 font-medium">{point.symbol}</p>
                    <p>Risk: {formatCurrency(point.risk)}</p>
                    <p>Reward: {formatCurrency(point.reward)}</p>
                    <p>P/L: {formatCurrency(point.pnl)}</p>
                  </div>
                )
              }}
            />
            <Scatter data={riskReward} fill="var(--chart-analytics)">
              {riskReward.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={
                    entry.result === 'win'
                      ? 'var(--chart-profit)'
                      : entry.result === 'loss'
                        ? 'var(--chart-loss)'
                        : 'var(--chart-analytics)'
                  }
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Timeframe Analysis"
        description="Net P/L by timeframe"
        empty={!timeframeAnalysis.length}
      >
        <HorizontalPnlChart data={timeframeAnalysis} />
      </ChartCard>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Calendar Heatmap</CardTitle>
          <CardDescription>Daily closed P/L over the last ~17 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarHeatmap days={calendarHeatmap} />
        </CardContent>
      </Card>
    </div>
  )
}
