import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { CtaRipple, Magnetic } from '@/pages/Landing/motion/interactions'
import { RevealOnScroll } from '@/pages/Landing/motion/motionUtils'
import { ROUTES } from '@/routes/paths'

export function FinalCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.45 })
  const reduced = useReducedMotion()

  return (
    <section ref={ref} className="relative px-4 py-24 md:py-32">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(59,130,246,0.16),transparent)]"
        initial={{ opacity: 0.45 }}
        animate={{ opacity: inView && !reduced ? 1 : 0.45 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <RevealOnScroll className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-[2rem] font-semibold tracking-tight text-[#F4F4F5] sm:text-[2.75rem] md:text-[3.25rem]">
          Stop guessing.
          <br />
          Start reviewing.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#A1A1AA] md:text-lg">
          Build a trading history you can actually learn from.
        </p>
        <div className="mt-8">
          <Magnetic>
            <CtaRipple>
              <Button size="lg" asChild className="landing-cta min-w-[180px]">
                <Link to={ROUTES.REGISTER}>
                  <span className="landing-cta-shimmer" aria-hidden="true" />
                  Start Journaling
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CtaRipple>
          </Magnetic>
        </div>
      </RevealOnScroll>
    </section>
  )
}
