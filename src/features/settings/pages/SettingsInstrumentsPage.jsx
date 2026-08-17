import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InstrumentList } from '@/features/instruments/components/InstrumentList'
import {
  useMasterInstrumentsCatalog,
  useSetInstrumentEnabled,
} from '@/features/instruments/hooks/useInstruments'
import {
  ASSET_CLASSES,
  ASSET_CLASS_LABELS,
} from '@/features/instruments/schemas/instrumentSchemas'
import { ConfigSourceTabs } from '@/features/settings/components/ConfigSourceTabs'
import { ConfigPagination } from '@/features/settings/components/ConfigToolbar'
import { CONFIG_PAGE_SIZE } from '@/features/settings/constants/configCategories'

export function SettingsInstrumentsPage() {
  const { data: instruments = [], isLoading, isError, error, refetch } =
    useMasterInstrumentsCatalog()
  const setEnabled = useSetInstrumentEnabled()
  const [tab, setTab] = useState('yours')
  const [search, setSearch] = useState('')
  const [assetClass, setAssetClass] = useState('all')
  const [page, setPage] = useState(1)
  const [togglingId, setTogglingId] = useState(null)

  const yoursInstruments = useMemo(
    () => instruments.filter((instrument) => instrument.is_enabled === true),
    [instruments],
  )
  const sourceInstruments = tab === 'yours' ? yoursInstruments : instruments

  const filteredInstruments = useMemo(() => {
    const query = search.trim().toLowerCase()

    return sourceInstruments.filter((instrument) => {
      if (assetClass !== 'all' && instrument.asset_class !== assetClass) {
        return false
      }

      if (!query) return true

      const haystack = [
        instrument.symbol,
        instrument.display_name,
        instrument.name,
        instrument.asset_class,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [assetClass, search, sourceInstruments])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInstruments.length / CONFIG_PAGE_SIZE),
  )
  const currentPage = Math.min(page, totalPages)
  const paginatedInstruments = filteredInstruments.slice(
    (currentPage - 1) * CONFIG_PAGE_SIZE,
    currentPage * CONFIG_PAGE_SIZE,
  )

  async function handleToggle(instrument, isEnabled) {
    setTogglingId(instrument.id)

    try {
      await setEnabled.mutateAsync({
        masterInstrumentId: instrument.id,
        isEnabled,
      })
      toast.success(
        isEnabled
          ? `${instrument.symbol} enabled`
          : `${instrument.symbol} disabled`,
      )
    } catch (toggleError) {
      toast.error(toggleError.message || 'Unable to update instrument')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-2">Instruments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your enabled symbols, plus the full master catalog. Only enabled
          instruments appear in the Trade Journal.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-sm">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search symbols..."
            aria-label="Search instruments"
          />
        </div>
        <Select
          value={assetClass}
          onValueChange={(value) => {
            setAssetClass(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-44" aria-label="Asset class">
            <SelectValue placeholder="Asset class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {ASSET_CLASSES.map((value) => (
              <SelectItem key={value} value={value}>
                {ASSET_CLASS_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ConfigSourceTabs
        value={tab}
        onValueChange={(value) => {
          setTab(value)
          setPage(1)
        }}
        yoursLabel="Your instruments"
        catalogLabel="Master catalog"
        yoursCount={yoursInstruments.length}
        catalogCount={instruments.length}
      />

      {isLoading ? (
        <div className="rounded-card border border-border px-4 py-12 text-center text-sm text-muted-foreground">
          Loading instruments...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-card border border-destructive/30 px-4 py-8 text-center">
          <p className="text-sm text-destructive">
            {error?.message || 'Failed to load instruments'}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => refetch()}
          >
            Try again
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <>
          <InstrumentList
            instruments={paginatedInstruments}
            onToggle={handleToggle}
            togglingId={togglingId}
            emptyTitle={
              tab === 'yours'
                ? 'No instruments enabled'
                : 'No instruments found'
            }
            emptyDescription={
              tab === 'yours'
                ? 'Enable symbols from the Master catalog to see them here.'
                : 'Try a different search, or check back when more markets are added.'
            }
          />
          <ConfigPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </div>
  )
}
