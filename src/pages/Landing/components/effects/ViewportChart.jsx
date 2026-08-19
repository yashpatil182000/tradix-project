import { useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

export function ViewportChart({ className, children }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.28 })
  const reduced = useReducedMotion()

  return (
    <div ref={ref} className={className}>
      {inView ? children({ animate: !reduced }) : null}
    </div>
  )
}
