import { cn } from '@/lib/utils'
import { RevealOnScroll } from '@/pages/Landing/motion/motionUtils'

export function SectionShell({
  id,
  children,
  className,
  containerClassName,
  badge,
  title,
  description,
  align = 'center',
}) {
  const isCenter = align === 'center'

  return (
    <section id={id} className={cn('relative scroll-mt-20 px-4 py-20 md:py-28', className)}>
      <div className={cn('mx-auto w-full max-w-6xl', containerClassName)}>
        {(badge || title || description) && (
          <RevealOnScroll className={cn('mb-12 md:mb-16', isCenter && 'text-center')}>
            {badge ? (
              <p
                className={cn(
                  'mb-4 text-xs font-medium tracking-[0.2em] text-[#71717A] uppercase',
                  isCenter && 'mx-auto',
                )}
              >
                {badge}
              </p>
            ) : null}
            {title ? (
              <h2
                className={cn(
                  'text-balance font-semibold tracking-tight text-[#F4F4F5]',
                  'text-[2rem] leading-[1.1] sm:text-[2.5rem] md:text-[3rem]',
                )}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                className={cn(
                  'mt-4 max-w-2xl text-base leading-relaxed text-[#A1A1AA] md:text-lg',
                  isCenter && 'mx-auto',
                )}
              >
                {description}
              </p>
            ) : null}
          </RevealOnScroll>
        )}
        {children}
      </div>
    </section>
  )
}
