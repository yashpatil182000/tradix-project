import { cn } from '@/lib/utils'

export function SkipLink({ href = '#main-content' }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-card"
    >
      Skip to main content
    </a>
  )
}

export function PageSkeleton({ className }) {
  return (
    <div
      className={cn('mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6', className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading</span>
      <div className="space-y-3">
        <div className="h-8 w-48 animate-pulse rounded-control bg-muted" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded-control bg-muted" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-card border border-border bg-muted/60"
          />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-64 animate-pulse rounded-card border border-border bg-muted/60" />
        <div className="h-64 animate-pulse rounded-card border border-border bg-muted/60" />
      </div>
    </div>
  )
}

export function FormPageSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6 sm:px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading form</span>
      <div className="h-8 w-40 animate-pulse rounded-control bg-muted" />
      <div className="h-4 w-64 animate-pulse rounded-control bg-muted" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-48 animate-pulse rounded-card border border-border bg-muted/60"
        />
      ))}
    </div>
  )
}

export function ListPageSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-44 animate-pulse rounded-control bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-control bg-muted" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-control bg-muted" />
      </div>
      <div className="h-10 w-full animate-pulse rounded-control bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-card border border-border bg-muted/60"
          />
        ))}
      </div>
    </div>
  )
}

export function PageError({ message, onRetry, className }) {
  return (
    <div
      className={cn(
        'rounded-card border border-destructive/30 bg-card px-4 py-12 text-center shadow-card',
        className,
      )}
      role="alert"
    >
      <p className="text-sm text-destructive">
        {message || 'Something went wrong'}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-9 items-center justify-center rounded-control border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}

export function EmptyState({ title, description, action, className }) {
  return (
    <div
      className={cn(
        'rounded-card border border-dashed border-border px-4 py-12 text-center',
        className,
      )}
    >
      <p className="text-sm font-medium">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
