import { REPORT_TYPES } from '@/features/reports/utils/reportPeriods'
import { cn } from '@/lib/utils'

export function ReportTypeSelector({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {REPORT_TYPES.map((type) => {
        const selected = value === type.id
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={cn(
              'rounded-card border px-4 py-3 text-left transition-colors',
              selected
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-card hover:bg-muted',
            )}
          >
            <p className="text-sm font-medium">{type.label}</p>
            <p className="mt-1 text-caption text-muted-foreground">
              {type.description}
            </p>
          </button>
        )
      })}
    </div>
  )
}
