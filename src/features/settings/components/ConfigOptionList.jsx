import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function StatusBadge({ isActive }) {
  return (
    <Badge variant={isActive ? 'success' : 'cancelled'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  )
}

export function ConfigOptionList({
  items,
  supportsValue = false,
  onEdit,
  onDelete,
}) {
  if (!items.length) {
    return (
      <div className="rounded-card border border-dashed border-border px-4 py-12 text-center">
        <p className="text-sm font-medium">No items yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first configuration item to get started.
        </p>
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
                <StatusBadge isActive={item.is_active} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {supportsValue ? (
                <div className="text-sm">
                  <p className="text-muted-foreground">Value</p>
                  <p>{item.value || '—'}</p>
                </div>
              ) : null}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => onDelete(item)}
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
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead data-slot="table-header">
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-medium">Label</th>
                {supportsValue ? (
                  <th className="px-4 py-3 font-medium">Value</th>
                ) : null}
                <th className="px-4 py-3 font-medium">Description</th>
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
                  {supportsValue ? (
                    <td className="px-4 py-3">{item.value || '—'}</td>
                  ) : null}
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.description || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge isActive={item.is_active} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
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
