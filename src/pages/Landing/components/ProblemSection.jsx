import { Quote } from 'lucide-react'
import { TiltCard } from '@/pages/Landing/motion/interactions'
import { RevealOnScroll, StaggerContainer, StaggerItem } from '@/pages/Landing/motion/motionUtils'
import { SectionShell } from './SectionShell'

const PROBLEMS = [
  'I entered because it looked right.',
  'I moved my stop.',
  'I should have waited.',
]

export function ProblemSection() {
  return (
    <SectionShell
      title="Most traders remember the trade. They forget the decision."
      align="center"
    >
      <StaggerContainer className="grid gap-4 md:grid-cols-3" stagger={0.12}>
        {PROBLEMS.map((problem, index) => (
          <StaggerItem
            key={problem}
            x={index === 1 ? 0 : index === 0 ? -36 : 36}
            y={index === 1 ? 28 : 12}
          >
            <TiltCard max={3.5}>
              <div className="landing-problem-card relative h-full rounded-xl border border-[#27272A] bg-[#151517] p-6">
                <Quote className="mb-4 size-5 text-[#71717A] transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
                <p className="text-lg leading-relaxed text-[#F4F4F5]">&ldquo;{problem}&rdquo;</p>
              </div>
            </TiltCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <RevealOnScroll className="mt-10 text-center" delay={0.2}>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#A1A1AA] md:text-lg">
          Without structured journaling, these patterns disappear. Tradix captures the
          context behind every trade so you can review what actually drove your results.
        </p>
      </RevealOnScroll>
    </SectionShell>
  )
}
