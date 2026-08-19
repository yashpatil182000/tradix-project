import { BookOpen, LineChart, PenLine } from 'lucide-react'
import { motion } from 'motion/react'
import { TiltCard } from '@/pages/Landing/motion/interactions'
import { StaggerContainer, StaggerItem } from '@/pages/Landing/motion/motionUtils'
import { SectionShell } from './SectionShell'

const STEPS = [
  {
    number: '01',
    title: 'Record',
    description: 'Capture the trade in seconds.',
    icon: PenLine,
  },
  {
    number: '02',
    title: 'Review',
    description: 'Understand what happened.',
    icon: BookOpen,
  },
  {
    number: '03',
    title: 'Improve',
    description: 'Find patterns in your behavior.',
    icon: LineChart,
  },
]

export function HowItWorks() {
  return (
    <SectionShell
      id="how-it-works"
      badge="How it works"
      title="Three steps to better trading discipline"
      description="A simple workflow designed for traders who want clarity, not clutter."
      className="bg-[#111113]"
    >
      <div className="relative">
        <div className="pointer-events-none absolute top-10 right-[16%] left-[16%] hidden h-px md:block">
          <motion.div
            className="h-px origin-left bg-[#27272A]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <StaggerContainer className="grid gap-6 md:grid-cols-3" stagger={0.14}>
          {STEPS.map((step) => {
            const Icon = step.icon
            return (
              <StaggerItem key={step.number}>
                <TiltCard max={3}>
                  <div className="landing-feature-card group relative h-full rounded-xl border border-[#27272A] bg-[#0B0B0C] p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-xs font-medium tracking-widest text-[#71717A]">
                        {step.number}
                      </span>
                      <div className="rounded-lg border border-[#27272A] bg-[#151517] p-2 text-[#A1A1AA] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-primary">
                        <Icon className="size-4" aria-hidden="true" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-[#F4F4F5]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">
                      {step.description}
                    </p>
                  </div>
                </TiltCard>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </SectionShell>
  )
}
