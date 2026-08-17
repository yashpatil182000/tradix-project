import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ConfigOptionForm } from '@/features/settings/components/ConfigOptionForm'
import { useCreateConfigOption } from '@/features/settings/hooks/useSettings'

export function CreateConfigOptionDialog({
  categoryKey,
  categoryLabel,
  singularLabel,
  supportsValue,
  open,
  onOpenChange,
}) {
  const createOption = useCreateConfigOption(categoryKey)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(values) {
    setIsSubmitting(true)
    try {
      await createOption.mutateAsync(values)
      onOpenChange(false)
    } catch {
      // toast handled in hook
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create {singularLabel || categoryLabel}</DialogTitle>
          <DialogDescription>
            Add your own option. If it matches a catalog item, that item is enabled instead.
          </DialogDescription>
        </DialogHeader>
        <ConfigOptionForm
          supportsValue={supportsValue}
          submitLabel="Create"
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
