import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect } from 'react'
import { useFinePointer } from '@/pages/Landing/motion/interactions'

export function MouseSpotlight() {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 80, damping: 22, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 80, damping: 22, mass: 0.4 })

  useEffect(() => {
    if (reduced || !fine) return undefined

    function onMove(event) {
      x.set(event.clientX)
      y.set(event.clientY)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [fine, reduced, x, y])

  if (reduced || !fine) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[1] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.09),transparent_68%)] mix-blend-screen"
      style={{ x: sx, y: sy }}
    />
  )
}
