import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreateInstrumentDialog } from '@/features/instruments/components/CreateInstrumentDialog'
import { DeleteInstrumentDialog } from '@/features/instruments/components/DeleteInstrumentDialog'
import { EditInstrumentDialog } from '@/features/instruments/components/EditInstrumentDialog'
import { InstrumentList } from '@/features/instruments/components/InstrumentList'
import { useInstruments } from '@/features/instruments/hooks/useInstruments'
import {
  ConfigPagination,
  ConfigToolbar,
} from '@/features/settings/components/ConfigToolbar'
import { CONFIG_PAGE_SIZE } from '@/features/settings/constants/configCategories'

export function SettingsInstrumentsPage() {
  const { data: instruments = [], isLoading, isError, error, refetch } =
    useInstruments()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingInstrument, setEditingInstrument] = useState(null)
  const [deletingInstrument, setDeletingInstrument] = useState(null)

  const filteredInstruments = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return instruments

    return instruments.filter((instrument) => {
      const haystack = [
        instrument.symbol,
        instrument.name,
        instrument.type,
        instrument.exchange,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [instruments, search])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInstruments.length / CONFIG_PAGE_SIZE),
  )
  const currentPage = Math.min(page, totalPages)
  const paginatedInstruments = filteredInstruments.slice(
    (currentPage - 1) * CONFIG_PAGE_SIZE,
    currentPage * CONFIG_PAGE_SIZE,
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-2">Instruments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the markets and symbols you trade.
        </p>
      </div>

      <ConfigToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        onCreate={() => setIsCreateOpen(true)}
        createLabel="Create instrument"
      />

      {isLoading ? (
        <div className="rounded-card border border-border px-4 py-12 text-center text-sm text-muted-foreground">
          Loading instruments...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-card border border-destructive/30 px-4 py-8 text-center">
          <p className="text-sm text-destructive">
            {error?.message || 'Failed to load instruments'}
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
        <>
          <InstrumentList
            instruments={paginatedInstruments}
            onEdit={setEditingInstrument}
            onDelete={setDeletingInstrument}
          />
          <ConfigPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : null}

      <CreateInstrumentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditInstrumentDialog
        instrument={editingInstrument}
        open={Boolean(editingInstrument)}
        onOpenChange={(open) => {
          if (!open) setEditingInstrument(null)
        }}
      />

      <DeleteInstrumentDialog
        instrument={deletingInstrument}
        open={Boolean(deletingInstrument)}
        onOpenChange={(open) => {
          if (!open) setDeletingInstrument(null)
        }}
      />
    </div>
  )
}
