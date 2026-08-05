import { cn } from '@/lib/utils'

export function SegmentedControl({
  value,
  onChange,
  options,
  ariaLabel,
  size = 'default',
  className,
}) {
  const compact = size === 'sm'

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'grid rounded-control border border-border bg-muted',
        compact ? 'h-9 gap-0.5 p-0.5' : 'gap-1 p-1',
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const selected = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-[6px] font-medium transition-colors',
              compact
                ? 'h-full min-h-0 px-1.5 text-xs'
                : 'min-h-11 rounded-[8px] px-2 text-sm',
              selected
                ? 'bg-primary text-primary-foreground shadow-card'
                : 'text-muted-foreground hover:bg-hover hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
