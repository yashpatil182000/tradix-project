import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DeleteTradeDialog } from '@/features/trades/components/DeleteTradeDialog'
import { useTrade } from '@/features/trades/hooks/useTrades'
import { formatCurrency, formatDateTime } from '@/features/capital/utils/formatCapital'
import { ROUTES } from '@/routes/paths'

function DetailItem({ label, value, className }) {
  return (
    <div>
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className={className || 'mt-1 text-sm font-medium'}>{value ?? '—'}</p>
    </div>
  )
}

export function TradeDetailsPage() {
  const { tradeId } = useParams()
  const navigate = useNavigate()
  const { data: trade, isLoading, isError, error } = useTrade(tradeId)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="px-4 py-12 text-center text-sm text-muted-foreground">
        Loading trade...
      </div>
    )
  }

  if (isError || !trade) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-destructive">{error?.message || 'Trade not found'}</p>
        <Button className="mt-4" variant="outline" onClick={() => navigate(ROUTES.TRADE_JOURNAL)}>
          Back to journal
        </Button>
      </div>
    )
  }

  const beforeImage = trade.images.find((image) => image.caption === 'before')
  const afterImage = trade.images.find((image) => image.caption === 'after')

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h1 className="text-heading-2">{trade.instrument?.symbol || 'Trade'}</h1>
            <Badge variant={trade.status === 'open' ? 'pending' : trade.status === 'closed' ? 'success' : 'cancelled'}>
              {trade.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(trade.entry_at)} · {trade.direction === 'long' ? 'Buy' : 'Sell'} ·{' '}
            {trade.style || 'Unspecified style'}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline">
            <Link to={`${ROUTES.TRADE_JOURNAL}/${trade.id}/edit`}>Edit</Link>
          </Button>
          <Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Trade details</CardTitle>
            <CardDescription>Execution, risk, and journal notes.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Instrument" value={trade.instrument?.symbol} />
            <DetailItem label="Timeframe" value={trade.timeframe} />
            <DetailItem label="Entry" value={trade.entry_price} />
            <DetailItem label="Stop loss" value={trade.stop_loss} />
            <DetailItem label="Target" value={trade.take_profit} />
            <DetailItem label="Exit price" value={trade.exit_price} />
            <DetailItem label="Position size" value={trade.quantity} />
            <DetailItem label="Fees" value={formatCurrency(trade.fees || 0)} />
            <DetailItem label="Risk amount" value={trade.risk_amount == null ? '—' : formatCurrency(trade.risk_amount)} />
            <DetailItem label="Reward" value={trade.reward_amount == null ? '—' : formatCurrency(trade.reward_amount)} />
            <DetailItem
              label="Risk reward ratio"
              value={trade.risk_reward == null ? '—' : `1 : ${Number(trade.risk_reward).toFixed(2)}`}
            />
            <DetailItem
              label="Profit / Loss"
              value={trade.pnl == null ? '—' : formatCurrency(trade.pnl)}
              className={
                Number(trade.pnl) < 0
                  ? 'mt-1 text-sm font-medium text-status-loss'
                  : 'mt-1 text-sm font-medium text-status-profit'
              }
            />
            <DetailItem
              label="Capital after trade"
              value={trade.capital_after == null ? '—' : formatCurrency(trade.capital_after)}
            />
            <DetailItem label="Entry reason" value={trade.entry_reason} />
            <DetailItem label="Exit reason" value={trade.exit_reason} />
            <DetailItem label="Emotion" value={trade.emotion} />
            <DetailItem
              label="Followed rules"
              value={
                trade.followed_rules === true
                  ? 'Yes'
                  : trade.followed_rules === false
                    ? 'No'
                    : '—'
              }
            />
            <DetailItem
              label="Mistakes"
              value={trade.mistakes?.length ? trade.mistakes.join(', ') : '—'}
            />
            <div className="sm:col-span-2">
              <DetailItem label="Remark" value={trade.lesson_learned} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Screenshots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-caption text-muted-foreground">Before</p>
                {beforeImage?.url ? (
                  <img
                    src={beforeImage.url}
                    alt="Before trade screenshot"
                    className="max-h-64 w-full rounded-card border border-border object-cover"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No before screenshot</p>
                )}
              </div>
              <div>
                <p className="mb-2 text-caption text-muted-foreground">After</p>
                {afterImage?.url ? (
                  <img
                    src={afterImage.url}
                    alt="After trade screenshot"
                    className="max-h-64 w-full rounded-card border border-border object-cover"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No after screenshot</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteTradeDialog
        trade={trade}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => navigate(ROUTES.TRADE_JOURNAL)}
      />
    </div>
  )
}
