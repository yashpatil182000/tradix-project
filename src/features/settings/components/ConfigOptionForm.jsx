import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { configOptionSchema } from '@/features/settings/schemas/configOptionSchemas'

const defaults = {
  label: '',
  description: '',
  value: '',
  is_active: true,
}

export function ConfigOptionForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isSubmitting = false,
  supportsValue = false,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(configOptionSchema),
    defaultValues: {
      ...defaults,
      ...initialValues,
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          placeholder="Breakout"
          aria-invalid={Boolean(errors.label)}
          {...register('label')}
        />
        {errors.label ? (
          <p className="text-sm text-destructive">{errors.label.message}</p>
        ) : null}
      </div>

      {supportsValue ? (
        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            placeholder="1%"
            aria-invalid={Boolean(errors.value)}
            {...register('value')}
          />
          {errors.value ? (
            <p className="text-sm text-destructive">{errors.value.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Optional notes"
          aria-invalid={Boolean(errors.description)}
          {...register('description')}
        />
        {errors.description ? (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <Controller
        name="is_active"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_active"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(Boolean(checked))}
            />
            <Label htmlFor="is_active" className="font-normal">
              Active
            </Label>
          </div>
        )}
      />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
