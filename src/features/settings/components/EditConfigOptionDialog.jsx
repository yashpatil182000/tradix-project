import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ConfigOptionForm } from '@/features/settings/components/ConfigOptionForm'
import { useUpdateConfigOption } from '@/features/settings/hooks/useSettings'

export function EditConfigOptionDialog({
  categoryKey,
  supportsValue,
  item,
  open,
  onOpenChange,
}) {
  const updateOption = useUpdateConfigOption(categoryKey)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!item) {
    return null
  }

  async function handleSubmit(values) {
    setIsSubmitting(true)
    try {
      await updateOption.mutateAsync({ id: item.id, payload: values })
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
          <DialogTitle>Edit item</DialogTitle>
          <DialogDescription>Update {item.label}.</DialogDescription>
        </DialogHeader>
        <ConfigOptionForm
          key={item.id}
          supportsValue={supportsValue}
          initialValues={{
            label: item.label ?? '',
            description: item.description ?? '',
            value: item.value ?? '',
            is_active: item.is_active ?? true,
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
