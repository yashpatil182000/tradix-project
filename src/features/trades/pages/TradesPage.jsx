import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DeleteTradeDialog } from '@/features/trades/components/DeleteTradeDialog'
import { TradeList } from '@/features/trades/components/TradeList'
import { useTrades } from '@/features/trades/hooks/useTrades'
import { ConfigPagination } from '@/features/settings/components/ConfigToolbar'
import {
  ListPageSkeleton,
  PageError,
} from '@/components/shared/PageStates'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/routes/paths'

const PAGE_SIZE = 10

export function TradesPage() {
  const { data: trades = [], isLoading, isError, error, refetch } = useTrades()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [deletingTrade, setDeletingTrade] = useState(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return trades.filter((trade) => {
      if (status !== 'all' && trade.status !== status) return false
      if (!query) return true
      const haystack = [
        trade.instrument?.symbol,
        trade.instrument?.name,
        trade.direction,
        trade.style,
        trade.entry_reason,
        trade.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [search, status, trades])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-heading-2">Trade Journal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log, review, and manage every trade with calculated risk metrics.
          </p>
        </div>
        <Button asChild>
          <Link to={`${ROUTES.TRADE_JOURNAL}/new`}>Create trade</Link>
        </Button>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_180px]">
        <div className="space-y-2">
          <Label htmlFor="trade-search" className="sr-only">
            Search trades
          </Label>
          <Input
            id="trade-search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search symbol, style, reason..."
            aria-label="Search trades"
          />
        </div>
        <div className="space-y-2">
          <Label className="sr-only">Filter by status</Label>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? <ListPageSkeleton className="px-0 py-0" /> : null}

      {isError ? (
        <PageError
          message={error?.message || 'Failed to load trades'}
          onRetry={() => refetch()}
        />
      ) : null}

      {!isLoading && !isError ? (
        <>
          <TradeList trades={paginated} onDelete={setDeletingTrade} />
          <ConfigPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : null}

      <DeleteTradeDialog
        trade={deletingTrade}
        open={Boolean(deletingTrade)}
        onOpenChange={(open) => {
          if (!open) setDeletingTrade(null)
        }}
      />
    </div>
  )
}
