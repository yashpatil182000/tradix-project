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
import { formatDateTime } from '@/features/capital/utils/formatCapital'
import { ROUTES } from '@/routes/paths'

export function OpenTradesCard({ trades = [] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Open Trades</CardTitle>
          <CardDescription>Positions still active</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link to={`${ROUTES.TRADE_JOURNAL}/new`}>Log trade</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!trades.length ? (
          <p className="rounded-card border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
            No open trades
          </p>
        ) : (
          <div className="space-y-3">
            {trades.map((trade) => (
              <Link
                key={trade.id}
                to={`${ROUTES.TRADE_JOURNAL}/${trade.id}`}
                className="flex items-center justify-between gap-3 rounded-control border border-border px-3 py-3 transition-colors hover:bg-muted"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {trade.instrument?.symbol || 'Unknown'}
                    </p>
                    <Badge variant="pending">open</Badge>
                  </div>
                  <p className="mt-1 text-caption text-muted-foreground">
                    {formatDateTime(trade.entry_at)} ·{' '}
                    {trade.direction === 'long' ? 'Buy' : 'Sell'} ·{' '}
                    {trade.style || '—'}
                  </p>
                </div>
                <p className="text-sm tabular-nums text-muted-foreground">
                  {trade.entry_price}
                </p>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
