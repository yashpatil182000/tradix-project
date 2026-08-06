import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EmptyState } from '@/components/shared/PageStates'
import { formatCurrency, formatDateTime } from '@/features/capital/utils/formatCapital'
import { ROUTES } from '@/routes/paths'

const statusVariant = {
  open: 'pending',
  closed: 'success',
  cancelled: 'cancelled',
}

export function TradeList({ trades, onDelete }) {
  if (!trades.length) {
    return (
      <EmptyState
        title="No trades yet"
        description="Create your first journal entry to start tracking performance."
        action={
          <Button asChild>
            <Link to={`${ROUTES.TRADE_JOURNAL}/new`}>Create trade</Link>
          </Button>
        }
      />
    )
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {trades.map((trade) => (
          <Card key={trade.id} size="sm">
            <CardHeader className="gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{trade.instrument?.symbol || 'Unknown'}</CardTitle>
                  <CardDescription>{formatDateTime(trade.entry_at)}</CardDescription>
                </div>
                <Badge variant={statusVariant[trade.status]}>{trade.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-muted-foreground">Side</p>
                  <p>{trade.direction === 'long' ? 'Buy' : 'Sell'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">P/L</p>
                  <p className={Number(trade.pnl) < 0 ? 'text-status-loss' : 'text-status-profit'}>
                    {trade.pnl == null ? '—' : formatCurrency(trade.pnl)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to={`${ROUTES.TRADE_JOURNAL}/${trade.id}`}>View</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to={`${ROUTES.TRADE_JOURNAL}/${trade.id}/edit`}>Edit</Link>
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => onDelete(trade)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-card border border-border md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead data-slot="table-header">
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Instrument</th>
                <th className="px-4 py-3 font-medium">Side</th>
                <th className="px-4 py-3 font-medium">Style</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Entry</th>
                <th className="px-4 py-3 text-right font-medium">P/L</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} data-slot="table-row" className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDateTime(trade.entry_at)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {trade.instrument?.symbol || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {trade.direction === 'long' ? 'Buy' : 'Sell'}
                  </td>
                  <td className="px-4 py-3 capitalize">{trade.style || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[trade.status]}>{trade.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">{trade.entry_price}</td>
                  <td
                    className={
                      Number(trade.pnl) < 0
                        ? 'px-4 py-3 text-right text-status-loss'
                        : 'px-4 py-3 text-right text-status-profit'
                    }
                  >
                    {trade.pnl == null ? '—' : formatCurrency(trade.pnl)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`${ROUTES.TRADE_JOURNAL}/${trade.id}`}>View</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`${ROUTES.TRADE_JOURNAL}/${trade.id}/edit`}>Edit</Link>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(trade)}
                      >
                        Delete
                      </Button>
                    </div>
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
