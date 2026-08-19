import { Check, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SAMPLE_TRADE } from '@/pages/Landing/data/mockData'
import { RevealOnScroll, StaggerContainer, StaggerItem } from '@/pages/Landing/motion/motionUtils'
import { SectionShell } from './SectionShell'

const JOURNAL_FIELDS = [
  { label: 'Instrument', value: SAMPLE_TRADE.instrument },
  { label: 'Direction', value: SAMPLE_TRADE.direction, badge: true },
  { label: 'Entry', value: SAMPLE_TRADE.entry.toFixed(2) },
  { label: 'Stop Loss', value: SAMPLE_TRADE.stopLoss.toFixed(2) },
  { label: 'Target', value: SAMPLE_TRADE.target.toFixed(2) },
  { label: 'Exit', value: SAMPLE_TRADE.exit.toFixed(2) },
  { label: 'Position Size', value: SAMPLE_TRADE.positionSize },
  { label: 'Risk', value: `$${SAMPLE_TRADE.risk}` },
  { label: 'Reward', value: `$${SAMPLE_TRADE.reward}` },
  { label: 'R:R', value: SAMPLE_TRADE.rr, highlight: true },
  { label: 'Emotion', value: SAMPLE_TRADE.emotion },
  { label: 'Entry Reason', value: SAMPLE_TRADE.entryReason, span: 2 },
  { label: 'Mistakes', value: SAMPLE_TRADE.mistakes },
  { label: 'Followed Rules', value: SAMPLE_TRADE.followedRules ? 'Yes' : 'No' },
  { label: 'Lesson', value: SAMPLE_TRADE.lesson, span: 2 },
]

export function JournalPreview() {
  return (
    <SectionShell
      badge="Trade journal"
      title="Log a trade in seconds"
      description="Capture the important information without slowing down the trader."
    >
      <div className="grid items-start gap-8 lg:grid-cols-5">
        <RevealOnScroll className="lg:col-span-2">
          <div className="sticky top-24 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#151517] px-3 py-1.5 text-xs text-[#A1A1AA]">
              <Clock className="size-3.5" aria-hidden="true" />
              Average log time: under 30 seconds
            </div>
            <p className="text-base leading-relaxed text-[#A1A1AA]">
              Tradix captures trade mechanics, psychology, and context in one structured
              entry — so your journal stays complete even on busy trading days.
            </p>
            <ul className="space-y-2 text-sm text-[#A1A1AA]">
              {['Structured fields', 'Screenshot attachments', 'Post-trade lessons'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0 text-[#22C55E]" aria-hidden="true" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="lg:col-span-3" delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-[#27272A] bg-[#151517] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.16)]">
            <div className="flex items-center justify-between border-b border-[#27272A] px-4 py-3">
              <p className="text-sm font-medium text-[#F4F4F5]">New trade entry</p>
              <span className="text-xs text-[#71717A]">Sample interface</span>
            </div>

            <StaggerContainer className="grid gap-px bg-[#27272A] p-px sm:grid-cols-2" stagger={0.04}>
              {JOURNAL_FIELDS.map((field) => (
                <StaggerItem
                  key={field.label}
                  className={field.span === 2 ? 'sm:col-span-2' : undefined}
                >
                  <div className="h-full bg-[#111113] px-4 py-3">
                    <p className="text-[10px] tracking-wide text-[#71717A] uppercase">
                      {field.label}
                    </p>
                    {field.badge ? (
                      <Badge variant="profit" className="mt-1 text-[10px]">
                        {field.value}
                      </Badge>
                    ) : (
                      <p
                        className={
                          field.highlight
                            ? 'mt-1 text-sm font-medium text-primary'
                            : 'mt-1 text-sm text-[#F4F4F5]'
                        }
                      >
                        {field.value}
                      </p>
                    )}
                  </div>
                </StaggerItem>
              ))}

              <StaggerItem className="sm:col-span-2">
                <div className="flex h-20 items-center justify-center bg-[#111113] text-xs text-[#71717A]">
                  Screenshot attachment
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </RevealOnScroll>
      </div>
    </SectionShell>
  )
}
