import {
  BarChart3,
  BookOpen,
  FileText,
  LayoutDashboard,
  Settings,
  Wallet,
} from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { TradixLogo } from '@/components/shared/TradixLogo'
import { cn } from '@/lib/utils'
import { GlassSweep } from '@/pages/Landing/components/effects/GlassSweep'
import { RECENT_TRADES } from '@/pages/Landing/data/mockData'
import { AnimatedNumber, RevealOnScroll } from '@/pages/Landing/motion/motionUtils'
import { SectionShell } from './SectionShell'

const SIDEBAR_ITEMS = [
  { label: 'Home', icon: LayoutDashboard, active: true },
  { label: 'Journal', icon: BookOpen },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Reports', icon: FileText },
  { label: 'Capital', icon: Wallet },
  { label: 'Settings', icon: Settings },
]

export function DashboardPreview() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [48, -16])
  const rise = useTransform(scrollYProgress, [0, 0.45], [56, 0])
  const frameY = reduced ? 0 : y

  return (
    <SectionShell
      badge="Dashboard"
      title="The Tradix experience"
      description="A familiar interface designed for review, not distraction."
      className="overflow-hidden bg-[#111113]"
    >
      <RevealOnScroll>
        <motion.div
          ref={ref}
          style={{ y: frameY }}
          className="relative overflow-hidden rounded-xl border border-[#27272A] bg-[#0B0B0C] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]"
        >
          <GlassSweep />
          <div className="flex items-center gap-2 border-b border-[#27272A] px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-[#EF4444]/80" />
            <span className="size-2.5 rounded-full bg-[#FACC15]/80" />
            <span className="size-2.5 rounded-full bg-[#22C55E]/80" />
          </div>

          <div className="flex min-h-[420px]">
            <aside className="hidden w-48 shrink-0 border-r border-[#27272A] bg-[#111113] md:block">
              <div className="border-b border-[#27272A] px-4 py-3">
                <TradixLogo size="sm" />
              </div>
              <nav className="space-y-0.5 p-2" aria-label="Sample sidebar">
                {SIDEBAR_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      className={
                        item.active
                          ? 'flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground'
                          : 'flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#71717A]'
                      }
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {item.label}
                    </div>
                  )
                })}
              </nav>
            </aside>

            <motion.div className="min-w-0 flex-1 p-4 md:p-6" style={reduced ? undefined : { y: rise }}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-[#71717A]">Dashboard</p>
                  <p className="text-lg font-semibold text-[#F4F4F5]">Overview</p>
                </div>
                <span className="text-xs text-[#71717A]">Sample data</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Capital', value: 24850, prefix: '$', color: 'text-[#F4F4F5]' },
                  { label: 'P/L', value: 1840, prefix: '+$', color: 'text-[#22C55E]' },
                  { label: 'Win Rate', value: 58.3, suffix: '%', color: 'text-[#22C55E]' },
                  { label: 'Trades', value: 142, color: 'text-[#F4F4F5]' },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg border border-[#27272A] bg-[#151517] p-3"
                  >
                    <p className="text-[10px] text-[#71717A] uppercase">{metric.label}</p>
                    <p className={cn('mt-1 text-lg font-semibold tabular-nums', metric.color)}>
                      {metric.prefix ? metric.prefix : ''}
                      <AnimatedNumber
                        value={metric.value}
                        decimals={metric.suffix ? 1 : 0}
                      />
                      {metric.suffix ?? ''}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-[#27272A] bg-[#151517] p-4">
                <p className="mb-3 text-sm font-medium text-[#F4F4F5]">Recent trades</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[320px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#27272A] text-[#71717A]">
                        <th className="pb-2 font-medium">Instrument</th>
                        <th className="pb-2 font-medium">Side</th>
                        <th className="pb-2 font-medium">R:R</th>
                        <th className="pb-2 text-right font-medium">P/L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_TRADES.map((trade) => (
                        <tr key={`${trade.instrument}-${trade.pnl}`} className="border-b border-[#27272A]/50">
                          <td className="py-2 text-[#F4F4F5]">{trade.instrument}</td>
                          <td className="py-2 text-[#A1A1AA]">{trade.direction}</td>
                          <td className="py-2 text-[#A1A1AA]">{trade.rr}</td>
                          <td
                            className={`py-2 text-right tabular-nums ${
                              trade.pnl >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                            }`}
                          >
                            {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </RevealOnScroll>
    </SectionShell>
  )
}
