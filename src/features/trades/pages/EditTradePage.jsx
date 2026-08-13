import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  FormPageSkeleton,
  PageError,
} from '@/components/shared/PageStates'
import { TradeForm } from '@/features/trades/components/TradeForm'
import { useTrade, useUpdateTrade } from '@/features/trades/hooks/useTrades'
import { useInstruments } from '@/features/instruments/hooks/useInstruments'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { useCapitalSummary } from '@/features/capital/hooks/useCapital'
import { toDateTimeLocalValue } from '@/features/capital/utils/formatCapital'
import { ROUTES } from '@/routes/paths'

export function EditTradePage() {
  const { tradeId } = useParams()
  const navigate = useNavigate()
  const tradeQuery = useTrade(tradeId)
  const updateTrade = useUpdateTrade()
  const instrumentsQuery = useInstruments()
  const settingsQuery = useSettings()
  const capitalQuery = useCapitalSummary()

  const trade = tradeQuery.data
  const instruments = useMemo(() => {
    const list = instrumentsQuery.data || []
    if (
      trade?.instrument &&
      !list.some((item) => item.id === trade.instrument_id)
    ) {
      return [
        ...list,
        {
          ...trade.instrument,
          id: trade.instrument_id,
          is_active: true,
          is_enabled: true,
        },
      ]
    }
    return list
  }, [instrumentsQuery.data, trade])

  const isLoading =
    tradeQuery.isLoading ||
    instrumentsQuery.isLoading ||
    settingsQuery.isLoading ||
    capitalQuery.isLoading

  async function handleSubmit(payload, files) {
    const updated = await updateTrade.mutateAsync({
      id: tradeId,
      payload,
      files,
    })
    navigate(`${ROUTES.TRADE_JOURNAL}/${updated.id}`)
  }

  if (isLoading) return <FormPageSkeleton />

  if (tradeQuery.isError || !trade) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <PageError
          message={tradeQuery.error?.message || 'Trade not found'}
          onRetry={() => tradeQuery.refetch()}
        />
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => navigate(ROUTES.TRADE_JOURNAL)}>
            Back to journal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-heading-2">Edit trade</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Capital updates only when status is Closed.
        </p>
      </div>

      <TradeForm
        initialValues={{
          entry_at: toDateTimeLocalValue(new Date(trade.entry_at)),
          instrument_id: trade.instrument_id,
          status: trade.status,
          direction: trade.direction,
          style: trade.style || 'intraday',
          entry_price: trade.entry_price,
          stop_loss: trade.stop_loss ?? '',
          take_profit: trade.take_profit ?? '',
          exit_price: trade.exit_price ?? '',
          quantity: trade.quantity,
          fees: trade.fees ?? 0,
          entry_reason: trade.entry_reason ?? '',
          emotion: trade.emotion ?? '',
          mistakes: trade.mistakes || [],
          timeframe: trade.timeframe ?? '',
          exit_reason: trade.exit_reason ?? '',
          followed_rules: Boolean(trade.followed_rules),
          lesson_learned: trade.lesson_learned ?? '',
          exit_at: trade.exit_at
            ? toDateTimeLocalValue(new Date(trade.exit_at))
            : '',
          pnl: trade.pnl,
          capital_after: trade.capital_after,
        }}
        instruments={instruments}
        configOptions={settingsQuery.data?.preferences || {}}
        existingImages={trade.images || []}
        currentCapital={capitalQuery.summary.currentCapital}
        submitLabel="Save trade"
        isSubmitting={updateTrade.isPending}
        onCancel={() => navigate(`${ROUTES.TRADE_JOURNAL}/${trade.id}`)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
