import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

function roundToStep(value, step) {
  const decimals = String(step).split('.')[1]?.length || 0
  const rounded = Math.round(value / step) * step
  return Number(rounded.toFixed(decimals))
}

export function LotSelector({
  id = 'quantity',
  value,
  onChange,
  step = 0.01,
  min = 0.01,
  max = 100,
  error,
  onConfigChange,
  onKeyDown,
  className,
}) {
  const numericValue = Number(value) || 0

  function commit(next) {
    const clamped = Math.min(max, Math.max(min, roundToStep(next, step)))
    onChange(clamped)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>Position size</Label>
        <div className="flex items-center gap-1" role="group" aria-label="Lot step presets">
          {[0.01, 0.1, 1].map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={Number(step) === item}
              aria-label={`Set lot step to ${item}`}
              onClick={() => onConfigChange?.({ step: item })}
              className={cn(
                'h-8 rounded-control px-2 text-caption font-medium',
                Number(step) === item
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 shrink-0"
          aria-label="Decrease lot"
          onClick={() => commit(numericValue - Number(step))}
        >
          <Minus className="size-4" />
        </Button>
        <Input
          id={id}
          inputMode="decimal"
          type="number"
          step={step}
          min={min}
          max={max}
          enterKeyHint="next"
          data-focus-name="quantity"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-11 scroll-mt-28 text-center text-base tabular-nums md:text-sm"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (value === '' || value == null) return
            commit(Number(value))
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 shrink-0"
          aria-label="Increase lot"
          onClick={() => commit((numericValue || 0) + Number(step))}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <label className="space-y-1">
          <span className="text-caption text-muted-foreground">Step</span>
          <Input
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            className="h-9"
            aria-label="Lot step size"
            value={step}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (Number.isFinite(next) && next > 0) onConfigChange?.({ step: next })
            }}
          />
        </label>
        <label className="space-y-1">
          <span className="text-caption text-muted-foreground">Min</span>
          <Input
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            className="h-9"
            aria-label="Minimum lot"
            value={min}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (Number.isFinite(next) && next > 0) onConfigChange?.({ min: next })
            }}
          />
        </label>
        <label className="space-y-1">
          <span className="text-caption text-muted-foreground">Max</span>
          <Input
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            className="h-9"
            aria-label="Maximum lot"
            value={max}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (Number.isFinite(next) && next > 0) onConfigChange?.({ max: next })
            }}
          />
        </label>
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
