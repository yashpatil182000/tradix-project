import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useMemo } from 'react'

const CHART_PATHS = [
  'M0 72 C 80 64, 140 88, 220 70 C 300 52, 360 78, 480 60 C 560 48, 640 74, 800 58',
  'M0 96 C 90 110, 170 80, 260 98 C 350 116, 430 84, 540 102 C 640 118, 720 90, 800 108',
  'M0 48 C 70 40, 150 62, 240 44 C 330 28, 410 56, 520 38 C 620 24, 710 50, 800 34',
]

export function AmbientBackground() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const gridY = useTransform(scrollY, [0, 1800], [0, 90])
  const chartX = useTransform(scrollY, [0, 1600], [0, -70])
  const glowOpacity = useTransform(scrollY, [0, 700], [1, 0.35])
  const chartOpacity = useTransform(scrollY, [0, 900], [0.07, 0])

  const paths = useMemo(() => CHART_PATHS, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0 bg-[#0B0B0C]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="absolute -top-[20%] left-1/2 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.14),transparent_68%)] blur-3xl"
        style={{ opacity: glowOpacity }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0.15 : 0.7, delay: reduced ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="landing-aurora absolute inset-0" />
      <div className="landing-noise absolute inset-0" />

      <motion.div
        className="landing-grid absolute inset-[-10%] opacity-80"
        style={reduced ? undefined : { y: gridY }}
      />

      <motion.svg
        viewBox="0 0 800 140"
        className="absolute top-[18%] left-0 h-[28vh] w-[140vw] max-w-none"
        style={reduced ? { opacity: 0.05 } : { x: chartX, opacity: chartOpacity }}
        preserveAspectRatio="none"
      >
        {paths.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="rgb(244 244 245 / 0.9)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </motion.svg>
    </div>
  )
}
