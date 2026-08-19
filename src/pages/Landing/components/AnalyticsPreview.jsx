import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltipContent } from '@/components/shared/charts/chartHelpers'
import { ViewportChart } from '@/pages/Landing/components/effects/ViewportChart'
import {
  INSTRUMENT_PERFORMANCE,
  PNL_BY_MONTH,
  SETUP_PERFORMANCE,
  WIN_RATE_DATA,
} from '@/pages/Landing/data/mockData'
import { TiltCard } from '@/pages/Landing/motion/interactions'
import {
  AnimatedNumber,
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from '@/pages/Landing/motion/motionUtils'
import { SectionShell } from './SectionShell'

export function AnalyticsPreview() {
  return (
    <SectionShell
      id="analytics"
      badge="Analytics"
      title="Turn your history into insight"
      description="Sample analytics — visual only, not connected to live data."
      className="bg-[#111113]"
    >
      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
        <StaggerItem>
          <div className="rounded-xl border border-[#27272A] bg-[#0B0B0C] p-4">
            <p className="text-xs text-[#71717A]">Win rate</p>
            <p className="mt-1 text-2xl font-semibold text-[#22C55E]">
              <AnimatedNumber value={58.3} decimals={1} suffix="%" />
            </p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="rounded-xl border border-[#27272A] bg-[#0B0B0C] p-4">
            <p className="text-xs text-[#71717A]">Total P/L</p>
            <p className="mt-1 text-2xl font-semibold text-[#22C55E]">
              +<AnimatedNumber value={2930} prefix="$" />
            </p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="rounded-xl border border-[#27272A] bg-[#0B0B0C] p-4">
            <p className="text-xs text-[#71717A]">Avg R:R</p>
            <p className="mt-1 text-2xl font-semibold text-[#F4F4F5]">
              1:<AnimatedNumber value={1.85} decimals={2} />
            </p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="rounded-xl border border-[#27272A] bg-[#0B0B0C] p-4">
            <p className="text-xs text-[#71717A]">Closed trades</p>
            <p className="mt-1 text-2xl font-semibold text-[#F4F4F5]">
              <AnimatedNumber value={142} />
            </p>
          </div>
        </StaggerItem>
      </StaggerContainer>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <RevealOnScroll delay={0.05}>
          <TiltCard max={2.5} glare={false}>
            <div className="rounded-xl border border-[#27272A] bg-[#0B0B0C] p-4">
              <p className="mb-4 text-sm font-medium text-[#F4F4F5]">Profit / Loss by month</p>
              <ViewportChart className="h-52">
                {({ animate }) => (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={PNL_BY_MONTH}>
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
                      />
                      <Tooltip content={<ChartTooltipContent />} animationDuration={180} />
                      <Bar
                        dataKey="pnl"
                        name="P/L"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={animate}
                        animationDuration={1100}
                        animationEasing="ease-out"
                      >
                        {PNL_BY_MONTH.map((entry) => (
                          <Cell
                            key={entry.month}
                            fill={entry.pnl >= 0 ? 'var(--chart-profit)' : 'var(--chart-loss)'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ViewportChart>
            </div>
          </TiltCard>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <TiltCard max={2.5} glare={false}>
            <div className="rounded-xl border border-[#27272A] bg-[#0B0B0C] p-4">
              <p className="mb-4 text-sm font-medium text-[#F4F4F5]">Win / Loss distribution</p>
              <ViewportChart className="h-52">
                {({ animate }) => (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={WIN_RATE_DATA}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={2}
                        isAnimationActive={animate}
                        animationDuration={1100}
                        animationEasing="ease-out"
                      >
                        {WIN_RATE_DATA.map((entry) => (
                          <Cell key={entry.label} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent />} animationDuration={180} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </ViewportChart>
            </div>
          </TiltCard>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <TiltCard max={2.5} glare={false}>
            <div className="rounded-xl border border-[#27272A] bg-[#0B0B0C] p-4">
              <p className="mb-4 text-sm font-medium text-[#F4F4F5]">Performance by instrument</p>
              <ViewportChart className="h-52">
                {({ animate }) => (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={INSTRUMENT_PERFORMANCE} layout="vertical">
                      <CartesianGrid stroke="var(--chart-grid)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#71717A', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                      />
                      <Tooltip content={<ChartTooltipContent />} animationDuration={180} />
                      <Bar
                        dataKey="pnl"
                        name="P/L"
                        fill="var(--primary)"
                        radius={[0, 4, 4, 0]}
                        isAnimationActive={animate}
                        animationDuration={1100}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ViewportChart>
            </div>
          </TiltCard>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <TiltCard max={2.5} glare={false}>
            <div className="rounded-xl border border-[#27272A] bg-[#0B0B0C] p-4">
              <p className="mb-4 text-sm font-medium text-[#F4F4F5]">Performance by setup</p>
              <ViewportChart className="h-52">
                {({ animate }) => (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SETUP_PERFORMANCE}>
                      <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#71717A', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltipContent />} animationDuration={180} />
                      <Bar
                        dataKey="pnl"
                        name="P/L"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={animate}
                        animationDuration={1100}
                        animationEasing="ease-out"
                      >
                        {SETUP_PERFORMANCE.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.pnl >= 0 ? 'var(--chart-profit)' : 'var(--chart-loss)'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ViewportChart>
            </div>
          </TiltCard>
        </RevealOnScroll>
      </div>
    </SectionShell>
  )
}
