import { useNavigate } from 'react-router-dom'
import {
  FormPageSkeleton,
  PageError,
} from '@/components/shared/PageStates'
import { TradeForm } from '@/features/trades/components/TradeForm'
import { useCreateTrade } from '@/features/trades/hooks/useTrades'
import { useInstruments } from '@/features/instruments/hooks/useInstruments'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { useCapitalSummary } from '@/features/capital/hooks/useCapital'
import { ROUTES } from '@/routes/paths'

export function CreateTradePage() {
  const navigate = useNavigate()
  const createTrade = useCreateTrade()
  const instrumentsQuery = useInstruments()
  const settingsQuery = useSettings()
  const capitalQuery = useCapitalSummary()

  const isLoading =
    instrumentsQuery.isLoading ||
    settingsQuery.isLoading ||
    capitalQuery.isLoading
  const isError =
    instrumentsQuery.isError || settingsQuery.isError || capitalQuery.isError

  async function handleSubmit(payload, files) {
    const trade = await createTrade.mutateAsync({ payload, files })
    navigate(`${ROUTES.TRADE_JOURNAL}/${trade.id}`)
  }

  if (isLoading) return <FormPageSkeleton />

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <PageError
          message={
            instrumentsQuery.error?.message ||
            settingsQuery.error?.message ||
            capitalQuery.error?.message ||
            'Unable to load trade form'
          }
          onRetry={() => {
            instrumentsQuery.refetch()
            settingsQuery.refetch()
            capitalQuery.refetch()
          }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-heading-2">Create trade</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log a trade in seconds. Metrics update as you type.
        </p>
      </div>

      <TradeForm
        instruments={instrumentsQuery.data || []}
        configOptions={settingsQuery.data?.preferences || {}}
        currentCapital={capitalQuery.summary.currentCapital}
        submitLabel="Save trade"
        isSubmitting={createTrade.isPending}
        onCancel={() => navigate(ROUTES.TRADE_JOURNAL)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
