import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function StatusBadge({ isEnabled }) {
  return (
    <Badge variant={isEnabled ? 'success' : 'cancelled'}>
      {isEnabled ? 'Enabled' : 'Disabled'}
    </Badge>
  )
}

function SourceBadge({ isCustom }) {
  if (!isCustom) {
    return (
      <Badge variant="cancelled">Catalog</Badge>
    )
  }

  return <Badge variant="pending">Custom</Badge>
}

function ItemActions({ item, mode, togglingId, onToggle, onEdit, onDelete }) {
  const isBusy = togglingId === item.id || togglingId === item.master_id

  if (mode === 'catalog') {
    const isEnabled = item.is_enabled === true
    return (
      <Button
        type="button"
        variant={isEnabled ? 'outline' : 'default'}
        size="sm"
        disabled={isBusy}
        onClick={() => onToggle(item, !isEnabled)}
      >
        {isBusy ? 'Updating...' : isEnabled ? 'Disable' : 'Enable'}
      </Button>
    )
  }

  if (item.is_custom) {
    return (
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(item)}
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onDelete(item)}
        >
          Delete
        </Button>
      </div>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isBusy}
      onClick={() => onToggle(item, false)}
    >
      {isBusy ? 'Updating...' : 'Disable'}
    </Button>
  )
}

export function ConfigOptionList({
  items,
  mode = 'yours',
  togglingId = null,
  onToggle,
  onEdit,
  onDelete,
  emptyTitle = 'No items yet',
  emptyDescription = 'Enable items from the catalog, or add your own.',
}) {
  if (!items.length) {
    return (
      <div className="rounded-card border border-dashed border-border px-4 py-12 text-center">
        <p className="text-sm font-medium">{emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {items.map((item) => (
          <Card key={item.id} size="sm">
            <CardHeader className="gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{item.label}</CardTitle>
                  <CardDescription>
                    {item.description || 'No description'}
                  </CardDescription>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {mode === 'yours' ? <SourceBadge isCustom={item.is_custom} /> : null}
                  <StatusBadge isEnabled={item.is_enabled === true} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ItemActions
                item={item}
                mode={mode}
                togglingId={togglingId}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-card border border-border md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead data-slot="table-header">
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-medium">Label</th>
                <th className="px-4 py-3 font-medium">Description</th>
                {mode === 'yours' ? (
                  <th className="px-4 py-3 font-medium">Source</th>
                ) : null}
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  data-slot="table-row"
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium">{item.label}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.description || '—'}
                  </td>
                  {mode === 'yours' ? (
                    <td className="px-4 py-3">
                      <SourceBadge isCustom={item.is_custom} />
                    </td>
                  ) : null}
                  <td className="px-4 py-3">
                    <StatusBadge isEnabled={item.is_enabled === true} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <ItemActions
                        item={item}
                        mode={mode}
                        togglingId={togglingId}
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
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
