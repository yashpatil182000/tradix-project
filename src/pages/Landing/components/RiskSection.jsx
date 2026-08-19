import { ArrowDown } from 'lucide-react'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { RevealOnScroll } from '@/pages/Landing/motion/motionUtils'
import { SectionShell } from './SectionShell'

const STEPS = [
  { label: 'Entry', value: '3,365.20' },
  { label: 'Stop Loss', value: '3,360.20' },
  { label: 'Target', value: '3,375.20' },
]

export function RiskSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  return (
    <SectionShell
      badge="Risk management"
      title="Define risk before you review results"
      description="Track the relationship between entry, stop, and target on every trade — without implying any outcome is guaranteed."
      className="bg-[#111113]"
    >
      <div ref={ref} className="grid items-center gap-10 lg:grid-cols-2">
        <RevealOnScroll>
          <div className="space-y-0">
            {STEPS.map((step, index) => (
              <div key={step.label}>
                <div className="rounded-xl border border-[#27272A] bg-[#0B0B0C] px-5 py-4">
                  <p className="text-xs tracking-wide text-[#71717A] uppercase">{step.label}</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-[#F4F4F5]">
                    {step.value}
                  </p>
                </div>
                {index < STEPS.length - 1 ? (
                  <div className="flex justify-center py-2 text-[#71717A]">
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </div>
                ) : null}
              </div>
            ))}

            <motion.div
              className="mt-4 rounded-xl border border-primary/30 bg-[#151517] px-5 py-4"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-xs tracking-wide text-[#71717A] uppercase">Risk / Reward</p>
              <div className="mt-3 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] text-[#71717A] uppercase">Risk</p>
                  <p className="text-lg font-semibold text-[#EF4444]">$50</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#71717A] uppercase">Reward</p>
                  <p className="text-lg font-semibold text-[#22C55E]">$100</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#71717A] uppercase">R:R</p>
                  <p className="text-lg font-semibold text-primary">1:2</p>
                </div>
              </div>
            </motion.div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#27272A] bg-[#0B0B0C]">
            <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
              <motion.line
                x1="80"
                y1="240"
                x2="320"
                y2="60"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 0.5 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
              />
              <motion.rect
                x="60"
                y="220"
                width="280"
                height="2"
                fill="#EF4444"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ transformOrigin: 'left' }}
              />
              <motion.rect
                x="60"
                y="80"
                width="280"
                height="2"
                fill="#22C55E"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{ transformOrigin: 'left' }}
              />
              <text x="60" y="260" fill="#71717A" fontSize="11">
                Stop
              </text>
              <text x="60" y="70" fill="#71717A" fontSize="11">
                Target
              </text>
              <text x="60" y="210" fill="#71717A" fontSize="11">
                Entry
              </text>
            </svg>
            <p className="absolute right-4 bottom-4 text-xs text-[#71717A]">
              Illustration only — not a trade recommendation
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </SectionShell>
  )
}
