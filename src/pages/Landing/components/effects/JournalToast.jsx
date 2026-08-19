import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'

export function JournalToast() {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (reduced) return undefined

    let hideTimer
    const show = () => {
      setVisible(true)
      hideTimer = window.setTimeout(() => setVisible(false), 4200)
    }

    const start = window.setTimeout(show, 3200)
    const loop = window.setInterval(show, 22000)

    return () => {
      window.clearTimeout(start)
      window.clearTimeout(hideTimer)
      window.clearInterval(loop)
    }
  }, [reduced])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-4 z-50 flex max-w-[min(100%-2rem,320px)] items-center gap-3 rounded-xl border border-[#27272A] bg-[#151517]/92 px-3 py-2.5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md md:left-6"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-[#22C55E]/15 text-[#22C55E]">
            <Check className="size-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#F4F4F5]">Journal entry saved</p>
            <p className="truncate text-xs text-[#A1A1AA]">XAUUSD · BUY · sample</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
