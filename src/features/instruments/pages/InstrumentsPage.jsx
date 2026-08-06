import { useState } from 'react'
import {
  ListPageSkeleton,
  PageError,
} from '@/components/shared/PageStates'
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
          <h1 className="text-heading-2">Instruments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the markets and symbols you trade.
          </p>
        </div>
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          Create instrument
        </Button>
      </div>

      {isLoading ? <ListPageSkeleton className="px-0 py-0" /> : null}

      {isError ? (
        <PageError
          message={error?.message || 'Failed to load instruments'}
          onRetry={() => refetch()}
        />
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
