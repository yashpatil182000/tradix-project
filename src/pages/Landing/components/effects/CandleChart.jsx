import { motion, useInView, useReducedMotion } from 'motion/react'
import { useId, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'

const HEIGHTS = [28, 42, 22, 48, 34, 56, 26, 40, 36, 52, 30, 46, 24, 50, 38, 44, 32]

export function CandleChart({ className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduced = useReducedMotion()
  const uid = useId()

  const candles = useMemo(
    () =>
      HEIGHTS.map((height, index) => ({
        height,
        up: index % 3 !== 1,
        delay: 0.9 + index * 0.03,
      })),
    [],
  )

  return (
    <div ref={ref} className={cn('flex h-full items-end justify-between gap-[3px] px-1', className)}>
      {candles.map((candle, index) => (
        <motion.span
          key={`${uid}-${index}`}
          className="w-[5px] rounded-[1px]"
          style={{
            backgroundColor: candle.up ? 'rgb(34 197 94 / 0.55)' : 'rgb(239 68 68 / 0.5)',
          }}
          initial={{ height: reduced ? `${candle.height}%` : '8%', opacity: 0.35 }}
          animate={
            inView
              ? { height: `${candle.height}%`, opacity: 0.7 }
              : { height: reduced ? `${candle.height}%` : '8%', opacity: 0.35 }
          }
          transition={{
            duration: reduced ? 0.15 : 0.7,
            delay: reduced ? 0 : candle.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  )
}
