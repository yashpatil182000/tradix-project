import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AddCapitalTransactionDialog } from '@/features/capital/components/AddCapitalTransactionDialog'
import { CapitalFilters } from '@/features/capital/components/CapitalFilters'
import { CapitalSummaryCards } from '@/features/capital/components/CapitalSummaryCards'
import { CapitalTransactionTable } from '@/features/capital/components/CapitalTransactionTable'
import { useCapitalSummary } from '@/features/capital/hooks/useCapital'
import { ConfigPagination } from '@/features/settings/components/ConfigToolbar'

const PAGE_SIZE = 10

export function CapitalPage() {
  const { data: entries = [], summary, isLoading, isError, error, refetch } =
    useCapitalSummary()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [direction, setDirection] = useState('all')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState('deposit')

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase()

    return [...entries]
      .reverse()
      .filter((entry) => {
        if (type !== 'all' && entry.entry_type !== type) return false
        if (direction !== 'all' && entry.direction !== direction) return false
        if (!query) return true

        const haystack = [entry.display_note, entry.entry_type, entry.amount]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(query)
      })
  }, [direction, entries, search, type])

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function openDialog(nextType) {
    setDialogType(nextType)
    setDialogOpen(true)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-heading-2">Capital</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track initial capital, deposits, withdrawals, and manual adjustments.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {!summary.hasStartingCapital ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => openDialog('starting')}
            >
              Set initial capital
            </Button>
          ) : null}
          <Button type="button" onClick={() => openDialog('deposit')}>
            Add transaction
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-card border border-border px-4 py-12 text-center text-sm text-muted-foreground">
          Loading capital history...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-card border border-destructive/30 px-4 py-8 text-center">
          <p className="text-sm text-destructive">
            {error?.message || 'Failed to load capital history'}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => refetch()}
          >
            Try again
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="space-y-6">
          <CapitalSummaryCards summary={summary} />

          <div className="rounded-card border border-border bg-card p-4 shadow-card sm:p-5">
            <div className="mb-4">
              <h2 className="text-heading-4">Capital history</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Every manual transaction is logged with a running balance.
              </p>
            </div>

            <CapitalFilters
              search={search}
              onSearchChange={(value) => {
                setSearch(value)
                setPage(1)
              }}
              type={type}
              onTypeChange={(value) => {
                setType(value)
                setPage(1)
              }}
              direction={direction}
              onDirectionChange={(value) => {
                setDirection(value)
                setPage(1)
              }}
            />

            <div className="mt-4">
              <CapitalTransactionTable entries={paginatedEntries} />
              <ConfigPagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      ) : null}

      <AddCapitalTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultType={dialogType}
        hasStartingCapital={summary.hasStartingCapital}
      />
    </div>
  )
}
