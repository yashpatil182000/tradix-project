import { Sparkles } from 'lucide-react'
import { BEHAVIORAL_INSIGHTS } from '@/pages/Landing/data/mockData'
import { TiltCard } from '@/pages/Landing/motion/interactions'
import { LineDraw, StaggerContainer, StaggerItem } from '@/pages/Landing/motion/motionUtils'
import { SectionShell } from './SectionShell'

export function InsightsSection() {
  return (
    <SectionShell
      badge="Behavioral insights"
      title="Understand how you trade, not just what you traded"
      description="Sample insights shown for demonstration — your patterns emerge from your own journal data."
    >
      <StaggerContainer className="grid gap-4 md:grid-cols-3" stagger={0.1}>
        {BEHAVIORAL_INSIGHTS.map((item, index) => (
          <StaggerItem key={item.title}>
            <TiltCard max={3.5} className="h-full">
              <div className="landing-insight-card flex h-full flex-col rounded-xl border border-[#27272A] bg-[#151517] p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <Sparkles
                    className="size-4 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <span className="rounded-full border border-[#27272A] bg-[#111113] px-2 py-0.5 text-[10px] text-[#71717A]">
                    Sample
                  </span>
                </div>
                <h3 className="font-semibold text-[#F4F4F5]">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#A1A1AA]">
                  &ldquo;{item.insight}&rdquo;
                </p>
                <p className="mt-3 text-xs font-medium text-primary">{item.metric}</p>
                <div className="mt-4 h-12">
                  <LineDraw
                    points={item.trend.map((y, x) => ({ x, y }))}
                    stroke="var(--primary)"
                    strokeWidth={1.5}
                    delay={index * 0.08}
                  />
                </div>
              </div>
            </TiltCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionShell>
  )
}
