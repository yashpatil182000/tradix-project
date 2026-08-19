import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { spring } from '@/pages/Landing/motion/motionUtils'

export function useFinePointer() {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return fine
}

export function Magnetic({ children, className, strength = 0.28 }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const enabled = !reduced && fine
  const x = useSpring(0, { stiffness: 260, damping: 22, mass: 0.18 })
  const y = useSpring(0, { stiffness: 260, damping: 22, mass: 0.18 })

  function onMove(event) {
    if (!enabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    x.set(dx * strength)
    y.set(dy * strength)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn('inline-flex', className)}
      style={enabled ? { x, y } : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}

export function TiltCard({
  children,
  className,
  max = 4,
  glare = true,
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const enabled = !reduced && fine
  const rotateX = useSpring(0, { stiffness: 180, damping: 22, mass: 0.2 })
  const rotateY = useSpring(0, { stiffness: 180, damping: 22, mass: 0.2 })
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.14), transparent 55%)`

  function onMove(event) {
    if (!enabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * (max * 2))
    rotateX.set((0.5 - py) * (max * 2))
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  function onLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn('group relative [transform-style:preserve-3d]', className)}
      style={
        enabled
          ? {
              rotateX,
              rotateY,
              transformPerspective: 1100,
            }
          : undefined
      }
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
      {glare && enabled ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBg }}
        />
      ) : null}
    </motion.div>
  )
}

export function CtaRipple({ children, className }) {
  const [ripples, setRipples] = useState([])
  const reduced = useReducedMotion()

  function onPointerDown(event) {
    if (reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 1.6
    const id = event.timeStamp
    setRipples((current) => [
      ...current,
      {
        id,
        size,
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
      },
    ])
    window.setTimeout(() => {
      setRipples((current) => current.filter((ripple) => ripple.id !== id))
    }, 650)
  }

  return (
    <span className={cn('relative inline-flex', className)} onPointerDown={onPointerDown}>
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="landing-ripple"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </span>
  )
}

export function LoopingNumber({
  from,
  to,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 2.2,
  hold = 11,
  className,
  active = true,
}) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(from)

  useEffect(() => {
    if (reduced || !active) {
      setDisplay(to)
      return undefined
    }

    let frame = 0
    let cancelled = false
    let direction = 1
    let holdTimer

    function animate(startValue, endValue, onDone) {
      const started = performance.now()
      const ms = duration * 1000

      function tick(now) {
        if (cancelled) return
        const progress = Math.min((now - started) / ms, 1)
        const eased = 1 - (1 - progress) ** 3
        setDisplay(startValue + (endValue - startValue) * eased)
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        } else {
          onDone()
        }
      }

      frame = requestAnimationFrame(tick)
    }

    function cycle() {
      if (cancelled) return
      const startValue = direction === 1 ? from : to
      const endValue = direction === 1 ? to : from
      animate(startValue, endValue, () => {
        holdTimer = window.setTimeout(() => {
          direction *= -1
          cycle()
        }, hold * 1000)
      })
    }

    cycle()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.clearTimeout(holdTimer)
    }
  }, [from, to, duration, hold, reduced, active])

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString('en-US')

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

export function DepthLayer({ children, className, z = 0, rotateY = 0, rotateX = 0 }) {
  return (
    <motion.div
      className={cn('[transform-style:preserve-3d]', className)}
      style={{
        transform: `translateZ(${z}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
      }}
      transition={spring}
    >
      {children}
    </motion.div>
  )
}
