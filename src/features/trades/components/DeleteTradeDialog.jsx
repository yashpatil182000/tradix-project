import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/features/capital/utils/formatCapital";
import { useDeleteTrade } from "@/features/trades/hooks/useTrades";

export function DeleteTradeDialog({ trade, open, onOpenChange, onDeleted }) {
  const deleteTrade = useDeleteTrade();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!trade) return null;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteTrade.mutateAsync(trade.id);
      onOpenChange(false);
      onDeleted?.();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete trade</DialogTitle>
          <DialogDescription>
            Delete the {trade.instrument?.symbol || ""} trade from{" "}
            {formatDateTime(trade.entry_at)}? This cannot be undone.
            Closed-trade capital adjustments will also be removed.
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
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
