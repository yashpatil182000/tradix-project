import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteConfigOption } from '@/features/settings/hooks/useSettings'

export function DeleteConfigOptionDialog({
  categoryKey,
  item,
  open,
  onOpenChange,
}) {
  const deleteOption = useDeleteConfigOption(categoryKey)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!item) {
    return null
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deleteOption.mutateAsync(item.id)
      onOpenChange(false)
    } catch {
      // toast handled in hook
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete item</DialogTitle>
          <DialogDescription>
            Delete <span className="font-medium text-foreground">{item.label}</span>?
            This cannot be undone.
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
