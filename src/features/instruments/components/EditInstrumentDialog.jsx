import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { InstrumentForm } from '@/features/instruments/components/InstrumentForm'
import { useUpdateInstrument } from '@/features/instruments/hooks/useInstruments'

export function EditInstrumentDialog({ instrument, open, onOpenChange }) {
  const updateInstrument = useUpdateInstrument()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!instrument) {
    return null
  }

  async function handleSubmit(values) {
    setIsSubmitting(true)

    try {
      await updateInstrument.mutateAsync({
        id: instrument.id,
        payload: values,
      })
      toast.success('Instrument updated')
      onOpenChange(false)
    } catch (error) {
      toast.error(error.message || 'Unable to update instrument')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit instrument</DialogTitle>
          <DialogDescription>
            Update details for {instrument.symbol}.
          </DialogDescription>
        </DialogHeader>
        <InstrumentForm
          key={instrument.id}
          initialValues={{
            symbol: instrument.symbol ?? '',
            name: instrument.name ?? '',
            type: instrument.type ?? 'other',
            exchange: instrument.exchange ?? '',
            is_active: instrument.is_active ?? true,
          }}
          submitLabel="Update"
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
