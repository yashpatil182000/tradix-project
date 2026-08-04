import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  INSTRUMENT_TYPES,
  instrumentSchema,
} from '@/features/instruments/schemas/instrumentSchemas'

const defaultValues = {
  symbol: '',
  name: '',
  type: 'stock',
  exchange: '',
  is_active: true,
}

export function InstrumentForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isSubmitting = false,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(instrumentSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="symbol">Symbol</Label>
          <Input
            id="symbol"
            placeholder="AAPL"
            aria-invalid={Boolean(errors.symbol)}
            {...register('symbol')}
          />
          {errors.symbol ? (
            <p className="text-sm text-destructive">{errors.symbol.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Apple Inc."
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
          {errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type" className="w-full" aria-invalid={Boolean(errors.type)}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {INSTRUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.type ? (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="exchange">Exchange</Label>
          <Input
            id="exchange"
            placeholder="NASDAQ"
            aria-invalid={Boolean(errors.exchange)}
            {...register('exchange')}
          />
          {errors.exchange ? (
            <p className="text-sm text-destructive">{errors.exchange.message}</p>
          ) : null}
        </div>
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
              Active instrument
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
