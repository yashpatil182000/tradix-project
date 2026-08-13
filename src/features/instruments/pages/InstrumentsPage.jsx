import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  ListPageSkeleton,
  PageError,
} from '@/components/shared/PageStates'
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

export function InstrumentsPage() {
  const { data: instruments = [], isLoading, isError, error, refetch } =
    useMasterInstrumentsCatalog()
  const setEnabled = useSetInstrumentEnabled()
  const [search, setSearch] = useState('')
  const [assetClass, setAssetClass] = useState('all')
  const [togglingId, setTogglingId] = useState(null)

  const filteredInstruments = useMemo(() => {
    const query = search.trim().toLowerCase()

    return instruments.filter((instrument) => {
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
  }, [assetClass, instruments, search])

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
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-heading-2">Instruments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse markets and enable the symbols you trade. Only enabled
          instruments appear in the Trade Journal.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-sm">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search symbols..."
            aria-label="Search instruments"
          />
        </div>
        <Select value={assetClass} onValueChange={setAssetClass}>
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

      {isLoading ? <ListPageSkeleton className="px-0 py-0" /> : null}

      {isError ? (
        <PageError
          message={error?.message || 'Failed to load instruments'}
          onRetry={() => refetch()}
        />
      ) : null}

      {!isLoading && !isError ? (
        <InstrumentList
          instruments={filteredInstruments}
          onToggle={handleToggle}
          togglingId={togglingId}
        />
      ) : null}
    </div>
  )
}
