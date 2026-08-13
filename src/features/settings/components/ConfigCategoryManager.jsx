import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfigOptionList } from '@/features/settings/components/ConfigOptionList'
import { ConfigPagination, ConfigToolbar } from '@/features/settings/components/ConfigToolbar'
import { CreateConfigOptionDialog } from '@/features/settings/components/CreateConfigOptionDialog'
import { DeleteConfigOptionDialog } from '@/features/settings/components/DeleteConfigOptionDialog'
import { EditConfigOptionDialog } from '@/features/settings/components/EditConfigOptionDialog'
import { CONFIG_PAGE_SIZE } from '@/features/settings/constants/configCategories'
import { useConfigOptions } from '@/features/settings/hooks/useSettings'

export function ConfigCategoryManager({ category }) {
  const { data: items = [], isLoading, isError, error, refetch } =
    useConfigOptions(category.key)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items

    return items.filter((item) => {
      const haystack = [
        item.label,
        item.description,
        item.value,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
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
        onCreate={() => setIsCreateOpen(true)}
        createLabel={`Add ${category.singularLabel.toLowerCase()}`}
      />

      {isLoading ? (
        <div className="rounded-card border border-border px-4 py-12 text-center text-sm text-muted-foreground">
          Loading {category.label.toLowerCase()}...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-card border border-destructive/30 px-4 py-8 text-center">
          <p className="text-sm text-destructive">
            {error?.message || `Failed to load ${category.label.toLowerCase()}`}
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
          <ConfigOptionList
            items={paginatedItems}
            supportsValue={category.supportsValue}
            onEdit={setEditingItem}
            onDelete={setDeletingItem}
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
        supportsValue={category.supportsValue}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditConfigOptionDialog
        categoryKey={category.key}
        supportsValue={category.supportsValue}
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
