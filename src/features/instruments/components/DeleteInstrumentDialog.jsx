import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteInstrument } from '@/features/instruments/hooks/useInstruments'

export function DeleteInstrumentDialog({ instrument, open, onOpenChange }) {
  const deleteInstrument = useDeleteInstrument()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!instrument) {
    return null
  }

  async function handleDelete() {
    setIsDeleting(true)

    try {
      await deleteInstrument.mutateAsync(instrument.id)
      toast.success('Instrument deleted')
      onOpenChange(false)
    } catch (error) {
      toast.error(error.message || 'Unable to delete instrument')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete instrument</DialogTitle>
          <DialogDescription>
            Delete <span className="font-medium text-foreground">{instrument.symbol}</span>?
            This cannot be undone. Instruments used by existing trades cannot be
            deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
