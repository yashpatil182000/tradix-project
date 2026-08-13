import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ASSET_CLASS_LABELS } from '@/features/instruments/schemas/instrumentSchemas'

function StatusBadge({ isEnabled }) {
  return (
    <span
      className={
        isEnabled
          ? 'inline-flex rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground'
          : 'inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'
      }
    >
      {isEnabled ? 'Enabled' : 'Disabled'}
    </span>
  )
}

function formatAssetClass(assetClass) {
  return ASSET_CLASS_LABELS[assetClass] || assetClass || '—'
}

export function InstrumentList({
  instruments,
  onToggle,
  togglingId = null,
}) {
  if (!instruments.length) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-12 text-center">
        <p className="text-sm font-medium">No instruments found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different search, or check back when more markets are added.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {instruments.map((instrument) => {
          const isEnabled = instrument.is_enabled === true
          const isBusy = togglingId === instrument.id

          return (
            <Card key={instrument.id} size="sm">
              <CardHeader className="gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{instrument.symbol}</CardTitle>
                    <CardDescription>
                      {instrument.display_name || instrument.name || '—'}
                    </CardDescription>
                  </div>
                  <StatusBadge isEnabled={isEnabled} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Asset class</p>
                    <p>{formatAssetClass(instrument.asset_class)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contract size</p>
                    <p>{instrument.contract_size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pip size</p>
                    <p>{instrument.pip_size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lot range</p>
                    <p>
                      {instrument.min_lot} – {instrument.max_lot}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={isEnabled ? 'outline' : 'default'}
                  size="sm"
                  className="w-full"
                  disabled={isBusy}
                  onClick={() => onToggle(instrument, !isEnabled)}
                >
                  {isBusy
                    ? 'Updating...'
                    : isEnabled
                      ? 'Disable'
                      : 'Enable'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Asset class</th>
              <th className="px-4 py-3 font-medium">Contract</th>
              <th className="px-4 py-3 font-medium">Pip</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instruments.map((instrument) => {
              const isEnabled = instrument.is_enabled === true
              const isBusy = togglingId === instrument.id

              return (
                <tr key={instrument.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">{instrument.symbol}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {instrument.display_name || instrument.name || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {formatAssetClass(instrument.asset_class)}
                  </td>
                  <td className="px-4 py-3">{instrument.contract_size}</td>
                  <td className="px-4 py-3">{instrument.pip_size}</td>
                  <td className="px-4 py-3">
                    <StatusBadge isEnabled={isEnabled} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant={isEnabled ? 'outline' : 'default'}
                        size="sm"
                        disabled={isBusy}
                        onClick={() => onToggle(instrument, !isEnabled)}
                      >
                        {isBusy
                          ? 'Updating...'
                          : isEnabled
                            ? 'Disable'
                            : 'Enable'}
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
