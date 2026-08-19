import {
  AlertTriangle,
  Camera,
  Gauge,
  Heart,
  Scale,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { TiltCard } from '@/pages/Landing/motion/interactions'
import { StaggerContainer, StaggerItem } from '@/pages/Landing/motion/motionUtils'
import { SectionShell } from './SectionShell'

const FEATURES = [
  {
    title: 'Fast Trade Logging',
    description: 'Log entries in seconds without breaking your flow.',
    icon: Zap,
    span: 'md:col-span-2',
    preview: (
      <div className="mt-4 grid grid-cols-2 gap-2">
        {['XAUUSD', 'Entry', 'Stop', 'Target'].map((label) => (
          <div
            key={label}
            className="rounded-md border border-[#27272A] bg-[#111113] px-3 py-2 text-xs text-[#A1A1AA] transition-colors duration-300 group-hover:border-primary/25"
          >
            {label}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Risk & Reward Tracking',
    description: 'See risk, reward, and R:R on every trade.',
    icon: Scale,
    preview: (
      <div className="mt-4 flex items-center justify-between rounded-md border border-[#27272A] bg-[#111113] px-3 py-2 text-xs">
        <span className="text-[#71717A]">R:R</span>
        <span className="font-medium text-primary transition-transform duration-300 group-hover:scale-[1.04]">
          1:2
        </span>
      </div>
    ),
  },
  {
    title: 'Emotion Tracking',
    description: 'Connect feelings to outcomes over time.',
    icon: Heart,
    preview: (
      <div className="mt-4 flex flex-wrap gap-1.5">
        {['Calm', 'Confident', 'Anxious'].map((e) => (
          <Badge key={e} variant="secondary" className="text-[10px]">
            {e}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    title: 'Mistake Tracking',
    description: 'Tag recurring errors and review them objectively.',
    icon: AlertTriangle,
    preview: (
      <p className="mt-4 rounded-md border border-[#27272A] bg-[#111113] px-3 py-2 text-xs text-[#A1A1AA]">
        Moved stop loss
      </p>
    ),
  },
  {
    title: 'Trade Screenshots',
    description: 'Attach chart context to every journal entry.',
    icon: Camera,
    span: 'md:col-span-2',
    preview: (
      <div className="mt-4 flex h-16 items-center justify-center rounded-md border border-dashed border-[#27272A] bg-[#111113] text-xs text-[#71717A]">
        Chart screenshot
      </div>
    ),
  },
  {
    title: 'Capital Tracking',
    description: 'Monitor balance changes alongside your journal.',
    icon: Gauge,
    preview: (
      <p className="mt-4 text-lg font-semibold tabular-nums text-[#F4F4F5] transition-colors duration-300 group-hover:text-primary">
        $24,850
      </p>
    ),
  },
]

export function FeatureShowcase() {
  return (
    <SectionShell
      id="features"
      badge="Features"
      title="Everything you need to journal with purpose"
      description="Built for traders who want structure without slowing down."
    >
      <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <StaggerItem key={feature.title} className={cn(feature.span)}>
              <TiltCard max={3.5} className="h-full">
                <div className="landing-feature-card flex h-full flex-col rounded-xl border border-[#27272A] bg-[#151517] p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg border border-[#27272A] bg-[#111113] p-2 text-[#A1A1AA] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-[#F4F4F5]">{feature.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#A1A1AA]">{feature.description}</p>
                  {feature.preview}
                </div>
              </TiltCard>
            </StaggerItem>
          )
        })}
      </StaggerContainer>
    </SectionShell>
  )
}
