import { Badge } from '@/components/ui/badge'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltipContent } from '@/components/shared/charts/chartHelpers'
import { ViewportChart } from '@/pages/Landing/components/effects/ViewportChart'
import { GlassSweep } from '@/pages/Landing/components/effects/GlassSweep'
import {
  CAPITAL_GROWTH,
  DASHBOARD_METRICS,
  RECENT_TRADES,
} from '@/pages/Landing/data/mockData'
import { TiltCard } from '@/pages/Landing/motion/interactions'
import {
  AnimatedNumber,
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from '@/pages/Landing/motion/motionUtils'
import { SectionShell } from './SectionShell'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function ProductVisualization() {
  return (
    <SectionShell
      badge="Product preview"
      title="Your trading history, organized."
      description="Sample dashboard data — not connected to your account."
      className="bg-[#111113]"
    >
      <RevealOnScroll>
        <TiltCard max={2} glare={false}>
          <div className="relative overflow-hidden rounded-xl border border-[#27272A] bg-[#0B0B0C] shadow-[0_32px_80px_-32px_rgba(0,0,0,0.9)]">
            <GlassSweep />
            <div className="flex items-center gap-2 border-b border-[#27272A] px-4 py-3">
              <span className="size-2.5 rounded-full bg-[#EF4444]/80" />
              <span className="size-2.5 rounded-full bg-[#FACC15]/80" />
              <span className="size-2.5 rounded-full bg-[#22C55E]/80" />
              <span className="ml-2 text-xs text-[#71717A]">tradix.app/dashboard</span>
            </div>

            <div className="p-4 md:p-6">
              <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
                <StaggerItem>
                  <div className="rounded-lg border border-[#27272A] bg-[#151517] p-4">
                    <p className="text-xs text-[#71717A]">Capital</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-[#F4F4F5]">
                      <AnimatedNumber value={DASHBOARD_METRICS.capital} prefix="$" />
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="rounded-lg border border-[#27272A] bg-[#151517] p-4">
                    <p className="text-xs text-[#71717A]">Win Rate</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-[#22C55E]">
                      <AnimatedNumber
                        value={DASHBOARD_METRICS.winRate}
                        decimals={1}
                        suffix="%"
                      />
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="rounded-lg border border-[#27272A] bg-[#151517] p-4">
                    <p className="text-xs text-[#71717A]">Avg R:R</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-[#F4F4F5]">
                      1:<AnimatedNumber value={DASHBOARD_METRICS.avgRr} decimals={2} />
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="rounded-lg border border-[#27272A] bg-[#151517] p-4">
                    <p className="text-xs text-[#71717A]">Monthly P/L</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-[#22C55E]">
                      +<AnimatedNumber value={DASHBOARD_METRICS.monthlyPnl} prefix="$" />
                    </p>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              <div className="mt-4 grid gap-4 lg:grid-cols-5">
                <RevealOnScroll className="lg:col-span-3" delay={0.1}>
                  <div className="rounded-lg border border-[#27272A] bg-[#151517] p-4">
                    <p className="mb-4 text-sm font-medium text-[#F4F4F5]">Capital growth</p>
                    <ViewportChart className="h-48 w-full">
                      {({ animate }) => (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={CAPITAL_GROWTH}>
                            <defs>
                              <linearGradient id="capitalGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                            <XAxis
                              dataKey="month"
                              tick={{ fill: '#71717A', fontSize: 11 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              tick={{ fill: '#71717A', fontSize: 11 }}
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<ChartTooltipContent />} animationDuration={180} />
                            <Area
                              type="monotone"
                              dataKey="capital"
                              name="Capital"
                              stroke="var(--primary)"
                              fill="url(#capitalGradient)"
                              strokeWidth={2}
                              isAnimationActive={animate}
                              animationDuration={1200}
                              animationEasing="ease-out"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </ViewportChart>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll className="lg:col-span-2" delay={0.15}>
                  <div className="rounded-lg border border-[#27272A] bg-[#151517] p-4">
                    <p className="mb-4 text-sm font-medium text-[#F4F4F5]">Recent trades</p>
                    <div className="space-y-2">
                      {RECENT_TRADES.map((trade) => (
                        <div
                          key={`${trade.instrument}-${trade.direction}`}
                          className="flex items-center justify-between rounded-md border border-[#27272A]/60 bg-[#111113] px-3 py-2 transition-colors duration-300 hover:border-primary/25"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#F4F4F5]">
                              {trade.instrument}
                            </span>
                            <Badge
                              variant={trade.direction === 'BUY' ? 'profit' : 'loss'}
                              className="text-[10px]"
                            >
                              {trade.direction}
                            </Badge>
                          </div>
                          <span
                            className={
                              trade.pnl >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                            }
                          >
                            {trade.pnl >= 0 ? '+' : ''}
                            {formatCurrency(trade.pnl)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </TiltCard>
      </RevealOnScroll>
    </SectionShell>
  )
}
