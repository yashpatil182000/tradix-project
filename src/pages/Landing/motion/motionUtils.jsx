import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export const spring = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

export const easeOut = [0.22, 1, 0.36, 1]

export function useMotionSettings() {
  const reduced = useReducedMotion()
  return {
    reduced,
    duration: reduced ? 0.15 : 0.5,
    stagger: reduced ? 0 : 0.08,
  }
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration,
  y = 16,
  as = motion.div,
  ...props
}) {
  const { reduced, duration: defaultDuration } = useMotionSettings()
  const Comp = as

  return (
    <Comp
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: duration ?? defaultDuration,
        delay,
        ease: easeOut,
      }}
      {...props}
    >
      {children}
    </Comp>
  )
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  y = 24,
  x = 0,
  once = true,
  amount = 0.2,
  ...props
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, amount })
  const { reduced, duration } = useMotionSettings()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y, x }}
      animate={
        inView
          ? { opacity: 1, y: 0, x: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y, x }
      }
      transition={{ duration, delay, ease: easeOut }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  once = true,
  amount = 0.15,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, amount })
  const { reduced } = useMotionSettings()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, y = 20, x = 0 }) {
  const { reduced, duration } = useMotionSettings()

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduced ? { opacity: 0 } : { opacity: 0, y, x },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { type: 'spring', stiffness: 280, damping: 28, duration },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedNumber({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  startOnView = true,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }

    if (!startOnView || !inView) return

    let start = 0
    const startTime = performance.now()
    const ms = duration * 1000

    function tick(now) {
      const progress = Math.min((now - startTime) / ms, 1)
      const eased = 1 - (1 - progress) ** 3
      start = value * eased
      setDisplay(start)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [value, duration, inView, reduced, startOnView])

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString('en-US')

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

export function LineDraw({
  points,
  className,
  stroke = 'var(--primary)',
  strokeWidth = 2,
  viewBox = '0 0 100 60',
  delay = 0,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduced = useReducedMotion()
  const gradientId = useId().replace(/:/g, '')

  const pathD = points
    .map((p, i) => {
      const x = (p.x / (points.length - 1)) * 100
      const y = 60 - (p.y / 60) * 50 - 5
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      className={cn('h-full w-full', className)}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0.6 }}
        animate={
          inView
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0.6 }
        }
        transition={{ duration: reduced ? 0.15 : 1.1, delay, ease: easeOut }}
      />
      <motion.path
        d={`${pathD} L 100 60 L 0 60 Z`}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.15 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: delay + 0.35 }}
      />
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
