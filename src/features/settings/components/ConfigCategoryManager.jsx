import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ConfigOptionList } from '@/features/settings/components/ConfigOptionList'
import { ConfigSourceTabs } from '@/features/settings/components/ConfigSourceTabs'
import { ConfigPagination, ConfigToolbar } from '@/features/settings/components/ConfigToolbar'
import { CreateConfigOptionDialog } from '@/features/settings/components/CreateConfigOptionDialog'
import { DeleteConfigOptionDialog } from '@/features/settings/components/DeleteConfigOptionDialog'
import { EditConfigOptionDialog } from '@/features/settings/components/EditConfigOptionDialog'
import { CONFIG_PAGE_SIZE } from '@/features/settings/constants/configCategories'
import {
  useMasterConfigCatalog,
  useSetConfigOptionEnabled,
  useYourConfigOptions,
} from '@/features/settings/hooks/useSettings'

function matchesSearch(item, query) {
  if (!query) return true
  const haystack = [item.label, item.description].filter(Boolean).join(' ').toLowerCase()
  return haystack.includes(query)
}

export function ConfigCategoryManager({ category }) {
  const yoursQuery = useYourConfigOptions(category.key)
  const catalogQuery = useMasterConfigCatalog(category.key)
  const setEnabled = useSetConfigOptionEnabled(category.key)
  const [tab, setTab] = useState('yours')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const yoursItems = yoursQuery.data ?? []
  const catalogItems = catalogQuery.data ?? []
  const isYours = tab === 'yours'
  const query = isYours ? yoursQuery : catalogQuery
  const items = isYours ? yoursItems : catalogItems

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((item) => matchesSearch(item, q))
  }, [items, search])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / CONFIG_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * CONFIG_PAGE_SIZE,
    currentPage * CONFIG_PAGE_SIZE,
  )

  function handleSearchChange(value) {
    setSearch(value)
    setPage(1)
  }

  function handleTabChange(value) {
    setTab(value)
    setPage(1)
  }

  async function handleToggle(item, isEnabled) {
    const masterId = item.master_id || item.id
    setTogglingId(masterId)

    try {
      await setEnabled.mutateAsync({ masterId, isEnabled })
      toast.success(isEnabled ? `${item.label} enabled` : `${item.label} disabled`)
    } catch (toggleError) {
      toast.error(toggleError.message || 'Unable to update item')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-2">{category.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {category.description}
        </p>
      </div>

      <ConfigToolbar
        search={search}
        onSearchChange={handleSearchChange}
        onCreate={isYours ? () => setIsCreateOpen(true) : undefined}
        createLabel={`Add custom ${category.singularLabel.toLowerCase()}`}
        searchPlaceholder={`Search ${category.label.toLowerCase()}...`}
      />

      <ConfigSourceTabs
        value={tab}
        onValueChange={handleTabChange}
        yoursLabel={`Your ${category.label.toLowerCase()}`}
        catalogLabel="Master catalog"
        yoursCount={yoursItems.length}
        catalogCount={catalogItems.length}
      />

      {query.isLoading ? (
        <div className="rounded-card border border-border px-4 py-12 text-center text-sm text-muted-foreground">
          Loading {category.label.toLowerCase()}...
        </div>
      ) : null}

      {query.isError ? (
        <div className="rounded-card border border-destructive/30 px-4 py-8 text-center">
          <p className="text-sm text-destructive">
            {query.error?.message || `Failed to load ${category.label.toLowerCase()}`}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => query.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : null}

      {!query.isLoading && !query.isError ? (
        <>
          <ConfigOptionList
            items={paginatedItems}
            mode={isYours ? 'yours' : 'catalog'}
            togglingId={togglingId}
            onToggle={handleToggle}
            onEdit={setEditingItem}
            onDelete={setDeletingItem}
            emptyTitle={
              isYours
                ? `No ${category.label.toLowerCase()} enabled`
                : 'No catalog items found'
            }
            emptyDescription={
              isYours
                ? 'Enable items from the Master catalog, or add your own.'
                : 'Try a different search.'
            }
          />
          <ConfigPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : null}

      <CreateConfigOptionDialog
        categoryKey={category.key}
        categoryLabel={category.label}
        singularLabel={category.singularLabel}
        supportsValue={false}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditConfigOptionDialog
        categoryKey={category.key}
        supportsValue={false}
        item={editingItem}
        open={Boolean(editingItem)}
        onOpenChange={(open) => {
          if (!open) setEditingItem(null)
        }}
      />

      <DeleteConfigOptionDialog
        categoryKey={category.key}
        item={deletingItem}
        open={Boolean(deletingItem)}
        onOpenChange={(open) => {
          if (!open) setDeletingItem(null)
        }}
      />
    </div>
  )
}
