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
import { useCreateInstrument } from '@/features/instruments/hooks/useInstruments'

export function CreateInstrumentDialog({ open, onOpenChange }) {
  const createInstrument = useCreateInstrument()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(values) {
    setIsSubmitting(true)

    try {
      await createInstrument.mutateAsync(values)
      toast.success('Instrument created')
      onOpenChange(false)
    } catch (error) {
      toast.error(error.message || 'Unable to create instrument')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create instrument</DialogTitle>
          <DialogDescription>
            Add a market symbol you want to track in your journal.
          </DialogDescription>
        </DialogHeader>
        <InstrumentForm
          submitLabel="Create"
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
