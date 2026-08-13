import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ENTRY_TYPE_LABELS,
  formatCurrency,
  formatDateTime,
} from '@/features/capital/utils/formatCapital'

function TypeBadge({ entry }) {
  const variantMap = {
    starting: 'info',
    deposit: 'success',
    withdrawal: 'loss',
    adjustment: 'warning',
  }

  return (
    <Badge variant={variantMap[entry.entry_type] || 'secondary'}>
      {ENTRY_TYPE_LABELS[entry.entry_type]}
    </Badge>
  )
}

export function CapitalTransactionTable({ entries, currency = 'USD' }) {
  if (!entries.length) {
    return (
      <div className="rounded-card border border-dashed border-border px-4 py-12 text-center">
        <p className="text-sm font-medium">No capital history yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a transaction to start tracking your capital.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {entries.map((entry) => (
          <Card key={entry.id} size="sm">
            <CardHeader className="gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">
                    {ENTRY_TYPE_LABELS[entry.entry_type]}
                  </CardTitle>
                  <CardDescription>{formatDateTime(entry.recorded_at)}</CardDescription>
                </div>
                <TypeBadge entry={entry} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span
                  className={
                    entry.signed_amount < 0
                      ? 'font-medium text-status-loss'
                      : 'font-medium text-status-profit'
                  }
                >
                  {entry.signed_amount < 0 ? '−' : '+'}
                  {formatCurrency(Math.abs(entry.signed_amount), currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Balance</span>
                <span className="font-medium">
                  {formatCurrency(entry.running_balance, currency)}
                </span>
              </div>
              <p className="text-muted-foreground">
                {entry.display_note || 'No note'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-card border border-border md:block">
        <div className="max-h-[560px] overflow-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead data-slot="table-header">
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Note</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  data-slot="table-row"
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDateTime(entry.recorded_at)}
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge entry={entry} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {entry.display_note || '—'}
                  </td>
                  <td
                    className={
                      entry.signed_amount < 0
                        ? 'px-4 py-3 text-right font-medium text-status-loss'
                        : 'px-4 py-3 text-right font-medium text-status-profit'
                    }
                  >
                    {entry.signed_amount < 0 ? '−' : '+'}
                    {formatCurrency(Math.abs(entry.signed_amount), currency)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(entry.running_balance, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
