import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/features/trades/components/SegmentedControl'

function pad(value) {
  return String(value).padStart(2, '0')
}

function splitValue(value) {
  const [date = '', time = '00:00'] = String(value || '').split('T')
  const [hourToken = '0', minuteToken = '0'] = time.split(':')
  const hour24 = Number(hourToken) || 0
  const minutes = Number(minuteToken) || 0
  const period = hour24 >= 12 ? 'PM' : 'AM'
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12

  return {
    date,
    hour12,
    minutes,
    period,
  }
}

function joinValue({ date, hour12, minutes, period }) {
  const normalizedHour = Math.min(12, Math.max(1, Number(hour12) || 12))
  const normalizedMinutes = Math.min(59, Math.max(0, Number(minutes) || 0))
  let hour24 = normalizedHour % 12
  if (period === 'PM') hour24 += 12

  return `${date}T${pad(hour24)}:${pad(normalizedMinutes)}`
}

export function DateTime12Field({
  id,
  value,
  onChange,
  onKeyDown,
}) {
  const parts = splitValue(value)

  function update(next) {
    const merged = { ...parts, ...next }
    if (!merged.date) return
    onChange(joinValue(merged))
  }

  return (
    <div className="flex h-11 items-center gap-2">
      <Input
        id={id}
        type="date"
        data-focus-name="entry_at"
        className="h-11 min-w-0 flex-1 scroll-mt-28"
        value={parts.date}
        onChange={(event) => update({ date: event.target.value })}
        onKeyDown={onKeyDown}
      />
      <div className="flex h-11 shrink-0 items-center gap-1">
        <Input
          aria-label="Hour"
          inputMode="numeric"
          className="h-9 w-10 px-1 text-center text-sm tabular-nums"
          value={pad(parts.hour12)}
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            const next = event.target.value.replace(/\D/g, '').slice(0, 2)
            update({ hour12: next === '' ? 12 : Number(next) })
          }}
          onKeyDown={onKeyDown}
        />
        <span className="text-xs font-medium text-muted-foreground">:</span>
        <Input
          aria-label="Minutes"
          inputMode="numeric"
          className="h-9 w-10 px-1 text-center text-sm tabular-nums"
          value={pad(parts.minutes)}
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            const next = event.target.value.replace(/\D/g, '').slice(0, 2)
            update({ minutes: next === '' ? 0 : Number(next) })
          }}
          onKeyDown={onKeyDown}
        />
        <SegmentedControl
          size="sm"
          ariaLabel="AM or PM"
          className="w-[72px]"
          value={parts.period}
          onChange={(period) => update({ period })}
          options={[
            { value: 'AM', label: 'AM' },
            { value: 'PM', label: 'PM' },
          ]}
        />
      </div>
    </div>
  )
}
