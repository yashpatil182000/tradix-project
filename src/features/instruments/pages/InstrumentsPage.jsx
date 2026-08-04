import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreateInstrumentDialog } from '@/features/instruments/components/CreateInstrumentDialog'
import { DeleteInstrumentDialog } from '@/features/instruments/components/DeleteInstrumentDialog'
import { EditInstrumentDialog } from '@/features/instruments/components/EditInstrumentDialog'
import { InstrumentList } from '@/features/instruments/components/InstrumentList'
import { useInstruments } from '@/features/instruments/hooks/useInstruments'

export function InstrumentsPage() {
  const { data: instruments = [], isLoading, isError, error, refetch } =
    useInstruments()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingInstrument, setEditingInstrument] = useState(null)
  const [deletingInstrument, setDeletingInstrument] = useState(null)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Instruments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the markets and symbols you trade.
          </p>
        </div>
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          Create instrument
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border px-4 py-12 text-center text-sm text-muted-foreground">
          Loading instruments...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-destructive/30 px-4 py-8 text-center">
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
        <InstrumentList
          instruments={instruments}
          onEdit={setEditingInstrument}
          onDelete={setDeletingInstrument}
        />
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
