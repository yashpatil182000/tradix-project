import { cn } from '@/lib/utils'

const SIZE_CLASS = {
  sm: 'text-[1.125rem] leading-none',
  md: 'text-[1.35rem] leading-none',
  lg: 'text-[1.75rem] leading-none',
  xl: 'text-[2.25rem] leading-none',
}

/**
 * Brand wordmark — use for logo placements only (nav, auth, report header).
 */
export function TradixLogo({
  as: Comp = 'span',
  size = 'md',
  compact = false,
  className,
  ...props
}) {
  return (
    <Comp
      className={cn(
        'tradix-logo inline-block select-none text-foreground',
        SIZE_CLASS[size] ?? SIZE_CLASS.md,
        className,
      )}
      {...props}
    >
      {compact ? 'T' : 'Tradix'}
    </Comp>
  )
}
