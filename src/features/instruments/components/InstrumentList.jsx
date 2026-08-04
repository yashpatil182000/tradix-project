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
    <span
      className={
        isActive
          ? 'inline-flex rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground'
          : 'inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'
      }
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

export function InstrumentList({ instruments, onEdit, onDelete }) {
  if (!instruments.length) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-12 text-center">
        <p className="text-sm font-medium">No instruments yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first instrument to start journaling trades.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {instruments.map((instrument) => (
          <Card key={instrument.id} size="sm">
            <CardHeader className="gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{instrument.symbol}</CardTitle>
                  <CardDescription>
                    {instrument.name || 'Untitled instrument'}
                  </CardDescription>
                </div>
                <StatusBadge isActive={instrument.is_active} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="capitalize">{instrument.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Exchange</p>
                  <p>{instrument.exchange || '—'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(instrument)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => onDelete(instrument)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Exchange</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instruments.map((instrument) => (
              <tr key={instrument.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{instrument.symbol}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {instrument.name || '—'}
                </td>
                <td className="px-4 py-3 capitalize">{instrument.type}</td>
                <td className="px-4 py-3">{instrument.exchange || '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadge isActive={instrument.is_active} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(instrument)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(instrument)}
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
    </>
  )
}
