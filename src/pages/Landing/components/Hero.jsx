import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { CtaRipple, Magnetic } from '@/pages/Landing/motion/interactions'
import { FadeIn } from '@/pages/Landing/motion/motionUtils'
import { ROUTES } from '@/routes/paths'
import { HeroDashboard } from './HeroDashboard'

const HEADLINE_LINES = ['Turn every trade', 'into a lesson.']

function scrollToHowItWorks() {
  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section className="relative overflow-hidden px-4 pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left">
          <FadeIn delay={0.28} y={10}>
            <p className="mb-6 inline-flex items-center rounded-full border border-[#27272A] bg-[#111113] px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-[#A1A1AA] uppercase">
              The trading journal built for discipline
            </p>
          </FadeIn>

          <h1 className="text-balance">
            {HEADLINE_LINES.map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[#F4F4F5] sm:text-[3rem] md:text-[3.75rem] lg:text-[4.25rem]"
                  initial={reduced ? { opacity: 0 } : { y: '110%', opacity: 0.2 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: reduced ? 0.15 : 0.62,
                    delay: reduced ? 0 : 0.4 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <FadeIn delay={0.62} y={14}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#A1A1AA] md:text-lg lg:mx-0">
              Tradix helps traders capture the decisions, risk, emotions and outcomes
              behind every trade — then turn that history into actionable insight.
            </p>
          </FadeIn>

          <FadeIn delay={0.74} y={10}>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Magnetic>
                <CtaRipple>
                  <Button size="lg" asChild className="landing-cta min-w-[160px]">
                    <Link to={ROUTES.REGISTER}>
                      <span className="landing-cta-shimmer" aria-hidden="true" />
                      Start Journaling
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CtaRipple>
              </Magnetic>
              <Button
                size="lg"
                variant="ghost"
                className="min-w-[160px] text-[#A1A1AA] hover:text-[#F4F4F5]"
                onClick={scrollToHowItWorks}
              >
                See how it works
                <ChevronDown className="size-4" />
              </Button>
            </div>
          </FadeIn>
        </div>

        <HeroDashboard />
      </div>
    </section>
  )
}
