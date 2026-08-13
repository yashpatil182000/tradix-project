import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCapitalEntry } from "@/features/capital/hooks/useCapital";
import { capitalTransactionSchema } from "@/features/capital/schemas/capitalSchemas";
import { toDateTimeLocalValue } from "@/features/capital/utils/formatCapital";

export function AddCapitalTransactionDialog({
  open,
  onOpenChange,
  defaultType = "deposit",
  hasStartingCapital = false,
}) {
  const createEntry = useCreateCapitalEntry();
  const resolvedDefaultType =
    defaultType === "starting" && hasStartingCapital ? "deposit" : defaultType;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(capitalTransactionSchema),
    defaultValues: {
      entry_type: resolvedDefaultType,
      amount: "",
      recorded_at: toDateTimeLocalValue(),
      note: "",
      direction: "in",
      currency: "USD",
    },
  });

  const entryType = watch("entry_type");

  useEffect(() => {
    if (!open) return;

    reset({
      entry_type: resolvedDefaultType,
      amount: "",
      recorded_at: toDateTimeLocalValue(),
      note: "",
      direction: resolvedDefaultType === "withdrawal" ? "out" : "in",
      currency: "USD",
    });
  }, [open, reset, resolvedDefaultType]);

  async function onSubmit(values) {
    await createEntry.mutateAsync({
      entry_type: values.entry_type,
      amount: values.amount,
      recorded_at: new Date(values.recorded_at).toISOString(),
      note: values.note,
      direction:
        values.entry_type === "withdrawal"
          ? "out"
          : values.entry_type === "adjustment"
            ? values.direction
            : "in",
      currency: values.currency,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {resolvedDefaultType === "starting"
              ? "Set initial capital"
              : "Add transaction"}
          </DialogTitle>
          <DialogDescription>
            Manual capital changes only. Trades will not update this balance
            yet.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="entry_type">Type</Label>
            <Controller
              name="entry_type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="entry_type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {!hasStartingCapital ? (
                      <SelectItem value="starting">Initial capital</SelectItem>
                    ) : null}
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.entry_type ? (
              <p className="text-sm text-destructive">
                {errors.entry_type.message}
              </p>
            ) : null}
          </div>

          {entryType === "adjustment" ? (
            <div className="space-y-2">
              <Label htmlFor="direction">Adjustment direction</Label>
              <Controller
                name="direction"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="direction" className="w-full">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Increase capital</SelectItem>
                      <SelectItem value="out">Decrease capital</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="1000.00"
                aria-invalid={Boolean(errors.amount)}
                {...register("amount")}
              />
              {errors.amount ? (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recorded_at">Date</Label>
              <Input
                id="recorded_at"
                type="datetime-local"
                aria-invalid={Boolean(errors.recorded_at)}
                {...register("recorded_at")}
              />
              {errors.recorded_at ? (
                <p className="text-sm text-destructive">
                  {errors.recorded_at.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Optional details"
              aria-invalid={Boolean(errors.note)}
              {...register("note")}
            />
            {errors.note ? (
              <p className="text-sm text-destructive">{errors.note.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
