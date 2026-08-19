import { useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

export function GlassSweep({ className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduced = useReducedMotion()

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'landing-glass-sweep absolute inset-0 z-10',
        inView && !reduced && 'is-active',
        className,
      )}
    />
  )
}
